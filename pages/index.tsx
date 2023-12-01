import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

const Home = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const cookies = parseCookies();
  const accessToken = cookies["access_token"];

  // 리다이렉션
  if (accessToken) {
    router.push("/situation/ems/allSitu");
    return;
  }

  return <></>;
};

export async function getStaticProps({ locale, locales }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "header"])),
      locales,
    },
  };
}

export default Home;
