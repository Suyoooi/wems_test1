import { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickModal: (rowData: any) => void;
  onClickStart: (rowData: any) => void;
  headerColumns: any[];
  headerRowData: any[];
  bodyRowData: any[];
  bodyColumns: any[];
  bodyText?: string;
  title: string;
  server: any[];
  topicName: string;
  durableName: string;
  clientId: string;
  isMap: boolean;
  columns: any[];
  rowData: any[];
}

const ModalDurable: React.FC<ModalDefaultType> = ({
  onClickModal,
  onClickStart,
  headerColumns,
  headerRowData,
  bodyRowData,
  bodyColumns,
  bodyText,
  title,
  server,
  topicName,
  durableName,
  clientId,
  isMap,
  columns,
  rowData,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const tableDataRef = useRef<ReactTabulator | null>(null);
  const [changeCategory, setChangeCategory] = useState<boolean>(true);
  const [changeBody, setChangeBody] = useState<boolean>(true);
  const [isTabulatorVisible, setIsTabulatorVisible] = useState(false);

  const handleStartButtonClick = () => {
    // Call the onClickStart function
    if (onClickStart) {
      onClickStart;
    }

    setIsTabulatorVisible(true);
  };

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

  const options = {
    layout: "fitColumns",
    maxHeight: 200,
    placeholder: t("MUL_ST_0009"),
  };

  const options2 = {
    layout: "fitColumns",
    maxHeight: 350,
    placeholder: t("MUL_ST_0009"),
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 엑셀 다운로드
  const handleHeaderDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Durable_Property_Header", fileType);

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
    const fullNm = DownloadFileNm("Durable_Property_Body", fileType);

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

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Durable_Property", fileType);

    if (tableDataRef.current && tableDataRef.current.table) {
      const table = tableDataRef.current.table;

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
            <div className="modal-content w_900" style={{ width: 900 }}>
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
                      onClickModal(rowData);
                    }
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row col-md-12">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6">Server</label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          value={server}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6">Topic Name</label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          value={topicName}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6">Durable Name</label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          value={durableName}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6">Client ID</label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          value={clientId}
                          disabled
                        />
                      </div>
                      <div className="mt-3 col-sm-12 d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={onClickStart}
                        >
                          {t("MUL_WD_0125")}
                        </button>
                      </div>
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
                      <div className="mt-2 col-sm-12">
                        <ReactTabulator
                          key={rowData.length}
                          ref={tableDataRef}
                          data={rowData}
                          columns={columns}
                          options={options}
                          layout={"fitData"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* <h6>TextMessage : ID:E4EMS-SERVER.1FCF64817BA2D9:1681</h6> */}
                    {/* <!-- button : 엑셀저장 --> */}
                    <div className="mb-2 d-flex justify-content-md-end">
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
                          type="button"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title={t("MUL_WD_0012") as string}
                        >
                          <i className="i_excel icon-lg fs-5"></i>
                        </button>
                      ) : (
                        <div style={{ height: 35 }}></div>
                      )}
                    </div>
                    {/* <!-- Tab --> */}
                    <div
                      className="card-header toolbar"
                      style={{ borderBottom: "1px solid #ededed" }}
                    >
                      {/* <!-- Nav tabs --> */}
                      <ul
                        className="nav nav-tabs card-header-tabs"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${
                              changeCategory ? "active" : ""
                            }`}
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
                      {/* <!--// Nav tabs --> */}
                    </div>

                    {/* <!--// Tab --> */}

                    <div className="mt-2 tab-content">
                      {/* <!-- 테이블 --> */}
                      <div className="table-responsive">
                        <div>
                          {changeCategory ? (
                            <ReactTabulator
                              key={headerRowData.length}
                              ref={tableRef}
                              data={headerRowData}
                              columns={headerColumns}
                              options={options2}
                              layout={"fitData"}
                            />
                          ) : changeBody ? (
                            <ReactTabulator
                              key={bodyRowData.length}
                              ref={tableRef}
                              data={bodyRowData}
                              columns={bodyColumns}
                              options={options2}
                              layout={"fitData"}
                            />
                          ) : (
                            <div
                              style={{
                                minHeight: "300px",
                                width: 305,
                                overflowY: "auto",
                              }}
                            >
                              {bodyText}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                {/* <!-- button --> */}
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickModal) {
                        onClickModal(rowData);
                      }
                    }}
                    type="button"
                    className="btn btn-light btn-lg"
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
                {/* <!-- END - button --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          if (onClickModal) {
            onClickModal(rowData);
          }
        }}
        className="modal_ly_bg"
      ></div>
    </>
  );
};

export default ModalDurable;
