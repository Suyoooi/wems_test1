import "react-tabulator/lib/styles.css";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { QueueCntArrVal, QueueSizeArrVal } from "@/types/getQTProp";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";

interface ModalDefaultType {
  onClickPropModal: () => void;
  propInfo: any;
}

function GrpModal({
  onClickPropModal,
  propInfo,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  //타입 명시를 위해
  let propInfoUrl = `/api/setting/queue/propertyApi`;
  let tableRef = useRef(null);

  const [tableData, setTableData] = useState([]);

  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "ALL_GET",
        rawQueueSn: propInfo.raw_queue_sn,
      };

      const res = await fetch(propInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      const detailDataVal: any = [];

      const cntArr = QueueCntArrVal;
      const sizeArr = QueueSizeArrVal;
      // const numArr = QueueNumArrVal;

      var keys = Object.keys(dataInfo);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        let concatVal: any = {};
        concatVal.key = key;
        // concatVal.value = dataInfo[key];

        if (cntArr.includes(key)) {
          concatVal.value = setCommaNum(dataInfo[key]);
        } else if (sizeArr.includes(key)) {
          concatVal.value = FormatBytes(dataInfo[key]);
          // } else if (numArr.includes(key)) {
          //   concatVal.value = setCommaNum(dataInfo[key]);
        } else {
          concatVal.value = dataInfo[key];
        }

        detailDataVal.push(concatVal);
      }

      setTableData(detailDataVal);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const setCommaNum = (val: any) => {
    if (val && val >= -1) {
      const numVal = val.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const FormatBytes = require("@/components/unitFormat");

  // 테이블 카테고리
  const columns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true, width: 230 },
    { title: "Value", field: "value", headerTooltip: true, width: 270 },
  ];

  //테이블 setUp
  const options = {
    height: 350,
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
  };

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Property {t("MUL_WD_0135")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickPropModal) {
                      onClickPropModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12 justify-content-center">
                    <div className="row col-sm-6">
                      <label
                        className="col-sm-5 col-form-label text-end"
                        htmlFor="inSrvrNm"
                      >
                        EMS Server
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          id="inSrvrNm"
                          value={propInfo.tib_srvr_alias}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row col-sm-6">
                      <label
                        className="col-sm-5 col-form-label text-end"
                        htmlFor="inQueueNm"
                      >
                        Queue Name
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          id="inQueueNm"
                          value={propInfo.ems_que_nm}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <ReactTabulator
                      key={tableData.length}
                      ref={tableRef}
                      autoResize={false}
                      data={tableData}
                      columns={columns}
                      options={options}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickPropModal) {
                        onClickPropModal();
                      }
                    }}
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GrpModal;
