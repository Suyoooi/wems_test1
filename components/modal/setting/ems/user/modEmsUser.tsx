import React, { PropsWithChildren, useState, useEffect } from "react";
import type { ModEmsUserInputBody } from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickModModal: () => void;
  userInfo: any;
  callbackFunction: any;
}

function Modal({
  onClickModModal,
  userInfo,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  let userInfoUrl = `/api/setting/ems/userListApi`;
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const schema = yup
    .object()
    .shape({
      inSrvrSn: yup.number().default(null),
      inSrvrNm: yup.string().required(t("MUL_ST_0048") as string),
      inUserNm: yup.string().required(t("MUL_ST_0049") as string),
      inPwd: yup.string().default(""),
      inDesc: yup.string().default(""),
    })
    .required();

  const defaultValues = {
    inSrvrNm: "",
    inUserNm: "",
    inPwd: "",
    inDesc: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<ModEmsUserInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<ModEmsUserInputBody> = (data) => {
    modEmsUser(data);
  };
  const headleError = (errors: any) => {
    console.log(errors);
  };

  const [inputData, setInputData] = useState({
    inSrvrNm: "",
    inUserNm: "",
    inPwd: "",
    inDesc: "",
  });
  const { inSrvrNm, inUserNm, inPwd, inDesc } = inputData;

  const setDataInfo = async () => {
    if (userInfo !== null && userInfo !== undefined) {
      if (userInfo.tib_srvr_sn) setValue("inSrvrSn", userInfo.tib_srvr_sn);
      if (userInfo.ems_alias) setValue("inSrvrNm", userInfo.ems_alias);
      if (userInfo.user_name) setValue("inUserNm", userInfo.user_name);
      if (userInfo.pwd_enc) setValue("inPwd", userInfo.pwd_enc);
      if (userInfo.description) setValue("inDesc", userInfo.description);
    }
  };

  useEffect(() => {
    setDataInfo();
  }, []);

  async function modEmsUser(dataVal: any) {
    try {
      if (confirm(t("MUL_ST_0047") as string)) {
        const inputDataVal = {
          case_method: "USER_PUT",
          tib_srvr_sn: dataVal.inSrvrSn,
          username: dataVal.inUserNm,
          password: dataVal.inPwd,
          description: dataVal.inDesc,
        };

        const res = await fetch(userInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "PUT",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_0046"));

          if (onClickModModal) {
            onClickModModal();
          }

          callbackFunction(data);
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

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_500">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="staticBackdropLabel"
                  style={{ color: "#000" }}
                >
                  {t("MUL_WD_0136")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickModModal) {
                      onClickModModal();
                    }
                  }}
                ></button>
              </div>

              <form onSubmit={handleSubmit(handleRegistration, headleError)}>
                <div className="modal-body">
                  <div className="content__boxed">
                    <div className="justify-content-center">
                      <div className="mb-2 row col-md-12">
                        <label
                          className="col-sm-4 col-form-label text-sm-end"
                          htmlFor="inSrvrSn"
                        >
                          * EMS Serial No
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="inSrvrSn"
                            {...register("inSrvrSn")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-2 row col-md-12">
                        <label
                          className="col-sm-4 col-form-label text-sm-end"
                          htmlFor="inSrvrNm"
                        >
                          * EMS {t("MUL_WD_0069")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="inSrvrNm"
                            {...register("inSrvrNm")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-2 row col-md-12">
                        <label
                          className="col-sm-4 col-form-label text-sm-end"
                          htmlFor="inUserNm"
                        >
                          * {t("MUL_WD_0032")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="inUserNm"
                            {...register("inUserNm")}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-2 row col-md-12">
                        <label
                          className="col-sm-4 col-form-label text-sm-end"
                          htmlFor="inPwd"
                        >
                          {t("MUL_WD_0003")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="password"
                            className={`form-control ${
                              errors.inPwd ? "is-invalid" : ""
                            }`}
                            id="inPwd"
                            {...register("inPwd")}
                          />
                          <div className="invalid-feedback">
                            {errors.inPwd?.message}
                          </div>
                        </div>
                      </div>
                      <div className="row col-md-12">
                        <label
                          className="col-sm-4 col-form-label text-sm-end"
                          htmlFor="inDesc"
                        >
                          Description
                        </label>
                        <div className="col-sm-8">
                          <textarea
                            id="inDesc"
                            className="form-control"
                            placeholder="comment"
                            rows={3}
                            {...register("inDesc")}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer justify-content-center">
                  <div className="flex-wrap gap-2 mt-3 d-flex">
                    <button
                      type="submit"
                      className="btn btn-deepgray btn-lg"
                      disabled={isSubmitting}
                    >
                      {t("MUL_WD_0024")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onClickModModal) {
                          onClickModModal();
                        }
                      }}
                    >
                      {t("MUL_WD_0023")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
