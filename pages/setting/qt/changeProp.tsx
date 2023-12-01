import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { PropListData } from "@/types/webComm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const topicColumns: ColumnDefinition[] = [
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
    hozAlign: "center",
  },
  {
    title: "Topic",
    field: "topic_name",
    headerTooltip: true,
    hozAlign: "center",
  },
];

const queueColumns: ColumnDefinition[] = [
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
    hozAlign: "center",
  },
  {
    title: "Queue",
    field: "queue_name",
    headerTooltip: true,
    hozAlign: "center",
  },
];

export default function ChangeProp() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const tableRef = useRef<ReactTabulator | null>(null);
  const propTableRef = useRef<ReactTabulator | null>(null);
  const resTableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<PropListData[]>([]);
  const [queueTableData, setQueueTableData] = useState<PropListData[]>([]);
  const [topicTableData, setTopicTableData] = useState<PropListData[]>([]);
  const [queuePropData, setQueuePropData] = useState<PropListData[]>([]);
  const [topicPropData, setTopicPropData] = useState<PropListData[]>([]);
  const [resTableData, setResTableData] = useState<PropListData[]>([]);
  const [propTableData, setPropTableData] = useState<PropListData[]>([]);
  const [selected, setSelected] = useState<string>("Queue");
  const [svcNm, setSvcNm] = useState("Queue");
  const [columns, setColumns] = useState(queueColumns);
  const [propKeyData, setPropKeyData] = useState("");
  const [resultVal, setResultVal] = useState("");

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sQtNm: "",
  });
  const { sSrvrNm, sQtNm } = searchInfo;

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;
    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  let qtInfoUrl = `/api/setting/qtCommApi`;
  let queuePropUrl = `/api/setting/queue/propertyApi`;
  let topicPropUrl = `/api/setting/topic/propertyApi`;

  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        alias: sSrvrNm,
        name: sQtNm,
      };

      const queueRes = await fetch(qtInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const dataVal = await queueRes.json();
      const qListData = dataVal[0].data;
      const tListData = dataVal[1].data;
      const qPropData = dataVal[2].data;
      const tPropData = dataVal[3].data;

      const qListDataVal: any = [];
      qListData.map((qData: any) => {
        if (!qData.queue_name.includes("$sys")) {
          qListDataVal.push(qData);
        }
      });

      const tListDataVal: any = [];
      tListData.map((tData: any) => {
        if (!tData.topic_name.includes("$sys")) {
          tListDataVal.push(tData);
        }
      });

      const qPropDataVal: any = [];
      var qKeys = Object.keys(qPropData);
      for (var i = 0; i < qKeys.length; i++) {
        var key = qKeys[i];
        let concatVal: any = {};
        concatVal.key = key;
        concatVal.value = qPropData[key];
        qPropDataVal.push(concatVal);
      }

      const tPropDataVal: any = [];
      var tKeys = Object.keys(tPropData);
      for (var i = 0; i < tKeys.length; i++) {
        var key = tKeys[i];
        let concatVal: any = {};
        concatVal.key = key;
        concatVal.value = tPropData[key];
        tPropDataVal.push(concatVal);
      }

      setQueueTableData(qListDataVal);
      setTopicTableData(tListDataVal);

      setQueuePropData(qPropDataVal);
      setTopicPropData(tPropDataVal);

      setPropTableData(qPropDataVal);

      if (selected && selected == "Topic") {
        setTableData(tListDataVal);
      } else {
        setTableData(qListDataVal);
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleChange = (event: any) => {
    setSelected(event.target.value);
    if (event.target.value == "Queue") {
      setSvcNm("Queue");
      setColumns(queueColumns);
      setTableData(queueTableData);
      setPropTableData(queuePropData);
      setResTableData([]);
    } else if (event.target.value == "Topic") {
      setSvcNm("Topic");
      setColumns(topicColumns);
      setTableData(topicTableData);
      setPropTableData(topicPropData);
      setResTableData([]);
    }
  };

  const options = {
    height: 345,
    layout: "fitColumns",
    placeholder: t("MUL_WD_0137"),
  };

  const propColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const propOptions: any = {
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
    { title: "Name", field: "name", headerTooltip: true },
    { title: "Property", field: "property", headerTooltip: true },
    { title: "Current Value", field: "currentVal", headerTooltip: true },
    {
      title: "New Value",
      field: "newVal",
      headerTooltip: true,
      editor: "input",
    },
  ];

  const resOptions = {
    maxHeight: 400,
    layout: "fitColumns",
    placeholder: t("MUL_WD_0137"),
  };

  const rowClick = async (e: any, row: any) => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    try {
      if (selectedData != "") {
        const propDataVal = row.getData();

        // 선택한 열에만 배경색 적용
        propTableRef.current?.table.getRows().forEach((row: any) => {
          row.getElement().style.backgroundColor = "";
        });
        row.getElement().style.backgroundColor = "#ffdedb";

        const vals = propDataVal.key;

        let newStr = vals.replace(/^[A-Z]/, (val: string) => val.toLowerCase());

        var radios: any = document.getElementsByName("radioField");
        var sel_type = null;
        for (var i = 0; i < radios.length; i++) {
          if (radios[i].checked === true) {
            sel_type = radios[i].value;
          }
        }

        let cast_type = "";
        let srvrListVal: any = [];
        if (sel_type && sel_type == "Queue") {
          cast_type = "QU_PROP";
          selectedData.map((datas: any) => {
            let concatVal: any = {};
            concatVal.tib_srvr_sn = datas.tib_srvr_sn;
            concatVal.queue_nm = datas.queue_name;
            srvrListVal.push(concatVal);
          });
        } else if (sel_type && sel_type == "Topic") {
          cast_type = "TO_PROP";
          selectedData.map((datas: any) => {
            let concatVal: any = {};
            concatVal.tib_srvr_sn = datas.tib_srvr_sn;
            concatVal.topic_nm = datas.topic_name;
            srvrListVal.push(concatVal);
          });
        }

        const bodyData = {
          case_method: cast_type,
          info: srvrListVal,
          property: newStr,
        };

        const res = await fetch(qtInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();
        const dataInfo = data.data;
        const propKey = propDataVal.key;

        const propListVal: any = [];
        var keys = Object.keys(dataInfo);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          let concatVal: any = {};
          const data = dataInfo[key];

          concatVal.tib_srvr_sn = data.tib_srvr_sn;
          if (sel_type && sel_type == "Queue") {
            concatVal.name = data.queue_nm;
          } else if (sel_type && sel_type == "Topic") {
            concatVal.name = data.topic_nm;
          } else {
            concatVal.name = "";
          }

          concatVal.property = propKey;
          concatVal.currentVal = data[propKey];
          propListVal.push(concatVal);
        }

        setPropKeyData(propKey);
        setResTableData(propListVal);
      } else {
        alert(t("MUL_ST_0004"));
      }
    } catch (e) {
      console.log(e);
    }

    // if (selectedData != "") {
    //   const propDataVal = row.getData();

    //   // 선택한 열에만 배경색 적용
    //   propTableRef.current?.table.getRows().forEach((row: any) => {
    //     row.getElement().style.backgroundColor = "";
    //   });
    //   row.getElement().style.backgroundColor = "#ffdedb";

    //   const vals = propDataVal.key;

    //   let newStr = vals.replace(/^[A-Z]/, (val: string) => val.toLowerCase());

    //   var radios: any = document.getElementsByName("radioField");
    //   var sel_type = null;
    //   for (var i = 0; i < radios.length; i++) {
    //     if (radios[i].checked === true) {
    //       sel_type = radios[i].value;
    //     }
    //   }

    //   let cast_type = "";
    //   let srvrListVal: any = [];
    //   if (sel_type && sel_type == "Queue") {
    //     cast_type = "QU_PROP";
    //     selectedData.map((datas: any) => {
    //       let concatVal: any = {};
    //       concatVal.tib_srvr_sn = datas.tib_srvr_sn;
    //       concatVal.queue_nm = datas.queue_name;
    //       srvrListVal.push(concatVal);
    //     });
    //   } else if (sel_type && sel_type == "Topic") {
    //     cast_type = "TO_PROP";
    //     selectedData.map((datas: any) => {
    //       let concatVal: any = {};
    //       concatVal.tib_srvr_sn = datas.tib_srvr_sn;
    //       concatVal.topic_nm = datas.topic_name;
    //       srvrListVal.push(concatVal);
    //     });
    //   }

    //   const bodyData = {
    //     case_method: cast_type,
    //     info: srvrListVal,
    //     property: newStr,
    //   };

    //   const res = await fetch(qtInfoUrl, {
    //     body: JSON.stringify(bodyData),
    //     method: "POST",
    //   });

    //   const data = await res.json();
    //   const dataInfo = data.data;
    //   const propKey = propDataVal.key;

    //   const propListVal: any = [];
    //   var keys = Object.keys(dataInfo);
    //   for (var i = 0; i < keys.length; i++) {
    //     var key = keys[i];
    //     let concatVal: any = {};
    //     const data = dataInfo[key];

    //     concatVal.tib_srvr_sn = data.tib_srvr_sn;
    //     if (sel_type && sel_type == "Queue") {
    //       concatVal.name = data.queue_nm;
    //     } else if (sel_type && sel_type == "Topic") {
    //       concatVal.name = data.topic_nm;
    //     } else {
    //       concatVal.name = "";
    //     }

    //     concatVal.property = propKey;
    //     concatVal.currentVal = data[propKey];
    //     propListVal.push(concatVal);
    //   }

    //   setPropKeyData(propKey);
    //   setResTableData(propListVal);
    // } else {
    //   alert(t("MUL_ST_0004"));
    // }
  };

  const searchData = async () => {
    fetchTableData();
  };

  const modPropInfo = async () => {
    const tableInfo: any = resTableRef.current;
    const tableData = tableInfo.table.getData();
    let newStr = propKeyData.replace(/^[A-Z]/, (val: string) =>
      val.toLowerCase()
    );

    if (tableData != "") {
      var radios: any = document.getElementsByName("radioField");
      var sel_type = null;
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked === true) {
          sel_type = radios[i].value;
        }
      }

      let url = "";
      if (sel_type && sel_type == "Queue") {
        url = queuePropUrl;
      } else if (sel_type && sel_type == "Topic") {
        url = topicPropUrl;
      }

      const newValArr: any = [];
      tableData.map((datas: any, idx: number) => {
        if (datas.newVal && datas.newVal != "") {
          let concatVal: any = {};
          concatVal.name = datas.name;
          concatVal.srvr_sn = datas.tib_srvr_sn;
          concatVal.value = datas.newVal;
          newValArr.push(concatVal);
        }
      });

      const bodyData = {
        case_method: "PUT",
        property: newStr,
        set_prop_list: newValArr,
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data.code && data.code == "200") {
        alert(t("MUL_ST_0038"));

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
        refreshPropInfo();
      } else {
        alert(t("MUL_ST_0039"));
      }
    }
  };

  const refreshPropInfo = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData != "") {
      const propDataVal = propKeyData;

      const vals = propDataVal;

      let newStr = vals.replace(/^[A-Z]/, (val: string) => val.toLowerCase());

      var radios: any = document.getElementsByName("radioField");
      var sel_type = null;
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked === true) {
          sel_type = radios[i].value;
        }
      }

      let cast_type = "";
      let srvrListVal: any = [];
      if (sel_type && sel_type == "Queue") {
        cast_type = "QU_PROP";
        selectedData.map((datas: any) => {
          let concatVal: any = {};
          concatVal.tib_srvr_sn = datas.tib_srvr_sn;
          concatVal.queue_nm = datas.queue_name;
          srvrListVal.push(concatVal);
        });
      } else if (sel_type && sel_type == "Topic") {
        cast_type = "TO_PROP";
        selectedData.map((datas: any) => {
          let concatVal: any = {};
          concatVal.tib_srvr_sn = datas.tib_srvr_sn;
          concatVal.topic_nm = datas.topic_name;
          srvrListVal.push(concatVal);
        });
      }

      const bodyData = {
        case_method: cast_type,
        info: srvrListVal,
        property: newStr,
      };

      const res = await fetch(qtInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      const propKey = propDataVal;

      const propListVal: any = [];
      var keys = Object.keys(dataInfo);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        let concatVal: any = {};
        const data = dataInfo[key];

        concatVal.tib_srvr_sn = data.tib_srvr_sn;
        if (sel_type && sel_type == "Queue") {
          concatVal.name = data.queue_nm;
        } else if (sel_type && sel_type == "Topic") {
          concatVal.name = data.topic_nm;
        } else {
          concatVal.name = "";
        }

        concatVal.property = propKey;
        concatVal.currentVal = data[propKey];
        propListVal.push(concatVal);
      }

      setPropKeyData(propKey);
      setResTableData(propListVal);
    } else {
      alert(t("MUL_ST_0004"));
    }
  };

  return (
    <>
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item" style={{ fontWeight: "bold" }}>
                  Queue/Topic
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Q/T {t("MUL_WD_0050")}
                </li>
              </ol>
            </nav>

            <h1 className="mt-2 mb-0 page-title"> Q/T {t("MUL_WD_0050")}</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 col-md-12">
                <div className="row">
                  <div className="pb-1 mt-3 col-md-12 boder_bt1">
                    <div className="form-check form-check-inline">
                      <label htmlFor="field-queue">
                        <input
                          type="radio"
                          value="Queue"
                          checked={selected === "Queue"}
                          id="field-queue"
                          name="radioField"
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
                          name="radioField"
                          className="form-check-input"
                          onChange={handleChange}
                        />
                        Topic
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-3 col-md-12 row">
                  <div className="col-md-3">
                    <div className="row">
                      <label
                        className="col-sm-3 col-form-label text-sm-end"
                        htmlFor="sSrvrNm"
                      >
                        EMS {t("MUL_WD_0009")}
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          id="sSrvrNm"
                          name="sSrvrNm"
                          onChange={onChangeSearch}
                        />
                      </div>
                    </div>
                    <div className="mt-2 row">
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          id="sQtGbn"
                          name="sQtGbn"
                          value={svcNm}
                          disabled
                        />
                      </div>
                      <div className="col-sm-9">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control input_radius_r"
                            id="sQtNm"
                            name="sQtNm"
                            onChange={onChangeSearch}
                          />
                          <button
                            type="button"
                            className="btn btn-icon btn-deepgray input_radius_l"
                            onClick={() => searchData()}
                          >
                            <i className="i_xs_search"></i>
                          </button>
                        </div>
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
                  <div className="col-md-9">
                    <h4 className="title_color">{t("MUL_WD_0017")}</h4>
                    <div className="row co-sm-12">
                      <div className="col-sm-4">
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
                      <div className="col-sm-7">
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
                  </div>
                </div>
                <div className="row">
                  <div className="justify-content-center d-flex">
                    <button
                      type="button"
                      className="btn btn-md btn-deepgray"
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
        </div>
      </section>
    </>
  );
}
