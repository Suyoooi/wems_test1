import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import * as yup from "yup";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { enLang, koLang } from "@/constant/redux/langSlice";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

interface IUserLogin {
  user_id: string;
  pwd_enc: string;
}

let loginUrl = `/api/webUser/login`;

const Login: FC<IUserLogin> = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();

  // 로그인
  const postModalDataAsync = async () => {
    dispatch(startLoading());

    const encodedPassword = Buffer.from(password).toString("base64");

    try {
      {
        const bodyData = {
          pwd_enc: encodedPassword,
          user_id: id,
        };

        const res = await fetch(loginUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        });

        const data = await res.json();

        if (data && data.code == "200") {
          // 토큰 추출
          const accessToken = data.data.access_token;
          const refreshToken = data.data.refresh_token;

          // 쿠키에 발급받은 토큰 저장
          document.cookie = `access_token=${accessToken}; path=/`;
          document.cookie = `refresh_token=${refreshToken}; path=/`;
          document.cookie;

          // 사용자의 로그인 시간 세션에 저장
          // loginTime는 페이지 이동시 마다 업데이트 됨 (사용자 활동 시간 체크를 위함)
          // reloadTime은 로그인 후 메인페이지 접속 시 리로드하기 위함
          const loginTime = new Date().getTime();
          sessionStorage.setItem("loginTime", loginTime.toString());
          sessionStorage.setItem("reloadTime", loginTime.toString());

          router.push("/situation/ems/allSitu");
        } else if (data.code === "U005") {
          alert(t("MUL_ST_00122"));
          return;
        } else if (data.code === "U003") {
          alert(t("MUL_ST_00123"));
          return;
        } else if (data.code === "U004") {
          alert(t("MUL_ST_00124"));
          return;
        } else if (data.code === "N001") {
          alert(t("MUL_ST_00125"));
          return;
        } else if (
          data.code === "500" ||
          data.code === "501" ||
          data.code === "502" ||
          data.code === "503" ||
          data.code === "504" ||
          data.code === "505" ||
          data.code === "506" ||
          data.code === "507" ||
          data.code === "508" ||
          data.code === "510" ||
          data.code === "511"
        ) {
          alert(t("MUL_ST_00233"));
        } else {
          alert(data.msg);
        }
      }
    } catch (error) {
      console.error("에러 발생:", error);
      // 로그인에 실패했다는 alert
      alert(t("MUL_ST_00171"));
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleBtnClick = () => {
    // 아이디와 패스워드 검증 스키마 정의
    const validationSchema = yup.object().shape({
      id: yup.string().required(() => t("MUL_ST_00172")),
      password: yup.string().required(() => t("MUL_ST_00173")),
    });

    // 입력 데이터 검증
    validationSchema
      .validate({ id, password }, { abortEarly: false })
      .then(() => {
        // 검증 성공한 경우 로그인 처리
        postModalDataAsync();
        setIdError("");
        setPasswordError("");
      })
      .catch((error) => {
        // 검증 실패한 경우 에러 메시지 설정
        if (error.inner.some((e: any) => e.path === "id")) {
          setIdError(
            error.inner.find((e: any) => e.path === "id")?.message || ""
          );
        } else {
          setIdError("");
        }
        if (error.inner.some((e: any) => e.path === "password")) {
          setPasswordError(
            error.inner.find((e: any) => e.path === "password")?.message || ""
          );
        } else {
          setPasswordError("");
        }
      });
  };

  // 엔터 키 눌렀을 때 로그인
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const button = document.getElementById("loginButton");
      if (button) {
        button.click();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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

  return (
    <>
      <div id="root" className="root front-container bg_deepblue">
        <section id="content" className="content">
          <div className="content__bcoxed min-vh-100 d-flex flex-column align-items-center justify-content-center">
            <div className="content__wrap">
              <div className="shadow-lg card">
                <div className="card-body w_600 p_tb0">
                  <div className="login_box">
                    {/* <!-- Brand --> */}
                    <div className="mb-4 d-flex justify-content-center login_brandimg">
                      <img
                        src="/assets/img/user_img/brand_logo.png"
                        width="208"
                        height="42"
                      />
                    </div>
                    {/* <!-- Brand --> */}
                    {/* <!-- English / Korean --> */}
                    <div className="d-flex justify-content-center btn_langage_group">
                      <Link href={router.pathname} locale="en">
                        <button
                          onClick={handleEnClick}
                          className={
                            lang === "en"
                              ? "btn btn_english active"
                              : "btn btn_english"
                          }
                        >
                          <span className="i_langage i_english mr_4" />
                          <span className="langage_name">English</span>
                        </button>
                      </Link>
                      <Link href={router.pathname} locale="ko">
                        <button
                          onClick={handleKoClick}
                          className={
                            lang === "ko"
                              ? "btn btn_korean active"
                              : "btn btn_korean"
                          }
                        >
                          <span className="i_langage i_korean mr_4" />
                          <span className="langage_name">한국어</span>
                        </button>
                      </Link>
                    </div>
                    {/* <!-- English / Korean --> */}
                    {/* <!-- input id / pw --> */}
                    <div className="mb-3 row">
                      <input
                        type="text"
                        className={`form-control input_idpw ${
                          idError ? "is-invalid" : ""
                        }`}
                        id="loginId"
                        placeholder={t("MUL_WD_0002") || ""}
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                      {idError && (
                        <div className="invalid-feedback">{idError}</div>
                      )}
                      <input
                        type="password"
                        className={`mt-2 form-control input_idpw ${
                          idError ? "is-invalid" : ""
                        }`}
                        id="loginPwd"
                        placeholder={t("MUL_WD_0003") || ""}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {passwordError && (
                        <div className="invalid-feedback">{passwordError}</div>
                      )}
                    </div>
                    {/* <!-- 로그인 / 회원가입 --> */}
                    <div className="row pb_90">
                      {/* <!-- 로그인 --> */}
                      <button
                        id="loginButton"
                        className="mb-2 btn btn-lg btn-deepgray h_50"
                        type="button"
                        onClick={handleBtnClick}
                      >
                        <i className="i_login icon-lg mr_10" />
                        {t("MUL_WD_0004")}
                      </button>
                      {/* <!-- 회원가입 --> */}
                      {/* <button className="btn btn-lg btn-outline-dark h_50">
                        <i className="mr-4 i_login_join icon-lg"></i>
                        회원가입
                      </button> */}
                    </div>
                    {/* <!-- 로그인 / 회원가입 --> */}
                    {/* </form> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
