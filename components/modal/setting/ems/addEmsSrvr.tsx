import React, {
  PropsWithChildren,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import type { EMSSrvrInputBody, GrpListData } from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
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
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  // const [encodedPassword, setEncodedPassword] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  const schema = yup.object().shape({
    inSrvrSn: yup.string().required(t("MUL_ST_0055") as string),
    inSrvrGrpCd: yup.string().default(null),
    inSrvrNm: yup.string().required(t("MUL_ST_0048") as string),
    inSrvrUrl: yup
      .string()
      .required(t("MUL_ST_0056") as string)
      .matches(
        /^(http|https|tcp):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        "MUL_ST_0057"
      ),
    inSrvrPort: yup
      .string()
      .required(t("MUL_ST_0058") as string)
      .matches(
        /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|5\d{4}|[0-9]\d{0,3})$/,
        t("MUL_ST_0061") as string
      ),
    inUserNm: yup
      .string()
      .required(t("MUL_ST_0059") as string)
      .matches(/^[A-Za-z][A-Za-z0-9_]{4,19}$/, t("MUL_ST_0060") as string),
    inPwd: yup.string().default(null),
    inEnIngest: yup.string().default(null),
    inEnSys: yup.string().default(null),
    inSrvrIpAddr: yup.string().default(null),
  });

  const [enIngest, setEnIngest] = useState<boolean>(true);
  const [enSys, setEnSys] = useState<boolean>(true);

  // 체크박스 상태 업데이트 함수
  const handleEnIngestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnIngest(event.target.checked);
  };

  const handleEnSysChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnSys(event.target.checked);
  };

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const defaultValues = {
    inEmsSrvrSn: undefined,
    inSrvrSn: "",
    inSrvrGrpCd: "",
    inSrvrNm: "",
    inSrvrUrl: "",
    inSrvrPort: "",
    inUserNm: "",
    inPwd: "",
    inEnIngest: "",
    inEnSys: "",
    inSrvrIpAddr: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<EMSSrvrInputBody>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleRegistration: SubmitHandler<EMSSrvrInputBody> = (data) => {
    if (data.inEmsSrvrSn != undefined) {
      modEmsServerInfo(data);
    } else {
      addEmsServerInfo(data);
    }
  };
  const headleError = (errors: any) => {};

  const tableRef = useRef<ReactTabulator | null>(null);
  const [popTitle, setPopTitle] = useState<String>();
  const [tableData, setTableData] = useState<GrpListData[]>([]);
  const [srvrData, setSrvrData] = useState([]);
  const [btnArow, setBtnArow] = useState(">");

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let grpInfoUrl = `/api/setting/ems/groupListApi`;
  let phySrvrInfoUrl = `/api/setting/srvr/srvrApi`;

  const setDataInfo = async () => {
    btnClick();
    getSrvrInfo();
    getGrpInfo();
    if (modSrvrInfo !== null && modSrvrInfo !== undefined) {
      if (modSrvrInfo.tib_srvr_mntr_yn === "N") {
        setEnIngest(false);
      } else if (modSrvrInfo.tib_srvr_mntr_yn === "Y") {
        setEnIngest(true);
      }
      if (modSrvrInfo.tib_srvr_sys_event_yn === "N") {
        setEnSys(false);
      } else if (modSrvrInfo.tib_srvr_sys_event_yn === "Y") {
        setEnSys(true);
      }
      if (modSrvrInfo.tib_srvr_sn)
        setValue("inEmsSrvrSn", modSrvrInfo.tib_srvr_sn);
      if (modSrvrInfo.alias) setValue("inSrvrNm", modSrvrInfo.alias);
      if (modSrvrInfo.tib_srvr_url) {
        const urlData = modSrvrInfo.tib_srvr_url;
        setValue("inSrvrUrl", urlData);

        let newUrl = urlData.replace("tcp://", "");
        let ip = "";
        let port = "";

        if (newUrl.includes(":")) {
          ip = newUrl.split(":")[0];
          port = newUrl.split(":")[1];
          setValue("inSrvrIpAddr", ip);
          setValue("inSrvrPort", port);
        } else {
          setValue("inSrvrIpAddr", ip);
          setValue("inSrvrPort", "");
        }
      }
      if (modSrvrInfo.username) setValue("inUserNm", modSrvrInfo.username);
      // if (modSrvrInfo.password) setValue("inPwd", modSrvrInfo.password);
      if (modSrvrInfo.pwd_enc) {
        const decodedPassword = atob(modSrvrInfo.pwd_enc);
        setValue("inPwd", decodedPassword);
      }

      setPopTitle("Modify EMS Server");
    } else {
      setPopTitle("Add EMS Server");
    }
  };

  const setSelectBoxInfo = async () => {
    if (modSrvrInfo !== null && modSrvrInfo !== undefined) {
      if (modSrvrInfo.srvr_sn) setValue("inSrvrSn", modSrvrInfo.srvr_sn);
      if (modSrvrInfo.grp_sn) setValue("inSrvrGrpCd", modSrvrInfo.grp_sn);
    }
  };

  useEffect(() => {
    setDataInfo();
    const intervalId = setInterval(() => {
      setSelectBoxInfo();
      clearInterval(intervalId);
    }, 500);
  }, []);

  // useEffect(() => {
  //   if (password) {
  //     setEncodedPassword(Buffer.from(password).toString("base64"));
  //   }
  // }, [password, encodedPassword]);

  const addEmsServerInfo = async (dataVal: any) => {
    try {
      if (confirm(t("MUL_ST_0062") as string)) {
        const inputDataVal = {
          case_method: "POST",
          grp_sn: dataVal.inSrvrGrpCd == "" ? 0 : dataVal.inSrvrGrpCd,
          srvr_sn: dataVal.inSrvrSn,
          tib_srvr_sn: dataVal.inEmsSrvrSn,
          tib_srvr_alias: dataVal.inSrvrNm,
          tib_srvr_url: dataVal.inSrvrUrl,
          tib_user_id: dataVal.inUserNm,
          tib_user_pwd: btoa(dataVal.inPwd),
          tib_srvr_mntr_yn: enIngest ? "Y" : "N",
          tib_srvr_sys_event_yn: enSys ? "Y" : "N",
        };
        console.log(inputDataVal);

        const res = await fetch(srvrInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        const data = await res.json();
        if (data && data.code == "200") {
          alert(t("MUL_ST_0052"));

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
  };

  const modEmsServerInfo = async (dataVal: any) => {
    try {
      if (confirm(t("MUL_ST_0053") as string)) {
        const inputDataVal = {
          case_method: "PATCH",
          be_grp_sn:
            modSrvrInfo.grp_sn == null || modSrvrInfo.grp_sn == ""
              ? 0
              : modSrvrInfo.grp_sn,
          grp_sn:
            dataVal.inSrvrGrpCd == null || dataVal.inSrvrGrpCd == ""
              ? 0
              : dataVal.inSrvrGrpCd,
          srvr_sn: dataVal.inSrvrSn,
          tib_srvr_sn: dataVal.inEmsSrvrSn,
          tib_srvr_alias: dataVal.inSrvrNm,
          tib_srvr_url: dataVal.inSrvrUrl,
          tib_user_id: dataVal.inUserNm,
          tib_user_pwd: btoa(dataVal.inPwd),
          tib_srvr_mntr_yn: enIngest ? "Y" : "N",
          tib_srvr_sys_event_yn: enSys ? "Y" : "N",
        };

        const res = await fetch(srvrInfoUrl, {
          body: JSON.stringify(inputDataVal),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_0054"));
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
  };

  const btnClick = () => {
    const btnVal = document.getElementById("modalId");
    const divMdVal = document.getElementById("divMd");

    var grpAreaVal = document.getElementById("grpArea") as HTMLInputElement;

    if (btnVal?.classList.contains("w_1200") === true) {
      btnVal?.classList.remove("w_1200");
      btnVal?.classList.add("w_500");
      grpAreaVal.style.display = "none";
      divMdVal?.classList.remove("col-md-5");
      divMdVal?.classList.add("col-md-12");
      setBtnArow(">");
    } else {
      getSrvrInfo();
      getGrpInfo();
      btnVal?.classList.remove("w_500");
      btnVal?.classList.add("w_1200");
      grpAreaVal.style.display = "block";
      divMdVal?.classList.remove("col-md-12");
      divMdVal?.classList.add("col-md-5");
      setBtnArow("<");
    }
  };

  const getGrpInfo = async () => {
    try {
      const bodyData = {
        case_method: "GET",
      };

      const res = await fetch(grpInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      setTableData(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  const getSrvrInfo = async () => {
    try {
      const bodyData = {
        case_method: "GET",
      };

      const res = await fetch(phySrvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      setSrvrData(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  const columns: ColumnDefinition[] = [
    {
      title: t("MUL_WD_0047"),
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: "Group Desc",
      field: "grp_desc",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: t("MUL_WD_0104"),
      field: "count",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  const langVal = t("MUL_ST_0009");

  const options: ReactTabulatorOptions = {
    height: 360,
    layout: "fitColumns",
    placeholder: langVal,
  };

  const addNewGrp = async () => {
    try {
      const grpNm = document.getElementById("inGrpNm") as HTMLInputElement;
      const grpDesc = document.getElementById("inGrpDesc") as HTMLInputElement;

      if (grpNm.value && grpNm.value != "") {
        const inData = tableData.some(
          (item: any) => item.grp_nm === grpNm.value
        );

        if (inData) {
          alert(t("MUL_ST_0063"));
        } else {
          if (confirm(t("MUL_ST_0064") as string)) {
            const inputDataVal = {
              case_method: "POST",
              grpNm: grpNm.value,
              description: grpDesc.value,
            };

            const res = await fetch(grpInfoUrl, {
              body: JSON.stringify(inputDataVal),
              method: "POST",
            });

            const data = await res.json();

            if (data && data.code == "200") {
              alert(t("MUL_ST_0065"));
              getGrpInfo();
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
              alert(t("MUL_ST_0066"));
            }
          } else {
            alert(t("MUL_ST_0067"));
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fullUrlChange = (event: any) => {
    let dataVal =
      event.target.options[event.target.selectedIndex].getAttribute("data-sub"); // data-cat
    let defaultUrl = "tcp://";
    let srvrUrl = "";

    if (dataVal && dataVal != null) {
      const urlVal: any = document.getElementById(
        "inSrvrIpAddr"
      ) as HTMLInputElement | null;
      const portVal: any = document.getElementById(
        "inSrvrPort"
      ) as HTMLInputElement | null;

      if (urlVal && urlVal != null) {
        if (portVal && portVal != null) {
          srvrUrl = defaultUrl.concat(dataVal, ":", portVal.value);
        } else {
          srvrUrl = defaultUrl.concat(dataVal);
        }
      } else {
        if (portVal && portVal != "") {
          srvrUrl = defaultUrl.concat(dataVal, ":", portVal.value);
        } else {
          srvrUrl = defaultUrl.concat(dataVal);
        }
      }
      setValue("inSrvrUrl", srvrUrl);
      setValue("inSrvrIpAddr", dataVal);
    } else {
      setValue("inSrvrUrl", "");
      setValue("inSrvrIpAddr", "");
      setValue("inSrvrPort", "");
    }
  };

  const portChange = (event: any) => {
    const defaultUrl = "tcp://";
    const ipAddr: any = document.getElementById(
      "inSrvrIpAddr"
    ) as HTMLInputElement | null;

    const srvrUrl = defaultUrl.concat(ipAddr.value, ":", event.target.value);
    setValue("inSrvrUrl", srvrUrl);
  };

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_1200" id="modalId">
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

              <form onSubmit={handleSubmit(handleRegistration, headleError)}>
                <div className="modal-body">
                  <div className="content__boxed">
                    <div className="row">
                      <div
                        id="divMd"
                        className="col-md-5 justify-content-center"
                      >
                        <div className="row col-md-12 justify-content-center">
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inEmsSrvrSn"
                            >
                              {t("MUL_WD_0047")}
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="text"
                                className="form-control"
                                id="inEmsSrvrSn"
                                {...register("inEmsSrvrSn")}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inSrvrSn"
                            >
                              * {t("MUL_WD_0009")}({t("MUL_WD_0016")})
                            </label>
                            <div className="col-sm-7">
                              <select
                                id="inSrvrSn"
                                className={`form-select ${
                                  errors.inSrvrSn ? "is-invalid" : ""
                                }`}
                                {...register("inSrvrSn")}
                                onChange={fullUrlChange}
                              >
                                <option value="" key="all">
                                  == {t("MUL_WD_0010")} ==
                                </option>
                                {srvrData &&
                                  srvrData.map((dataVal: any) => (
                                    <option
                                      value={dataVal.srvr_sn}
                                      key={dataVal.srvr_alias}
                                      data-sub={dataVal.srvr_ipaddr}
                                    >
                                      {dataVal.srvr_alias}
                                    </option>
                                  ))}
                              </select>
                              <div className="invalid-feedback">
                                {errors.inSrvrSn?.message}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inSrvrGrpCd"
                            >
                              EMS {t("MUL_WD_0009")} {t("MUL_WD_0020")}
                            </label>
                            <div className="col-sm-5">
                              <select
                                id="inSrvrGrpCd"
                                className={`form-select ${
                                  errors.inSrvrGrpCd ? "is-invalid" : ""
                                }`}
                                {...register("inSrvrGrpCd")}
                              >
                                <option value="" key="all">
                                  == {t("MUL_WD_0010")} ==
                                </option>
                                {tableData &&
                                  tableData.map((grpCd: any) => (
                                    <option
                                      value={grpCd.grp_sn}
                                      key={grpCd.grp_nm}
                                    >
                                      {grpCd.grp_nm}
                                    </option>
                                  ))}
                              </select>
                              <div className="invalid-feedback">
                                {errors.inSrvrGrpCd?.message}
                              </div>
                            </div>
                            <div className="col-sm-2">
                              <button
                                type="button"
                                className="btn btn-md btn-gray"
                                id="newBtnId"
                                onClick={() => btnClick()}
                              >
                                new
                              </button>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inSrvrNm"
                            >
                              * EMS {t("MUL_WD_0011")}
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.inSrvrNm ? "is-invalid" : ""
                                }`}
                                id="inSrvrNm"
                                {...register("inSrvrNm")}
                              />
                              <div className="invalid-feedback">
                                {errors.inSrvrNm?.message}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inSrvrUrl"
                            >
                              * EMS Connect Url
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.inSrvrUrl ? "is-invalid" : ""
                                }`}
                                id="inSrvrUrl"
                                {...register("inSrvrUrl")}
                                disabled
                              />
                              <div className="invalid-feedback">
                                {errors.inSrvrUrl?.message}
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-7">
                              <input
                                type="hidden"
                                className="form-control"
                                id="inSrvrIpAddr"
                                {...register("inSrvrIpAddr")}
                              />
                            </div>
                          </div>

                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inSrvrPort"
                            >
                              * Port
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.inSrvrPort ? "is-invalid" : ""
                                }`}
                                id="inSrvrPort"
                                {...register("inSrvrPort")}
                                onChange={portChange}
                              />
                              <div className="invalid-feedback">
                                {errors.inSrvrPort?.message}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inUserNm"
                            >
                              * {t("MUL_WD_0032")}
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.inUserNm ? "is-invalid" : ""
                                }`}
                                id="inUserNm"
                                {...register("inUserNm")}
                              />
                              <div className="invalid-feedback">
                                {errors.inUserNm?.message}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 col-form-label text-end"
                              htmlFor="inPwd"
                            >
                              {t("MUL_WD_0003")}
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="password"
                                className={`form-control ${
                                  errors.inPwd ? "is-invalid" : ""
                                }`}
                                id="inPwd"
                                {...register("inPwd")}
                                // value={password}
                                // onChange={(e) => setPassword(e.target.value)}
                              />
                              <div className="invalid-feedback">
                                {errors.inPwd?.message}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 form-check-label text-end"
                              htmlFor="inEnIngest"
                            >
                              Enable Ingest Data
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="inEnIngest"
                                checked={enIngest}
                                onChange={handleEnIngestChange}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <label
                              className="col-sm-5 form-check-label text-end"
                              htmlFor="inEnSys"
                            >
                              Enable $sys.monitor Event
                            </label>
                            <div className="col-sm-7">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="inEnSys"
                                checked={enSys}
                                onChange={handleEnSysChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="grpArea"
                        className="col-md-7 justify-content-center"
                      >
                        <div className="row col-md-12">
                          <div className="row col-sm-8">
                            <div className="table-responsive">
                              <ReactTabulator
                                key={tableData.length}
                                ref={tableRef}
                                autoResize={false}
                                data={tableData}
                                columns={columns}
                                options={options}
                              />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <div className="mt-2 mb-4">
                              <h4>New Group</h4>
                            </div>
                            <div className="mb-2">
                              <h5>
                                {t("MUL_WD_0020")}
                                {t("MUL_WD_0072")}
                              </h5>
                              <input
                                type="text"
                                id="inGrpNm"
                                className="form-control col-sm-12"
                              />
                            </div>
                            <div className="mb-3">
                              <h5>
                                {t("MUL_WD_0020")} {t("MUL_WD_0105")}
                              </h5>
                              <input
                                type="text"
                                id="inGrpDesc"
                                className="form-control col-sm-12"
                              />
                            </div>
                            <div className="row">
                              <button
                                type="button"
                                className="btn btn-md btn-gray"
                                onClick={() => addNewGrp()}
                              >
                                {t("MUL_WD_0029")}
                              </button>
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
