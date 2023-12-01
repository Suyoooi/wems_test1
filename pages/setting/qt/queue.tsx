import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { QueueListData } from "@/types/webComm";
import CodeList from "@/components/codeList";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/addQTInfo";
import GetPropModal from "@/components/modal/setting/queue/getPropInfo";
import SetPropModal from "@/components/modal/setting/queue/setPropInfo";
import SrvrSelect from "@/components/dropdown/DropdownComponent";
import { parseCookies } from "nookies";
import { QUEUE_COLUMNS } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function QueueInfo() {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];

  let queueInfoUrl = `/api/setting/queue/queueListApi`;
  let qtInfoUrl = `/api/setting/qtCommApi`;
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<QueueListData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenPropModal, setOpenPropModal] = useState<boolean>(false);
  const [srvrQueueInfo, setSrvrQueueInfo] = useState();
  const [isOpenSetPropModal, setOpenSetPropModal] = useState<boolean>(false);
  const dispatch = useDispatch();

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
  const onClickPropModal = useCallback(() => {
    if (isOpenPropModal) {
      handleClosePropModal();
    } else {
      handleOpenPropModal();
    }
  }, [isOpenPropModal]);

  // 모달3
  const handleOpenSetPropModal = () => {
    setOpenSetPropModal(true);
    dispatch(openModal());
  };
  const handleCloseSetPropModal = () => {
    setOpenSetPropModal(false);
    dispatch(closeModal());
  };
  const onClickSetPropModal = useCallback(() => {
    if (isOpenSetPropModal) {
      handleCloseSetPropModal();
    } else {
      handleOpenSetPropModal();
    }
  }, [isOpenSetPropModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sQueueType: "",
    sQueueNm: "",
  });
  const { sSrvrNm, sQueueType, sQueueNm } = searchInfo;

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
        emsSrvrList: serverFilter,
        pattern: sQueueType,
        name: sQueueNm,
        accToken: accessToken,
      };

      const res = await fetch(queueInfoUrl, {
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
      formatter: function (cell: any, formatterParams: any, onRendered: any) {
        const data = cell.getRow().getData();
        var checkbox: any = document.createElement("input");
        checkbox.type = "checkbox";
        const queueNm = data.ems_que_nm;

        if (tableRef.current && tableRef.current.table) {
          const table = tableRef.current.table;

          if (table.modExists("selectRow", true)) {
            checkbox.addEventListener("click", (e: any) => {
              e.stopPropagation();
            });

            if (typeof cell.getRow == "function") {
              var row = cell.getRow();

              if (row._getSelf().type == "row") {
                checkbox.addEventListener("change", (e: any) => {
                  row.toggleSelect();
                });

                if (queueNm.includes("$sys")) {
                  checkbox.disabled = "true";
                } else {
                  checkbox.checked = row.isSelected && row.isSelected();
                  table.modules.selectRow.registerRowSelectCheckbox(
                    row,
                    checkbox
                  );
                }
              } else {
                checkbox = "";
              }
            } else {
              checkbox.addEventListener("change", (e: any) => {
                if (table.modules.selectRow.selectedRows.length) {
                  table.deselectRow();
                } else {
                  table.selectRow(formatterParams.rowRange);
                }
              });

              table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
            }
          }
        }
        return checkbox;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      cssClass: "text-center",
    },
    // { title: "", width: 40, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", frozen: true, headerSort: false, cssClass: 'text-center' },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      width: 70,
      headerHozAlign: "center",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      formatter: reactFormatter(<QueueActionButton />),
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      width: 145,
      tooltip: formatTooltip,
    },
    {
      title: t("MUL_WD_0100"),
      field: "ems_que_nm",
      headerTooltip: true,
      hozAlign: "left",
      frozen: true,
      width: 145,
      tooltip: formatTooltip,
    },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "right",
      visible: false,
    },
    {
      title: "QueueSn",
      field: "raw_queue_sn",
      headerTooltip: true,
      hozAlign: "right",
      visible: false,
    },
    {
      title: "Group",
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 145,
      tooltip: formatTooltip,
    },
    {
      title: "CreateDate",
      field: "clct_dt",
      headerTooltip: true,
      hozAlign: "center",
      width: 150,
      tooltip: formatTooltip,
    },
    {
      title: "PendingMsgCount",
      field: "pend_msg_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 160,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "PendingMsgSize",
      field: "pend_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 160,
      formatter: function (cell) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "ReceiverCount",
      field: "recvr_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 140,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "InTotalMsgs",
      field: "in_tot_msg",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "OutTotalMsgs",
      field: "out_tot_msg",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "InMsgRate",
      field: "in_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "OutMsgRate",
      field: "out_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "PendPersMsgCount",
      field: "pend_msg_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 175,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "PendPersMsgSize",
      field: "pend_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 165,
      formatter: function (cell) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "InTotalBytes",
      field: "in_tot_byte",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "OutTotalBytes",
      field: "out_tot_byte",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "InByteRate",
      field: "in_byte_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "OutByteRate",
      field: "out_byte_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "AvgMsgSize",
      field: "avg_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "StoreName",
      field: "store",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "Static",
      field: "is_que_static",
      headerTooltip: true,
      hozAlign: "center",
      width: 90,
    },
    {
      title: "Routed",
      field: "is_route",
      headerTooltip: true,
      hozAlign: "center",
      width: 90,
    },
    {
      title: "RouteConnected",
      field: "is_rte_cnnt",
      headerTooltip: true,
      hozAlign: "center",
      width: 150,
    },
    {
      title: "RouteName",
      field: "route_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
  ];

  const options: ReactTabulatorOptions = {
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

  function QueueActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;
    let btnDis = false;
    const queueNm = rowData.ems_que_nm;

    if (queueNm.includes("$sys")) {
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
            title={t("MUL_WD_0017") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => viewPropInfo(rowData)}
          >
            <i className="i_property icon-sm fs-5"></i>
          </button>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0045") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            disabled={btnDis}
            onClick={() => modPropInfo(rowData, cell)}
          >
            <i className="i_modify icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  function viewPropInfo(rowData: any) {
    setSrvrQueueInfo(rowData);
    onClickPropModal();
  }

  async function modPropInfo(rowData: any, cell: any) {
    setSrvrQueueInfo(rowData);
    onClickSetPropModal();
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Queue", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(QUEUE_COLUMNS);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(QUEUE_COLUMNS);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableData();
    }
  };

  const addQueue = () => {
    onClickToggleModal();
  };

  const destQueue = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const destPurData: any = [];

    if (selectedData != "") {
      const queueNm = selectedData[0].ems_que_nm;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to delete ${mapCnt}} items other than the selected [ ${queueNm} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 [ ${queueNm} ] 외 ${mapCnt} 건을 삭제하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Are you sure you want to delete the selected [ ${queueNm} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 [ ${queueNm} ]를 삭제하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.name = sData.ems_que_nm;
          concatVal.srvr_sn = sData.tib_srvr_sn;
          destPurData.push(concatVal);
        });

        const bodyData = {
          case_method: "DEL",
          emsQT: "queue",
          des_pur_list: destPurData,
          accToken: accessToken,
        };

        const res = await fetch(qtInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00165"));
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
          alert(t("MUL_ST_00164"));
        }
      }
    } else {
      alert(t("MUL_ST_00163"));
    }
  };

  const purgeQueue = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const destPurData: any = [];

    if (selectedData != "") {
      const queueNm = selectedData[0].ems_que_nm;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to purge ${mapCnt} items other than the selected [ ${queueNm} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 [ ${queueNm} ] 외 ${mapCnt} 건을 퍼지하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to purge the selected [ ${queueNm} ]?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 [ ${queueNm} ]을 퍼지하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.name = sData.ems_que_nm;
          concatVal.srvr_sn = sData.tib_srvr_sn;
          destPurData.push(concatVal);
        });

        const bodyData = {
          case_method: "PUT",
          emsQT: "queue",
          des_pur_list: destPurData,
          accToken: accessToken,
        };

        const res = await fetch(qtInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00162"));
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
          alert(t("MUL_ST_00161"));
        }
      }
    } else {
      alert(t("MUL_ST_00160"));
    }
  };

  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          svcGbn="Queue"
          chVisible={true}
          callbackFunction={callbackFunction}
        />
      )}

      {isOpenPropModal && (
        <GetPropModal
          onClickPropModal={handleClosePropModal}
          propInfo={srvrQueueInfo}
        />
      )}

      {isOpenSetPropModal && (
        <SetPropModal
          onClickSetPropModal={handleCloseSetPropModal}
          propInfo={srvrQueueInfo}
        />
      )}

      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  Queue/Topic
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Queue
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Queue</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  <div className="row col-md-5">
                    <label
                      className="col-sm-3 col-form-label text-sm-end"
                      htmlFor="sel_ems"
                    >
                      EMS
                    </label>
                    <div className="col-sm-8">
                      <SrvrSelect
                        onServerSelected={handleSelectedServerAlias}
                      />
                    </div>
                  </div>
                  <div className="mb-2 row col-md-5">
                    <label
                      className="col-sm-3 col-form-label text-sm-end"
                      htmlFor="sQueueType"
                    >
                      Queue
                    </label>
                    <div className="col-sm-5">
                      <select
                        id="sQueueType"
                        name="sQueueType"
                        className="form-select"
                        onChange={onChangeSearch}
                      >
                        <CodeList codeGroupId="QUE_TP_CD" />
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        id="sQueueNm"
                        name="sQueueNm"
                        onChange={onChangeSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 justify-content-start">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="gap-2 btn btn-dark hstack"
                    >
                      <i className="i_view_search fs-5"></i>
                      {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 row">
                <div
                  className="col-md-8"
                  style={{ display: "flex", gap: "0.5rem" }}
                >
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={() => addQueue()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0082")}
                  </button>
                  <button
                    className="gap-2 btn btn-gray hstack"
                    onClick={() => destQueue()}
                  >
                    {t("MUL_WD_0083")}
                  </button>
                  <button
                    className="gap-2 btn btn-gray hstack"
                    onClick={() => purgeQueue()}
                  >
                    {t("MUL_WD_0084")}
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
