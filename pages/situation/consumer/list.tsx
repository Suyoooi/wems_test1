import CodeList from "@/components/codeList";
import SingleDropdownComponent from "@/components/dropdown/SingleDropdownComponent";
import Modal from "@/components/modal/Modal";
import { ConsumerTableData } from "@/types/webComm";
import { useCallback, useRef, useState, useEffect } from "react";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { toast } from "react-toastify";
import DownloadFileNm from "@/utils/downloadFileNm";
import { CONSUMER_DATA_COLUMNS_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const List = () => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [selectedServerName, setSelectedServerName] = useState<string[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<ConsumerTableData[]>([]);
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dataParseVal, setDataPaseVal] = useState([]);
  const dispatch = useDispatch();

  const FormatBytes = require("@/components/unitFormat");

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const defaultFetch = async () => {
    setFilteredData([]);
  };
  useEffect(() => {
    defaultFetch();
  }, []);

  let consumerUrl = `/api/situation/consumerApi`;

  const fetchDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_sn: serverFilter,
        pattern: selectedPattern,
        type: selectedType,
      };

      const res = await fetch(consumerUrl, {
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

  const CONSUMER_DATA_COLUMNS_LIST = [
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
      title: "ID",
      field: "id",
      hozAlign: "right",
      frozen: true,
      headerTooltip: true,
      width: 100,
    },
    {
      title: "connection",
      field: "cntn_id",
      frozen: true,
      hozAlign: "left",
      headerTooltip: true,
      width: 90,
      formatter: reactFormatter(<PropActionButton />),
      headerSort: false,
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },

    {
      title: "CreateTime",
      field: "cre_tm",
      hozAlign: "center",
      headerTooltip: true,
      width: 155,
    },
    {
      title: "DestinationName",
      field: "dest_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 350,
    },
    {
      title: "Active",
      field: "dtl_atv",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "PendingMsgCount",
      field: "pend_msg_cnt",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "PendingMsgSize",
      field: "pend_msg_size",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "ByteRate",
      field: "byte_rate",
      hozAlign: "right",
      headerTooltip: true,
      width: 100,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "MsgRate",
      field: "msg_rate",
      hozAlign: "right",
      headerTooltip: true,
      width: 100,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "TotalBytes",
      field: "tot_byte",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "TotalMsgs",
      field: "tot_msg",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "MillisSinceLastSent",
      field: "dtl_esin_lst_snt",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "MillisSinceLastAck",
      field: "dtl_esin_lst_ack_know",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "UnackedMsgCount",
      field: "dtl_crmsg_cnt_snd_srvr",
      hozAlign: "right",
      headerTooltip: true,
      width: 160,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Selector",
      field: "seltr",
      hozAlign: "left",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "UserName",
      field: "user_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "ConnectedID",
      field: "cntn_id",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "SessionID",
      field: "sess_id",
      hozAlign: "right",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "System",
      field: "dtl_sys",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "AckMode",
      field: "ack_mode",
      hozAlign: "left",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "DestinationType",
      field: "dest_tp",
      hozAlign: "left",
      headerTooltip: true,
      width: 160,
    },
    {
      title: "DurableName",
      field: "durab_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "Multicast",
      field: "mtcast",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
  ];

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

  // connection 속성
  async function getPropDetail(rowData: any) {
    const connetionId = rowData.cntn_id;
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET_PROP",
        tib_srvr_sn: serverFilter,
        connect_id: connetionId,
      };

      const res = await fetch(consumerUrl, {
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

        // Uptime 데이터만 가져옴
        const uptimeItem = detailDataVal.find(
          (item: { key: string }) => item.key === "Uptime"
        );
        const upDt = uptimeItem ? uptimeItem.value : null;

        if (upDt !== null && !isNaN(upDt)) {
          const timeGap = new Date(upDt);

          const days = Math.floor(upDt / (24 * 60 * 60 * 1000));
          const hours = timeGap.getUTCHours();
          const minutes = timeGap.getUTCMinutes();
          const seconds = timeGap.getUTCSeconds();

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

          if (uptimeItem) {
            uptimeItem.value = fullDate;
          }
        }
      }
      setDataPaseVal(detailDataVal);
      dispatch(stopLoading());
    } catch (error) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
    onClickToggleModal();
  }

  const CONNT_COLUMNS = [
    {
      title: "Key",
      field: "key",
      hozAlign: "left",
      headerTooltip: true,
      width: 200,
    },
    {
      title: "Value",
      field: "value",
      headerTooltip: true,
      hozAlign: "left",
      width: 200,
    },
  ];

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

  const options = {
    layout: "fitDataTable",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    scrollable: true,
    height: 500,
    placeholder: t("MUL_ST_0009"),
  };

  const columns = CONSUMER_DATA_COLUMNS_LIST;

  // 조회 버튼
  const handleClickButton = async () => {
    dispatch(startLoading());

    try {
      if (!serverFilter || serverFilter.length === 0) {
        toast.error(t("MUL_ST_0004"), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        dispatch(stopLoading());
        return;
      }
      await fetchDataAsync();
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

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Consumer_List", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(CONSUMER_DATA_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(CONSUMER_DATA_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          columns={CONNT_COLUMNS}
          rowData={dataParseVal}
          title={t("MUL_WD_0126")}
          fileNm={"Consumer_Connection"}
        />
      )}
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <nav aria-label="breadcrumb">
            <ol className="mb-0 breadcrumb">
              <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
              <li className="breadcrumb-item">Consumer</li>
            </ol>
          </nav>
          <h1 className="mt-2 mb-0 page-title">Consumer</h1>
          <p className="lead"></p>
          <div className="content__boxed">
            <div className="mt-2 search-box justify-content-center">
              <div className="row col-md-12">
                <div className="row col-md-3">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    * {t("MUL_WD_0009")}
                  </label>
                  <div className="col-sm-8">
                    <SingleDropdownComponent
                      onServerSelected={handleSelectedServerAlias}
                      onSelectedServerName={handleSeletedServerName}
                    />
                  </div>
                </div>
                <div className="mb-2 row col-md-6">
                  <label
                    className="col-sm-3 col-form-label text-sm-end"
                    htmlFor="sel_queue"
                  >
                    {t("MUL_WD_0079")}
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      value={selectedPattern}
                      onChange={(e) => setSelectedPattern(e.target.value)}
                    >
                      <CodeList codeGroupId="TPI_TP_CD" />
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <select
                      id="sel_topic"
                      className="form-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <CodeList codeGroupId="QT_GBN_CD" />
                    </select>
                  </div>
                </div>
                {/* <!-- button : 조회 --> */}
                <div className="col-3 justify-content-start">
                  <button
                    type="button"
                    onClick={handleClickButton}
                    className="gap-2 btn btn-dark hstack"
                  >
                    <i className="i_view_search fs-5"></i>
                    {t("MUL_WD_0022")}
                  </button>
                </div>
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
