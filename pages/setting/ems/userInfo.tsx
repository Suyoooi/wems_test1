// import Layout from '@/components/layout/layout'
import { useState } from "react";
import SetUser from "./user/setUser";
import SetGrp from "./user/setGrp";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function SetGroupHome() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [index, setIndex] = useState(0);

  const activeLink = (id: number) =>
    id === index ? "nav-link active" : "nav-link";

  const titles = t("MUL_WD_0064").concat(" ").concat(t("MUL_WD_0020"));

  const data = [
    // { id: 0, title: "User", content: <SetUser /> },
    // { id: 1, title: "User Group", content: <SetGrp /> },
    { id: 0, title: t("MUL_WD_0064"), content: <SetUser /> },
    { id: 1, title: titles, content: <SetGrp /> },
  ];

  return (
    <>
      {/* <Layout> */}
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <nav aria-label="breadcrumb">
            <ol className="mb-0 breadcrumb">
              <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
              <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                EMS {t("MUL_WD_0009")}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                EMS {t("MUL_WD_0019")} & {t("MUL_WD_0020")}
              </li>
            </ol>
          </nav>

          <h1 className="mt-2 mb-0 page-title">
            EMS {t("MUL_WD_0019")} & {t("MUL_WD_0020")}
          </h1>
          <p className="lead"></p>

          <div className="content__boxed">
            <div
              className="card-header toolbar"
              style={{ borderBottom: "1px solid #ededed" }}
            >
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                {data.map((item) => (
                  <li className="nav-item" role="presentation" key={item.id}>
                    <button
                      className={activeLink(item.id)}
                      data-bs-toggle="tab"
                      data-bs-target="#tabsHome"
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

            {data
              .filter((item) => index === item.id)
              .map((item) => (
                <div className="tab-content" key={item.id}>
                  {item.content}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
