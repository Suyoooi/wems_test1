import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ColumnDefinition,
  ReactTabulator,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import { ListTableData, QueueTableData } from "@/types/webComm";
import {
  QUEUE_BROWSER_BODY_DATA_LIST,
  QUEUE_BROWSER_HEADER_DATA_LIST,
} from "@/constant/data/QueueListData";
import SingleDropdownComponent from "@/components/dropdown/SingleDropdownComponent";
import ModalCategory from "@/components/modal/ModalCategory";
import DatePickerDropdown from "@/components/dropdown/DatePickerDropdown";
import { toast } from "react-toastify";
import DownloadFileNm from "@/utils/downloadFileNm";
import { QUEUE_BROWSE_COLUMNS_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function Browse() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [bodyMapData, setBodyMapData] = useState<any[]>([]);
  const [bodyTextData, setBodyTextData] = useState<string | undefined>();
  const [headerDetailData, setHeaderDetailData] = useState([]);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [selectedQueue, setselectedQueue] = useState("");
  const [filteredData, setFilteredData] = useState<QueueTableData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [selectedServerName, setSelectedServerName] = useState<string[]>([]);
  const [queueOptions, setQueueOptions] = useState<ListTableData[]>([]);
  const [isMap, setIsMap] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const setCommaNum = (cell: any, num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString("ko-KR");
      return numVal;
    } else {
      return 0;
    }
  };

  // property 모달 열고 닫기
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };
  const onClickModal = useCallback(() => {
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
      title: t("MUL_WD_0017"),
      frozen: true,
      headerTooltip: true,
      hozAlign: "left",
      width: 80,
      formatter: reactFormatter(<PropActionButton />),
      headerSort: false,
    },
    {
      title: "MessageID",
      field: "jms_msg_id",
      headerTooltip: true,
      hozAlign: "left",
      width: 320,
    },
    {
      title: "Timestamp",
      field: "jms_ts",
      headerTooltip: true,
      width: 180,
      hozAlign: "center",
    },
    {
      title: "Type",
      field: "jms_tp",
      headerTooltip: true,
      width: 100,
      hozAlign: "left",
    },
    {
      title: "MsgSize",
      field: "msg_size",
      headerTooltip: true,
      width: 100,
      hozAlign: "right",
      formatter: function (cell: any) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "Destination",
      field: "jms_dest",
      headerTooltip: true,
      width: 130,
      hozAlign: "left",
    },
    {
      title: "DeliveryMode",
      field: "jms_delvy_mode",
      headerTooltip: true,
      width: 150,
      hozAlign: "center",
    },
    {
      title: "DeliveryTime",
      field: "jms_delvy_tm",
      headerTooltip: true,
      width: 150,
      hozAlign: "left",
    },
    {
      title: "CorrelationID",
      field: "jms_corr_id",
      headerTooltip: true,
      hozAlign: "left",
      width: 150,
    },
  ];

  const columns = QUEUE_DATE_COLUMNS_LIST;

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

  const defaultFetch = async () => {
    setFilteredData([]);
  };
  useEffect(() => {
    defaultFetch();
  }, []);

  const fetchTableDataAsync = async () => {
    dispatch(startLoading());

    try {
      let returnVal;
      if (serverFilter[0] == undefined) {
        toast.error(t("MUL_ST_0004"), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        returnVal = false;
      } else if (selectedQueue == "") {
        toast.error(t("MUL_ST_0003"), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        returnVal = false;
      } else if (inputValue == "") {
        toast.error(t("MUL_ST_00155"), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        returnVal = false;
      } else {
        returnVal = true;
      }

      if (returnVal) {
        let url = `/api/situation/queue/queueBrowseApi`;
        const bodyData = {
          tib_srvr_sn: serverFilter[0],
          name: selectedQueue,
          selector: inputValue,
        };

        const res = await fetch(url, {
          body: JSON.stringify(bodyData),
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${accessToken}`,
          // },
        });

        const data = await res.json();

        if (data && data.code == "200") {
          const dataInfo = data.data;
          setFilteredData(dataInfo);
        } else {
          alert(
            "조회 시 문제가 발생하였습니다.\n관리자에게 문의하여 주시기 바랍니다."
          );
        }

        // data.code === "J001" 일 경우 존재 (어떤 에러인지 몰라서 처리 안함)
      }
    } catch (error) {
      console.error(error);
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

  let queueOptionUrl = `/api/situation/queue/queueListApi`;

  // queue 옵션 리스트 (일반만 보이도록 해야함)
  const fetchQueueOptionsTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET_OPTION",
        tib_srvr_sn: serverFilter,
      };

      const res = await fetch(queueOptionUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setQueueOptions(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  // queue 속성
  async function getPropDetail(rowData: any) {
    const headerData = rowData.sys_header;
    const mapBodyData = rowData.sys_body.map_body.data;
    const textBodyData = rowData.sys_body.text_body.text;

    const jms_tp = rowData.jms_tp;

    if (jms_tp === "[Map]") {
      setIsMap(true);
    } else if (jms_tp === "[Text]") {
      setIsMap(false);
    }

    const DataVal: any = [];
    const detailDataVal: any = [];

    var keys = Object.keys(headerData);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      const value: any = {};
      value.key = key;
      value.value = headerData[key];

      DataVal.push(value);
    }
    setHeaderDetailData(DataVal);

    var keys = Object.keys(mapBodyData);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      const value: any = {};
      value.mapKey = key;
      value.mapValue = mapBodyData[key];

      detailDataVal.push(value);
    }

    // mapData, bodyData 중 어떤 값을 보여줄지
    if (Array.isArray(mapBodyData) && mapBodyData.length > 0) {
      setBodyMapData(detailDataVal);
      // setBodyTextData(undefined);
    }
    if (typeof textBodyData === "string") {
      setBodyTextData(textBodyData);
      // setBodyMapData([]);
    }

    onClickModal();
  }

  // tabulator 옵션
  const options = {
    layout: "fitColumns",
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    height: 460,
    scrollable: true,
    placeholder: t("MUL_WD_0137"),
  };

  // 조회 버튼
  const handleViewButtonClick = async () => {
    dispatch(startLoading());

    try {
      await fetchTableDataAsync();
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading()); // 로딩 상태 종료
    }
  };

  const handelQueueOptionBoxClick = () => {
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
    fetchQueueOptionsTableDataAsync();
  };

  // 시간 선택
  const handleSelectedDateClick = (date: string) => {
    setDate(date);
  };

  const handleSelectedTimeClick = (time: string) => {
    setTime(time);
  };

  const handleInputChange = useCallback((inputValue: string) => {
    setInputValue(inputValue);
  }, []);

  // 엑셀 다운로드

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Queue_Browse", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(QUEUE_BROWSE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(QUEUE_BROWSE_COLUMNS_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  return (
    <>
      {isOpenModal && (
        <ModalCategory
          onClickModal={handleCloseModal}
          // header 데이터
          headerColumns={QUEUE_BROWSER_HEADER_DATA_LIST}
          headerRowData={headerDetailData}
          title={"Browser Property"}
          // map body 데이터
          bodyColumns={QUEUE_BROWSER_BODY_DATA_LIST}
          bodyRowData={bodyMapData}
          // text body 데이터
          bodyText={bodyTextData}
          isMap={isMap}
        />
      )}
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <nav aria-label="breadcrumb">
            <ol className="mb-0 breadcrumb">
              <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
              <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                Queue
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Browse
              </li>
            </ol>
          </nav>
          <h1 className="mt-2 mb-0 page-title">Browse</h1>
          <p className="lead"></p>

          <div className="content__boxed">
            <div className="mt-2 search-box justify-content-center">
              <div className="row col-md-12">
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
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    * Queue {t("MUL_WD_0072")}
                  </label>
                  <div className="col-sm-5" onClick={handelQueueOptionBoxClick}>
                    <select
                      className="form-select"
                      value={selectedQueue}
                      onChange={(e) => setselectedQueue(e.target.value)}
                      required
                    >
                      <option value="" hidden>
                        Queue {t("MUL_WD_0072")}
                      </option>
                      {queueOptions.map((option, index) => (
                        <option key={index} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    * Selector
                  </label>
                  <div className="col-sm-6">
                    <DatePickerDropdown
                      onSelectedDate={handleSelectedDateClick}
                      onSelectedTime={handleSelectedTimeClick}
                      onInputChange={handleInputChange}
                    />
                  </div>
                  <div className="col-3 justify-content-start">
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
            </div>
          </div>
          <div className="mt-3 row">
            <div className="row justify-content-end">
              <button
                className="btn btn-icon btn-green mr_4"
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
}
