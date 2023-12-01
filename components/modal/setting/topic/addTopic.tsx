import React, { PropsWithChildren, useRef, useState, useEffect } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import type { AddTopicInputBody, TopicListData } from "@/types/webComm";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  // callbackFunction: any;
}

function Modal({
  onClickToggleModal,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const schema = yup.object().shape({
    inTopicNm: yup.string().required(t("MUL_ST_00184") as string),
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<AddTopicInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<AddTopicInputBody> = (data) => {
    addTopicInfo(data);
  };
  const headleError = (errors: any) => {};
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<TopicListData[]>([]);
  const [selected, setSelected] = useState<string>("topic");
  const [resultVal, setResultVal] = useState("");

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let topicInfoUrl = `/api/setting/qtCommApi`;
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
      if (data && data.code == "200") {
        const dataInfo = data.data;
        setTableData(dataInfo);
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
      title: t("MUL_WD_0020"),
      field: "groupName",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: t("MUL_WD_0069"),
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

  const addTopicInfo = async (data: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const srvrNm = selectedData[0].alias;
      const mapSize = selectedData.length;

      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to add Topic?\nTarget server [ ${srvrNm} ] and ${mapCnt}`;
        } else if (lang === "ko") {
          confirmVal = `Topic 추가하시겠습니까?\n대상 서버 [ ${srvrNm} ] 외 ${mapCnt} 건`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to add a topic?\nTarget server [ ${srvrNm} ]`;
        } else if (lang === "ko") {
          confirmVal = `Topic를 추가하시겠습니까?\n대상 서버 [ ${srvrNm} ]`;
        }
      }

      if (confirm(confirmVal)) {
        const srvrSnVal: any = [];
        const paramData = selectedData.map((datas: any) => {
          srvrSnVal.push(datas.tibSrvrSn);
        });

        const paramVal = {
          case_method: "POST",
          emsQT: "topic",
          name: data.inTopicNm,
          tib_srvr_list: srvrSnVal,
        };

        await fetch(topicInfoUrl, {
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
      <div className="modal-dialog">
        <div className="modal-content" style={{ width: "700px" }}>
          <div className="modal-header">
            <div className="row col-md-12">
              <h5 className="modal-title" id="staticBackdropLabel">
                {t("MUL_WD_0111")}
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
            <div className="row col-md-12">
              <div className="form-check form-check-inline">
                <label htmlFor="field-queue">
                  <input
                    // {...register("inServiceGbn")}
                    type="radio"
                    value="queue"
                    checked={selected === "queue"}
                    id="field-queue"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  Queue
                </label>
              </div>

              <div className="form-check form-check-inline">
                <label htmlFor="field-topic">
                  <input
                    // {...register("inServiceGbn")}
                    type="radio"
                    value="topic"
                    checked={selected === "topic"}
                    id="field-topic"
                    className="form-check-input"
                    onChange={handleChange}
                  />
                  Topic
                </label>
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <h6>EMS Server</h6>
                    </div>
                    <input id="inSrvrNm" value={"gpu01"}></input>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {/* 테이블 시작 */}
                      <div className="table-responsove">
                        <ReactTabulator
                          key={tableData.length}
                          ref={tableRef}
                          autoResize={false}
                          data={tableData}
                          columns={columns}
                          options={options}
                        />
                      </div>
                      {/* END - 테이블 끝 */}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(handleRegistration, headleError)}>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <h6>Topic Name</h6>
                      </div>
                      <input
                        type="text"
                        className={`col-sm-6 form-control ${
                          errors.inTopicNm ? "is-invalid" : ""
                        }`}
                        id="inTopicNm"
                        {...register("inTopicNm")}
                      />
                      <div className="invalid-feedback">
                        {errors.inTopicNm?.message}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-info btn-md margin-l10"
                        disabled={isSubmitting}
                      >
                        {t("MUL_WD_0029")}
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <h6>Result</h6>
                      </div>
                      <textarea
                        id="inResult"
                        className="form-control"
                        placeholder={t("MUL_WD_0048") as string}
                        rows={6}
                        value={resultVal}
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer justify-content-center">
              <div className="flex-wrap gap-2 mt-3 d-flex">
                <button type="submit" className="btn btn-primary btn-lg">
                  Confirm
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
                  {t("MUL_WD_0055")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Backdrop
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }}
      /> */}
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
