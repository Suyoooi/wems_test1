import React, { PropsWithChildren, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { SrvrInputBody } from "@/types/webComm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";
interface ModalDefaultType {
  onClickToggleModal: () => void;
  modSrvrInfo: any;
  callbackFunction: any;
}

function Modal({
  onClickToggleModal,
  modSrvrInfo,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  let srvrInfoUrl = `/api/setting/srvr/srvrApi`;
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const schema = yup.object().shape({
    // inSrvrSn: yup.number().default(null),
    inPhySrvrAlias: yup.string().required(t("MUL_ST_0010") as string),
    inSrvrHtNm: yup.string().required(t("MUL_ST_0011") as string),
    inSrvrIpaddr: yup
      .string()
      .required(t("MUL_ST_0012") as string)
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        t("MUL_ST_0014") as string
      ),
    inSrvrPort: yup
      .string()
      .required(t("MUL_ST_0013") as string)
      .matches(
        /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|5\d{4}|[0-9]\d{0,3})$/,
        t("MUL_ST_0015") as string
      ),
    inSrvrDesc: yup.string().default(""),
  });

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const defaultValues = {
    inSrvrSn: undefined,
    inPhySrvrAlias: "",
    inSrvrHtNm: "",
    inSrvrIpaddr: "",
    inSrvrPort: "",
    inSrvrDesc: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SrvrInputBody>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<SrvrInputBody> = (data) => {
    if (data.inSrvrSn != undefined) {
      modifySrvrInfo(data);
    } else {
      createSrvrInfo(data);
    }
  };
  const handleError = (errors: any) => {
    console.log(errors);
  };

  const [popTitle, setPopTitle] = useState<String>();
  const [popBtn, setPopBtn] = useState<String>();

  const setDataInfo = async () => {
    if (modSrvrInfo !== null && modSrvrInfo !== undefined) {
      if (modSrvrInfo.srvr_sn) setValue("inSrvrSn", modSrvrInfo.srvr_sn);
      if (modSrvrInfo.srvr_alias)
        setValue("inPhySrvrAlias", modSrvrInfo.srvr_alias);
      if (modSrvrInfo.srvr_ht_nm)
        setValue("inSrvrHtNm", modSrvrInfo.srvr_ht_nm);
      if (modSrvrInfo.srvr_ipaddr)
        setValue("inSrvrIpaddr", modSrvrInfo.srvr_ipaddr);
      if (modSrvrInfo.srvr_port) setValue("inSrvrPort", modSrvrInfo.srvr_port);
      if (modSrvrInfo.srvr_desc) setValue("inSrvrDesc", modSrvrInfo.srvr_desc);
      setPopTitle(t("MUL_WD_0113") as string);
      setPopBtn(t("MUL_WD_0045") as string);
    } else {
      setPopTitle(t("MUL_WD_0114") as string);
      setPopBtn(t("MUL_WD_0044") as string);
    }
  };

  useEffect(() => {
    setDataInfo();
  }, []);

  async function createSrvrInfo(dataVal: any) {
    try {
      if (confirm(t("MUL_ST_0096") as string)) {
        const inputDataVal = {
          case_method: "POST",
          srvrAlias: dataVal.inPhySrvrAlias,
          srvrHtNm: dataVal.inSrvrHtNm,
          srvrIpaddr: dataVal.inSrvrIpaddr,
          srvrPort: dataVal.inSrvrPort,
          srvrDesc: dataVal.inSrvrDesc,
        };

        const res = await fetch(srvrInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_0097"));

          if (onClickToggleModal) {
            onClickToggleModal();
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

  async function modifySrvrInfo(dataVal: any) {
    try {
      if (confirm(t("MUL_ST_0098") as string)) {
        const inputDataVal = {
          case_method: "PATCH",
          srvrSn: dataVal.inSrvrSn,
          srvrAlias: dataVal.inPhySrvrAlias,
          srvrHtNm: dataVal.inSrvrHtNm,
          srvrIpaddr: dataVal.inSrvrIpaddr,
          srvrPort: dataVal.inSrvrPort,
          srvrDesc: dataVal.inSrvrDesc,
        };

        const res = await fetch(srvrInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "PATCH",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_0099"));

          if (onClickToggleModal) {
            onClickToggleModal();
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

              <form onSubmit={handleSubmit(handleRegistration, handleError)}>
                <div className="modal-body">
                  <div className="content__boxed">
                    <div className="row col-md-12 justify-content-center">
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inSrvrSn"
                        >
                          Server No
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
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inPhySrvrAlias"
                        >
                          * {t("MUL_WD_0011")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.inPhySrvrAlias ? "is-invalid" : ""
                            }`}
                            id="inPhySrvrAlias"
                            {...register("inPhySrvrAlias")}
                          />
                          <div className="invalid-feedback">
                            {errors.inPhySrvrAlias?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inSrvrHtNm"
                        >
                          * {t("MUL_WD_0040")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.inSrvrHtNm ? "is-invalid" : ""
                            }`}
                            id="inSrvrHtNm"
                            {...register("inSrvrHtNm")}
                          />
                          <div className="invalid-feedback">
                            {errors.inSrvrHtNm?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inSrvrIpaddr"
                        >
                          * {t("MUL_WD_0041")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.inSrvrIpaddr ? "is-invalid" : ""
                            }`}
                            id="inSrvrIpaddr"
                            {...register("inSrvrIpaddr")}
                          />
                          <div className="invalid-feedback">
                            {errors.inSrvrIpaddr?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inSrvrPort"
                        >
                          * {t("MUL_WD_0042")} (ssh)
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.inSrvrPort ? "is-invalid" : ""
                            }`}
                            id="inSrvrPort"
                            {...register("inSrvrPort")}
                          />
                          <div className="invalid-feedback">
                            {errors.inSrvrPort?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          className="col-sm-4 col-form-label text-end"
                          htmlFor="inSrvrDesc"
                        >
                          {t("MUL_WD_0009")} {t("MUL_WD_0105")}
                        </label>
                        <div className="col-sm-8">
                          <textarea
                            id="inSrvrDesc"
                            className="form-control"
                            placeholder="comment"
                            rows={3}
                            {...register("inSrvrDesc")}
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
