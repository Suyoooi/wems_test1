import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { AddQTInputBody, SrvrListData } from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function AddQTInfo() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const schema = yup.object().shape({
    inSvcNm: yup.string().required(t("MUL_ST_00181") as string),
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<AddQTInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<AddQTInputBody> = (data) => {
    addQTInfo(data);
  };
  const headleError = (errors: any) => {};

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<SrvrListData[]>([]);
  const [selected, setSelected] = useState<string>("Queue");
  const [svcNm, setSvcNm] = useState("Queue");
  const [resultVal, setResultVal] = useState("");

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;
  let qtInfoUrl = `/api/setting/qtCommApi`;
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
    maxHeight: 750,
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
    if (event.target.value == "Queue") {
      setSvcNm("Queue");
    } else if (event.target.value == "Topic") {
      setSvcNm("Topic");
    }
  };

  const addQTInfo = async (data: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const srvrNm = selectedData[0].alias;
      const mapSize = selectedData.length;

      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (svcNm && svcNm === "Queue") {
          if (lang === "en") {
            confirmVal = `Do you want to add ${svcNm}?\n${srvrNm} and ${mapCnt}`;
          } else if (lang === "ko") {
            confirmVal = `${svcNm}를 추가하시겠습니까?\n ${srvrNm} 외 ${mapCnt}건`;
          }
        } else if (svcNm && svcNm === "Topic") {
          // confirmVal = svcNm;
          if (lang === "en") {
            confirmVal = `Do you want to add ${svcNm}?\n${srvrNm} and ${mapCnt}`;
          } else if (lang === "ko") {
            confirmVal = `${svcNm}를 추가하시겠습니까?\n ${srvrNm} 외 ${mapCnt}건`;
          }
        }
      } else {
        if (svcNm && svcNm === "Queue") {
          if (lang === "en") {
            confirmVal = `Do you want to add ${svcNm}?`;
          } else if (lang === "ko") {
            confirmVal = `${svcNm}를 추가하시겠습니까?`;
          }
        } else if (svcNm && svcNm === "Topic") {
          // confirmVal = svcNm;
          if (lang === "en") {
            confirmVal = `Do you want to add ${svcNm}?`;
          } else if (lang === "ko") {
            confirmVal = `${svcNm}를 추가하시겠습니까?`;
          }
        }
      }

      if (confirm(confirmVal)) {
        const srvrSnVal: any = [];
        const paramData = selectedData.map((datas: any) => {
          srvrSnVal.push(datas.tibSrvrSn);
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
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("MUL_WD_0111")}
                </li>
              </ol>
            </nav>
            <h1 className="mb-2 page-title"> {t("MUL_WD_0111")}</h1>
            <p className="lead"></p>
          </div>
        </div>
        <div className="content__boxed">
          <div className="content__wrap">
            <div className="row">
              <div className="col-md-12">
                <div className="form-check form-check-inline">
                  <label htmlFor="field-queue">
                    <input
                      type="radio"
                      value="Queue"
                      checked={selected === "Queue"}
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
                      type="radio"
                      value="Topic"
                      checked={selected === "Topic"}
                      id="field-topic"
                      className="form-check-input"
                      onChange={handleChange}
                    />
                    Topic
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mt-4 card">
                  <div className="card-body">
                    <div className="row">
                      <h6>EMS Server</h6>
                    </div>
                    <input id="inSrvrNm" value={"gpu01"}></input>
                    <div className="mt-4 row">
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mt-4 card">
                  <div className="card-body">
                    <form
                      onSubmit={handleSubmit(handleRegistration, headleError)}
                    >
                      <div className="row">
                        <h6>{svcNm} Name</h6>
                      </div>
                      <div className="row">
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className={`col-sm-6 form-control ${
                              errors.inSvcNm ? "is-invalid" : ""
                            }`}
                            id="inSvcNm"
                            {...register("inSvcNm")}
                          />
                          <div className="invalid-feedback">
                            {errors.inSvcNm?.message}
                          </div>
                        </div>
                        <div className="col-sm-2">
                          <button
                            type="submit"
                            className="btn btn-info btn-md margin-l10"
                            disabled={isSubmitting}
                          >
                            {t("MUL_WD_0029")}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 row">
                        <h6>{t("MUL_WD_0048")}</h6>
                      </div>
                      <textarea
                        id="inResult"
                        className="form-control"
                        placeholder={t("MUL_WD_0048") as string}
                        rows={6}
                        value={resultVal}
                        disabled
                      ></textarea>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
