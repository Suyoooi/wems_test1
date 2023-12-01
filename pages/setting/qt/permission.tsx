import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ReactTabulator, ColumnDefinition } from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { PermissionData, PropListData } from "@/types/webComm";
import CheckboxTree from "react-checkbox-tree";
import { QueuePermNode, TopicPermNode } from "@/types/qtPermission";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox,
  MdFolder,
  MdFolderOpen,
} from "react-icons/md";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const queueNodes = QueuePermNode;
const topicNodes = TopicPermNode;

export default function SrvrPropInfo() {
  const tableRef = useRef<ReactTabulator | null>(null);
  const guTableRef = useRef<ReactTabulator | null>(null);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [selected, setSelected] = useState<string>("Queue");
  const [svcNm, setSvcNm] = useState("Queue");
  const [tableData, setTableData] = useState<PropListData[]>([]);
  const [grpUserData, setGrpUserData] = useState([]);
  const [rowInfoData, setRowInfoData] = useState<PermissionData>();
  const [queueTableData, setQueueTableData] = useState<PropListData[]>([]);
  const [topicTableData, setTopicTableData] = useState<PropListData[]>([]);
  // const [nodeData, setNodeData] = useState<any>([]);

  const [checked, setChecked] = useState<any>([]);
  const [expanded, setExpanded] = useState<any>([]);

  const [resultVal, setResultVal] = useState("");

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sQtNm: "",
  });
  const { sSrvrNm, sQtNm } = searchInfo;

  const topicColumns: ColumnDefinition[] = [
    // { title: "", width: 40, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", frozen: true, headerSort: false, cssClass: 'text-center' },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "Server Alias",
      field: "tib_srvr_alias",
      headerTooltip: true,
      width: 150,
      hozAlign: "left",
    },
    {
      title: "Topic",
      field: "topic_name",
      headerTooltip: true,
      hozAlign: "left",
    },
  ];

  const queueColumns: ColumnDefinition[] = [
    // { title: "", width: 40, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", frozen: true, headerSort: false, cssClass: 'text-center' },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "Server Alias",
      field: "tib_srvr_alias",
      headerTooltip: true,
      width: 150,
      hozAlign: "left",
    },
    {
      title: "Queue",
      field: "queue_name",
      headerTooltip: true,
      hozAlign: "left",
    },
  ];

  const [columns, setColumns] = useState(queueColumns);

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;
    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  let qtInfoUrl = `/api/setting/qtCommApi`;

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

      setQueueTableData(qListDataVal);
      setTopicTableData(tListDataVal);

      if (selected && selected == "Topic") {
        setTableData(tListDataVal);
      } else {
        setTableData(qListDataVal);
      }

      const propExpanded: any = [];

      propExpanded.push("All", "JMS_ALL", "ADMIN");

      setExpanded(propExpanded);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleChange = (event: any) => {
    setSelected(event.target.value);

    //     const queueNodes = QueuePermNode;
    // const topicNodes = TopicPermNode;

    if (event.target.value == "Queue") {
      setSvcNm("Queue");
      setColumns(queueColumns);
      setTableData(queueTableData);
      setGrpUserData([]);
      // setNodeData(queueNodes);

      // nodeData = QueuePermNode;
    } else if (event.target.value == "Topic") {
      setSvcNm("Topic");
      setColumns(topicColumns);
      setTableData(topicTableData);
      setGrpUserData([]);
      // setNodeData(topicNodes);
      // nodeData = TopicPermNode;
    }
  };

  const options = {
    height: 345,
    layout: "fitColumns",
    placeholder: t("MUL_WD_0137"),
  };

  const guColumns: ColumnDefinition[] = [
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      visible: false,
    },
    {
      title: "Name",
      field: "name",
      headerTooltip: true,
      visible: false,
    },
    {
      title: "Principal Type",
      field: "pType",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: "Principal",
      field: "principal",
      headerTooltip: true,
      hozAlign: "left",
    },
  ];

  const guOptions = {
    maxHeight: 345,
    layout: "fitColumns",
    placeholder: "No Data",
  };

  const searchData = async () => {
    fetchTableData();
  };

  const rowClick = async (e: any, row: any) => {
    // 선택한 열에만 배경색 적용
    tableRef.current?.table.getRows().forEach((row: any) => {
      row.getElement().style.backgroundColor = "";
    });
    row.getElement().style.backgroundColor = "#ffdedb";

    setChecked([]);
    // setGrpUserData([]);

    try {
      const rowDataVal = row.getData();

      const bodyData = {
        case_method: "GRP_USER",
        tib_srvr_sn: rowDataVal.tib_srvr_sn,
      };

      const res = await fetch(qtInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      if (dataInfo && dataInfo != "") {
        const guDataVal: any = [];
        const userData = dataInfo.user_list;
        const grpData = dataInfo.grp_list;

        var radios: any = document.getElementsByName("radioField");
        var sel_type = null;
        for (var i = 0; i < radios.length; i++) {
          if (radios[i].checked === true) {
            sel_type = radios[i].value;
          }
        }

        let nameVal = "";
        if (sel_type && sel_type == "Topic") {
          nameVal = rowDataVal.topic_name;
        } else {
          nameVal = rowDataVal.queue_name;
        }

        userData.map((uData: any) => {
          let concatVal: any = {};
          concatVal.tib_srvr_sn = rowDataVal.tib_srvr_sn;
          concatVal.name = nameVal;
          concatVal.pType = "USER";
          concatVal.principal = uData;
          guDataVal.push(concatVal);
        });

        grpData.map((gData: any) => {
          let concatVal: any = {};
          concatVal.tib_srvr_sn = rowDataVal.tib_srvr_sn;
          concatVal.name = nameVal;
          concatVal.pType = "GROUP";
          concatVal.principal = gData;
          guDataVal.push(concatVal);
        });

        setGrpUserData(guDataVal);
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  const guRowClick = async (e: any, row: any) => {
    // 선택한 열에만 배경색 적용
    guTableRef.current?.table.getRows().forEach((row: any) => {
      row.getElement().style.backgroundColor = "";
    });
    row.getElement().style.backgroundColor = "#ffdedb";

    try {
      const rowDataVal = row.getData();

      var radios: any = document.getElementsByName("radioField");
      var sel_type = null;
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked === true) {
          sel_type = radios[i].value;
        }
      }

      const bodyData = {
        case_method: "PERMISSION",
        ems_qt: sel_type,
        tib_srvr_sn: rowDataVal.tib_srvr_sn,
        name: rowDataVal.name,
        principal: rowDataVal.principal,
      };

      const res = await fetch(qtInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      const propDataVal: any = [];
      const propExpanded: any = [];

      if (dataInfo && dataInfo != "") {
        const dataSplit = dataInfo.split(",");
        dataSplit.map((checkVal: any) => {
          const dataVal = checkVal.toUpperCase();
          let data = dataVal.replace(/-/gi, "_");

          // if (data == "SHUTDOWN") {
          //   data = "SHUTDOWN_SERVER"
          // }
          propDataVal.push(data);
        });
      }

      propExpanded.push("All", "JMS_ALL", "ADMIN");

      setRowInfoData(rowDataVal);
      setExpanded(propExpanded);
      setChecked(propDataVal);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  const modPropInfo = async () => {
    var radios: any = document.getElementsByName("radioField");
    var sel_type = null;
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked === true) {
        sel_type = radios[i].value;
      }
    }

    if (rowInfoData && rowInfoData.name != "") {
      const pType = rowInfoData.pType;
      const groupList = [];
      const userList = [];
      if (pType && pType == "USER") {
        userList.push(rowInfoData.principal);
      } else if (pType && pType == "GROUP") {
        groupList.push(rowInfoData.principal);
      }

      const bodyData = {
        case_method: "SET_PERM",
        ems_qt: sel_type,
        grant_list: checked,
        group_list: groupList,
        name: rowInfoData.name,
        tib_srvr_sn: rowInfoData.tib_srvr_sn,
        user_list: userList,
      };

      const res = await fetch(qtInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data.code && data.code == "200") {
        alert(t("MUL_ST_0037"));

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
      } else {
        alert(t("MUL_ST_0036"));
      }
    }
  };

  const icons = {
    check: <MdCheckBox className="rct-icon rct-icon-check" />,
    uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    halfCheck: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    ),
    expandClose: <MdChevronRight className="rct-icon rct-icon-expand-close" />,
    expandOpen: (
      <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
    ),
    expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    // collapseAll: (
    //   <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
    // ),
    parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
    parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
    // leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />
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
                  Q/T Permission
                </li>
              </ol>
            </nav>

            <h1 className="mt-2 mb-0 page-title"> Q/T Permission</h1>
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
                  <div className="col-md-4">
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
                    <div className="custom-selectable table-responsive">
                      <ReactTabulator
                        key={tableData.length}
                        ref={tableRef}
                        autoResize={false}
                        data={tableData}
                        columns={columns}
                        options={options}
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
                  <div className="col-md-3">
                    <h4 className="sm-title">
                      {t("MUL_WD_0019")} & {t("MUL_WD_0020")}
                    </h4>
                    <div className="custom-selectable table-responsive">
                      <ReactTabulator
                        key={grpUserData.length}
                        ref={guTableRef}
                        autoResize={false}
                        data={grpUserData}
                        columns={guColumns}
                        options={guOptions}
                        events={{
                          rowClick: guRowClick,
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
                  <div className="col-md-3">
                    <h4 className="sm-title">Permission</h4>
                    <CheckboxTree
                      nodes={selected === "Queue" ? queueNodes : topicNodes}
                      checked={checked}
                      expanded={expanded}
                      onCheck={(checked) => setChecked(checked)}
                      onExpand={(expanded) => setExpanded(expanded)}
                      showNodeIcon={false}
                      icons={icons}
                    />
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
