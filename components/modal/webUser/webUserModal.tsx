import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { WebUserData } from "@/types/webComm";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  rowData: any;
  callbackFunction: any;
}

const WebUserModal: React.FC<ModalDefaultType> = ({
  onClickToggleModal,
  rowData,
  callbackFunction,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const validationSchema = yup.object().shape({
    user_id: yup.string().required(t("MUL_ST_00103") as string),
    user_nm: yup.string().required(t("MUL_ST_00101") as string),
    user_rol_cd: yup.string().required(t("MUL_ST_00101") as string),
    pwd_enc: yup
      .string()
      .required(t("MUL_ST_00102") as string)
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [popTitle, setPopTitle] = useState<String>();
  const [popBtn, setPopBtn] = useState<String>();
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [resetPassword, setResetPassword] = useState();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const defaultValues = {
    user_id: "",
    user_nm: "",
    user_rol_cd: "",
    pwd_enc: "",
    user_telno_enc: "",
    user_eml: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<WebUserData>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });

  // 비밀번호를 Base64로 인코딩
  const modPassword = Buffer.from("qwer1234!").toString("base64");

  const handleRegistration: SubmitHandler<WebUserData> = (data) => {
    if (data.user_sn === undefined) {
      if (data.pwd_enc !== confirmedPassword) {
        alert(t("MUL_ST_00107"));
        return;
      }
      postModalDataAsync(data);
    } else {
      setConfirmedPassword(modPassword);
      putModalDataAsync(data);
    }
  };

  const setDataInfo = async () => {
    if (rowData !== null && rowData !== undefined) {
      if (rowData.user_sn) setValue("user_sn", rowData.user_sn);
      if (rowData.user_id) setValue("user_id", rowData.user_id);
      if (rowData.user_nm) setValue("user_nm", rowData.user_nm);
      if (rowData.user_rol_cd) setValue("user_rol_cd", rowData.user_rol_cd);
      if (rowData.pwd_enc) setValue("pwd_enc", "qwer1234!");
      if (rowData.user_telno_enc.replace(/-/g, ""))
        setValue("user_telno_enc", rowData.user_telno_enc.replace(/-/g, ""));
      if (rowData.user_eml) setValue("user_eml", rowData.user_eml);
      setPopTitle(t("MUL_WD_0117") as string);
      setPopBtn(t("MUL_WD_0045") as string);
    } else {
      setPopTitle(t("MUL_WD_0116") as string);
      setPopBtn(t("MUL_WD_0044") as string);
    }
  };

  useEffect(() => {
    setDataInfo();
  }, []);

  let webUserUrl = `/api/webUser/webUserApi`;

  // 사용자 등록
  const postModalDataAsync = async (dataVal: any) => {
    setIsLoading(true);

    try {
      if (confirm(t("MUL_ST_00108") as string)) {
        // 비밀번호를 Base64로 인코딩
        const encodedPassword = Buffer.from(dataVal.pwd_enc).toString("base64");
        const EncodedPassword = window.btoa(dataVal.pwd_enc);

        const bodyData = {
          pwd_enc: encodedPassword,
          user_eml: dataVal.user_eml,
          user_id: dataVal.user_id,
          user_nm: dataVal.user_nm,
          user_rol_cd: dataVal.user_rol_cd,
          user_telno_enc: dataVal.user_telno_enc.replace(/-/g, ""),
          access_token: dataVal.accessToken,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00110"));
          callbackFunction(data);

          if (onClickToggleModal) {
            onClickToggleModal();
          }
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
    } catch (error) {
      console.error("에러 발생:", error);
      alert(t("MUL_ST_00111"));
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 수정
  async function putModalDataAsync(dataVal: any) {
    const modUsersn = rowData.user_sn;
    const modUsernm = rowData.user_nm;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Would you like to modify your ${modUsernm} user information?`;
    } else if (lang === "ko") {
      confirmVal = `${modUsernm} 사용자 정보를 수정하시겠습니까?`;
    }

    try {
      if (confirm(confirmVal)) {
        const inputDataVal = {
          case_method: "PATCH",
          user_sn: modUsersn,
          pwd_enc: dataVal.pwd_enc,
          user_eml: dataVal.user_eml,
          user_id: dataVal.user_id,
          user_nm: dataVal.user_nm,
          user_rol_cd: dataVal.user_rol_cd,
          user_telno_enc: dataVal.user_telno_enc.replace(/-/g, ""),
          change_yn: false,
          access_token: dataVal.accessToken,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(inputDataVal),
          method: "PATCH",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_00114"));
          callbackFunction(data);

          if (onClickToggleModal) {
            onClickToggleModal();
          }
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
      if (onClickToggleModal) {
        onClickToggleModal();
      }
    }
  }

  const [expirationDate, setExpirationDate] = useState(
    rowData && rowData.pwd_epi_date
  );
  const [failedNumber, setFailedNumber] = useState(
    rowData && rowData.lgn_fail_cnt
  );

  // 패스워드 실패 횟수 초기화
  async function postfailedNumberAsync() {
    const modUsersn = rowData.user_sn;
    const modUserId = rowData.user_id;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Do you want to reset the number of password failures for user ${modUserId}?`;
    } else if (lang === "ko") {
      confirmVal = `사용자 ${modUserId}의 패스워드 실패 횟수를 초기화 하시겠습니까?`;
    }

    try {
      if (confirm(confirmVal)) {
        const inputDataVal = {
          case_method: "R_POST",
          user_sn: modUsersn,
          access_token: accessToken,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        alert(t("MUL_ST_00116"));
        setFailedNumber(0);
      }
    } catch (e) {
      if (onClickToggleModal) {
        onClickToggleModal();
      }
    }
  }

  const handleResetBtnClick = () => {
    postfailedNumberAsync();
  };

  // 패스워드 유효기간 연장
  async function postEpiDateAsync() {
    const modUsersn = rowData.user_sn;
    const modUserId = rowData.user_id;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Would you like to extend the password expiration date for user ${modUserId}?`;
    } else if (lang === "ko") {
      confirmVal = `사용자 ${modUserId}의 패스워드 유효기간을 연장 하시겠습니까?`;
    }

    try {
      if (confirm(confirmVal)) {
        const inputDataVal = {
          case_method: "P_POST",
          user_sn: modUsersn,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        const data = await res.json();
        alert(t("MUL_ST_00118"));
        setExpirationDate(data.data.pwd_epi_date);
      }
    } catch (e) {
      if (onClickToggleModal) {
        onClickToggleModal();
      }
    }
  }

  const handleEpiBtnClick = () => {
    postEpiDateAsync();
  };

  // 비밀번호 초기화 및 발급
  async function postResetPwAsync() {
    const modUsersn = rowData.user_sn;
    const modUserId = rowData.user_id;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Would you like to reset the password for user ${modUserId}?`;
    } else if (lang === "ko") {
      confirmVal = `사용자 ${modUserId}의 비밀번호를 초기화 하시겠습니까?`;
    }

    try {
      if (confirm(confirmVal)) {
        const inputDataVal = {
          case_method: "L_POST",
          user_sn: modUsersn,
        };

        const res = await fetch(webUserUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_00119"));
          setResetPassword(data.data.check_pwd);
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
      if (onClickToggleModal) {
        onClickToggleModal();
      }
    }
  }

  const handleRePwBtnClick = () => {
    postResetPwAsync();
  };

  return (
    <div className="modal_wrap">
      <div className="modal_wrapbox">
        <div className="modal-dialog">
          <div className="modal-content w_700">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                {popTitle}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={(e) => {
                  e.preventDefault();
                  if (onClickToggleModal) {
                    onClickToggleModal();
                  }
                }}
              ></button>
            </div>
            <form onSubmit={handleSubmit(handleRegistration)}>
              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12">
                    {/* <!-- 사용자 아이디 --> */}
                    <div className="mb-3 row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        * {t("MUL_WD_0031")}
                      </label>
                      <div className="col-sm-7">
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
                    {/* <!-- 사용자 이름 --> */}
                    <div className="mb-3 row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        * {t("MUL_WD_0032")}
                      </label>
                      <div className="col-sm-7">
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
                    <div className="row col-sm-6"></div>
                    {/* <!-- 사용자 권한 --> */}
                    <div className="mb-3 row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        * {t("MUL_WD_0033")}
                      </label>
                      <div className="col-sm-7">
                        <select
                          className={`form-select ${
                            errors.user_rol_cd ? "is-invalid" : ""
                          }`}
                          id="user_rol_cd"
                          {...register("user_rol_cd")}
                        >
                          <option selected hidden>
                            = {t("MUL_WD_0062")} =
                          </option>
                          <option value="ADMIN">{t("MUL_WD_0063")}</option>
                          <option value="USER">{t("MUL_WD_0064")}</option>
                        </select>
                        <div className="invalid-feedback">
                          {errors.user_rol_cd?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: popBtn === t("MUL_WD_0045") ? "none" : "block",
                    }}
                  >
                    <div className="mb-3 row col-md-12">
                      {/* <!-- 비밀번호 --> */}
                      <div className="row col-sm-6">
                        <label className="col-sm-5 col-form-label text-end">
                          * {t("MUL_WD_0003")}
                        </label>
                        <div className="col-sm-7">
                          <input
                            hidden={popBtn === t("MUL_WD_0045")}
                            type="password"
                            className={`form-control ${
                              errors.pwd_enc ? "is-invalid" : ""
                            }`}
                            id="pwd_enc"
                            {...register("pwd_enc")}
                          />
                          <div className="invalid-feedback">
                            {errors.pwd_enc?.message}
                          </div>
                        </div>
                      </div>
                      <div className="row col-sm-6">
                        <span className="mt-2 t_red">{t("MUL_ST_00223")}</span>
                      </div>
                    </div>
                    <div className="mb-3 row col-md-12">
                      {/* <!-- 비밀번호 확인 --> */}
                      <div className="row col-sm-6">
                        <label className="col-sm-5 col-form-label text-end">
                          * {t("MUL_WD_0003")} {t("MUL_WD_0055")}
                        </label>
                        <div className="col-sm-7">
                          <input
                            hidden={popBtn === t("MUL_WD_0045")}
                            type="password"
                            className={`form-control ${
                              errors.pwd_enc ? "is-invalid" : ""
                            }`}
                            value={confirmedPassword}
                            onChange={(e) =>
                              setConfirmedPassword(e.target.value)
                            }
                          />
                          <div className="invalid-feedback">
                            {errors.pwd_enc?.message}
                          </div>
                        </div>
                      </div>
                      <div className="row col-sm-6"></div>
                    </div>
                  </div>
                  <div
                    className="mb-3 row col-md-12"
                    hidden={popBtn === t("MUL_WD_0044")}
                  >
                    {/* <!-- 패스워드 만료일 --> */}
                    <div className="row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        {t("MUL_ST_00222")}
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          id="pwd_epi_date"
                          value={resetPassword}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="btn btn-gray btn-md"
                        onClick={handleRePwBtnClick}
                      >
                        {t("MUL_WD_0118")}
                      </button>
                    </div>
                  </div>
                  <div
                    className="mb-3 row col-md-12"
                    hidden={popBtn === t("MUL_WD_0044")}
                  >
                    {/* <!-- 패스워드 만료일 --> */}
                    <div className="row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        {t("MUL_WD_0038")}
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          id="pwd_epi_date"
                          value={expirationDate}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="btn btn-gray btn-md"
                        onClick={handleEpiBtnClick}
                      >
                        {t("MUL_WD_0119")}
                      </button>
                    </div>
                  </div>
                  <div
                    className="mb-3 row col-md-12"
                    hidden={popBtn === t("MUL_WD_0044")}
                  >
                    {/* <!-- 패스워드 실패횟수 --> */}
                    <div className="row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        {t("MUL_WD_0037")}
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          id="input_pwfailnum"
                          value={failedNumber}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="btn btn-gray btn-md"
                        onClick={handleResetBtnClick}
                      >
                        {t("MUL_WD_0118")}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3 row col-md-12">
                    {/* <!-- 사용자 연락처 --> */}
                    <div className="row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        {t("MUL_WD_0064")} {t("MUL_WD_0035")}
                      </label>
                      <div className="col-sm-7">
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
                    <div className="col-sm-6"></div>
                  </div>
                  <div className="mb-3 row col-md-12">
                    {/* <!-- 이메일 --> */}
                    <div className="row col-sm-6">
                      <label className="col-sm-5 col-form-label text-end">
                        {t("MUL_WD_0036")}
                      </label>
                      <div className="col-sm-7">
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
                    <div className="col-sm-6"></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                {/* <!-- button -->/ */}
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="submit"
                    className="btn btn-deepgray btn-lg"
                    disabled={isSubmitting}
                  >
                    {popBtn}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickToggleModal) {
                        onClickToggleModal();
                      }
                    }}
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
                {/* <!-- END - button --> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="modal_ly_bg"></div> */}
    </div>
  );
};

export default WebUserModal;
