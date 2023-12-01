import "react-tabulator/lib/styles.css";
import { ReactTabulator } from "react-tabulator";
import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickSetPropModal: () => void;
  propInfo: any;
}

function GrpModal({
  onClickSetPropModal,
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
        case_method: "PROP_GET",
        raw_queue_sn: propInfo.raw_queue_sn,
      };

      const res = await fetch(propInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      const queuePropType = dataInfo.queuePropType;
      const queuePropValue = dataInfo.queuePropChangeable;
      const detailDataVal: any = [];

      var keys = Object.keys(queuePropValue);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        let concatVal: any = {};
        concatVal.key = key;
        concatVal.type = queuePropType[key];
        concatVal.value = queuePropValue[key];

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

  // 테이블 카테고리
  const columns = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Type", field: "type", headerTooltip: true },
    {
      title: "Current Value",
      field: "value",
      headerTooltip: true,
      hozAlign: "right",
    },
    {
      title: "New Value",
      field: "newVal",
      headerTooltip: true,
      hozAlign: "right",
      editor: "input",
    },
  ];

  //테이블 setUp
  const options = {
    height: 350,
    layout: "fitDataStretch",
    placeholder: t("MUL_ST_0009"),
  };

  const modPropInfo = async () => {
    const tableInfo: any = tableRef.current;
    const tableData = tableInfo.table.getData();

    if (tableData != "") {
      const newValArr: any = [];
      tableData.map((datas: any, idx: number) => {
        if (datas.newVal && datas.newVal != "") {
          let concatVal: any = {};
          concatVal.property = datas.key;
          concatVal.value = datas.newVal;
          newValArr.push(concatVal);
        }
      });

      if (newValArr && newValArr != "") {
        const bodyData = {
          case_method: "POST",
          srvr_sn: propInfo.tib_srvr_sn,
          queue_name: propInfo.ems_que_nm,
          queue_prop_value_list: newValArr,
        };

        const res = await fetch(propInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data.code && data.code == "200") {
          alert(t("MUL_ST_0093"));
          if (onClickSetPropModal) {
            onClickSetPropModal();
          }
        } else {
          alert(t("MUL_ST_0094"));
        }
      } else {
        alert(t("MUL_ST_0095"));
      }
    }
  };

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_600">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0112")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickSetPropModal) {
                      onClickSetPropModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12 justify-content-center">
                    <div className="mb-3 row col-sm-6">
                      <label
                        className="col-sm-5 col-form-label text-end"
                        htmlFor="inSrvrNm"
                      >
                        EMS {t("MUL_WD_0009")}
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
                    <div className="mb-3 row col-sm-6">
                      <label
                        className="col-sm-5 col-form-label text-end"
                        htmlFor="inQueueNm"
                      >
                        Queue {t("MUL_WD_0072")}
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
                    className="btn btn-deepgray btn-lg"
                    onClick={() => modPropInfo()}
                  >
                    {t("MUL_WD_0024")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickSetPropModal) {
                        onClickSetPropModal();
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
