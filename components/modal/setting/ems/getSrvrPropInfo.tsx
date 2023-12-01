import React, { PropsWithChildren, useState, useEffect, useRef } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { CntArrVal, SizeArrVal, numArrVal } from "@/types/getSrvrProp";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickTogglePropModal: () => void;
  srvrPropInfo: any;
  callbackFunction: any;
}

function Modal({
  onClickTogglePropModal,
  srvrPropInfo,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState([]);
  const [srvrNm, setSrvrNm] = useState("");

  const fetchTableData = async () => {
    setSrvrNm(srvrPropInfo.alias);

    try {
      const bodyData = {
        case_method: "PROP_GET",
        tib_srvr_sn: srvrPropInfo.tib_srvr_sn,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      const propDataVal: any = [];

      const cntArr = CntArrVal;
      const sizeArr = SizeArrVal;
      const numArr = numArrVal;

      var keys = Object.keys(dataInfo);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        let concatVal: any = {};
        concatVal.key = key;

        if (cntArr.includes(key)) {
          concatVal.value = setCommaNum(dataInfo[key]);
        } else if (sizeArr.includes(key)) {
          concatVal.value = FormatBytes(dataInfo[key]);
        } else if (numArr.includes(key)) {
          concatVal.value = setCommaNum(dataInfo[key]);
        } else {
          concatVal.value = dataInfo[key];
        }

        propDataVal.push(concatVal);
      }

      setTableData(propDataVal);
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
    { title: "Property", field: "key", headerTooltip: true, width: 250 },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const langVal = t("MUL_ST_0009");

  //테이블 setUp
  const options: ReactTabulatorOptions = {
    height: 350,
    layout: "fitColumns",
    placeholder: langVal,
  };

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Server_Property", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
    }
  };

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_900">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0009")} {t("MUL_WD_0017")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickTogglePropModal) {
                      onClickTogglePropModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row col-md-12 justify-content-center">
                  <label
                    className="row col-sm-2 col-form-label"
                    htmlFor="inSrvrNm"
                  >
                    {t("MUL_WD_0009")}
                  </label>
                  <div className="row col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="inSrvrNm"
                      name="inSrvrNm"
                      value={srvrNm}
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-2 row col-md-12">
                  <div className="mt-2 col-sm-12 d-flex justify-content-end">
                    <button
                      className="btn btn-icon btn-green mr_4"
                      onClick={() => handleDataExport("xlsx")}
                      type="button"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-original-title={t("MUL_WD_0012") as string}
                    >
                      <i className="i_excel icon-lg fs-5"></i>
                    </button>
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
                      if (onClickTogglePropModal) {
                        onClickTogglePropModal();
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

export default Modal;
