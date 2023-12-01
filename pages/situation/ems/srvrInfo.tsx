import React, { useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import axios from "axios";
import SingleDropdownComponent from "@/components/dropdown/SingleDropdownComponent";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function SrvrInfo() {
  const dispatch = useDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [selectedServerName, setSelectedServerName] = useState<string[]>([]);
  const [dataParseVal, setDataPaseVal] = useState([]);
  const [detailData, setDetailData] = useState([]);

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());

    try {
      const params = {
        tib_srvr_sn: serverFilter,
      };

      const paramString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              Array.isArray(value) && value.length
                ? value.join(",")
                : value.toString()
            )}`
        )
        .join("&");

      const url = `/tibco/ems/tib-srvr/info?${paramString}`;

      const response = await axios.get(url, {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      });

      const rowData = response.data.data;
      if (rowData && rowData !== "") {
        const connectData = rowData.connect_dto;
        const propData = rowData.ems_prop_data_list;

        const detailDataVal: any = [];

        var keys = Object.keys(propData);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          const value: any = {};
          value.dataNo = i + 1;
          value.key = key;
          value.value = propData[key];

          detailDataVal.push(value);
        }
        setDetailData(detailDataVal);

        const detailConntDataVal: any = [];

        var keys = Object.keys(connectData);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          const value: any = {};
          value.dataNo = i + 1;
          value.key = key;
          value.value = connectData[key];

          detailConntDataVal.push(value);
        }
        setDataPaseVal(detailConntDataVal);

        if (tableRef.current && tableRef.current.table) {
          const table = tableRef.current.table;
          table.setData(rowData);
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  const SERVER_PROP_COLUMNS = [
    { title: "Property", field: "key", headerTooltip: true, width: 130 },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const SERVER_CONNT_COLUMNS = [
    { title: "Property", field: "key", headerTooltip: true, width: 130 },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  // tabulator 옵션
  const conntOptions = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    scrollable: true,
    maxHeight: 200,
    placeholder: t("MUL_ST_0009"),
  };
  const options = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    scrollable: true,
    maxHeight: 400,
    placeholder: t("MUL_ST_0009"),
  };

  // 조회 버튼
  const handleViewButtonClick = async () => {
    dispatch(startLoading());

    try {
      await fetchTableDataAsync();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  // 서버 선택
  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };
  const handleSeletedServerName = (alias: string[]) => {
    setSelectedServerName(alias);
  };

  const columns = SERVER_PROP_COLUMNS;

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("All_Server_Situation", fileType);

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
      {/* <-- page title --> */}
      <div className="content__wrap">
        <nav aria-label="breadcrumb">
          <ol className="mb-0 breadcrumb">
            <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
            <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
              EMS {t("MUL_WD_0009")}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("MUL_WD_0009")} Info
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 mb-0 page-title">{t("MUL_WD_0009")} Info</h1>
        <p className="lead"></p>
      </div>
      {/* <-- page title --> */}
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="mt-2 search-box justify-content-center">
            <div className="row col-md-12">
              {/* <-- Server --> */}
              <div className="mb-2 row col-md-8">
                <label
                  className="col-sm-3 col-form-label text-sm-end"
                  htmlFor="sel_server"
                >
                  {t("MUL_WD_0009")}
                </label>
                <div className="col-sm-6">
                  <SingleDropdownComponent
                    onServerSelected={handleSelectedServerAlias}
                    onSelectedServerName={handleSeletedServerName}
                  />
                </div>
              </div>
            </div>
            {/* <!-- 조회 버튼 --> */}
            <div className="mt-3 d-flex justify-content-center">
              <button
                type="button"
                onClick={handleViewButtonClick}
                className="gap-2 btn btn-dark hstack"
              >
                <i className="i_view_search fs-5"></i>
                {t("MUL_WD_0022")}
              </button>
            </div>
          </div>
          {/* --- 엑셀 저장 버튼 --- */}
          <div className="mt-3 row">
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
          </div>
          <div className="table-responsive">
            <ReactTabulator
              key={dataParseVal.length}
              ref={tableRef}
              autoResize={false}
              options={conntOptions}
              data={dataParseVal}
              columns={SERVER_CONNT_COLUMNS}
            />
          </div>
          <div className="table-responsive">
            <ReactTabulator
              key={detailData.length}
              ref={tableRef}
              autoResize={false}
              options={options}
              data={detailData}
              columns={SERVER_PROP_COLUMNS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
