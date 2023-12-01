import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function PageNotFound() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  return (
    <>
      <title>404</title>
      <div className="content__boxed rounded-0 w-100 min-vh-100 d-flex flex-column align-items-stretch justify-content-center">
        <div className="content__wrap">
          <div className="text-center">
            <div className="mb-3 error-code page-title">404</div>
            <h3 className="mb-4">
              <div className="badge bg-info">{"404_Title"}</div>
            </h3>
            <p className="lead">{"404_Message"}</p>
          </div>

          <div className="gap-3 mt-4 d-flex justify-content-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn btn-light"
            >
              {t("MUL_WD_0140")}
            </button>
            <Link href="/" className="btn btn-primary">
              {"returnHome"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
