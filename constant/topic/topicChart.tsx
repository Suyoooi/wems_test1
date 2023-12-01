import React, { useCallback, useState } from "react";
import "react-tabulator/lib/styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuickDatePicker from "@/components/timeSetting/QuickDatePicker";
import moment from "moment";
import ReactChart from "@/components/chart/reactChart";
import SingleDropdownComponent from "@/components/dropdown/SingleDropdownComponent";
import { TopicHistoryTableData } from "@/types/webComm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CAHRT_COLORS, QUEUE_CHART_LIST } from "../data/ChartData";
import ModalChart from "@/components/modal/ModalChart";
import { TOPIC_DATE_COLUMNS_LIST } from "../data/TopicListData";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import { TOPIC_HIST_LIST_EXCEL } from "../excel/columns";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const TopicChart = () => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const dispatch = useDispatch();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(
    moment(Date.now() - 10 * 60 * 1000).format("YYYY-MM-DD HH:mm:ss")
  );
  const [endDate, setEndDate] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [selectedServerName, setSelectedServerName] = useState<string[]>([]);
  const [selectedChartName, setSelectedChartName] = useState("");
  const [selectedChartNames, setSelectedChartNames] = useState<string[]>([]);
  const [timeData, setTimeData] = useState<string[]>([]);
  const [pendingMsgCountData, setPendingMsgCountData] = useState<number[]>([]);
  const [pendingMsgSizeData, setPendingMsgSizeData] = useState<number[]>([]);
  const [inMsgRateData, setInMsgRateData] = useState<number[]>([]);
  const [inTotalByteData, setInTotalByteData] = useState<number[]>([]);
  const [outMsgRateData, setOutMsgRateData] = useState<number[]>([]);
  const [outTotalByteData, setOutTotalByteData] = useState<number[]>([]);
  const [inTotalMsgData, setInTotalMsgData] = useState<number[]>([]);
  const [outTotalMsgData, setOutTotalMsgData] = useState<number[]>([]);
  const [inByteRateData, setInByteRateData] = useState<number[]>([]);
  const [outByteRateData, setOutByteRateData] = useState<number[]>([]);
  const [topicList, setTopicList] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<TopicHistoryTableData[]>([]);

  // property 모달 열고 닫기
  const handleOpenModal = () => {
    fetchHistoryTableData();
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

  const columns = TOPIC_DATE_COLUMNS_LIST;

  let url = `/api/situation/topic/topicHistoryApi`;
  // history 모달 데이터
  const fetchHistoryTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET_HIST",
        tib_srvr_list: serverFilter,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await fetch(url, {
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

  const fetchTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET_CHART",
        tib_srvr_sn: serverFilter,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const Data = data.data;

      const clctDtArraySet = new Set(
        Data.map((item: any) => item.chart_info[0].clct_dt)
      );

      const clctDtArrayList: any = Array.from(clctDtArraySet);
      setTimeData(clctDtArrayList);

      // topicName 추출
      const topicNameSet = new Set(Data.map((item: any) => item.ems_nm));
      // topicName 중복 제거
      const topicName: any = Array.from(topicNameSet);
      setTopicList(topicName);

      // topicName을 arr 형식으로 변경
      const arrLabelInfo: any[] = Array.from(topicNameSet);
      const initializeArray = (length: number) =>
        Array.from({ length }, () => []);

      const pend_msg_size: any[] = initializeArray(arrLabelInfo.length);
      const pend_msg_count: any[] = initializeArray(arrLabelInfo.length);
      const in_tot_msg: any[] = initializeArray(arrLabelInfo.length);
      const out_tot_msg: any[] = initializeArray(arrLabelInfo.length);
      const in_msg_rate: any[] = initializeArray(arrLabelInfo.length);
      const out_msg_rate: any[] = initializeArray(arrLabelInfo.length);
      const in_tot_byte: any[] = initializeArray(arrLabelInfo.length);
      const out_tot_byte: any[] = initializeArray(arrLabelInfo.length);
      const in_byte_rate: any[] = initializeArray(arrLabelInfo.length);
      const out_byte_rate: any[] = initializeArray(arrLabelInfo.length);

      Data.forEach((item: any) => {
        arrLabelInfo.forEach((arrItem: any, idx: number) => {
          const topicNm = item.ems_nm;
          const labelNm = arrItem;

          if (topicNm == labelNm) {
            let x = new Date(item.chart_info[0].clct_dt);

            const pendingMsgSize = item.chart_info[0].pend_msg_size;
            const pendingMsgCount = item.chart_info[0].pend_msg_cnt;
            const inTotalMsg = item.chart_info[0].in_tot_msg;
            const outTotalMsg = item.chart_info[0].out_tot_msg;
            const inMsgRate = item.chart_info[0].in_msg_rate;
            const outMsgRate = item.chart_info[0].out_msg_rate;
            const inTotalBytes = item.chart_info[0].in_tot_byte;
            const outTotalBytes = item.chart_info[0].out_tot_byte;
            const inByteRate = item.chart_info[0].in_byte_rate;
            const outByteRate = item.chart_info[0].out_byte_rate;

            const formattedDate = moment(x).format("HH:mm:ss");

            pend_msg_size[idx].unshift({ x: formattedDate, y: pendingMsgSize });
            pend_msg_count[idx].unshift({
              x: formattedDate,
              y: pendingMsgCount,
            });
            in_tot_msg[idx].unshift({ x: formattedDate, y: inTotalMsg });
            out_tot_msg[idx].unshift({ x: formattedDate, y: outTotalMsg });
            in_msg_rate[idx].unshift({ x: formattedDate, y: inMsgRate });
            out_msg_rate[idx].unshift({ x: formattedDate, y: outMsgRate });
            in_tot_byte[idx].unshift({ x: formattedDate, y: inTotalBytes });
            out_tot_byte[idx].unshift({ x: formattedDate, y: outTotalBytes });
            in_byte_rate[idx].unshift({ x: formattedDate, y: inByteRate });
            out_byte_rate[idx].unshift({ x: formattedDate, y: outByteRate });

            return false;
          }
        });
      });
      setPendingMsgSizeData(pend_msg_size);
      setPendingMsgCountData(pend_msg_count);
      setInTotalMsgData(in_tot_msg);
      setOutTotalMsgData(out_tot_msg);
      setInMsgRateData(in_msg_rate);
      setOutMsgRateData(out_msg_rate);
      setInTotalByteData(in_tot_byte);
      setOutTotalByteData(out_tot_byte);
      setInByteRateData(in_byte_rate);
      setOutByteRateData(out_byte_rate);
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      dispatch(stopLoading());
      // onChildIsLoadingChange(false);
    }
  };

  // x축
  const Labels = timeData.map((dateString: string) =>
    moment(dateString).format("HH:mm:ss")
  );

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
      await fetchTableData();
      // fetchHistoryTableData();
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

  const PendingMsgCountChart: any[] = [];
  const PendingMsgSizeChart: any[] = [];
  const InTotalMsgChart: any[] = [];
  const OutTotalMsgChart: any[] = [];
  const InMsgRateChart: any[] = [];
  const OutMsgRateChart: any[] = [];
  const InTotalBytesChart: any[] = [];
  const OutTotalBytesChart: any[] = [];
  const InByteRateChart: any[] = [];
  const OutByteRateChart: any[] = [];

  if (
    pendingMsgSizeData &&
    pendingMsgCountData &&
    inMsgRateData &&
    outMsgRateData &&
    inTotalMsgData &&
    outTotalMsgData &&
    inTotalByteData &&
    outTotalByteData &&
    inByteRateData &&
    outByteRateData
  ) {
    const chartDataInfo1 = Object.values(pendingMsgSizeData);
    const chartDataInfo2 = Object.values(pendingMsgCountData);
    const chartDataInfo3 = Object.values(inTotalMsgData);
    const chartDataInfo4 = Object.values(outTotalMsgData);
    const chartDataInfo5 = Object.values(inMsgRateData);
    const chartDataInfo6 = Object.values(outMsgRateData);
    const chartDataInfo7 = Object.values(inTotalByteData);
    const chartDataInfo8 = Object.values(outTotalByteData);
    const chartDataInfo9 = Object.values(inByteRateData);
    const chartDataInfo10 = Object.values(outByteRateData);

    for (let i = 0; i < chartDataInfo1.length; i++) {
      const topicName = topicList[i];
      const backgroundColor = CAHRT_COLORS[i % CAHRT_COLORS.length];
      const borderColor = CAHRT_COLORS[i % CAHRT_COLORS.length];
      const pendingMsgCnt = chartDataInfo2[i];
      const pendingMsgSize = chartDataInfo1[i];
      const inTotalMsg = chartDataInfo3[i];
      const outTotalMsg = chartDataInfo4[i];
      const inMsgRate = chartDataInfo5[i];
      const outMsgRate = chartDataInfo6[i];
      const inTotalByte = chartDataInfo7[i];
      const outTotalByte = chartDataInfo8[i];
      const inByteRate = chartDataInfo9[i];
      const outByteRate = chartDataInfo10[i];

      PendingMsgCountChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: pendingMsgCnt,
        borderWidth: 1,
        yAxisID: "y-axis-1",
      });

      PendingMsgSizeChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: pendingMsgSize,
        borderWidth: 1,
        yAxisID: "y-axis-2",
      });

      InTotalMsgChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: inTotalMsg,
        borderWidth: 1,
        yAxisID: "y-axis-3",
      });

      OutTotalMsgChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: outTotalMsg,
        borderWidth: 1,
        yAxisID: "y-axis-4",
      });

      InMsgRateChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: inMsgRate,
        borderWidth: 1,
        yAxisID: "y-axis-5",
      });

      OutMsgRateChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: outMsgRate,
        borderWidth: 1,
        yAxisID: "y-axis-6",
      });

      InTotalBytesChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: inTotalByte,
        borderWidth: 1,
        yAxisID: "y-axis-7",
      });

      OutTotalBytesChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: outTotalByte,
        borderWidth: 1,
        yAxisID: "y-axis-8",
      });

      InByteRateChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: inByteRate,
        borderWidth: 1,
        yAxisID: "y-axis-9",
      });

      OutByteRateChart.push({
        label: topicName,
        backgroundColor,
        borderColor,
        data: outByteRate,
        borderWidth: 1,
        yAxisID: "y-axis-10",
      });
    }
  }

  const handleAddChart = () => {
    if (selectedChartName) {
      if (selectedChartNames.includes(selectedChartName)) {
        toast.error(t("MUL_ST_00121"), {
          position: "top-center",
        });
      } else {
        setSelectedChartNames([...selectedChartNames, selectedChartName]);
        setSelectedChartName("");
      }
    }
  };

  const handleDeleteChart = (chartName: string) => {
    const updatedCharts = selectedChartNames.filter(
      (name) => name !== chartName
    );
    setSelectedChartNames(updatedCharts);
  };
  return (
    <>
      {isOpenModal && (
        <ModalChart
          onClickToggleModal={handleCloseModal}
          columns={columns}
          excelColumns={TOPIC_HIST_LIST_EXCEL}
          excelFileNm="Topic_History"
          rowData={filteredData}
          title={`Server: ${selectedServerName}`}
        />
      )}
      <div className="content__boxed">
        <div className="mt-2 search-box justify-content-center">
          <div className="row col-md-12">
            <div className="row col-md-4">
              <label
                className="col-sm-3 col-form-label text-sm-end"
                htmlFor="sel_server"
              >
                * {t("MUL_WD_0009")}
              </label>
              <div className="col-sm-9">
                <SingleDropdownComponent
                  onServerSelected={handleSelectedServerAlias}
                  onSelectedServerName={handleSeletedServerName}
                />
              </div>
            </div>
            <div className="row col-md-4">
              <label
                className="col-sm-3 col-form-label text-sm-end"
                htmlFor="int_day"
              >
                {t("MUL_WD_0026")}
              </label>
              <div className="col-sm-6">
                <QuickDatePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={(date) =>
                    setStartDate(moment(date).format("YYYY-MM-DD HH:mm:ss"))
                  }
                  onEndDateChange={(date) =>
                    setEndDate(moment(date).format("YYYY-MM-DD HH:mm:ss"))
                  }
                  defaultTime={new Date(Date.now() - 10 * 60 * 1000)}
                />
              </div>
            </div>
            <div
              className="justify-content-start"
              style={{ maxWidth: 100, marginLeft: 100 }}
            >
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

        <div className="mt-3 row">
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedChartName}
              onChange={(e) => setSelectedChartName(e.target.value)}
            >
              <option hidden>{t("MUL_ST_0008")}</option>
              {QUEUE_CHART_LIST.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-md btn-gray" onClick={handleAddChart}>
              {t("MUL_WD_0029")}
            </button>
          </div>
          <div className="col-md-7 d-flex justify-content-end">
            <button
              className="btn btn-icon btn-light"
              onClick={onClickToggleModal}
              type="button"
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              data-bs-original-title={t("MUL_WD_0007") as string}
            >
              <i className="i_table"></i>
            </button>
          </div>
        </div>
        <main>
          {selectedChartNames.map((chartName) => (
            <div key={chartName}>
              {QUEUE_CHART_LIST.map((item) => (
                <div key={item.value}>
                  {chartName === `${item.title}` && (
                    <div className="p-10 content__boxed">
                      <div className="p-2 mt-3 row bg_chartarea">
                        <div className="col-md-12">
                          <div className="p-2 m-1 card border_1">
                            <div className="card-header toolbar">
                              <div className="toolbar-start">
                                <h5 className="m-0" style={{ color: "black" }}>
                                  {item.title} (Server: {selectedServerName})
                                </h5>
                              </div>
                              <div className="toolbar-end">
                                <button
                                  type="button"
                                  className="btn btn-icon btn-light btn-xs"
                                  data-bs-toggle="button"
                                  data-view="fullcontent"
                                  data-view-target=".card"
                                  aria-pressed="false"
                                  onClick={() => handleDeleteChart(chartName)}
                                >
                                  <i className="i_chart_del"></i>
                                </button>
                              </div>
                            </div>
                            <div style={{ height: 500 }}>
                              {item.title === "PendingMsgCount" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={PendingMsgCountChart}
                                />
                              ) : item.title === "PendingMsgSize" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={PendingMsgSizeChart}
                                />
                              ) : item.title === "InTotalMsg" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={InTotalMsgChart}
                                />
                              ) : item.title === "OutTotalMsg" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={OutTotalMsgChart}
                                />
                              ) : item.title === "InMsgRate" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={InMsgRateChart}
                                />
                              ) : item.title === "OutMsgRate" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={OutMsgRateChart}
                                />
                              ) : item.title === "InTotalBytes" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={InTotalBytesChart}
                                />
                              ) : item.title === "OutTotalBytes" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={OutTotalBytesChart}
                                />
                              ) : item.title === "InByteRate" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={InByteRateChart}
                                />
                              ) : item.title === "OutByteRate" ? (
                                <ReactChart
                                  labels={Labels}
                                  datasets={OutByteRateChart}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </main>
      </div>
    </>
  );
};

export default TopicChart;
