import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { ConnectionListData } from "@/types/webComm";
import CodeList from "@/components/codeList";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/bridge/setBridgeInfo";
import SrvrSelect from "@/components/dropdown/DropdownComponent";
import { BRIDGES_LIST_EXCEL } from "@/constant/excel/columns";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
export default function ConnectionInfo() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let bridgeInfoUrl = `/api/setting/bridge/bridgeListApi`;

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<ConnectionListData[]>([]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const dispatch = useDispatch();

  // 모달 open
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };

  // 모달 close
  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };

  // property 모달 열고 닫기
  // const onClickToggleModal = useCallback(() => {
  //   setOpenModal(!isOpenModal);
  // }, [isOpenModal]);
  const onClickToggleModal = useCallback(() => {
    if (isOpenModal) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isOpenModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sType: "",
    sSourceNm: "",
  });
  const { sSrvrNm, sType, sSourceNm } = searchInfo;

  function onChangeSearch(e: { target: { value: any; name: any } }) {
    const { value, name } = e.target;

    setSearchInfo({
      ...searchInfo,
      [name]: value,
    });
  }

  const fetchTableData = async () => {
    dispatch(startLoading());
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverFilter,
        ems_qt: sType,
        source_name: sSourceNm,
      };

      const res = await fetch(bridgeInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      setTableData(dataInfo);

      dispatch(stopLoading());
    } catch (err) {
      dispatch(stopLoading());
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleSubmit = async () => {
    fetchTableData();
  };

  const columns: ColumnDefinition[] = [
    {
      title: "No",
      field: "dataNo",
      formatter: "rownum",
      headerTooltip: true,
      hozAlign: "center",
      width: 70,
      headerSort: false,
    },
    {
      title: t("MUL_WD_0069"),
      field: "server_alias",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      width: 130,
      visible: false,
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "Source",
      field: "source",
      headerTooltip: true,
      width: 160,
      hozAlign: "left",
    },
    {
      title: "SourceType",
      field: "source_type",
      headerTooltip: true,
      width: 130,
      hozAlign: "left",
    },
    {
      title: "Target",
      field: "target",
      headerTooltip: true,
      hozAlign: "left",
      width: 160,
    },
    {
      title: "TargetType",
      field: "target_type",
      headerTooltip: true,
      hozAlign: "left",
      width: 130,
    },
    {
      title: "Selector",
      field: "selector",
      headerTooltip: true,
      hozAlign: "left",
      sorter: "string",
    },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      width: 50,
      headerHozAlign: "center",
      hozAlign: "left",
      headerSort: false,
      formatter: reactFormatter(<BridgeActionButton />),
    },
  ];

  function BridgeActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;

    return (
      <>
        <div className="gap-2 row" style={{ paddingLeft: "7px" }}>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0046") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => delBridgeInfo(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  const options = {
    layout: "fitColumns",
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    scrollable: true,
    placeholder: t("MUL_WD_0137"),
  };

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Bridges", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(BRIDGES_LIST_EXCEL);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(BRIDGES_LIST_EXCEL);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  const addBridge = async () => {
    onClickToggleModal();
  };

  const delBridgeInfo = async (rowData: any) => {
    const delSrvrSn = rowData.tib_srvr_sn;
    const delSrvrNm = rowData.server_alias;
    const delSourceNm = rowData.source;
    const delSourceType = rowData.source_type;
    const delTargetNm = rowData.target;
    const delTargetType = rowData.target_type;
    const delSelector = rowData.selector;

    if (
      confirm(
        t("MUL_ST_00135") +
          delSrvrNm +
          " [" +
          delSrvrSn +
          t("MUL_ST_00136") +
          delSourceNm +
          " [" +
          delSourceType +
          t("MUL_ST_00137") +
          delTargetNm +
          " [" +
          delTargetType +
          "]"
      )
    ) {
      const delBodyData = {
        case_method: "DEL",
        tib_srvr_sn: delSrvrSn,
        source_name: delSourceNm,
        source_type: delSourceType,
        destination_name: delTargetNm,
        destination_type: delTargetType,
        selector: delSelector,
      };

      const res = await fetch(bridgeInfoUrl, {
        body: JSON.stringify(delBodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data && data.code == "200") {
        alert(t("MUL_ST_00131"));
        fetchTableData();
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
        alert(t("MUL_ST_00131"));
      }
    }
  };

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableData();
    }
  };

  const handleSelectedServerAlias = (tibSrvrSn: number[]) => {
    setServerFilter(tibSrvrSn);
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          callbackFunction={callbackFunction}
        />
      )}
      {/* {isLoading && <Loading />} */}
      <section id="content" className="content">
        <div className="content__header content__boxed overlapping">
          <div className="content__wrap">
            <nav aria-label="breadcrumb">
              <ol className="mb-0 breadcrumb">
                <li className="breadcrumb-item">{t("MUL_WD_0015")}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Bridges
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Bridges</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  <div className="row col-md-3">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sSrvrNm"
                    >
                      EMS {t("MUL_WD_0009")}
                    </label>
                    <div className="col-sm-8">
                      <SrvrSelect
                        onServerSelected={handleSelectedServerAlias}
                      />
                    </div>
                  </div>
                  <div className="row col-md-3">
                    <label
                      className="col-sm-4 col-form-label text-sm-end"
                      htmlFor="sType"
                    >
                      Type
                    </label>
                    <div className="col-sm-8">
                      <select
                        id="sType"
                        name="sType"
                        className="form-select"
                        onChange={onChangeSearch}
                      >
                        <CodeList codeGroupId="QT_GBN_CD" />
                      </select>
                    </div>
                  </div>

                  <div className="row col-md-3">
                    <label className="col-sm-4 col-form-label text-sm-end">
                      Source
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="form-control"
                        id="sSourceNm"
                        name="sSourceNm"
                        onChange={onChangeSearch}
                      />
                    </div>
                  </div>
                  <div className="col-3 justify-content-start">
                    <button
                      type="button"
                      className="gap-2 btn btn-dark hstack"
                      onClick={handleSubmit}
                    >
                      <i className="i_view_search fs-5"></i>
                      {t("MUL_WD_0022")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 row">
                <div className="col-md-8">
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={() => addBridge()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0080")}
                  </button>
                </div>
                <div className="d-flex col-md-4 justify-content-md-end">
                  <button
                    className="btn btn-icon btn-green"
                    onClick={() => handleDataExport("xlsx")}
                    type="button"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-original-title={t("MUL_WD_0012") as string}
                  >
                    <i className="i_excel icon-lg fs-5"></i>
                  </button>
                </div>
              </div>
              <div className="table table-responsove">
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
      </section>
    </>
  );
}
