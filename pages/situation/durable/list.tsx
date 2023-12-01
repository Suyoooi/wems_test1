import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import { DurableTableData, TopicTableData } from "@/types/webComm";
import SingleDropdownComponent from "@/components/dropdown/SingleDropdownComponent";
import GetBrowseModal from "@/components/modal/setting/durable/getBrowseInfo";
import { toast } from "react-toastify";
import DownloadFileNm from "@/utils/downloadFileNm";
import { DURABLE_COLUMNS_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function List() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [selectedServerName, setSelectedServerName] = useState<string[]>([]);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [selectedTopic, setSelectedTopic] = useState();
  const [selectedServer, setSelectedServer] = useState<number[]>([0]);
  const [filteredData, setFilteredData] = useState<TopicTableData[]>([]);
  const [rowData, setRowData] = useState<DurableTableData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [isOpenBrowseModal, setOpenBrowseModal] = useState<boolean>(false);
  const [browseInfo, setBrowseInfo] = useState();

  const FormatBytes = require("@/components/unitFormat");

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  const DURABLE_COLUMNS_LIST = [
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
      title: "Browse",
      field: "consumer",
      frozen: true,
      hozAlign: "left",
      headerTooltip: true,
      width: 70,
      formatter: reactFormatter(<ConsumerActionButton />),
      headerSort: false,
    },
    {
      title: "DurableName",
      field: "durab_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "TopicName",
      field: "topic_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "Active",
      field: "atv",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
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
      title: "ClientID",
      field: "clnt_id",
      hozAlign: "left",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "ConsumerID",
      field: "cnsmr_id",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "UserName",
      field: "user_nm",
      hozAlign: "center",
      headerTooltip: true,
      width: 130,
    },
    {
      title: "Selector",
      field: "seltr",
      hozAlign: "left",
      headerTooltip: true,
      width: 100,
      sorter: "string",
    },
    {
      title: "NoLocal",
      field: "no_locl_enbd",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "DeliveredMsgCount",
      field: "deliv_msg_cnt",
      hozAlign: "right",
      headerTooltip: true,
      width: 180,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "Static",
      field: "durab_static",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
    },
    {
      title: "isShared",
      field: "shared",
      hozAlign: "center",
      headerTooltip: true,
      width: 100,
    },
  ];

  // tabulator 옵션
  const options = {
    layout: "fitColumns",
    scrollable: true,
    height: 500,
    placeholder: t("MUL_ST_0009"),
  };

  const columns = DURABLE_COLUMNS_LIST;

  const defaultFetch = async () => {
    setRowData([]);
  };
  useEffect(() => {
    defaultFetch();
  }, []);

  let topicListUrl = `/api/situation/topic/topicListApi`;

  // topic 옵션 리스트 (일반만 보이도록 해야함)
  const fetchTopicDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        // tib_srvr_list: serverFilter,
        tib_srvr_list: selectedServer,
        pattern: "STAT",
        name: "",
      };

      const res = await fetch(topicListUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      // 중복 ems_tpc_nm 제거
      const uniqueTopics = [];
      const topicSet = new Set();
      for (const topic of dataInfo) {
        const ems_tpc_nm = topic.ems_tpc_nm;
        if (!topicSet.has(ems_tpc_nm)) {
          topicSet.add(ems_tpc_nm);
          uniqueTopics.push(topic);
        }
      }
      setFilteredData(uniqueTopics);
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTopicDataAsync();
  }, [serverFilter]);

  let durableListUrl = `/api/situation/durable/durableListApi`;

  // durable List
  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_sn: serverFilter,
        name: selectedTopic,
      };

      const res = await fetch(durableListUrl, {
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

  // 조회 버튼
  const handleViewButtonClick = async () => {
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
      fetchTableDataAsync();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
    }
  };

  // 서버 선택
  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
    setSelectedServer(tibSrvrSn);
  };

  const handleSeletedServerName = (alias: string[]) => {
    setSelectedServerName(alias);
  };

  const handelTopicOptionBoxClick = () => {
    if (!serverFilter || serverFilter.length === 0) {
      toast.error(t("MUL_ST_0005"), {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      return;
    }
  };

  function ConsumerActionButton(props: any) {
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
          onClick={() => viewBrowseInfo(rowData)}
        >
          <i className="i_property icon-sm fs-5"></i>
        </button>
      </>
    );
  }

  function viewBrowseInfo(rowData: any) {
    setBrowseInfo(rowData);
    onClickBrowseModal();
  }

  // property 모달 열고 닫기
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

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Durable_List", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(DURABLE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(DURABLE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      {isOpenBrowseModal && (
        <GetBrowseModal
          onClickBrowseModal={handleCloseModal}
          browseInfoVal={browseInfo}
        />
      )}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          {/* <-- page title --> */}
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
                <li className="breadcrumb-item">Durable</li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Durable</h1>
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
                    * {t("MUL_WD_0009")}
                  </label>
                  <div className="col-sm-6">
                    <SingleDropdownComponent
                      onServerSelected={handleSelectedServerAlias}
                      onSelectedServerName={handleSeletedServerName}
                    />
                  </div>
                </div>
                {/* <-- Topic --> */}
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    Topic {t("MUL_WD_0072")}
                  </label>
                  <div className="col-sm-9" onClick={handelTopicOptionBoxClick}>
                    <select
                      className="form-select"
                      value={selectedTopic}
                      onChange={(e: any) => setSelectedTopic(e.target.value)}
                      required
                    >
                      <option value="">== {t("MUL_WD_0010")} ==</option>
                      {filteredData.map((data, index) => (
                        <option key={index} value={data.ems_tpc_nm}>
                          {data.ems_tpc_nm}
                        </option>
                      ))}
                    </select>
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
