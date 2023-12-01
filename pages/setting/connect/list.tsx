import React, { useRef, useState, useEffect, useCallback } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { ConnectionListData } from "@/types/webComm";
import CodeList from "@/components/codeList";
import DownloadFileNm from "@/utils/downloadFileNm";
import SrvrSelect from "@/components/dropdown/DropdownComponent";
import { CONNECTION_COLUMNS } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function ConnectionInfo() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  let connInfoUrl = `/api/setting/connect/connectListApi`;

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<ConnectionListData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sType: "",
  });
  const { sSrvrNm, sType } = searchInfo;

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;

    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  const fetchTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        type: sType,
      };

      const res = await fetch(connInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      setTableData(dataInfo);
      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleSubmit = async () => {
    fetchTableData();
  };

  const columns: ColumnDefinition[] = [
    {
      title: "",
      width: 40,
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      cssClass: "text-center",
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "ID",
      field: "ID",
      headerTooltip: true,
      hozAlign: "left",
      width: 90,
    },
    {
      title: "Type",
      field: "Type",
      headerTooltip: true,
      hozAlign: "left",
      width: 100,
    },
    {
      title: "Host",
      field: "Host",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "Address",
      field: "Address",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
    },
    {
      title: "Port",
      field: "Port",
      headerTooltip: true,
      hozAlign: "right",
      width: 90,
    },
    {
      title: "ClientID",
      field: "ClientID",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
    },
    {
      title: "ConsumerCount",
      field: "ConsumerCount",
      headerTooltip: true,
      hozAlign: "right",
      width: 150,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "ProducerCount",
      field: "ProducerCount",
      headerTooltip: true,
      hozAlign: "right",
      width: 145,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "SessionCount",
      field: "SessionCount",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "StartTime",
      field: "StartTime",
      headerTooltip: true,
      hozAlign: "center",
      width: 160,
      // formatter: function (cell: any, formatterParams) {
      //   const data = cell.getData().StartTime;
      //   const date = new Date(Number(data));

      //   const year = date.getFullYear().toString();
      //   const month = ("0" + (date.getMonth() + 1)).slice(-2);
      //   const day = ("0" + date.getDate()).slice(-2);
      //   const hour = ("0" + date.getHours()).slice(-2);
      //   const minute = ("0" + date.getMinutes()).slice(-2);
      //   const second = ("0" + date.getSeconds()).slice(-2);

      //   const returnDate =
      //     year +
      //     "-" +
      //     month +
      //     "-" +
      //     day +
      //     " " +
      //     hour +
      //     ":" +
      //     minute +
      //     ":" +
      //     second;
      //   return returnDate;
      // },
    },
    {
      title: "Uptime",
      field: "Uptime",
      headerTooltip: true,
      hozAlign: "center",
      width: 150,
      formatter: function (cell: any, formatterParams) {
        const upDt = cell.getData().Uptime;

        const timeGap = new Date(0, 0, 0, 0, 0, 0, upDt);
        const days = Math.floor(upDt / (24 * 60 * 60 * 1000));
        const hours = timeGap.getHours();
        const minutes = timeGap.getMinutes();
        const seconds = timeGap.getSeconds();

        let fullDate = "";
        if (lang === "en") {
          fullDate = `${days != 0 ? days + " Days" : ""} ${
            hours != 0 ? hours + " Hours" : ""
          } ${minutes != 0 ? minutes + " Mins" : ""} ${
            seconds != 0 ? seconds + " Secs" : ""
          }`;
        } else {
          fullDate = `${days != 0 ? days + "일" : ""} ${
            hours != 0 ? hours + "시간" : ""
          } ${minutes != 0 ? minutes + "분" : ""} ${
            seconds != 0 ? seconds + "초" : ""
          }`;
        }

        return fullDate;
      },
    },
    {
      title: "URL",
      field: "URL",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "UserName",
      field: "UserName",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "ClientVersion",
      field: "ClientVersion",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "ClientType",
      field: "ClientType",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "isFT",
      field: "isFT",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "isXA",
      field: "isXA",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "isAdmin",
      field: "isAdmin",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "UncommittedCount",
      field: "UncommittedCount",
      headerTooltip: true,
      hozAlign: "right",
      width: 170,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "UncommittedSize",
      field: "UncommittedSize",
      headerTooltip: true,
      hozAlign: "right",
      width: 155,
      formatter: function (cell) {
        return FormatBytes(cell.getValue());
      },
    },
  ];

  const options = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    layout: "fitDataTable",
    rowHeight: 45,
    placeholder: t("MUL_WD_0137"),
  };

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  const setCommaNum = (num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const FormatBytes = require("@/components/unitFormat");

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Connection", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(CONNECTION_COLUMNS);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(CONNECTION_COLUMNS);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  const destConnect = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const destConnData: any = [];

    if (selectedData != "") {
      const connId = selectedData[0].ID;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to delete ${mapCnt} cases other than the selected ConnectionId [ ${connId} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ConnectionId [ ${connId} ] 외 ${mapCnt} 건을 삭제하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to delete the selected ConnectionId [ ${connId} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ConnectionId [ ${connId} ]을 삭제하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.tib_srvr_sn = sData.tib_srvr_sn;
          concatVal.conn_id = sData.ID;
          destConnData.push(concatVal);
        });

        const bodyData = {
          case_method: "DEL",
          conn_info_list: destConnData,
        };

        const res = await fetch(connInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00132"));
          fetchTableData();
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
          alert(t("MUL_ST_00133"));
        }
      }
    } else {
      alert(t("MUL_ST_00134"));
    }
  };

  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };

  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Connection
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Connection</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  <div className="row col-md-4">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sel_ems"
                    >
                      EMS {t("MUL_WD_0009")}
                    </label>
                    <div className="col-sm-8">
                      <SrvrSelect
                        onServerSelected={handleSelectedServerAlias}
                      />
                    </div>
                  </div>

                  <div className="mb-2 row col-md-4">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sType"
                    >
                      Type
                    </label>
                    <div className="col-sm-8">
                      <select
                        id="sType"
                        name="sType"
                        className="form-select"
                        onChange={onChangeSearch}
                      >
                        <CodeList codeGroupId="QT_GBN_CD" />
                      </select>
                    </div>
                  </div>
                  <div className="col-4 justify-content-start">
                    <button
                      type="button"
                      className="gap-2 btn btn-dark hstack"
                      onClick={handleSubmit}
                    >
                      <i className="i_view_search fs-5"></i>
                      {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 row">
                <div className="col-md-8">
                  <button
                    className="gap-2 btn btn-gray hstack"
                    onClick={() => destConnect()}
                  >
                    <i className="i_disconnect fs-5"></i>
                    {t("MUL_WD_0081")}
                  </button>
                </div>
                <div className="d-flex col-md-4 justify-content-md-end">
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

              <div className="table table-responsove">
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
        </div>
      </section>
    </>
  );
}
