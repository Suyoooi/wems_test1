import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { SrvrListData } from "@/types/webComm";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/srvr/setSrvrInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function SrvrListInfo() {
  let srvrInfoUrl = `/api/setting/srvr/srvrApi`;
  const dispatch = useDispatch();
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<SrvrListData[]>([]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [srvrInfo, setSrvrInfo] = useState(null);

  // property 모달 열고 닫기
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };
  // 모달close
  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(closeModal());
  };
  const onClickToggleModal = useCallback(() => {
    if (isOpenModal) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isOpenModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sHostNm: "",
  });
  const { sSrvrNm, sHostNm } = searchInfo;

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
        alias: sSrvrNm,
        hostname: sHostNm,
      };

      const res = await fetch(srvrInfoUrl, {
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

  async function handleSubmit() {
    fetchTableData();
  }

  const columns: ColumnDefinition[] = [
    {
      title: t("MUL_WD_0101"),
      field: "srvr_sn",
      headerTooltip: true,
      hozAlign: "right",
      width: 140,
      tooltip: formatTooltip,
    },
    {
      title: t("MUL_WD_0069"),
      field: "srvr_alias",
      headerTooltip: true,
      hozAlign: "left",
      tooltip: formatTooltip,
    },
    {
      title: "Hostname",
      field: "srvr_ht_nm",
      headerTooltip: true,
      hozAlign: "left",
      tooltip: formatTooltip,
    },
    {
      title: "Description",
      field: "srvr_desc",
      headerTooltip: true,
      hozAlign: "left",
      tooltip: formatTooltip,
    },
    {
      title: "IP Address",
      field: "srvr_ipaddr",
      headerTooltip: true,
      hozAlign: "right",
      tooltip: formatTooltip,
    },
    {
      title: "SSH Port",
      field: "srvr_port",
      headerTooltip: true,
      hozAlign: "right",
      tooltip: formatTooltip,
    },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      hozAlign: "center",
      width: 80,
      headerSort: false,
      formatter: reactFormatter(<SrvrActionButton />),
    },
  ];

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  const options: ReactTabulatorOptions = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    placeholder: t("MUL_WD_0137"),
  };

  function SrvrActionButton(props: any) {
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
            title={t("MUL_WD_0045") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => modSrvrInfo(rowData, cell)}
          >
            <i className="i_modify icon-sm fs-5"></i>
          </button>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0046") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            onClick={() => delSrvrInfo(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  async function modSrvrInfo(rowData: any, cell: any) {
    setSrvrInfo(rowData);
    onClickToggleModal();
  }

  const delSrvrInfo = async (rowData: any) => {
    const delSrvrSn = rowData.srvr_sn;
    const delSrvrHtNm = rowData.srvr_ht_nm;

    if (confirm(t("MUL_ST_00154") + delSrvrHtNm + " [" + delSrvrSn + "]")) {
      const delBodyData = {
        case_method: "DEL",
        delSrvrSn: delSrvrSn,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(delBodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data && data.code == "200") {
        alert(t("MUL_ST_00152"));
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
        alert(t("MUL_ST_00153"));
      }
    }
  };

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Server", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
    }
  };

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableData();
    }
  };

  const addSrvr = () => {
    setSrvrInfo(null);
    onClickToggleModal();
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          onClickToggleModal={handleCloseModal}
          modSrvrInfo={srvrInfo}
          callbackFunction={callbackFunction}
        />
      )}

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
                  {t("MUL_WD_0009")} ({t("MUL_WD_0016")})
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 mb-0 page-title">Server</h1>
            <p className="lead"></p>

            <div className="content__boxed">
              <div className="mt-2 search-box justify-content-center">
                <div className="row col-md-12">
                  <div className="row col-md-4">
                    <label className="col-sm-3 col-form-label text-sm-end">
                      {t("MUL_WD_0069")}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="sSrvrNm"
                        name="sSrvrNm"
                        onChange={onChangeSearch}
                      />
                    </div>
                  </div>
                  <div className="mb-2 row col-md-6">
                    <label className="col-sm-3 col-form-label text-sm-end">
                      {t("MUL_WD_0040")}
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        id="sHostNm"
                        name="sHostNm"
                        onChange={onChangeSearch}
                      />
                    </div>
                    <div className="col-3 justify-content-start">
                      <button
                        type="button"
                        className="gap-2 btn btn-dark hstack"
                        onClick={() => handleSubmit()}
                      >
                        <i className="i_view_search fs-5"></i>
                        {t("MUL_WD_0022")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* --- 서버 추가 버튼 --- */}
              <div className="mt-3 row">
                <div className="col-md-6">
                  <button
                    className="gap-2 btn btn-info hstack"
                    onClick={() => addSrvr()}
                  >
                    <i className="i_add fs-5"></i>
                    {t("MUL_WD_0030")}
                  </button>
                </div>
                {/* --- 엑셀 저장 버튼 --- */}
                <div className="d-flex col-md-6 justify-content-md-end">
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
        </div>
      </section>
    </>
  );
}
