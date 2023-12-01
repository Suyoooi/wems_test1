import DropdownComponent from "@/components/dropdown/DropdownComponent";
import { TOPIC_SUBSCRIPTION_LIST } from "@/constant/data/TopicListData";
import { TopicSubscriptionData, TopicTableData } from "@/types/webComm";
import { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import DownloadFileNm from "@/utils/downloadFileNm";
import { TOPIC_SUBSCRIPTION_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import CodeList from "@/components/codeList";
import { toast } from "react-toastify";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const Subscription = () => {
  const dispatch = useDispatch();
  const tableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [selectedServer, setSelectedServer] = useState<number[]>([0]);
  const [dataParseVal, setDataPaseVal] = useState<TopicSubscriptionData[]>([]);
  const [filteredData, setFilteredData] = useState<TopicTableData[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [name, setName] = useState("");

  const columns = TOPIC_SUBSCRIPTION_LIST;

  const handleSelectedPattern = (pattern: string) => {
    setSelectedPattern(pattern);
  };

  let topicListUrl = `/api/situation/topic/topicListApi`;
  let topicSubUrl = `/api/situation/topic/topicSubApi`;

  const fetchTopicSubscriptionAsync = async () => {
    setDataPaseVal([]);
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        topic_name: selectedTopic,
        name: name,
      };

      const res = await fetch(topicSubUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setDataPaseVal(dataInfo);

      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTopicSubscriptionAsync();
  }, []);

  // topic 옵션 List
  const fetchTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        // tib_srvr_list: serverFilter,
        tib_srvr_list: selectedServer,
        pattern: selectedPattern,
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

  const options = {
    layout: "fitColumns",
    scrollable: true,
    height: 500,
    placeholder: t("MUL_ST_0009"),
  };

  // 조회 버튼
  const handleClickButton = async () => {
    dispatch(startLoading());
    try {
      await fetchTopicSubscriptionAsync();
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

  // 엑셀 다운로드
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Topic_Subscription", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(TOPIC_SUBSCRIPTION_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(TOPIC_SUBSCRIPTION_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
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
    fetchTableDataAsync();
  };

  return (
    <>
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
                  Topic Subscription
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Topic Show Subscription</h1>
            <p className="lead"></p>
          </div>
        </div>
        <div className="content__boxed">
          <div className="content__wrap">
            <div className="mt-2 search-box justify-content-center">
              <div className="row col-md-12">
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
                {/* <-- Topic --> */}
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    Topic
                  </label>
                  <div className="col-sm-4">
                    <select
                      id="sel_pattern"
                      className="form-select"
                      value={selectedPattern}
                      onChange={(e) => handleSelectedPattern(e.target.value)}
                    >
                      <CodeList codeGroupId="QUE_TP_CD" />
                    </select>
                  </div>
                  <div className="col-sm-5" onClick={handelTopicOptionBoxClick}>
                    <select
                      id="sel_topic"
                      className="form-select"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                      <option value="">== {t("MUL_WD_0010")} ==</option>
                      <option value="$sys.>">$sys {t("MUL_WD_0010")}</option>
                      {filteredData.map((data, index) => (
                        <option key={index} value={data.ems_tpc_nm}>
                          {data.ems_tpc_nm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row col-md-4">
                  <label className="col-sm-3 col-form-label text-sm-end">
                    {t("MUL_WD_0072")}
                  </label>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {/* <!-- 조회 버튼 --> */}
                  <div className="col-4 justify-content-start">
                    <button
                      type="button"
                      className="gap-2 btn btn-dark hstack"
                      onClick={handleClickButton}
                    >
                      <i className="i_view_search fs-5"></i>
                      {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 row">
              <div className="row justify-content-end">
                <button
                  className="gap-2 btn btn-icon btn-gray mr_4"
                  onClick={handleClickButton}
                  type="button"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-original-title={t("MUL_WD_0071") as string}
                >
                  <i className="i_refresh icon-lg fs-5"></i>
                </button>
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
                key={dataParseVal.length}
                ref={tableRef}
                autoResize={false}
                options={options}
                data={dataParseVal}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Subscription;
