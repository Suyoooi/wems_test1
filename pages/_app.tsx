import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "@/constant/context/themeContext";
import Layout from "@/components/layout/layout";
import LoginWrapper from "@/components/layout/LoginWrapper";
import store from "@/constant/redux/store";
import { Provider } from "react-redux";

/*---Toast Css---*/
import "react-toastify/dist/ReactToastify.css";

/*---Custom Css---*/
import "../public/assets/css/style.css";
import "../public/assets/css/tabulator_dark.css";

/*---Light Mode---*/
// import "../public/assets/css/bootstrap.css";
// import "../public/assets/css/nifty.css";

/*---Dark Mode---*/
// import "../public/assets/css/color-schemes/dark/nifty.css";
// import "../public/assets/css/color-schemes/dark/bootstrap.css";

/*---Nifty Css---*/
import "../public/assets/premium/icon-sets/icons/line-icons/premium-line-icons.css";
import "../public/assets/premium/icon-sets/icons/solid-icons/premium-solid-icons.css";
import "../public/assets/css/user_common.css";
import "../public/assets/css/react-checkbox-tree.css";

/*---Tabultor---*/
import "../public/assets/css/tabulator_semanticui.css";

function MyApp({
  Component,
  router,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const isLoginPage = router.pathname === "/login";
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadThemeCss = async () => {
      if (isDarkMode) {
        console.log("dark");
        await import("../styles/dark/nifty.css");
        await import("../styles/dark/bootstrap.css");
      } else {
        console.log("light");
        await import("../styles/light/nifty.css");
        await import("../styles/light/bootstrap.css");
      }
    };
    loadThemeCss();
  }, [isDarkMode]);

  return (
    <ThemeProvider>
      <Provider store={store}>
        {isLoginPage ? (
          <LoginWrapper>
            <Component {...pageProps} />
          </LoginWrapper>
        ) : (
          <Layout>
            <LoginWrapper>
              <Component {...pageProps} />
            </LoginWrapper>
          </Layout>
        )}
        <ToastContainer />
      </Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
