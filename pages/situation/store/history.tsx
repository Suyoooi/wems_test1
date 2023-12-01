import React, { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import { StoreTableData } from "@/types/webComm";
import DropdownComponent from "@/components/dropdown/DropdownComponent";
import QuickDatePicker from "@/components/timeSetting/QuickDatePicker";
import moment from "moment";
import DownloadFileNm from "@/utils/downloadFileNm";
import { STORE_COLUMNS_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function History() {
  const dispatch = useDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [rowData, setRowData] = useState<StoreTableData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss")
  );
  const [endDate, setEndDate] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const FormatBytes = require("@/components/unitFormat");

  const STORE_COLUMNS_LIST = [
    {
      title: "No",
      field: "dataNo",
      frozen: true,
      formatter: "rownum",
      hozAlign: "center",
      headerTooltip: true,
      width: 70,
      headerSort: false,
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      frozen: true,
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      frozen: true,
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "CollectionDate",
      field: "clct_dt",
      hozAlign: "center",
      headerTooltip: true,
      width: 155,
    },
    {
      title: "StoreName",
      field: "store_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "StoreType",
      field: "store_type",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "FileName",
      field: "file_name",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "FileSize",
      field: "file_size",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "FreeSpace",
      field: "free_space",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "UsedSpace",
      field: "used_space",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "Fragmentation",
      hozAlign: "right",
      field: "fragmentation",
      headerTooltip: true,
      width: 150,
    },
    {
      title: "MsgSize",
      field: "msg_size",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "MSgCount",
      field: "msg_cnt",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "SyncWrites",
      field: "sync_writes",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "SwappedSize",
      hozAlign: "right",
      field: "swap_size",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "WriteRate",
      field: "write_rate",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "AvgWriteTime(ms)",
      field: "avg_wr_tm",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "WriteUsage",
      field: "wr_usge",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "DestDefrag",
      field: "dest_defrag",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "SyncProgress",
      field: "sync_progress",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "DiscardScanInterval",
      field: "discard_scan_interval",
      hozAlign: "center",
      headerTooltip: true,
      width: 180,
    },
    {
      title: "DiscardScanBytes",
      field: "discard_scan_bytes",
      hozAlign: "center",
      headerTooltip: true,
      width: 180,
    },
    {
      title: "FirstScanFinished",
      field: "first_scan_finished",
      hozAlign: "center",
      headerTooltip: true,
      width: 180,
    },
  ];

  // tabulator 옵션
  const options = {
    layout: "fitDataTable",
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    height: 460,
    scrollable: true,
    placeholder: t("MUL_WD_0137"),
  };

  const columns = STORE_COLUMNS_LIST;

  const defaultFetch = async () => {
    setRowData([]);
  };
  useEffect(() => {
    defaultFetch();
  }, []);

  let storeUrl = `/api/situation/storeApi`;

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await fetch(storeUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setRowData(dataInfo);

      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, []);

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

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Store_History", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(STORE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(STORE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          {/* <-- page title --> */}
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  Store
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Store {t("MUL_WD_0007")}
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Store {t("MUL_WD_0007")}</h1>
            <p className="lead"></p>
          </div>
          {/* <-- page title --> */}
        </div>
        <div className="content__boxed">
          <div className="content__wrap">
            <div className="mt-2 search-box justify-content-center">
              <div className="row col-md-12">
                {/* <-- Server --> */}
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    {t("MUL_WD_0009")}
                  </label>
                  <div className="col-sm-5">
                    <DropdownComponent
                      onServerSelected={handleSelectedServerAlias}
                    />
                  </div>
                </div>
                {/* <!-- 일시 --> */}
                <div className="row col-md-4">
                  <label
                    className="col-sm-3 col-form-label text-sm-end"
                    htmlFor="int_day"
                  >
                    {t("MUL_WD_0026")}
                  </label>
                  <div className="col-sm-9">
                    <QuickDatePicker
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={(date) =>
                        setStartDate(moment(date).format("YYYY-MM-DD HH:mm:ss"))
                      }
                      onEndDateChange={(date) =>
                        setEndDate(moment(date).format("YYYY-MM-DD HH:mm:ss"))
                      }
                      defaultTime={new Date(Date.now() - 10 * 60 * 1000)}
                    />
                  </div>
                </div>
                {/* <!-- 조회 버튼 --> */}
                <div
                  style={{ maxWidth: 100, marginLeft: 100 }}
                  className="justify-content-start"
                >
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
            </div>
            {/* --- 엑셀 저장 버튼 --- */}
            <div className="mt-3 row">
              <div className="row justify-content-end">
                <button
                  className="btn btn-icon btn-green"
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
                autoResize={false}
                options={options}
                data={rowData}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
