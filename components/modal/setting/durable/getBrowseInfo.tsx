import "react-tabulator/lib/styles.css";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import { PropsWithChildren, useState, useRef, useEffect } from "react";
import DownloadFileNm from "@/utils/downloadFileNm";
import GetHeader from "./getHeader";
import GetTextBody from "./getTextBody";
import GetMapBody from "./getMapBody";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickBrowseModal: () => void;
  browseInfoVal: any;
}

function GrpModal({
  onClickBrowseModal,
  browseInfoVal,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let browseInfoUrl = `/api/setting/durable/durableListApi`;

  const [index, setIndex] = useState(0);

  const FormatBytes = require("@/components/unitFormat");

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const activeLink = (id: number) =>
    id === index ? "nav-link active" : "nav-link";

  const tableRef = useRef<ReactTabulator | null>(null);

  const [tableData, setTableData] = useState([]);
  const [tabGbnData, setTabGbnData] = useState<any>([]);
  const [clickRowData, setClickRowData] = useState();

  const [msgId, setMsgId] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    dispatch(startLoading());
    try {
      interface BodyData {
        case_method: string;
        tib_srvr_sn: any;
        topic_nm: any;
        durab_nm: any;
        clnt_id?: any;
      }

      const bodyData: BodyData = {
        case_method: "BROW_GET",
        tib_srvr_sn: browseInfoVal.tib_srvr_sn,
        topic_nm: browseInfoVal.topic_nm,
        durab_nm: browseInfoVal.durab_nm,
      };

      // clnt_id가 존재하는 경우에만 bodyData에 추가
      if (browseInfoVal.clnt_id) {
        bodyData.clnt_id = browseInfoVal.clnt_id;
      }

      const res = await fetch(browseInfoUrl, {
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

  // 테이블 카테고리
  const columns: ColumnDefinition[] = [
    {
      title: "MessageID",
      field: "jms_msg_id",
      headerTooltip: true,
      hozAlign: "left",
      width: 290,
      tooltip: formatTooltip,
    },
    {
      title: "Timestamp",
      field: "jms_ts",
      headerTooltip: true,
      hozAlign: "center",
      width: 155,
      // visible: false,
    },
    {
      title: "Type",
      field: "jms_tp",
      headerTooltip: true,
      hozAlign: "center",
      width: 80,
    },
    {
      title: "MsgSize",
      field: "msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "Destination",
      field: "jms_dest",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveryMode",
      field: "jms_delvy_mode",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveryTime",
      field: "jms_delvy_tm",
      headerTooltip: true,
      hozAlign: "center",
      width: 155,
    },
    {
      title: "CorrelationID",
      field: "jms_corr_id",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveryCnt",
      field: "jms_delvy_cnt",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      visible: false,
    },
    {
      title: "Property",
      field: "jms_proty",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      visible: false,
    },
    {
      title: "SysHeader",
      field: "sys_header",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      visible: false,
    },
    {
      title: "SysBody",
      field: "sys_body",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      visible: false,
    },
  ];

  const downloadColumns: ColumnDefinition[] = [
    {
      title: "MessageID",
      field: "jms_msg_id",
      headerTooltip: true,
      hozAlign: "center",
      width: 290,
      tooltip: formatTooltip,
    },
    {
      title: "Timestamp",
      field: "jms_ts",
      headerTooltip: true,
      hozAlign: "center",
      width: 155,
      // visible: false,
    },
    {
      title: "Type",
      field: "jms_tp",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "MsgSize",
      field: "msg_size",
      headerTooltip: true,
      hozAlign: "right",
      width: 130,
      formatter: function (cell) {
        return FormatBytes(cell.getValue());
      },
    },
    {
      title: "Destination",
      field: "jms_dest",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveryMode",
      field: "jms_delvy_mode",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "DeliveryTime",
      field: "jms_delvy_tm",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
    {
      title: "CorrelationID",
      field: "jms_corr_id",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
    },
  ];

  const langVal = t("MUL_ST_0009");

  //테이블 setUp
  const options: ReactTabulatorOptions = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    height: 300,
    layout: "fitColumns",
    placeholder: langVal,
  };

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Browse", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;
      table.setColumns(downloadColumns);
      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
      table.setColumns(columns);
    }
  };

  const rowClick = async (e: any, row: any) => {
    var index = row.getIndex();
    // if (currentCh == undefined || currentCh == "") {
    //   currentCh = e.currentTarget.innerText;
    // } else {

    //   if (currentCh !== e.currentTarget.innerText) {
    //     currentCh = e.currentTarget.innerText;
    //   } else {
    //     currentCh = "";
    //   }
    // }

    const srvrDataVal = row.getData();
    const msgType = srvrDataVal.jms_tp;

    const btnVal = document.getElementById("modalId");
    const bodyVal = document.getElementById("bodyId");
    const setDivVal = document.getElementById("setDiv");

    if (btnVal?.classList.contains("w_800")) {
      btnVal?.classList.remove("w_800");
      btnVal?.classList.add("w_1200");
      bodyVal?.classList.remove("col-md-12");
      bodyVal?.classList.add("col-md-8");
      setDivVal?.classList.remove("d-none");
    }

    // 선택한 열에만 배경색 적용
    tableRef.current?.table.getRows().forEach((row: any) => {
      row.getElement().style.backgroundColor = "";
    });
    row.getElement().style.backgroundColor = "#ffdedb";

    let msgId = "";

    let tabGbn = null;
    if (msgType && msgType == "[Text]") {
      msgId = "TextMessage ".concat(srvrDataVal.jms_msg_id);

      tabGbn = [
        {
          id: 0,
          title: "Header",
          content: <GetHeader setData={srvrDataVal} />,
        },
        {
          id: 1,
          title: "Body",
          content: <GetTextBody setData={srvrDataVal} />,
        },
      ];
    } else if (msgType && msgType == "[Map]") {
      msgId = "MapMessage ".concat(srvrDataVal.jms_msg_id);

      tabGbn = [
        {
          id: 0,
          title: "Header",
          content: <GetHeader setData={srvrDataVal} />,
        },
        { id: 1, title: "Body", content: <GetMapBody setData={srvrDataVal} /> },
      ];
    }

    setMsgId(msgId);
    setTabGbnData(tabGbn);
    setClickRowData(srvrDataVal.jms_tp);
  };

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_800" id="modalId">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Durable Browse
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickBrowseModal) {
                      onClickBrowseModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row col-md-12">
                  <div className="col-md-12" id="bodyId">
                    <div className="row">
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6" htmlFor="sSrvrNm">
                          Server
                        </label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          id="sSrvrNm"
                          value={browseInfoVal.tib_srvr_alias}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6" htmlFor="sTopicNm">
                          Topic Name
                        </label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          id="sTopicNm"
                          value={browseInfoVal.topic_nm}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6" htmlFor="sDurableNm">
                          Durable Name
                        </label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          id="sDurableNm"
                          value={browseInfoVal.durab_nm}
                          disabled
                        />
                      </div>
                      <div className="mt-2 col-sm-6">
                        <label className="col-sm-6" htmlFor="sClientId">
                          Client ID
                        </label>
                        <input
                          type="text"
                          className="col-sm-6 form-control"
                          id="sClientId"
                          value={browseInfoVal.clnt_id}
                          disabled
                        />
                      </div>
                      <div className="mt-3 col-sm-12 d-flex justify-content-center">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="btn btn-md btn-gray"
                        >
                          {t("MUL_WD_0125")}
                        </button>
                      </div>
                      <div className="mt-2 col-sm-12 d-flex justify-content-end">
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
                      <div className="custom-selectable table-responsive">
                        <ReactTabulator
                          key={tableData.length}
                          ref={tableRef}
                          autoResize={false}
                          data={tableData}
                          columns={columns}
                          options={options}
                          events={{
                            rowClick: rowClick,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div id="setDiv" className="col-md-4 d-none">
                    <h6>{msgId}</h6>
                    <div
                      className="card-header toolbar"
                      style={{ borderBottom: "1px solid #ededed" }}
                    >
                      <ul
                        className="nav nav-tabs card-header-tabs"
                        role="tablist"
                      >
                        {tabGbnData.map((item: any) => (
                          <li
                            className="nav-item"
                            role="presentation"
                            key={item.id}
                          >
                            <button
                              className={activeLink(item.id)}
                              data-bs-toggle="tab"
                              data-bs-target="cardTabsHome"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                              onClick={() => setIndex(item.id)}
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tabGbnData
                      .filter((item: any) => index === item.id)
                      .map((item: any) => (
                        <div className="mt-2 tab-content" key={item.id}>
                          {item.content}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickBrowseModal) {
                        onClickBrowseModal();
                      }
                    }}
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GrpModal;
