import React, { useState } from "react";
import "react-tabulator/lib/styles.css";
import TopicChart from "@/constant/topic/topicChart";
import TopicHistory from "@/constant/topic/topicHistory";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const History: React.FC = () => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const [changePage, setChangePage] = useState(true);

  const handleHistoryButtonClick = () => {
    setChangePage(false);
  };

  const handleChartChangeButtonClick = () => {
    setChangePage(true);
  };

  return (
    <>
      <div className="content__header content __boxed overlapping">
        <div className="content__wrap">
          {/* <!-- page position -->   */}
          <nav aria-label="breadcrumb">
            <ol className="mb-0 breadcrumb">
              <li className="breadcrumb-item">{t("MUL_WD_0008")}</li>
              <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                Topic
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {changePage === true ? t("MUL_WD_0122") : t("MUL_WD_0089")}
              </li>
            </ol>
          </nav>
          {/* <!-- page position -->  */}
          {/* <!-- page title -->   */}
          <h1 className="mt-2 mb-0 page-title">
            {changePage === true ? t("MUL_WD_0122") : t("MUL_WD_0089")}
          </h1>
          {/* <!-- page title -->   */}

          <p className="lead"></p>
          {/* <--- 차트 / 이력 카테고리 버튼 ---> */}
          <div
            className="card-header toolbar"
            style={{ borderBottom: "1px solid #ededed" }}
          >
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#_dm-cardTabsHome"
                  onClick={handleChartChangeButtonClick}
                >
                  {t("MUL_WD_0025")}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#_dm-cardTabsHome"
                  onClick={handleHistoryButtonClick}
                >
                  {t("MUL_WD_0007")}
                </button>
              </li>
            </ul>
          </div>
          {changePage === true ? <TopicChart /> : <TopicHistory />}
        </div>
      </div>
    </>
  );
};

export default History;
