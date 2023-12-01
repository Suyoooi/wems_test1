import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { DurableListData } from "@/types/webComm";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/durable/addDurableInfo";
import GetBrowseModal from "@/components/modal/setting/durable/getBrowseInfo";
import SrvrSelect from "@/components/dropdown/DropdownComponent";
import { DURABLE_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function DurableInfo() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let durableInfoUrl = `/api/setting/durable/durableListApi`;

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<DurableListData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  // Add Durable 모달
  const handleOpenAddModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };
  const handleCloseAddModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };
  const onClickToggleModal = useCallback(() => {
    if (isOpenModal) {
      handleCloseAddModal();
    } else {
      handleOpenAddModal();
    }
  }, [isOpenModal]);

  const [isOpenBrowseModal, setOpenBrowseModal] = useState<boolean>(false);
  const [browseInfo, setBrowseInfo] = useState();

  // property 모달
  const handleOpenModal = () => {
    setOpenBrowseModal(true);
    dispatch(openModal());
  };
  const handleCloseModal = () => {
    setOpenBrowseModal(false);
    dispatch(closeModal());
  };
  const onClickBrowseModal = useCallback(() => {
    if (isOpenBrowseModal) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isOpenBrowseModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sDurableNm: "",
  });
  const { sSrvrNm, sDurableNm } = searchInfo;

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
        name: sDurableNm,
      };

      const res = await fetch(durableInfoUrl, {
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
      title: "Browse",
      field: "custom",
      headerTooltip: true,
      width: 80,
      headerHozAlign: "center",
      hozAlign: "left",
      frozen: true,
      headerSort: false,
      formatter: reactFormatter(<DurableActionButton />),
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
      hozAlign: "left",
      visible: false,
    },
    {
      title: "Group",
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 95,
      tooltip: formatTooltip,
    },
    {
      title: "DurableName",
      field: "durab_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "TopicName",
      field: "topic_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "Active",
      field: "atv",
      headerTooltip: true,
      hozAlign: "center",
      width: 90,
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
      title: "ClientID",
      field: "clnt_id",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "ConsumerID",
      field: "cnsmr_id",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "UserName",
      field: "user_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "Selector",
      field: "seltr",
      hozAlign: "left",
      headerTooltip: true,
      width: "10%",
      sorter: "string",
    },
    {
      title: "NoLocal",
      field: "no_locl_enbd",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveredMsgCount",
      field: "deliv_msg_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 180,
      formatter: function (cell) {
        return setCommaNum(cell.getValue());
      },
    },
    {
      title: "Static",
      field: "durab_static",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "isShared",
      field: "shared",
      headerTooltip: true,
      hozAlign: "center",
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

  function DurableActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;
    let btnDis = false;
    const queueNm = rowData.ems_que_nm;

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
            onClick={() => viewBrowseInfo(rowData)}
          >
            <i className="i_property icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  function viewBrowseInfo(rowData: any) {
    setBrowseInfo(rowData);
    onClickBrowseModal();
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Durable", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(DURABLE_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(DURABLE_LIST_EXCEL);
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

  const addDurable = () => {
    onClickToggleModal();
  };

  const destDurable = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const destDurData: any = [];

    if (selectedData != "") {
      const durableNm = selectedData[0].durab_nm;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to delete ${mapCnt} items other than the selected ${durableNm}?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ${durableNm} 외 ${mapCnt} 건을 삭제하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Are you sure you want to delete the selected ConnectionId  ${durableNm}?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ConnectionId ${durableNm}을 삭제하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.tib_srvr_sn = sData.tib_srvr_sn;
          concatVal.durable_name = sData.durab_nm;
          concatVal.client_id = sData.clnt_id;
          destDurData.push(concatVal);
        });

        const bodyData = {
          case_method: "DEL",
          durab_info_list: destDurData,
        };

        const res = await fetch(durableInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00138"));
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
          alert(t("MUL_ST_00139"));
        }
      }
    } else {
      alert(t("MUL_ST_00140"));
    }
  };

  const purgeDurable = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const destDurData: any = [];

    if (selectedData != "") {
      const durableNm = selectedData[0].durab_nm;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to purge ${mapCnt} items other than the selected ${durableNm}?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ${durableNm} 외 ${mapCnt} 건을 퍼지하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to purge the selected ${durableNm}`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ${durableNm}을 퍼지하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.tib_srvr_sn = sData.tib_srvr_sn;
          concatVal.durable_name = sData.durab_nm;
          concatVal.client_id = sData.clnt_id;
          destDurData.push(concatVal);
        });

        const bodyData = {
          case_method: "PUT",
          durab_info_list: destDurData,
        };

        const res = await fetch(durableInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00145"));
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
          alert(t("MUL_ST_00146"));
        }
      }
    } else {
      alert(t("MUL_ST_00148"));
    }
  };

  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseAddModal}
          durableInfoVal={tableData}
          callbackFunction={callbackFunction}
        />
      )}
      {isOpenBrowseModal && (
        <GetBrowseModal
          onClickBrowseModal={handleCloseModal}
          browseInfoVal={browseInfo}
        />
      )}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Durable
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Durable</h1>
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
                      htmlFor="sDurableNm"
                    >
                      Durable {t("MUL_WD_0072")}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="sDurableNm"
                        name="sDurableNm"
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
                    onClick={() => addDurable()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0076")}
                  </button>
                  <button
                    className="gap-2 btn btn-gray hstack"
                    onClick={() => destDurable()}
                  >
                    {t("MUL_WD_0077")}
                  </button>
                  <button
                    className="gap-2 btn btn-gray hstack"
                    onClick={() => purgeDurable()}
                  >
                    {t("MUL_WD_0078")}
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
