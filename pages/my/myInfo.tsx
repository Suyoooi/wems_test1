import { WebUserData } from "@/types/webComm";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import CodeList from "@/components/codeList";

const MyInfo = () => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [encodedPassword, setEncodedPassword] = useState<string>("");
  const [failedNumber, setFailedNumer] = useState<number>(0);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [originPassword, setOriginPassword] = useState("");
  const [originEncodePassword, setOriginEncodePassword] = useState("");
  const [newPassword, setNewPassword] = useState<boolean>(false);
  const [userData, setUserData] = useState<WebUserData | null>(null);
  const dispatch = useDispatch();

  let consumerUrl = `/api/situation/my/myInfoApi`;

  // 로그인한 사용자 정보 조회
  const fetchTableDataAsync = async () => {
    dispatch(startLoading());
    const storedUserSn = sessionStorage.getItem("userSn");

    try {
      const bodyData = {
        case_method: "GET",
        user_sn: storedUserSn,
      };

      const res = await fetch(consumerUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      dispatch(stopLoading());
      setUserData(dataInfo);
    } catch (error) {
      console.error("myInfo:::: 에러 발생", error);

      dispatch(stopLoading());
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, []);

  const validationSchema = yup.object().shape({
    user_id: yup.string().required(t("MUL_ST_00103") as string),
    user_nm: yup.string().required(t("MUL_ST_00100") as string),
    user_rol_cd: yup.string().required(t("MUL_ST_00101") as string),
    pwd_enc: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/,
        t("MUL_ST_00104") as string
      ),
    user_telno_enc: yup
      .string()
      .notRequired()
      .matches(
        /^(\d{2,3}-\d{3,4}-\d{4}|\d{10,11})?$/,
        t("MUL_ST_00105") as string
      ),
    user_eml: yup
      .string()
      .email(t("MUL_ST_00106") as string)

      .notRequired(),
    change_yn: yup.boolean(),
  });

  const defaultValues = {
    user_id: "",
    user_nm: "",
    user_rol_cd: "",
    pwd_enc: "qwer1234!",
    user_telno_enc: "",
    user_eml: "",
    change_yn: false,
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<WebUserData>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });

  const handleRegistration: SubmitHandler<WebUserData> = (data) => {
    if (data.user_sn != undefined) {
      if (password !== confirmedPassword) {
        alert(t("MUL_ST_00124"));
        return;
      }

      putModalDataAsync(data);
    }
  };

  const handleError = (errors: any) => {
    console.log(errors);
  };

  useEffect(() => {
    if (userData !== null) {
      setDataInfo();
    }
  }, [userData]);

  const setDataInfo = async () => {
    if (userData !== null && userData !== undefined) {
      if (userData.user_sn) setValue("user_sn", userData.user_sn);
      if (userData.user_id) setValue("user_id", userData.user_id);
      if (userData.user_nm) setValue("user_nm", userData.user_nm);
      if (userData.user_rol_cd) setValue("user_rol_cd", userData.user_rol_cd);
      if (changePassword && newPassword === false) {
        setPassword("qwer1234!");
        // if (userData.pwd_enc) setValue("pwd_enc", "qwer1234!");
      } else if (changePassword && newPassword === true) {
        setPassword(encodedPassword);
      }
      if (userData.user_telno_enc && userData.user_telno_enc.replace(/-/g, ""))
        setValue("user_telno_enc", userData.user_telno_enc.replace(/-/g, ""));
      if (userData.user_eml) setValue("user_eml", userData.user_eml);
      if (userData.pwd_epi_date)
        setValue("pwd_epi_date", userData.pwd_epi_date);
      if (userData.user_rol_cd) setValue("user_rol_cd", userData.user_rol_cd);
      if (userData.change_yn) setValue("change_yn", false);
    }
  };

  const handleCancelBtnClick = () => {
    const userConfirmed = confirm(t("MUL_ST_00126") as string);
    if (userConfirmed) {
      // 확인 버튼 눌렀을 때
      window.location.reload();
    } else {
      // 취소 버튼 눌렀을 때
    }
  };

  let webUserUrl = `/api/webUser/webUserApi`;

  // 사용자 비밀번호 확인
  async function putOriginPasswordAsync() {
    const storedUserSn = sessionStorage.getItem("userSn");
    try {
      {
        const modifyDataVal = {
          case_method: "C_POST",
          user_sn: storedUserSn,
          check_pwd: originEncodePassword,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(modifyDataVal),
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${accessToken}`,
          // },
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00127"));
          setNewPassword(true);
        } else if (data.code === 400) {
          alert(t("MUL_ST_00227"));
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
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (changePassword === false) {
      setOriginEncodePassword("qwer1234!");
      setEncodedPassword(Buffer.from("qwer1234!").toString("base64"));
    } else if (changePassword === true) {
      setOriginEncodePassword(Buffer.from(originPassword).toString("base64"));
      setEncodedPassword(Buffer.from(password).toString("base64"));
    }
  }, [changePassword, originPassword, password, encodedPassword]);

  const handelCofirmBtnClick = () => {
    putOriginPasswordAsync();
  };

  // 사용자 정보 수정
  async function putModalDataAsync(dataVal: any) {
    const storedUserId = sessionStorage.getItem("userId");

    try {
      if (confirm(t("MUL_ST_00130") as string)) {
        if (changePassword === true) {
          if (newPassword === false) {
            alert(t("MUL_ST_00128"));
            return;
          } else if (newPassword === true) {
            if (encodedPassword === "") {
              alert(t("MUL_ST_00129"));
              return;
            }
          }
        }

        const inputDataVal = {
          case_method: "PATCH",
          user_sn: dataVal.user_sn,
          pwd_enc: encodedPassword,
          user_eml: dataVal.user_eml,
          user_id: dataVal.user_id,
          user_nm: dataVal.user_nm,
          user_rol_cd: dataVal.user_rol_cd,
          user_telno_enc: dataVal.user_telno_enc,
          change_yn: changePassword,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(inputDataVal),
          method: "PATCH",
          // headers: {
          //   Authorization: `Bearer ${accessToken}`,
          // },
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00114"));
          window.location.reload();
        } else if (data.code === "U001") {
          alert(t("MUL_ST_00109"));
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
    } catch (e) {
      console.log(e);
    }
  }

  const handleChagePassword = () => {
    setChangePassword(!changePassword);
  };

  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            {/* <!-- page position -->   */}
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("MUL_WD_0059")}
                </li>
              </ol>
            </nav>
            {/* <!-- page position -->  */}
            <h1 className="mt-2 mb-0 page-title"> {t("MUL_WD_0059")}</h1>
            <p className="lead"></p>
            <div className="content__boxed">
              {/* <form> */}
              <form onSubmit={handleSubmit(handleRegistration, handleError)}>
                <div className="search-box">
                  <div className="mt-3">
                    <div className="col-md-9 justify-content-center">
                      <div className="mb-3 row">
                        {/* <!-- 사용자 번호 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          {t("MUL_WD_0052")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="user_sn"
                            {...register("user_sn")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 사용자 아이디 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          * {t("MUL_WD_0031")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.user_id ? "is-invalid" : ""
                            }`}
                            id="user_id"
                            {...register("user_id")}
                          />
                          <div className="invalid-feedback">
                            {errors.user_id?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 사용자 이름 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          * {t("MUL_WD_0032")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.user_nm ? "is-invalid" : ""
                            }`}
                            id="user_nm"
                            {...register("user_nm")}
                          />
                          <div className="invalid-feedback">
                            {errors.user_nm?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 사용자 상태 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          * {t("MUL_WD_0033")}
                        </label>
                        <div className="col-sm-8">
                          <select
                            className="form-select"
                            id="user_rol_cd"
                            {...register("user_rol_cd")}
                            disabled
                          >
                            <CodeList codeGroupId="USER_ROL_CD" />
                          </select>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 비밀번호 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          * {t("MUL_WD_0003")}
                        </label>
                        <div className="col-sm-8 justify-content-start">
                          <button
                            type="button"
                            className="btn btn-md btn-gray"
                            onClick={handleChagePassword}
                            id="change_yn"
                            {...register("change_yn")}
                          >
                            {t("MUL_WD_0053")}
                          </button>
                        </div>
                      </div>
                      {changePassword === true ? (
                        <div>
                          <div className="mb-3 row">
                            {/* <!-- 기존 비밀번호 --> */}
                            <label className="col-sm-4 col-form-label text-sm-end">
                              * {t("MUL_WD_0054")}
                            </label>
                            <div className="col-sm-8">
                              <div className="input-group">
                                <input
                                  type="password"
                                  className="form-control"
                                  id="input_afpassword"
                                  value={originPassword}
                                  onChange={(e) =>
                                    setOriginPassword(e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  className="btn btn-md btn-gray"
                                  onClick={handelCofirmBtnClick}
                                >
                                  {t("MUL_WD_0055")}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            {/* <!-- 새 비밀번호 --> */}
                            <label className="col-sm-4 col-form-label text-sm-end">
                              * {t("MUL_WD_0056")}
                            </label>
                            <div className="col-sm-8">
                              <input
                                disabled={newPassword === false}
                                type="password"
                                className={`form-control ${
                                  errors.pwd_enc ? "is-invalid" : ""
                                }`}
                                id="pwd_enc"
                                {...register("pwd_enc")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <div className="invalid-feedback">
                                {errors.pwd_enc?.message}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            {/* <!-- 비밀번호 확인 --> */}
                            <label className="col-sm-4 col-form-label text-sm-end">
                              * {t("MUL_WD_0056")}
                            </label>
                            <div className="col-sm-8">
                              <input
                                type="password"
                                className="form-control"
                                value={confirmedPassword}
                                onChange={(e) =>
                                  setConfirmedPassword(e.target.value)
                                }
                                disabled={newPassword === false}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div className="mb-3 row">
                        {/* <!-- 비밀번호 실패횟수 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          {t("MUL_WD_0037")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="input_pwfailnum"
                            value={failedNumber}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 비밀번호 만료일 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          {t("MUL_WD_0038")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="pwd_epi_date"
                            {...register("pwd_epi_date")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 연락처 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          {t("MUL_WD_0035")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.user_telno_enc ? "is-invalid" : ""
                            }`}
                            id="user_telno_enc"
                            {...register("user_telno_enc")}
                          />
                          <div className="invalid-feedback">
                            {errors.user_telno_enc?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        {/* <!-- 이메일 --> */}
                        <label className="col-sm-4 col-form-label text-sm-end">
                          {t("MUL_WD_0036")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.user_eml ? "is-invalid" : ""
                            }`}
                            id="user_eml"
                            {...register("user_eml")}
                          />
                          <div className="invalid-feedback">
                            {errors.user_eml?.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gap-2 mt-3 col-md-12 d-flex justify-content-center">
                  <button type="submit" className="btn btn-lg btn-deepgray">
                    {t("MUL_WD_0045")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg btn-light"
                    onClick={handleCancelBtnClick}
                  >
                    {t("MUL_WD_0058")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyInfo;
