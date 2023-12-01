import React, { PropsWithChildren, useRef, useState, useEffect } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import type {
  DurableInputBody,
  SrvrListData,
  PropListData,
} from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TopicDropdown from "@/components/dropdown/TopicDropdown";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  durableInfoVal: any;
  callbackFunction: any;
}

function Modal({
  onClickToggleModal,
  durableInfoVal,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  let srvrInfoUrl = `/api/setting/srvr/srvrApi`;
  let emsSrvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let durableInfoUrl = `/api/setting/durable/durableListApi`;
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<SrvrListData[]>([]);
  const [srvrGrpData, setSrvrGrpData] = useState<PropListData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [srvrSn, setSrvrSn] = useState();
  const [clickVal, setClickVal] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const schema = yup.object().shape({
    inSrvrSn: yup.number().required().default(null),
    inSrvrNm: yup.string().required(t("MUL_ST_00182") as string),
    inDurableNm: yup.string().required(t("MUL_ST_00183") as string),
    inTopicNm: yup.string().required(t("MUL_ST_00184") as string),
    inClientID: yup.string().default(""),
    inSelector: yup.string().default(""),
  });

  const defaultValues = {
    inSrvrNm: "",
    inDurableNm: "",
    inTopicNm: "",
    inClientID: "",
    inSelector: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<DurableInputBody>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleRegistration: SubmitHandler<DurableInputBody> = (data) => {
    createDurableInfo(data);
  };
  const headleError = (errors: any) => {};

  const [inputData, setInputData] = useState({
    inSrvrNm: "",
    inDurableNm: "",
    inTopicNm: "",
    inClientID: "",
    inSelector: "",
  });

  const { inSrvrNm, inDurableNm, inClientID, inSelector } = inputData;

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
  });
  const { sSrvrNm } = searchInfo;

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;

    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  // 그룹 및 서버 목록 조회
  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GRP_GET",
      };

      const res = await fetch(emsSrvrInfoUrl, {
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

  const options = {
    height: 250,
    width: 100,
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
  };

  // 서버 검색
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

      const res = await fetch(emsSrvrInfoUrl, {
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

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // server 선택
  const rowClick = async (e: any, row: any) => {
    const srvrDataVal = row.getData();

    // 선택한 열에만 배경색 적용
    tableRef.current?.table.getRows().forEach((row: any) => {
      row.getElement().style.backgroundColor = "";
    });
    row.getElement().style.backgroundColor = "#ffdedb";

    setValue("inSrvrSn", srvrDataVal.tib_srvr_sn);
    setValue("inSrvrNm", srvrDataVal.tib_srvr_alias);

    setClickVal(0);

    setSrvrSn(srvrDataVal.tib_srvr_sn);
  };

  // Durable 등록
  async function createDurableInfo(dataVal: any) {
    try {
      const inData = durableInfoVal.some(
        (item: any) =>
          item.tib_srvr_sn === dataVal.inSrvrSn &&
          item.durab_nm === dataVal.inDurableNm
      );

      if (inData) {
        alert(t("MUL_ST_00226"));
      } else {
        if (confirm(t("MUL_ST_0030") as string)) {
          const inputDataVal = {
            case_method: "POST",
            tib_srvr_sn: dataVal.inSrvrSn,
            durable_name: dataVal.inDurableNm,
            topic_name: dataVal.inTopicNm,
            client_id: dataVal.inClientID,
            selector: dataVal.inSelector,
          };

          const res = await fetch(durableInfoUrl, {
            body: JSON.stringify(inputDataVal),
            method: "POST",
          });

          const data = await res.json();

          if (data && data.code == 200) {
            alert(t("MUL_ST_0032"));

            if (onClickToggleModal) {
              onClickToggleModal();
            }

            callbackFunction(data);
          } else {
            alert(t("MUL_ST_0033"));
          }
        }
      }
    } catch (e) {
      console.log(e);
      alert(t("MUL_ST_0034"));
    }
  }

  const topicSelected = (data: any) => {
    if (data && data != "") {
      setValue("inTopicNm", data);
    } else {
      setValue("inTopicNm", "");
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_800">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0138")}
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
                />
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12 justify-content-center">
                    <div className="col-md-6">
                      <h5 className="mt-2">EMS {t("MUL_WD_0009")}</h5>
                      <div className="name_sel">
                        <div className="gridjs-wrapper custom_butt">
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
                      <div className="custom-selectable table-responsive">
                        <ReactTabulator
                          key={filteredDataByCategory.length}
                          ref={tableRef}
                          autoResize={false}
                          data={filteredDataByCategory}
                          columns={columns}
                          options={options}
                          events={{
                            rowClick: rowClick,
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <form
                        onSubmit={handleSubmit(handleRegistration, headleError)}
                      >
                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
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
                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="inSrvrNm"
                          >
                            {t("MUL_WD_0011")}
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.inSrvrNm ? "is-invalid" : ""
                              }`}
                              id="inSrvrNm"
                              {...register("inSrvrNm")}
                              disabled
                            />
                            <div className="invalid-feedback">
                              {errors.inSrvrNm?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="inDurableNm"
                          >
                            * Durable {t("MUL_WD_0072")}
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.inDurableNm ? "is-invalid" : ""
                              }`}
                              id="inDurableNm"
                              {...register("inDurableNm")}
                            />
                            <div className="invalid-feedback">
                              {errors.inDurableNm?.message}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="inTopicNm"
                          >
                            * Topic {t("MUL_WD_0072")}
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="hidden"
                              className={`form-control ${
                                errors.inTopicNm ? "is-invalid" : ""
                              }`}
                              id="inTopicNm"
                              {...register("inTopicNm")}
                            />
                            <TopicDropdown
                              topicSelected={topicSelected}
                              cleanVal={clickVal}
                              serverData={srvrSn}
                            />
                            <div className="invalid-feedback">
                              {errors.inTopicNm?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="inClientID"
                          >
                            Client Id
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.inClientID ? "is-invalid" : ""
                              }`}
                              id="inClientID"
                              {...register("inClientID")}
                            />
                            <div className="invalid-feedback">
                              {errors.inClientID?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 row col-sm-12">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="inSelector"
                          >
                            Selector
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.inSelector ? "is-invalid" : ""
                              }`}
                              id="inSelector"
                              {...register("inSelector")}
                            />
                            <div className="invalid-feedback">
                              {errors.inSelector?.message}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
