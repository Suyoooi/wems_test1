import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ColumnDefinition,
  ReactTabulator,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import { TopicTableData } from "@/types/webComm";
import DropdownComponent from "@/components/dropdown/DropdownComponent";
import Modal from "@/components/modal/Modal";
import { TOPIC_PROPERTY_HEADER_LIST } from "@/constant/data/TopicListData";
import CodeList from "@/components/codeList";
import DownloadFileNm from "@/utils/downloadFileNm";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function List() {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [detailData, setDetailData] = useState([]);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [filteredData, setFilteredData] = useState<TopicTableData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  let topicListUrl = `/api/situation/topic/topicListApi`;

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        pattern: selectedPattern,
        name: topicFilter,
      };

      const res = await fetch(topicListUrl, {
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

  const TOPIC_DATE_COLUMNS_LIST: ColumnDefinition[] = [
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
      sorter: "string",
      width: 130,
    },
    {
      title: "TopicName",
      field: "ems_tpc_nm",
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
      title: "SubscriberCount",
      field: "subsb_cnt",
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
      width: 130,
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
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "AvgMsgSize",
      field: "avg_msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "Static",
      field: "is_tpc_static",
      headerTooltip: true,
      hozAlign: "center",
      width: 100,
    },
    {
      title: "DurableCount",
      field: "durab_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell: any) {
        return setCommaNum(cell, cell.getValue());
      },
    },
    {
      title: "StoreName",
      field: "store_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "global",
      field: "global",
      headerTooltip: true,
      hozAlign: "center",
      width: 100,
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

  // topic 속성 api
  async function getPropDetail(rowData: any) {
    const serialNm = rowData.raw_topic_sn;
    try {
      const bodyData = {
        case_method: "GET_PROP",
        raw_topic_sn: serialNm,
      };

      const res = await fetch(topicListUrl, {
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

  const columns = TOPIC_DATE_COLUMNS_LIST;

  const [langVal, setLangVal] = useState("");

  useEffect(() => {
    if (lang === "en") {
      setLangVal("No data found.");
    } else if (lang === "ko") {
      setLangVal("검색된 데이터가 없습니다.");
    }
  }, [lang]);

  // tabulator 옵션
  const options = {
    layout: "fitColumns",
    scrollable: true,
    maxHeight: 500,
    placeholder: langVal,
  };

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

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Topic_List", fileType);

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
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          columns={TOPIC_PROPERTY_HEADER_LIST}
          rowData={detailData}
          title={"Topic Property"}
          fileNm={"Topic Property"}
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
                  Topic
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Topic {t("MUL_WD_0014")}
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Topic {t("MUL_WD_0014")}</h1>
            <p className="lead"></p>
          </div>
          {/* <-- page title --> */}
        </div>
        <div className="content__boxed">
          <div className="content__wrap">
            <div className="mt-2 search-box justify-content-center">
              <div className="row col-md-12">
                {/* <!-- Server --> */}
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
                {/* <!-- Topic --> */}
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    Topic
                  </label>
                  <div className="col-sm-5">
                    <select
                      id="sel_topic"
                      className="form-select"
                      value={selectedPattern}
                      onChange={(e) => setSelectedPattern(e.target.value)}
                    >
                      <CodeList codeGroupId="TPI_TP_CD" />
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <input
                      className="form-control"
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value)}
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
                className="custom_tabulator"
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
      </section>
    </>
  );
}
