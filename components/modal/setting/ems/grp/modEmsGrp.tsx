import React, { PropsWithChildren, useState, useEffect } from "react";
import type { ModEmsGrpInputBody } from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickModModal: () => void;
  grpInfo: any;
  callbackFunction: any;
}

function Modal({
  onClickModModal,
  grpInfo,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let grpInfoUrl = `/api/setting/ems/userGrpApi`;

  const schema = yup
    .object()
    .shape({
      inSrvrSn: yup.number().default(null),
      inSrvrNm: yup.string().required(t("MUL_ST_0085") as string),
      inGrpNm: yup.string().required(t("MUL_ST_0086") as string),
      inDesc: yup.string().default(""),
    })
    .required();

  const defaultValues = {
    inSrvrNm: "",
    inGrpNm: "",
    inDesc: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<ModEmsGrpInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<ModEmsGrpInputBody> = (data) => {
    modEmsUserGrp(data);
  };
  const headleError = (errors: any) => {
    console.log(errors);
  };

  const [inputData, setInputData] = useState({
    inSrvrNm: "",
    inGrpNm: "",
    inDesc: "",
  });

  const setDataInfo = async () => {
    if (grpInfo !== null && grpInfo !== undefined) {
      if (grpInfo.tib_srvr_sn) setValue("inSrvrSn", grpInfo.tib_srvr_sn);
      if (grpInfo.ems_alias) setValue("inSrvrNm", grpInfo.ems_alias);
      if (grpInfo.group_name) setValue("inGrpNm", grpInfo.group_name);
      if (grpInfo.description) setValue("inDesc", grpInfo.description);
    }
  };

  useEffect(() => {
    setDataInfo();
  }, []);

  async function modEmsUserGrp(dataVal: any) {
    try {
      if (confirm(t("MUL_ST_0084") as string)) {
        const inputDataVal = {
          case_method: "GRP_PUT",
          tib_srvr_sn: dataVal.inSrvrSn,
          group_name: dataVal.inGrpNm,
          description: dataVal.inDesc,
        };

        const res = await fetch(grpInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "PUT",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_0087"));
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
                  {t("MUL_WD_0109")}
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
                    <div className="row col-md-12 justify-content-center">
                      <div className="row col-md-12">
                        <div>
                          <div className="mt-2 mb-2 row col-md-12">
                            <label
                              className="col-sm-4 col-form-label text-sm-end"
                              htmlFor="inSrvrSn"
                            >
                              * Ems No
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
                          <div className="mt-2 mb-2 row col-md-12">
                            <label
                              className="col-sm-4 col-form-label text-sm-end"
                              htmlFor="inSrvrNm"
                            >
                              * Ems {t("MUL_WD_0009")}
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
                          <div className="mt-2 mb-2 row col-md-12">
                            <label
                              className="col-sm-4 col-form-label text-sm-end"
                              htmlFor="inGrpNm"
                            >
                              * {t("MUL_WD_0020")} {t("MUL_WD_0072")}
                            </label>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                className="form-control"
                                id="inGrpNm"
                                {...register("inGrpNm")}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="mt-2 mb-2 row col-md-12">
                            <label
                              className="col-sm-4 col-form-label text-sm-end"
                              htmlFor="inDesc"
                            >
                              {t("MUL_WD_0105")}
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
