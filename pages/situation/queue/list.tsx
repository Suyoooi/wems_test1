import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ColumnDefinition,
  ReactTabulator,
  ReactTabulatorOptions,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import { QueueTableData } from "@/types/webComm";
import DropdownComponent from "@/components/dropdown/DropdownComponent";
import Modal from "@/components/modal/Modal";
import { QUEUE_PROPERTY_HEADER_LIST } from "@/constant/data/QueueListData";
import CodeList from "@/components/codeList";
import DownloadFileNm from "@/utils/downloadFileNm";
import { QUEUE_DATE_COLUMNS_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useTheme } from "@/constant/context/themeContext";

export default function List() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [detailData, setDetailData] = useState([]);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [queueFilter, setQueueFilter] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [filteredData, setFilteredData] = useState<QueueTableData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const { isDarkMode } = useTheme();

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const options: ReactTabulatorOptions = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    layout: "fitDataFill",
    placeholder: t("MUL_WD_0137"),
  };

  let queueListUrl = `/api/situation/queue/queueListApi`;

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        pattern: selectedPattern,
        name: queueFilter,
      };

      const res = await fetch(queueListUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setFilteredData(dataInfo);

      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, []);

  // property 모달 열고 닫기
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

  const FormatBytes = require("@/components/unitFormat");

  const QUEUE_DATE_COLUMNS_LIST: ColumnDefinition[] = [
    {
      title: "No",
      field: "dataNo",
      frozen: true,
      formatter: "rownum",
      headerTooltip: true,
      hozAlign: "center",
      width: 70,
      headerSort: false,
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      frozen: true,
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: t("MUL_WD_0017"),
      frozen: true,
      headerTooltip: true,
      hozAlign: "left",
      width: 80,
      formatter: reactFormatter(<PropActionButton />),
      headerSort: false,
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      frozen: true,
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
      sorter: "string",
    },
    {
      title: "QueueName",
      field: "ems_que_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "PendingMsgCount",
      field: "pend_msg_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgSize",
      field: "pend_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 150,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "ReceiverCount",
      field: "recvr_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 150,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "InTotalMsgs",
      field: "in_tot_msg",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutTotalMsgs",
      field: "out_tot_msg",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "InMsgRate",
      field: "in_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutMsgRate",
      field: "out_msg_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendPersMsgCount",
      field: "pend_msg_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 180,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendPersMsgSize",
      field: "pend_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 165,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "InTotalBytes",
      field: "in_tot_byte",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutTotalBytes",
      field: "out_tot_byte",
      headerTooltip: true,
      hozAlign: "right",
      width: 150,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "InByteRate",
      field: "in_byte_rate",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "OutByteRate",
      field: "out_byte_rate",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "AvgMsgSize",
      field: "avg_msg_size",
      headerTooltip: true,
      width: 130,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "StoreName",
      field: "store_nm",
      headerTooltip: true,
      width: 130,
      hozAlign: "left",
    },
    {
      title: "Static",
      field: "is_que_static",
      headerTooltip: true,
      width: 100,
      hozAlign: "center",
    },
    {
      title: "Routed",
      field: "is_route",
      headerTooltip: true,
      width: 100,
      hozAlign: "center",
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
      width: 130,
      hozAlign: "right",
    },
  ];

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Queue_List", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(QUEUE_DATE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(QUEUE_DATE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  function PropActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    return (
      <>
        <button
          type="button"
          aria-expanded="false"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title={t("MUL_WD_0017") as string}
          className="btn btn-icon btn-outline-light btn_t_xs"
          onClick={() => getPropDetail(rowData)}
        >
          <i className="i_property icon-sm fs-5"></i>
        </button>
      </>
    );
  }

  // queue 속성 api
  async function getPropDetail(rowData: any) {
    const serialNm = rowData.raw_queue_sn;
    try {
      const bodyData = {
        case_method: "GET_PROP",
        raw_queue_sn: serialNm,
      };

      const res = await fetch(queueListUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const propertyData = data.data;
      const detailDataVal: any = [];

      var keys = Object.keys(propertyData);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        const value: any = {};
        value.dataNo = i + 1;
        value.key = key;
        value.value = propertyData[key];

        detailDataVal.push(value);
      }
      setDetailData(detailDataVal);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }

    onClickToggleModal();
  }

  const columns = QUEUE_DATE_COLUMNS_LIST;

  // 조회 버튼
  const handleViewButtonClick = async () => {
    setFilteredData([]);
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

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          columns={QUEUE_PROPERTY_HEADER_LIST}
          rowData={detailData}
          title={"Queue Property"}
          fileNm={"Queue Property"}
        />
      )}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          {/* <-- page title --> */}
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  Queue
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Queue {t("MUL_WD_0014")}
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Queue {t("MUL_WD_0014")}</h1>
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
                {/* <-- Queue --> */}
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    Queue
                  </label>
                  <div className="col-sm-5">
                    <select
                      id="sel_queue"
                      className="form-select"
                      value={selectedPattern}
                      onChange={(e) => setSelectedPattern(e.target.value)}
                    >
                      <CodeList codeGroupId="QUE_TP_CD" />
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <input
                      className="form-control"
                      value={queueFilter}
                      onChange={(e) => setQueueFilter(e.target.value)}
                    />
                  </div>
                </div>
                {/* <!-- 조회 버튼 --> */}
                <div className="col-4 justify-content-start">
                  <button
                    type="button"
                    className="gap-2 btn btn-dark hstack"
                    onClick={handleViewButtonClick}
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
              {/* --- Tabulator --- */}
              <ReactTabulator
                key={filteredData.length}
                ref={tableRef}
                autoResize={false}
                options={options}
                data={filteredData}
                columns={columns}
                // className={isDarkMode ? "dark-mode" : ()}
                // className={}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
