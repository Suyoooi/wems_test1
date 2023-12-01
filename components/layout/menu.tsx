import Link from "next/link";
import Sidebar from "./navCompo";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { enLang, koLang } from "@/constant/redux/langSlice";
import { useTheme } from "@/constant/context/themeContext";

export default function MenuNav() {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [userNm, setUserNm] = useState("");
  const [loginUserSn, setLoginUserSn] = useState<number>();
  const isLoading = useSelector(
    (state: { loading: { isLoading: boolean } }) => state.loading.isLoading
  );
  const modalOpen = useSelector(
    (state: { loading: { modalOpen: boolean } }) => state.loading.modalOpen
  );

  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const handleEnClick = () => {
    dispatch(enLang());
    useMultilingual("en");
    console.log("영어", lang);
  };

  const handleKoClick = () => {
    dispatch(koLang());
    useMultilingual("ko");
    console.log("한국어", lang);
  };

  // dark/light mode 선택
  const { isDarkMode, toggleTheme } = useTheme();

  const handleDarkBtnClick = () => {
    toggleTheme();
  };

  const handleLightBtnClick = () => {
    toggleTheme();
  };
  // const [lightMode, setLightMode] = useState<boolean>(true);
  // const [darkMode, setDarkMode] = useState<boolean>(false);

  // const handleDarkBtnClick = () => {
  //   setLightMode(false);
  //   setDarkMode(true);
  //   console.log("다크모드 true:::", darkMode);
  //   console.log("라이트모드 false:::", lightMode);
  // };

  // const handleLightBtnClick = () => {
  //   setDarkMode(false);
  //   setLightMode(true);
  //   console.log("다크모드 false:::", darkMode);
  //   console.log("라이트모드 true:::", lightMode);
  // };

  // 로그아웃 함수
  const logout = () => {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    sessionStorage.removeItem("userSn");
    sessionStorage.removeItem("userNm");
    sessionStorage.removeItem("userId");
    router.push("/login");
  };

  const handleLogoutBtnClick = () => {
    const userConfirmed = confirm(t("MUL_ST_0017") as string);
    if (userConfirmed) {
      // 확인 버튼 눌렀을 때
      logout();
    } else {
      // 취소 버튼 눌렀을 때
      return;
    }
  };

  const updateLoginTime = () => {
    const newLoginTime = new Date().getTime();
    sessionStorage.setItem("loginTime", newLoginTime.toString());
  };

  const handleRouteChange = () => {
    updateLoginTime();
  };

  const checkAutoLogout = () => {
    const loginTime = parseInt(sessionStorage.getItem("loginTime") || "{}");
    if (loginTime && accessToken) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - loginTime;

      if (elapsedTime >= 20 * 60 * 1000) {
        // 테스트용 10초
        // if (elapsedTime >= 10 * 1000) {
        alert(t("MUL_ST_0018"));
        logout();
      }
    }
  };
  useEffect(() => {
    checkAutoLogout();
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 후 20분 이상 경과한 경우에만 checkAutoLogout 실행
    const timerId = setTimeout(() => {
      checkAutoLogout();
    }, 10 * 1000);

    return () => {
      // 타이머 해제
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    // 페이지 로드 시 현재 시간으로 로그인 시간 초기화
    updateLoginTime();

    // 페이지 언마운트 시에도 로그인 시간 업데이트
    return () => {
      updateLoginTime();
    };
  }, []);

  useEffect(() => {
    // 페이지 이동 시에도 로그인 시간 업데이트
    router.events.on("routeChangeComplete", updateLoginTime);

    // 페이지 언마운트 시에도 로그인 시간 업데이트
    return () => {
      router.events.off("routeChangeComplete", updateLoginTime);
    };
  }, []);

  useEffect(() => {
    const decodedToken: any = jwt.decode(accessToken, { complete: true });
    if (decodedToken && decodedToken.payload) {
      setLoginUserSn(decodedToken.payload.userSn);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken === undefined) {
      logout();
    }
  });

  const url = "/api/situation/my/myInfoApi";

  // 로그인한 사용자 정보 조회
  const fetchTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        user_sn: loginUserSn,
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();

      const userList = data.data;

      if (userList && userList !== "") {
        //  유저 정보를 세션에 저장
        sessionStorage.setItem("userId", userList.user_id);
        sessionStorage.setItem("userSn", JSON.stringify(userList.user_sn));
        sessionStorage.setItem("userNm", JSON.stringify(userList.user_nm));

        const user = userList[0];
        setUserId(userList.user_id);
        setUserNm(userList.user_nm);
      }
    } catch (error) {
      console.error("menu:::: 에러 발생", error);
    }
  };

  useEffect(() => {
    if (loginUserSn) {
      fetchTableDataAsync();
    }
  }, [loginUserSn, accessToken]);

  return (
    <>
      {isLoading && <Loading />}
      {modalOpen && <div className="modal_ly_bg" />}
      {/* <!-- header -->	 */}
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <div className="brand-wrap" title="EMS Monitoring Application">
              <a className="brand-img stretched-link" href="/">
                <img
                  src="/assets/img/user_img/logo.svg"
                  width="27"
                  height="24"
                  alt="logo"
                />
              </a>
              <div className="brand-title">WEMS</div>
            </div>
          </div>
          <div className="header__content">
            <div className="header__content-start">
              <button
                type="button"
                className="nav-toggler header__btn btn btn-icon btn-sm btn_menuopen btn_header_w"
                aria-label="Nav Toggler"
              >
                <img
                  alt="Menu Button"
                  loading="lazy"
                  width="14"
                  height="10"
                  decoding="async"
                  data-nimg="1"
                  style={{ color: "transparent" }}
                  src="/assets/img/user_img/i_menuopen.png"
                />
              </button>
            </div>
            <div className="header__content-end">
              <div style={{ display: "flex", marginRight: 10, gap: 5 }}>
                {isDarkMode === true ? (
                  <div>
                    <button
                      onClick={handleDarkBtnClick}
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "#000",
                        borderColor: "#fff",
                        borderWidth: 3,
                        paddingBottom: 5,
                        paddingTop: 5,
                      }}
                    >
                      <img
                        src="/assets/img/mode/darkMode_light.png"
                        style={{ width: 30, height: 30 }}
                      />
                    </button>
                    {/* <button
                    onClick={handleLightBtnClick}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "#000",
                      borderColor: "#fff",
                      borderWidth: 3,
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  >
                    <img
                      src="/assets/img/mode/lightMode_light.png"
                      style={{ width: 30, height: 30 }}
                    />
                  </button> */}
                  </div>
                ) : (
                  <div>
                    {/* <button
                    onClick={handleDarkBtnClick}
                    style={{
                      borderRadius: "50%",
                      backgroundColor: "transparent",
                      borderColor: "#000",
                      borderWidth: 3,
                      paddingBottom: 5,
                      paddingTop: 5,
                    }}
                  >
                    <img
                      src="/assets/img/mode/darkMode_dark.png"
                      style={{ width: 30, height: 30 }}
                    />
                  </button> */}
                    <button
                      onClick={handleLightBtnClick}
                      style={{
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        borderWidth: 3,
                        borderColor: "#000",
                        paddingBottom: 5,
                        paddingTop: 5,
                      }}
                    >
                      <img
                        src="/assets/img/mode/lightMode_dark.png"
                        style={{ width: 30, height: 30 }}
                      />
                    </button>
                  </div>
                )}
              </div>

              <span className="mr_6 header_name">
                {userId} / {userNm}
              </span>
              <a className="" href="/my/myInfo">
                <button
                  className="header__btn btn btn-icon btn-sm"
                  type="button"
                  aria-expanded="true"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  data-bs-original-title={t("MUL_WD_0059") as string}
                >
                  <i className="i_h_male" title="사용자 설정"></i>
                </button>
              </a>
              <button
                onClick={handleLogoutBtnClick}
                className="header__btn btn btn-icon btn-sm"
                type="button"
                aria-expanded="false"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-original-title={t("MUL_WD_0005") as string}
              >
                <i className="i_h_unlock" title="로그아웃"></i>
              </button>
              <div
                className="d-flex justify-content-center btn_langage_group"
                style={{ marginBottom: 0 }}
              >
                <Link href={router.pathname} locale="en">
                  <button
                    className={
                      lang === "en"
                        ? "btn btn_english active"
                        : "btn btn_english"
                    }
                    type="button"
                    onClick={handleEnClick}
                  >
                    <span className="i_langage i_english mr_3"></span>
                    <span className="langage_name">English</span>
                  </button>
                </Link>

                <Link href={router.pathname} locale="ko">
                  <button
                    className={
                      lang === "ko" ? "btn btn_korean active" : "btn btn_korean"
                    }
                    type="button"
                    onClick={handleKoClick}
                  >
                    <span className="i_langage i_korean mr_3"></span>
                    <span className="langage_name">한국어</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <-- header --> */}
      {/* <-- navbar --> */}
      <nav id="mainnav-container" className="mainnav">
        <div className="mainnav__inner">
          <div className="p-0 mainnav__top-content scrollable-content">
            <Sidebar></Sidebar>
          </div>
          <div
            className="pb-2 mainnav__bottom-content border-top"
            onClick={handleLogoutBtnClick}
          >
            <ul
              id="mainnav"
              className="mainnav__menu nav flex-column border_no"
            >
              <li className="nav-item has-sub">
                <a
                  href="#"
                  className="nav-link collapsed bott_logout"
                  aria-expanded="false"
                >
                  <i className="mt-2 pli-unlock fs-5 me-2"></i>
                  <span className="mt-2 nav-label ms-1">Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <-- navbar --> */}
      {/* <div className="modal_ly_bg"></div> */}
    </>
  );
}
