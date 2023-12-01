import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ReactTabulator } from "react-tabulator";
import { AllServerListData } from "@/types/webComm";
import DownloadFileNm from "@/utils/downloadFileNm";
import { parseCookies } from "nookies";
import { ALL_SERVER_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const AllSitu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  const [rowData, setRowData] = useState<AllServerListData[]>([]);

  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  // console.log(
  //   // "%c WEMS WEMS WEMS WEMS",
  //   "color: #ffdedb; font-size: 24px; font-weight: bold;"
  // );

  // console.log(
  //   `%c
  //   ██╗    ██╗███████╗███╗   ███╗███████╗
  //   ██║    ██║██╔════╝████╗ ████║██╔════╝
  //   ██║ █╗ ██║█████╗  ██╔████╔██║███████╗
  //   ██║███╗██║██╔══╝  ██║╚██╔╝██║╚════██║
  //   ╚███╔███╔╝███████╗██║ ╚═╝ ██║███████║
  //    ╚══╝╚══╝ ╚══════╝╚═╝     ╚═╝╚══════╝

  //   `,
  //   "color: #ffdedb;"
  // );

  // console.log(router)

  // useEffect(() => {
  //   const reloadTime = sessionStorage.getItem("reloadTime");
  //   // 로그인 후 페이지 진입시에 리프레시
  //   // [로그인 한 시간 + 1초]가 현재 시간보다 클 경우에만
  //   // 즉, 진입하고 1초 이내에 리프레시 실행, 만약 이후에 진입했다면 리프레시 실행 안함.
  //   // 토큰 유무로 할 경우 무한 루프 이슈 발생
  //   if (Number(reloadTime) + 1000 > currentTime) {
  //     router.reload();
  //   }
  // }, []);

  const [langVal, setLangVal] = useState("");

  const FormatBytes = require("@/components/unitFormat");

  useEffect(() => {
    if (lang === "en") {
      setLangVal("No data found.");
    } else if (lang === "ko") {
      setLangVal("검색된 데이터가 없습니다.");
    }
  }, [lang]);

  const options = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    scrollable: true,
    maxHeight: 500,
    placeholder: langVal,
  };

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        alias: "",
        accToken: "",
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      if (data && data.code == "200") {
        setRowData(dataInfo);
      } else if (data && data.code == "J002") {
        alert(data.msg);
      } else if (
        data.code === "500" ||
        data.code === "501" ||
        data.code === "502" ||
        data.code === "503" ||
        data.code === "504" ||
        data.code === "505" ||
        data.code === "506" ||
        data.code === "507" ||
        data.code === "508" ||
        data.code === "510" ||
        data.code === "511"
      ) {
        alert(t("MUL_ST_00233"));
      } else {
        alert(t("MUL_ST_00228"));
      }
      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    const cookies = parseCookies();
    const accessToken = cookies["access_token"];

    // accessToken이 존재하지 않으면 로그인 페이지로 리디렉션
    if (!accessToken) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchTableDataAsync();
  }, [dispatch]);

  // 조회 버튼
  const handleClickButton = async () => {
    dispatch(startLoading());

    try {
      await fetchTableDataAsync();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  const setCommaNum = (cell: any, num: any) => {
    const statusVal = cell.getData().status;

    if (statusVal) {
      if (num && num >= -1) {
        const numVal = num.toLocaleString("ko-KR");
        return numVal;
      } else {
        return 0;
      }
    }
  };

  const ALL_SERVER_LIST = [
    {
      title: "No",
      field: "dataNo",
      frozen: true,
      formatter: "rownum",
      headerTooltip: true,
      width: 70,
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: t("MUL_WD_0069"),
      field: "alias",
      frozen: true,
      headerTooltip: true,
      width: 130,
      hozAlign: "left",
    },
    {
      title: t("MUL_WD_0070"),
      field: "status",
      frozen: true,
      headerTooltip: true,
      width: 80,
      formatter: statusFormatter,
      hozAlign: "center",
    },
    {
      title: t("MUL_WD_0011"),
      field: "server_name",
      frozen: true,
      headerTooltip: true,
      width: 130,
      hozAlign: "left",
    },
    {
      title: "FaultTolerantState",
      field: "fault_tolerant_state",
      headerTooltip: true,
      width: 160,
      hozAlign: "left",
    },
    // {
    //   title: "Events",
    //   field: "tib_srvr_sys_event_yn",
    //   headerTooltip: true,
    //   width: 90,
    //   hozAlign: "center",
    // },
    {
      title: "Connections",
      field: "connections",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Sessions",
      field: "sessions",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Queues",
      field: "queues",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Topics",
      field: "topics",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Durables",
      field: "durables",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgs",
      field: "pending_msgs",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgSize",
      field: "pending_msg_size",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "MsgMem",
      field: "msg_mem",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "InMsgRate",
      field: "in_msg_rate",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutMsgRate",
      field: "out_msg_rate",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "DiskReadRate",
      field: "disk_read_rate",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "DiskWriteRate",
      field: "disk_write_rate",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "AsyncDBSize",
      field: "async_db_size",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "SyncDBSize",
      field: "sync_db_size",
      headerTooltip: true,
      width: 150,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "RespTime",
      field: "sync_db_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 150,
    },
  ];

  function statusFormatter(cell: any) {
    var value = cell.getValue();
    var element = document.createElement("span");

    if (value === true) {
      element.className += "circle g_cir16";
    } else if (value === false) {
      element.className += "circle r_cir16";
    } else {
      element.textContent = "알 수 없음";
    }
    return element;
  }

  const columns = ALL_SERVER_LIST;

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("All_Server_Situation", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(ALL_SERVER_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(ALL_SERVER_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      <div>
        <section id="content" className="content">
          <main>
            <section id="content" className="content">
              <div className="content__header content__boxed overlapping">
                <div className="content__wrap">
                  <nav aria-label="breadcrumb">
                    <ol className="mb-0 breadcrumb">
                      <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
                      <li
                        className="breadcrumb-item"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("MUL_WD_0067")}
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {t("MUL_WD_0068")}
                      </li>
                    </ol>
                  </nav>
                  <h1 className="mt-2 mb-0 page-title"> {t("MUL_WD_0068")}</h1>
                  <p className="lead"></p>
                  <div className="content__boxed">
                    <div className="mt-3 row">
                      <div className="row justify-content-end">
                        <button
                          type="button"
                          className="gap-2 btn btn-icon btn-gray mr_4"
                          onClick={handleClickButton}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title={t("MUL_WD_0071") as string}
                        >
                          <i className="i_refresh icon-lg fs-5"></i>
                        </button>
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
                  </div>
                  <div className="table-responsive">
                    {/* --- Tabulator --- */}
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
          </main>
        </section>
      </div>
    </>
  );
};

export default AllSitu;
