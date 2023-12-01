import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function DashBoard() {
  const { t, i18n } = useTranslation("common");
  return (
    <>
      <title>대시보드</title>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">{t("Home")}</Link>
              </li>
              {/* <li className="breadcrumb-item active" aria-current="page">{t("EMS 서비스 조회")}</li> */}
              <li className="breadcrumb-item active" aria-current="page">
                대시보드
              </li>
            </ol>
          </nav>

          <h1 className="page-title mb-2">대시보드</h1>
        </div>
        <div className="text-center">
          <div className="error-code page-title mb-3">작업 중</div>
        </div>
      </div>
    </>
  );
}
