import React, { useRef, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
interface ModalDefaultType {
  onClickToggleModal: () => void;
  columns: any[];
  excelColumns: any[];
  excelFileNm: string;
  rowData: any[];
  title: string;
}

const ModalChart: React.FC<ModalDefaultType> = ({
  onClickToggleModal,
  columns,
  excelColumns,
  excelFileNm,
  rowData,
  title,
}) => {
  const tableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const options = {
    layout: "fitColumns",
    maxHeight: 350,
    padding: 0,
    placeholder: t("MUL_ST_0009"),
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 50, 100],
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm(excelFileNm, fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(excelColumns);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(excelColumns);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog modal_wrap_position">
            <div className="modal-content w_1000">
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
                ></button>
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row justify-content-end">
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
                  <div className="table table-responsive">
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
    </>
  );
};

export default ModalChart;
