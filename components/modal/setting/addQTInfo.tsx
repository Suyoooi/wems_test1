import React, { PropsWithChildren, useRef, useState, useEffect } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import type {
  AddQTInputBody,
  EMSSrvrListData,
  PropListData,
} from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  svcGbn: string;
  chVisible: boolean;
  callbackFunction: any;
}

function Modal({
  onClickToggleModal,
  svcGbn,
  chVisible,
  callbackFunction,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const schema = yup.object().shape({
    inSvcNm: yup.string().required(t("MUL_ST_00224") as string),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<AddQTInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<AddQTInputBody> = (data) => {
    addQTInfo(data);
  };
  const headleError = (errors: any) => {};
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<EMSSrvrListData[]>([]);
  const [srvrGrpData, setSrvrGrpData] = useState<PropListData[]>([]);
  const [selected, setSelected] = useState<string>(svcGbn);
  const [svcNm, setSvcNm] = useState(svcGbn);
  const [resultVal, setResultVal] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
  });
  const { sSrvrNm } = searchInfo;

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;

    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let qtInfoUrl = `/api/setting/qtCommApi`;
  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GRP_GET",
        alias: sSrvrNm,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const queuePropData = await res.json();

      const dataInfo = queuePropData[0].data;
      const grpData = queuePropData[1].data;

      setTableData(dataInfo);
      setSrvrGrpData(grpData);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  // 데이터 필터링
  const filteredDataByCategory = selectedCategories.includes("All")
    ? tableData
    : tableData.filter((item: any) => selectedCategories.includes(item.grp_nm));

  useEffect(() => {
    fetchTableData();
  }, []);

  const columns: ColumnDefinition[] = [
    {
      title: "",
      width: 40,
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      cssClass: "text-center",
    },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      width: 100,
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "GroupSn",
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "Group",
      field: "grp_nm",
      width: 100,
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "ServerName",
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  const langVal = t("MUL_ST_0009");

  const options: ReactTabulatorOptions = {
    height: 250,
    width: 100,
    layout: "fitColumns",
    placeholder: langVal,
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
    if (event.target.value == "Queue") {
      setSvcNm("Queue");
    } else if (event.target.value == "Topic") {
      setSvcNm("Topic");
    }
  };

  const handleSelectCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      const updatedCategories = selectedCategories.includes("All")
        ? [category]
        : selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(updatedCategories);

      if (updatedCategories.length === 0) {
        setSelectedCategories(["All"]);
      } else {
        setSelectedCategories(updatedCategories);
      }
    }
  };

  const searchSrvr = async () => {
    try {
      const btnVal = document.getElementsByName("sSrvrGrp");

      var selVal = [];
      for (var i = 0; i < btnVal.length; i++) {
        if (
          btnVal[i].classList.contains("active") === true &&
          btnVal[i].getAttribute("value") != "All"
        ) {
          selVal.push(btnVal[i].getAttribute("value"));
        }
      }

      const bodyData = {
        case_method: "SRVR_GET",
        alias: sSrvrNm,
        grp_sn_list: selVal,
      };

      const res = await fetch(srvrInfoUrl, {
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

  const addQTInfo = async (data: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const srvrNm = selectedData[0].tib_srvr_alias;
      const mapSize = selectedData.length;

      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (svcNm && svcNm === "Queue") {
          confirmVal = svcNm
            .concat(t("MUL_ST_0022"))
            .concat(srvrNm)
            .concat(t("MUL_ST_00142"))
            .concat(mapCnt)
            .concat(t("MUL_ST_00143"));
        } else if (svcNm && svcNm === "Topic") {
          confirmVal = svcNm
            .concat(t("MUL_ST_0021"))
            .concat(srvrNm)
            .concat(t("MUL_ST_00142"))
            .concat(mapCnt)
            .concat(t("MUL_ST_00143"));
        }
      } else {
        if (svcNm && svcNm === "Queue") {
          confirmVal = svcNm
            .concat(t("MUL_ST_0022"))
            .concat(srvrNm)
            .concat("]");
        } else if (svcNm && svcNm === "Topic") {
          confirmVal = svcNm
            .concat(t("MUL_ST_0021"))
            .concat(srvrNm)
            .concat("]");
        }
      }

      if (confirm(confirmVal)) {
        const srvrSnVal: any = [];
        const paramData = selectedData.map((datas: any) => {
          srvrSnVal.push(datas.tib_srvr_sn);
        });

        const paramVal = {
          case_method: "POST",
          emsQT: svcNm.toLowerCase(),
          name: data.inSvcNm,
          tib_srvr_list: srvrSnVal,
        };

        await fetch(qtInfoUrl, {
          body: JSON.stringify(paramVal),
          method: "POST",
        })
          .then(async function (res) {
            const data = await res.json();
            const resultData = data.data;

            if (data && data.code == "200") {
              const textVal = JSON.stringify(resultData);
              let aType = /\[\"/gi;
              let bType = /\"\,\"/gi;
              let cType = /\"\, \"/gi;
              let dType = /\"\]/gi;

              const newText = textVal
                .replace(aType, "")
                .replace(bType, "\n")
                .replace(cType, "\n")
                .replace(dType, "");

              setResultVal(newText);
              callbackFunction(data);
            } else {
              alert(data.msg);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }
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
      alert(t("MUL_ST_0020"));
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_700">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0123")}
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
              <div className="modal-body">
                <div className="content__boxed">
                  <div className="pb-1 col-md-12 boder_bt1">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="radio_queue">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="radio_queue"
                          value="Queue"
                          checked={selected === "Queue"}
                          disabled={chVisible}
                          onChange={handleChange}
                        />
                        Queue
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="radio_topic">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="radio_topic"
                          value="Topic"
                          checked={selected === "Topic"}
                          disabled={chVisible}
                          onChange={handleChange}
                        />
                        Topic
                      </label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="col-md-6 float-start p_5">
                      <h5 className="mt-2">EMS Server</h5>
                      <div className="name_sel name_sel_bg">
                        <div
                          className="gridjs-wrapper custom_butt"
                          style={{ maxHeight: "80px" }}
                        >
                          <button
                            className={
                              selectedCategories.includes("All")
                                ? "name_sel_butt active"
                                : "name_sel_butt"
                            }
                            name="sSrvrGrp"
                            key={"All"}
                            value={"All"}
                            onClick={() => handleSelectCategory("All")}
                          >
                            All
                          </button>
                          {srvrGrpData.map((item: any) => (
                            <button
                              className={
                                selectedCategories.includes(item.grp_nm)
                                  ? "name_sel_butt active"
                                  : "name_sel_butt"
                              }
                              name="sSrvrGrp"
                              key={item.grp_sn}
                              value={item.grp_sn}
                              onClick={() => handleSelectCategory(item.grp_nm)}
                            >
                              {item.grp_nm}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="search_area">
                        <div className="col-sm-11 float-start">
                          <input
                            type="text"
                            className="form-control input_30"
                            id="sSrvrNm"
                            name="sSrvrNm"
                            onChange={onChangeSearch}
                          />
                        </div>
                        <div className="col-sm-1 float-start">
                          <button
                            type="button"
                            className="btn btn-icon btn-deepgray btn_xs_search"
                            onClick={() => searchSrvr()}
                          >
                            <i className="i_search icon-lg fs-5"></i>
                          </button>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <ReactTabulator
                          key={filteredDataByCategory.length}
                          ref={tableRef}
                          autoResize={false}
                          data={filteredDataByCategory}
                          columns={columns}
                          options={options}
                        />
                      </div>
                    </div>
                    <form
                      onSubmit={handleSubmit(handleRegistration, headleError)}
                    >
                      <div className="col-md-6 float-end p_5">
                        <h5 className="mt-2">{svcNm} Name</h5>
                        <div className="col-sm-11 float-start">
                          <input
                            type="text"
                            className={`form-control input_30 ${
                              errors.inSvcNm ? "is-invalid" : ""
                            }`}
                            id="inSvcNm"
                            {...register("inSvcNm")}
                          />
                          <div className="invalid-feedback">
                            {errors.inSvcNm?.message}
                          </div>
                        </div>
                        <div className="col-sm-1 float-start">
                          <button
                            type="submit"
                            className="btn btn-icon btn-deepgray btn_xs_search"
                            disabled={isSubmitting}
                          >
                            <i className="i_add icon-lg fs-5"></i>
                          </button>
                        </div>
                        <h5 className="mt-5" style={{ paddingTop: 20 }}>
                          {t("MUL_WD_0048")}
                        </h5>
                        <div>
                          <textarea
                            id="inResult"
                            className="form-control h_180"
                            placeholder={t("MUL_WD_0048") as string}
                            rows={6}
                            value={resultVal}
                            disabled
                          ></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
