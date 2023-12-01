import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { SrvrListData } from "@/types/webComm";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/ems/addEmsSrvr";
import PropModal from "@/components/modal/setting/ems/getSrvrPropInfo";
import GrpModal from "@/components/modal/setting/ems/setGrpInfo";
import { parseCookies } from "nookies";
import { EMS_SERVER_COLUMNS } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function EmsSrvrListInfo() {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<SrvrListData[]>([]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenPropModal, setOpenPropModal] = useState<boolean>(false);
  const [isOpenGrpModal, setOpenGrpModal] = useState<boolean>(false);
  const [srvrInfo, setSrvrInfo] = useState(null);

  // 모달1
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };

  const onClickToggleModal = useCallback(() => {
    if (isOpenModal) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isOpenModal]);

  // 모달2
  const handleOpenPropModal = () => {
    setOpenPropModal(true);
    dispatch(openModal());
  };

  const handleClosePropModal = () => {
    setOpenPropModal(false);
    dispatch(closeModal());
  };

  const onClickTogglePropModal = useCallback(() => {
    if (isOpenPropModal) {
      handleClosePropModal();
    } else {
      handleOpenPropModal();
    }
  }, [isOpenPropModal]);

  // 모달3
  const handleOpenGrpModal = () => {
    setOpenGrpModal(true);
    dispatch(openModal());
  };

  const handleCloseGrpModal = () => {
    setOpenGrpModal(false);
    dispatch(closeModal());
  };

  const onClickToggleGrpModal = useCallback(() => {
    if (isOpenGrpModal) {
      handleCloseGrpModal();
    } else {
      handleOpenGrpModal();
    }
  }, [isOpenModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sHostNm: "",
  });
  const { sSrvrNm, sHostNm } = searchInfo;

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
        alias: sSrvrNm,
        accToken: accessToken,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      if (data && data.code == "200") {
        setTableData(dataInfo);
      } else if (data && data.code == "J002") {
        alert(data.msg);
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
    fetchTableData();
  }, []);

  async function handleSubmit() {
    fetchTableData();
  }

  const columns: ColumnDefinition[] = [
    {
      title: "No",
      field: "dataNo",
      frozen: true,
      formatter: "rownum",
      headerTooltip: true,
      hozAlign: "center",
      // width: 70,
      headerSort: false,
    },
    {
      title: t("MUL_WD_0047"),
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "right",
      frozen: true,
      // width: 110,
      tooltip: formatTooltip,
    },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      width: 70,
      headerHozAlign: "center",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      formatter: reactFormatter(<SrvrActionButton />),
    },
    {
      title: t("MUL_WD_0017"),
      field: "custom",
      headerTooltip: true,
      width: 50,
      headerHozAlign: "center",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      formatter: reactFormatter(<SrvrPropActionButton />),
    },
    {
      title: t("MUL_WD_0069"),
      field: "alias",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      // width: 130,
      tooltip: formatTooltip,
    },
    {
      title: t("MUL_WD_0070"),
      field: "status",
      headerTooltip: true,
      hozAlign: "center",
      frozen: true,
      // width: 90,
      tooltip: formatTooltip,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return "<span class='circle g_cir16'></span>";
        } else {
          return "<span class='circle r_cir16'></span>";
        }
      },
    },
    {
      title: "SrvrSn",
      field: "srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      frozen: true,
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: t("MUL_WD_0011"),
      field: "server_name",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      // width: 130,
      tooltip: formatTooltip,
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      // width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "GroupSn",
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "ServerUrl",
      field: "tib_srvr_url",
      headerTooltip: true,
      hozAlign: "center",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "UserName",
      field: "username",
      headerTooltip: true,
      hozAlign: "left",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "UserPassword",
      field: "password",
      headerTooltip: true,
      hozAlign: "center",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "Ingest",
      field: "tib_srvr_mntr_yn",
      headerTooltip: true,
      hozAlign: "center",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "SysMonitor",
      field: "tib_srvr_sys_event_yn",
      headerTooltip: true,
      hozAlign: "center",
      // width: 130,
      tooltip: formatTooltip,
      visible: false,
    },
    {
      title: "FaultTolerantState",
      field: "fault_tolerant_state",
      headerTooltip: true,
      hozAlign: "center",
      // width: 80,
      tooltip: formatTooltip,
    },
    {
      title: "Events",
      field: "",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Connections",
      field: "connections",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Sessions",
      field: "sessions",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Queues",
      field: "queues",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Topics",
      field: "topics",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Durables",
      field: "durables",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgs",
      field: "pending_msgs",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgSize",
      field: "pending_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "MsgMem",
      field: "msg_mem",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "InMsgRate",
      field: "in_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutMsgRate",
      field: "out_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "DiskReadRate",
      field: "disk_read_rate",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "DiskWriteRate",
      field: "disk_write_rate",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "AsyncDBSize",
      field: "async_db_size",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "SyncDBSize",
      field: "sync_db_size",
      headerTooltip: true,
      hozAlign: "right",
      // width: 130,
      formatter: function (cell) {
        return formatBytes(cell, cell.getValue());
      },
    },
    {
      title: "RespTime",
      field: "",
      headerTooltip: true,
      hozAlign: "center",
      // width: 80,
      tooltip: formatTooltip,
    },
  ];

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

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

  function formatBytes(cell: any, bytes: any, decimals = 2) {
    const statusVal = cell.getData().status;

    if (statusVal) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      const parseData = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
      const parseVal = parseData.toLocaleString("ko-KR") + " " + sizes[i];

      return parseVal;
    }
  }

  const options: ReactTabulatorOptions = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    layout: "fitDataTable",
    placeholder: t("MUL_WD_0137"),
  };

  function SrvrActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;

    let btnDis = false;
    const statusVal = rowData.status;

    // [2023-11-20] 서버 상태와 상관 없이 무조건 수정할 수 있도록 변경
    if (!statusVal) {
      btnDis = true;
    }

    return (
      <>
        <div className="gap-2 row" style={{ paddingLeft: "7px" }}>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0045") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            // disabled={btnDis}
            onClick={() => modSrvrInfo(rowData, cell)}
          >
            <i className="i_modify icon-sm fs-5"></i>
          </button>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0046") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => delSrvrInfo(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  function SrvrPropActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;

    let btnPropDis = false;
    const statusVal = rowData.status;

    if (!statusVal) {
      btnPropDis = true;
    }

    return (
      <>
        <div className="gap-2 row" style={{ paddingLeft: "7px" }}>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0017") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            disabled={btnPropDis}
            onClick={() => srvrPropInfo(rowData, cell)}
          >
            <i className="i_property icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  async function modSrvrInfo(rowData: any, cell: any) {
    setSrvrInfo(rowData);
    onClickToggleModal();
  }

  async function srvrPropInfo(rowData: any, cell: any) {
    setSrvrInfo(rowData);
    onClickTogglePropModal();
  }

  const delSrvrInfo = async (rowData: any) => {
    const delSrvrSn = rowData.tib_srvr_sn;
    const delSrvrAlias = rowData.alias;

    if (confirm(t("MUL_ST_0040") + delSrvrAlias + " [" + delSrvrSn + "]")) {
      const delBodyData = {
        case_method: "DEL",
        tib_srvr_sn: delSrvrSn,
        accToken: accessToken,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(delBodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data && data.code == "200") {
        alert(t("MUL_ST_0041"));
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
        alert(t("MUL_ST_0042"));
      }
    }
  };

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("EMS_Server_List", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      table.setColumns(EMS_SERVER_COLUMNS);
      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
      table.setColumns(columns);
    }
  };

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableData();
    }
  };

  const addSrvr = () => {
    setSrvrInfo(null);
    onClickToggleModal();
  };

  const addGrp = () => {
    onClickToggleGrpModal();
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          modSrvrInfo={srvrInfo}
          callbackFunction={callbackFunction}
        />
      )}

      {isOpenPropModal && (
        <PropModal
          onClickTogglePropModal={handleClosePropModal}
          srvrPropInfo={srvrInfo}
          callbackFunction={callbackFunction}
        />
      )}

      {isOpenGrpModal && (
        <GrpModal
          onClickToggleGrpModal={handleCloseGrpModal}
          callbackFunction={callbackFunction}
        />
      )}

      {/* {isLoading && <Loading />} */}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  EMS {t("MUL_WD_0009")}
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  EMS {t("MUL_WD_0009")}
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">EMS {t("MUL_WD_0009")}</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  <div className="row col-md-6">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sSrvrNm"
                    >
                      {t("MUL_WD_0069")}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="sSrvrNm"
                        name="sSrvrNm"
                        onChange={onChangeSearch}
                      />
                    </div>
                  </div>
                  <div className="mb-2 row col-md-6">
                    <div className="col-3 justify-content-start">
                      <button
                        type="button"
                        className="gap-2 btn btn-dark hstack"
                        onClick={() => handleSubmit()}
                      >
                        <i className="i_view_search fs-5"></i>
                        {t("MUL_WD_0022")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- 서버 추가 버튼 --- */}
              <div className="mt-3 row">
                <div
                  className="col-md-6"
                  style={{ display: "flex", gap: "0.5rem" }}
                >
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={() => addSrvr()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0030")}
                  </button>
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={() => addGrp()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0085")}
                  </button>
                </div>
                {/* --- 엑셀 저장 버튼 --- */}
                <div className="d-flex col-md-6 justify-content-md-end">
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
        </div>
      </section>
    </>
  );
}
