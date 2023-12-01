import React from "react";
import "react-tabulator/lib/styles.css";
import axios from "axios";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface TopicHistoryProps {
  startDate: string;
  endDate: string;
  serverSn: any;
  pattern: string;
  name: string;
}

const TopicHistExcel: React.FC<TopicHistoryProps> = ({
  startDate,
  endDate,
  serverSn,
  pattern,
  name,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  // excel 다운로드
  const fetchTableDataExcel = async () => {
    try {
      const params = {
        tib_srvr_list: serverSn,
        pattern: pattern,
        name: name,
        start_date: startDate,
        end_date: endDate,
      };

      const paramString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              Array.isArray(value) && value.length
                ? value.join(",")
                : value.toString()
            )}`
        )
        .join("&");

      const url = `/app/monitor/topic/hist/excel?${paramString}`;

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      const match = contentDisposition.match(/filename=(.+)/);
      const filename = match ? match[1] : "queue_history.xlsx";

      const blobURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobURL;
      link.setAttribute("download", filename);
      link.click();

      console.log("Excel downloaded successfully");
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleDownloadButtonClick = () => {
    fetchTableDataExcel();
  };

  return (
    <>
      <button
        className="btn btn-icon btn-green mr_4"
        onClick={handleDownloadButtonClick}
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-original-title={t("MUL_WD_0012") as string}
        // title="excel"
      >
        <i className="i_excel icon-lg fs-5"></i>
      </button>
    </>
  );
};

export default TopicHistExcel;
