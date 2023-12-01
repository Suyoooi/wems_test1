import React, { useRef, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  columns: any[];
  rowData: any[];
  title: string;
  fileNm: string;
}

const Modal: React.FC<ModalDefaultType> = ({
  onClickToggleModal,
  columns,
  rowData,
  title,
  fileNm,
}) => {
  const tableRef = useRef<ReactTabulator | null>(null);
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const options = {
    layout: "fitColumns",
    maxHeight: 350,
    placeholder: t("MUL_ST_0009"),
  };

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm(fileNm, fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(columns);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(columns);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="staticBackdropLabel"
                  style={{ color: "black" }}
                >
                  {title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickToggleModal) {
                      onClickToggleModal();
                    }
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="content__boxed">
                  <div style={{ display: "flex", justifyContent: "end" }}>
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
                </div>
                <div className="table-responsive">
                  <ReactTabulator
                    key={rowData.length}
                    ref={tableRef}
                    data={rowData}
                    columns={columns}
                    options={options}
                    layout={"fitData"}
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickToggleModal) {
                        onClickToggleModal();
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
      {/* <div className="modal_ly_bg"></div> */}
    </>
  );
};

export default Modal;
