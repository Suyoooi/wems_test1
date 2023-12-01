import React, { useRef, useState, useEffect } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { SrvrPropListData, PropListData } from "@/types/webComm";
import Image from "next/image";
import { parseCookies } from "nookies";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function EmsServerProp() {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const propTableRef = useRef<ReactTabulator | null>(null);
  const resTableRef = useRef<ReactTabulator | null>(null);

  const [tableData, setTableData] = useState<PropListData[]>([]);
  const [propTableData, setPropTableData] = useState<SrvrPropListData[]>([]);
  const [resTableData, setResTableData] = useState<SrvrPropListData[]>([]);
  const [propKeyData, setPropKeyData] = useState("");
  const [resultVal, setResultVal] = useState("");

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

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;

  const fetchTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "MT_PROP",
        alias: sSrvrNm,
        accToken: accessToken,
      };

      const queueRes = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const srvrInfoData = await queueRes.json();
      const sData = srvrInfoData[0].data;
      const pData = srvrInfoData[1].data;

      const srvrInfo: any = [];
      const paramData = sData.map((datas: any) => {
        const status = datas.status;
        if (status) {
          srvrInfo.push(datas);
        }
      });

      const propDataVal: any = [];
      var pKeys = Object.keys(pData);
      for (var i = 0; i < pKeys.length; i++) {
        var key = pKeys[i];
        let concatVal: any = {};
        concatVal.key = key;
        concatVal.value = pData[key];
        propDataVal.push(concatVal);
      }

      setTableData(srvrInfo);
      setPropTableData(propDataVal);
      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
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
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "ServerName",
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "left",
    },
  ];

  const options: ReactTabulatorOptions = {
    maxHeight: 400,
    layout: "fitColumns",
    placeholder: t("MUL_WD_0137"),
  };

  const propColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Type", field: "value", headerTooltip: true },
  ];

  const propOptions: ReactTabulatorOptions = {
    maxHeight: 400,
    layout: "fitColumns",
  };

  const resColumns: ColumnDefinition[] = [
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "ServerName",
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: "Property",
      field: "property",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: "Current Value",
      field: "currentVal",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: "New Value",
      field: "newVal",
      headerTooltip: true,
      editor: "input",
      hozAlign: "left",
    },
  ];

  const resOptions: ReactTabulatorOptions = {
    maxHeight: 400,
    layout: "fitColumns",
    placeholder: t("MUL_WD_0137"),
  };

  const searchData = async () => {
    fetchTableData();
  };

  const rowClick = async (e: any, row: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      // 선택한 열에만 배경색 적용
      propTableRef.current?.table.getRows().forEach((row: any) => {
        row.getElement().style.backgroundColor = "";
      });
      row.getElement().style.backgroundColor = "#ffdedb";

      const srvrSnVal: any = [];
      const paramData = selectedData.map((datas: any) => {
        srvrSnVal.push(datas.tib_srvr_sn);
      });

      const srvrPropVal = row.getData();

      const paramVal = {
        case_method: "SRVR_PROP",
        tib_srvr_list: srvrSnVal,
      };

      await fetch(srvrInfoUrl, {
        body: JSON.stringify(paramVal),
        method: "POST",
      })
        .then(async function (res) {
          const data = await res.json();
          const resData = data.data;

          const propKey = srvrPropVal.key;
          const propKeyVal = propKey.replace(/[A-Z]/g, (str: string) =>
            str === str.toUpperCase()
              ? "_".concat(str.toLowerCase())
              : str.toLowerCase()
          );

          const propDataVal: any = [];
          var pKeys = Object.keys(resData);
          for (var i = 0; i < pKeys.length; i++) {
            var key = pKeys[i];
            let concatVal: any = {};
            const data = resData[key];

            concatVal.tib_srvr_sn = data.tib_srvr_sn;
            concatVal.tib_srvr_alias = data.tib_srvr_alias;
            concatVal.grp_nm = data.grp_nm;
            concatVal.property = propKey;
            concatVal.currentVal = data[propKey];
            propDataVal.push(concatVal);
          }

          setPropKeyData(propKey);
          setResTableData(propDataVal);
        })
        .catch(function (e) {
          console.log(e);
        });
    } else {
      alert(t("MUL_ST_0004"));
    }
  };

  const getSrvrProp = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const srvrSnVal: any = [];
      const paramData = selectedData.map((datas: any) => {
        srvrSnVal.push(datas.tib_srvr_sn);
      });

      const srvrPropVal = propKeyData;

      const paramVal = {
        case_method: "SRVR_PROP",
        tib_srvr_list: srvrSnVal,
      };

      await fetch(srvrInfoUrl, {
        body: JSON.stringify(paramVal),
        method: "POST",
      })
        .then(async function (res) {
          const data = await res.json();
          const resData = data.data;
          const propKey = srvrPropVal;
          const propKeyVal = propKey.replace(/[A-Z]/g, (str: string) =>
            str === str.toUpperCase()
              ? "_".concat(str.toLowerCase())
              : str.toLowerCase()
          );

          const propDataVal: any = [];
          var pKeys = Object.keys(resData);
          for (var i = 0; i < pKeys.length; i++) {
            var key = pKeys[i];
            let concatVal: any = {};
            const data = resData[key];

            concatVal.tib_srvr_sn = data.tib_srvr_sn;
            concatVal.tib_srvr_alias = data.tib_srvr_alias;
            concatVal.grp_nm = data.grp_nm;
            concatVal.property = propKey;
            concatVal.currentVal = data[propKey];
            propDataVal.push(concatVal);
          }

          setPropKeyData(propKey);
          setResTableData(propDataVal);
        })
        .catch(function (e) {
          console.log(e);
        });
    } else {
      alert(t("MUL_ST_0004"));
    }
  };

  const modPropInfo = async () => {
    const tableInfo: any = resTableRef.current;
    const tableData = tableInfo.table.getData();

    const srvrTableInfo: any = tableRef.current;
    const selectedData = srvrTableInfo.table.getSelectedData();

    // const propTableInfo: any = propTableRef.current;
    // const propSelData = propTableInfo.table.getSelectedData();

    if (selectedData != "") {
      // if (propSelData != "") {
      if (tableData != "") {
        const newValArr: any = [];
        tableData.map((datas: any, idx: number) => {
          if (datas.newVal && datas.newVal != "") {
            let concatVal: any = {};
            concatVal.srvr_sn = datas.tib_srvr_sn;
            concatVal.value = datas.newVal;
            newValArr.push(concatVal);
          }
        });

        const bodyData = {
          case_method: "SET_PROP",
          property: propKeyData,
          srvr_info_list: newValArr,
          accToken: accessToken,
        };

        const res = await fetch(srvrInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data.code && data.code == "200") {
          alert(t("MUL_ST_0093"));

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
          getSrvrProp();
        } else {
          alert(t("MUL_ST_0094"));
        }
      }
      // } else {
      //   alert(t("MUL_ST_00234"));
      // }
    } else {
      alert(t("MUL_ST_0004"));
    }
  };

  return (
    <>
      {/* {isLoading && <Loading />} */}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  EMS {t("MUL_WD_0009")}
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("MUL_WD_0092")}
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">{t("MUL_WD_0092")}</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box">
                <div className="row col-md-10 justify-content-center">
                  <label
                    className="col-sm-4 col-form-label text-sm-end"
                    htmlFor="sSrvrNm"
                  >
                    EMS {t("MUL_WD_0009")}
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      id="sSrvrNm"
                      name="sSrvrNm"
                      onChange={onChangeSearch}
                    />
                  </div>
                  <div className="col-sm-2">
                    <button
                      type="button"
                      className="gap-2 btn btn-dark hstack"
                      onClick={() => searchData()}
                    >
                      <i className="i_view_search fs-5"></i>
                      {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 row col-md-12">
                <div className="col-sm-2">
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
                <div className="col-sm-3">
                  <div className="custom-selectable table-responsive">
                    <ReactTabulator
                      key={propTableData.length}
                      ref={propTableRef}
                      autoResize={false}
                      data={propTableData}
                      columns={propColumns}
                      options={propOptions}
                      events={{
                        rowClick: rowClick,
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-1 d-flex justify-content-center img_center">
                  <Image
                    src={"/assets/img/user_img/img_next.png"}
                    alt={"변환"}
                    width={11}
                    height={18}
                  />
                </div>
                <div className="col-sm-6">
                  <div className="table-responsive">
                    <ReactTabulator
                      key={resTableData.length}
                      ref={resTableRef}
                      autoResize={false}
                      data={resTableData}
                      columns={resColumns}
                      options={resOptions}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 row justify-content-center">
                <div className="col-sm-2">
                  <button
                    type="button"
                    className="btn btn-lg btn-deepgray"
                    onClick={() => modPropInfo()}
                  >
                    {t("MUL_WD_0024")}
                  </button>
                </div>
              </div>

              <div className="mt-3 col-md-12">
                <h4 className="title_color">{t("MUL_WD_0048")}</h4>
              </div>
              <div className="mt-2 col-md-12 name_sel_bg p_10">
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
        </div>
      </section>
    </>
  );
}
