import React, { useRef, useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import QuickDatePicker from "@/components/timeSetting/QuickDatePicker";
import { QUEUE_DATE_COLUMNS_LIST } from "@/constant/data/QueueListData";
import moment from "moment";
import { QueueHistoryTableData } from "@/types/webComm";
import DropdownComponent from "@/components/dropdown/DropdownComponent";
import CodeList from "@/components/codeList";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import QueueHistExcel from "@/components/excel/queueHistExcel";
import DownloadFileNm from "@/utils/downloadFileNm";
import { QUEUE_HIST_LIST_EXCEL } from "../excel/columns";

const QueueHistory = () => {
  const tableRef = useRef<ReactTabulator | null>(null);
  const [startDate, setStartDate] = useState(
    moment().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss")
  );
  const [endDate, setEndDate] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );

  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [queueFilter, setQueueFilter] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [filteredData, setFilteredData] = useState<QueueHistoryTableData[]>([]);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const dispatch = useDispatch();

  const columns = QUEUE_DATE_COLUMNS_LIST;
  let url = `/api/situation/queue/queueHistoryApi`;

  const fetchTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET_HIST",
        tib_srvr_list: serverFilter,
        pattern: selectedPattern,
        name: queueFilter,
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
    } catch (error) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", error);
    }
  };

  const langVal = t("MUL_WD_0137");

  const options = {
    layout: "fitDataTable",
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [50, 100, 500],
    height: 460,
    placeholder: langVal,
  };

  // 조회 버튼
  const handleClickButton = async () => {
    fetchTableData();
  };

  // 서버 선택
  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };

  // 엑셀 다운로드 (서버X)
  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Queue_History", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(QUEUE_HIST_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(QUEUE_HIST_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };
  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap"></div>
        </div>
        <div className="content__boxed">
          <div className="mt-2 search-box justify-content-center">
            <div className="row col-md-12">
              <div className="mb-2 row col-md-6">
                <label
                  className="col-sm-3 col-form-label text-sm-end"
                  htmlFor="sel_server"
                >
                  {t("MUL_WD_0009")}
                </label>
                <div className="col-sm-6">
                  <DropdownComponent
                    onServerSelected={handleSelectedServerAlias}
                  />
                </div>
              </div>
              <div className="mb-2 row col-md-6">
                <label
                  className="col-sm-3 col-form-label text-sm-end"
                  htmlFor="sel_queue"
                >
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
                    type="text"
                    className="form-control"
                    value={queueFilter}
                    onChange={(e) => setQueueFilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2 row col-md-6">
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
            </div>
            <div className="mt-3 d-flex justify-content-center">
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
          <div
            className="mt-3 content__boxed"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {/* --- 저장 버튼 --- */}
            {/* 서버 사용해서 엑셀 저장할 때 */}
            {/* <QueueHistExcel
              startDate={startDate}
              endDate={endDate}
              serverSn={serverFilter}
              pattern={selectedPattern}
              name={queueFilter}
            /> */}
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
          <div className="table table-responsive">
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
      </section>
    </>
  );
};

export default QueueHistory;
