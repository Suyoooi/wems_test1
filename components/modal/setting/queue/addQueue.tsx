import React, { PropsWithChildren, useRef, useState, useEffect } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import type { AddQueueInputBody, QueueListData } from "@/types/webComm";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  // callbackFunction: any;
}

function Modal({ onClickToggleModal }: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const schema = yup.object().shape({
    inQueueNm: yup.string().required(t("MUL_ST_00186") as string),
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<AddQueueInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<AddQueueInputBody> = (data) => {
    addQueueInfo(data);
  };
  const headleError = (errors: any) => {};
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<QueueListData[]>([]);
  const [selected, setSelected] = useState<string>("queue");
  const [resultVal, setResultVal] = useState("");

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let queueInfoUrl = `/api/setting/qtCommApi`;
  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GET",
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
      field: "tibSrvrSn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "Group",
      field: "groupName",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "ServerName",
      field: "alias",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  const options = {
    height: 250,
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const addQueueInfo = async (data: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const srvrNm = selectedData[0].alias;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to add a queue?\nTarget server [ ${srvrNm} ] and ${mapCnt} more`;
        } else if (lang === "ko") {
          confirmVal = `Queue를 추가하시겠습니까?\n대상 서버 [ ${srvrNm} ] 외 ${mapCnt} 건`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to add queue?\nTarget server [ {{ srvrNm }} ]`;
        } else if (lang === "ko") {
          confirmVal = `Queue를 추가하시겠습니까?\n대상 서버 [ {{ srvrNm }} ]`;
        }
      }

      if (confirm(confirmVal)) {
        const srvrSnVal: any = [];
        selectedData.map((datas: any) => {
          srvrSnVal.push(datas.tibSrvrSn);
        });

        const paramVal = {
          case_method: "POST",
          emsQT: "queue",
          name: data.inQueueNm,
          tib_srvr_list: srvrSnVal,
        };

        await fetch(queueInfoUrl, {
          body: JSON.stringify(paramVal),
          method: "POST",
        })
          .then(async function (res) {
            const data = await res.json();
            if (data && data.code == "200") {
              const resultData = data.data;
              const textVal = JSON.stringify(resultData);
              let aType = /\[\"/gi;
              let cType = /\"\, \"/gi;
              let dType = /\"\]/gi;

              const newText = textVal
                .replace(aType, "")
                .replace(cType, "\n")
                .replace(dType, "");

              setResultVal(newText);
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
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    } else {
      alert(t("MUL_ST_0092"));
    }
  };

  return (
    <ModalContainer>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0111")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
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
                          value="queue"
                          checked={selected === "queue"}
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
                          value="topic"
                          checked={selected === "topic"}
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
                        <a href="" className="name_sel_butt active">
                          All
                        </a>
                        <a href="" className="name_sel_butt">
                          ems-special-Grp1
                        </a>
                        <a href="" className="name_sel_butt">
                          ems-special-Grp1
                        </a>
                        <a href="" className="name_sel_butt">
                          Grap1
                        </a>
                        <a href="" className="name_sel_butt">
                          Grap2
                        </a>
                        <a href="" className="name_sel_butt">
                          ServerEMS1
                        </a>
                      </div>

                      <div className="search_area">
                        <div className="col-sm-11 float-start">
                          <input
                            type="text"
                            className="form-control input_30"
                          />
                        </div>
                        <div className="col-sm-1 float-start">
                          <button
                            type="button"
                            className="btn btn-icon btn-deepgray btn_xs_search"
                          >
                            <i className="i_search icon-lg fs-5"></i>
                          </button>
                        </div>
                      </div>

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

                    <form
                      onSubmit={handleSubmit(handleRegistration, headleError)}
                    >
                      <div className="col-md-6 float-end p_5">
                        <h5 className="mt-2">Queue {t("MUL_WD_0072")}</h5>
                        <div className="col-sm-11 float-start">
                          <input
                            type="text"
                            className={`form-control input_30 ${
                              errors.inQueueNm ? "is-invalid" : ""
                            }`}
                            id="inQueueNm"
                            {...register("inQueueNm")}
                          />
                          <div className="invalid-feedback">
                            {errors.inQueueNm?.message}
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
                        <h5 className="mt-5">Result</h5>
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
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
`;

export default Modal;
