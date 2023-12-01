import React, { useRef, useEffect, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickModal: () => void;
  headerColumns: any[];
  headerRowData: any[];
  bodyRowData: any[];
  bodyColumns: any[];
  bodyText?: string;
  title: string;
  isMap: boolean;
}

const ModalCategory: React.FC<ModalDefaultType> = ({
  onClickModal,
  headerColumns,
  headerRowData,
  bodyRowData,
  bodyColumns,
  bodyText,
  title,
  isMap,
}) => {
  const tableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const options = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    maxHeight: 350,
    minHeight: 350,
    placeholder: t("MUL_ST_0009"),
  };

  const [changeCategory, setChangeCategory] = useState<boolean>(true);
  const [changeBody, setChangeBody] = useState<boolean>(true);

  const handleHeaderButtonClick = () => {
    setChangeCategory(true);
    setChangeBody(true);
  };

  const handleMapBodyButtonClick = () => {
    setChangeCategory(false);
    setChangeBody(true);
  };

  const handleTextBodyButtonClick = () => {
    setChangeCategory(false);
    setChangeBody(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 엑셀 다운로드
  const handleHeaderDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Browse_Property_Header", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(headerColumns);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(headerColumns);
      } else if (fileType == "xlsx") {
        table.setColumns(headerColumns);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(headerColumns);
      }
    }
  };

  const handleBodyDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Browse_Property_Body", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(bodyColumns);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(bodyColumns);
      } else if (fileType == "xlsx") {
        table.setColumns(bodyColumns);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(bodyColumns);
      }
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_500">
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
                    if (onClickModal) {
                      onClickModal();
                    }
                  }}
                />
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", justifyContent: "end" }}>
                  {changeCategory ? (
                    <button
                      className="btn btn-icon btn-green mr_4"
                      onClick={() => handleHeaderDataExport("xlsx")}
                      type="button"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-original-title={t("MUL_WD_0012") as string}
                    >
                      <i className="i_excel icon-lg fs-5"></i>
                    </button>
                  ) : changeBody ? (
                    <button
                      className="btn btn-icon btn-green mr_4"
                      onClick={() => handleBodyDataExport("xlsx")}
                    >
                      <i className="i_excel icon-lg fs-5"></i>
                    </button>
                  ) : (
                    <div style={{ height: 35 }}></div>
                  )}
                </div>
                <div
                  className="card-header toolbar"
                  style={{ borderBottom: "1px solid #ededed" }}
                >
                  <ul className="nav nav-tabs card-header-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${changeCategory ? "active" : ""}`}
                        data-bs-toggle="tab"
                        data-bs-target="#_dm-cardTabsHome"
                        type="button"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                        onClick={handleHeaderButtonClick}
                      >
                        Header
                      </button>
                    </li>
                    {isMap === true ? (
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            !changeCategory && changeBody ? "active" : ""
                          }`}
                          data-bs-toggle="tab"
                          data-bs-target="#_dm-cardTabsProfile"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                          onClick={handleMapBodyButtonClick}
                        >
                          MapBody
                        </button>
                      </li>
                    ) : (
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            !changeCategory && !changeBody ? "active" : ""
                          }`}
                          data-bs-toggle="tab"
                          data-bs-target="#_dm-cardTabsProfile"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected="false"
                          onClick={handleTextBodyButtonClick}
                        >
                          TextBody
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  {changeCategory ? (
                    <ReactTabulator
                      key={headerRowData.length}
                      ref={tableRef}
                      data={headerRowData}
                      columns={headerColumns}
                      options={options}
                      layout={"fitData"}
                    />
                  ) : changeBody ? (
                    <ReactTabulator
                      key={bodyRowData.length}
                      ref={tableRef}
                      data={bodyRowData}
                      columns={bodyColumns}
                      options={options}
                      layout={"fitData"}
                    />
                  ) : (
                    <div id="textBodyForm">
                      <textarea
                        id="inResult"
                        className="form-control h_180"
                        style={{ marginTop: 14 }}
                        placeholder=""
                        rows={6}
                        value={bodyText}
                        disabled
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickModal) {
                        onClickModal();
                      }
                    }}
                    type="button"
                    className="btn btn-light btn-lg"
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          if (onClickModal) {
            onClickModal();
          }
        }}
        className="modal_ly_bg"
      ></div>
    </>
  );
};

export default ModalCategory;
