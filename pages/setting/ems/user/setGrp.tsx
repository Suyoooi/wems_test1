import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import "react-tabulator/lib/styles.css";
import type { QueueListData } from "@/types/webComm";
import DownloadFileNm from "@/utils/downloadFileNm";
import Modal from "@/components/modal/setting/ems/grp/addEmsGrp";
import ModModal from "@/components/modal/setting/ems/grp/modEmsGrp";
import PropModal from "@/components/modal/setting/ems/grp/getGrpPropInfo";
import UserModal from "@/components/modal/setting/ems/grp/setUserInGrp";
import SrvrSelect from "@/components/dropdown/DropdownComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  stopLoading,
  openModal,
  closeModal,
} from "@/constant/redux/loadingSlice";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export default function EmsUserInfo() {
  const dispatch = useDispatch();
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let userGrpUrl = `/api/setting/ems/userGrpApi`;

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<QueueListData[]>([]);
  const [serverFilter, setServerFilter] = useState<number[]>([]);
  const [emsUserGrpInfo, setEmsUserGrpInfo] = useState();

  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  // 모달1
  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(openModal());
  };

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

  const [isOpenModModal, setOpenModModal] = useState<boolean>(false);
  // 모달2
  const handleOpenModModal = () => {
    setOpenModModal(true);
    dispatch(openModal());
  };

  const handleCloseModModal = () => {
    setOpenModModal(false);
    dispatch(closeModal());
  };

  const onClickModModal = useCallback(() => {
    if (isOpenModModal) {
      handleCloseModModal();
    } else {
      handleOpenModModal();
    }
  }, [isOpenModModal]);

  const [isOpenPropModal, setOpenPropModal] = useState<boolean>(false);
  // 모달3
  const handleOpenPropModal = () => {
    setOpenPropModal(true);
    dispatch(openModal());
  };

  const handleClosePropModal = () => {
    setOpenPropModal(false);
    dispatch(closeModal());
  };

  const onClickPropModal = useCallback(() => {
    if (isOpenPropModal) {
      handleClosePropModal();
    } else {
      handleOpenPropModal();
    }
  }, [isOpenPropModal]);

  const [isOpenSetUserModal, setOpenSetUserModal] = useState<boolean>(false);
  const handleOpenSetUserModal = () => {
    setOpenSetUserModal(true);
    dispatch(openModal());
  };

  const handleCloseSetUserModal = () => {
    setOpenSetUserModal(false);
    dispatch(closeModal());
  };

  const onClickSetUserModal = useCallback(() => {
    if (isOpenSetUserModal) {
      handleCloseSetUserModal();
    } else {
      handleOpenSetUserModal();
    }
  }, [isOpenSetUserModal]);

  // const [isOpenSetPropModal, setOpenSetPropModal] = useState<boolean>(false);
  // 모달4
  // const handleOpenSetPropModal = () => {
  //   setOpenSetPropModal(true);
  //   dispatch(openModal());
  // };

  // const handleCloseSetPropModal = () => {
  //   setOpenSetPropModal(false);
  //   dispatch(closeModal());
  // };

  // const onClickSetPropModal = useCallback(() => {
  //   if (isOpenSetPropModal) {
  //     handleClosePropModal();
  //   } else {
  //     handleOpenPropModal();
  //   }
  // }, [isOpenPropModal]);

  const [searchInfo, setSearchInfo] = useState({
    sSrvrNm: "",
    sGrpNm: "",
  });
  const { sSrvrNm, sGrpNm } = searchInfo;

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
        case_method: "GRP_GET",
        tib_srvr_list: serverFilter,
        grp_nm: sGrpNm,
      };

      const res = await fetch(userGrpUrl, {
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
      title: "",
      width: 40,
      formatter: function (cell: any, formatterParams: any, onRendered: any) {
        const data = cell.getRow().getData();
        var checkbox: any = document.createElement("input");
        checkbox.type = "checkbox";
        const grpNm = data.group_name;

        if (tableRef.current && tableRef.current.table) {
          const table = tableRef.current.table;

          if (table.modExists("selectRow", true)) {
            checkbox.addEventListener("click", (e: any) => {
              e.stopPropagation();
            });

            if (typeof cell.getRow == "function") {
              var row = cell.getRow();

              if (row._getSelf().type == "row") {
                checkbox.addEventListener("change", (e: any) => {
                  row.toggleSelect();
                });

                if (grpNm == "$admin" || grpNm == "all") {
                  checkbox.disabled = "true";
                } else {
                  checkbox.checked = row.isSelected && row.isSelected();
                  table.modules.selectRow.registerRowSelectCheckbox(
                    row,
                    checkbox
                  );
                }
              } else {
                checkbox = "";
              }
            } else {
              checkbox.addEventListener("change", (e: any) => {
                if (table.modules.selectRow.selectedRows.length) {
                  table.deselectRow();
                } else {
                  table.selectRow(formatterParams.rowRange);
                }
              });

              table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
            }
          }
        }
        return checkbox;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      frozen: true,
      headerSort: false,
      cssClass: "text-center",
    },
    {
      title: "ServerName",
      field: "ems_alias",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "ServerSn",
      field: "tib_srvr_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "GroupName",
      field: "group_name",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "Description",
      field: "description",
      headerTooltip: true,
      hozAlign: "left",
      width: 250,
      tooltip: formatTooltip,
    },
    {
      title: "isExternal",
      field: "is_external",
      headerTooltip: true,
      hozAlign: "center",
      width: 110,
      tooltip: formatTooltip,
    },
    {
      title: "Principal Type",
      field: "principal_type",
      headerTooltip: true,
      hozAlign: "center",
      width: 140,
      tooltip: formatTooltip,
    },
    {
      title: "UserCount",
      field: "user_cnt",
      headerTooltip: true,
      hozAlign: "right",
      width: 140,
      tooltip: formatTooltip,
    },
    {
      title: "Users",
      field: "user",
      headerTooltip: true,
      hozAlign: "left",
      width: 200,
      tooltip: formatTooltip,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        let newText = "";

        if (value && value != "") {
          const stringVal = value.toString();

          let aType = /\[/gi;
          let dType = /\]/gi;

          newText = stringVal.replace(aType, "").replace(dType, "");
        } else {
          newText = value;
        }

        return newText;
      },
    },
    {
      title: "Permissions",
      field: "permissions",
      headerTooltip: true,
      hozAlign: "left",
      tooltip: formatTooltip,
    },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      width: 100,
      headerHozAlign: "center",
      hozAlign: "center",
      headerSort: false,
      formatter: reactFormatter(<UserGrpActionButton />),
    },
  ];

  const downloadColumns: ColumnDefinition[] = [
    {
      title: "ServerName",
      field: "ems_alias",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "GroupName",
      field: "group_name",
      headerTooltip: true,
      hozAlign: "center",
      width: 130,
      tooltip: formatTooltip,
    },
    {
      title: "Description",
      field: "description",
      headerTooltip: true,
      hozAlign: "left",
      width: 200,
      tooltip: formatTooltip,
    },
    {
      title: "isExternal",
      field: "is_external",
      headerTooltip: true,
      hozAlign: "center",
      width: 110,
      tooltip: formatTooltip,
    },
    {
      title: "Principal Type",
      field: "principal_type",
      headerTooltip: true,
      hozAlign: "center",
      width: 140,
      tooltip: formatTooltip,
    },
    {
      title: "UserCount",
      field: "user_cnt",
      headerTooltip: true,
      hozAlign: "left",
      tooltip: formatTooltip,
    },
    {
      title: "Users",
      field: "user",
      headerTooltip: true,
      hozAlign: "left",
      width: 250,
      tooltip: formatTooltip,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        let newText = "";

        if (value && value != "") {
          const stringVal = value.toString();

          let aType = /\[/gi;
          let dType = /\]/gi;

          newText = stringVal.replace(aType, "").replace(dType, "");
        } else {
          newText = value;
        }

        return newText;
      },
    },
    {
      title: "Permissions",
      field: "permissions",
      headerTooltip: true,
      hozAlign: "right",
      tooltip: formatTooltip,
    },
  ];

  const options: ReactTabulatorOptions = {
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50, 100],
    maxHeight: 500,
    layout: "fitColumns",
    rowHeight: 45,
    placeholder: t("MUL_WD_0137"),
  };

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  function UserGrpActionButton(props: any) {
    const rowData = props.cell._cell.row.data;
    const cell = props.cell;

    let btnDis = false;
    let perBtnDis = false;
    const grpNm = rowData.group_name;

    if (grpNm && (grpNm == "$admin" || grpNm == "all")) {
      btnDis = true;
    }

    if (grpNm && grpNm == "$admin") {
      perBtnDis = true;
    }

    return (
      <>
        <div className="gap-2 row" style={{ paddingLeft: "7px" }}>
          <button
            type="button"
            className="btn btn-icon btn-outline-light btn_t_xs"
            disabled={perBtnDis}
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0021") as string}
            onClick={() => setGrpPropInfo(rowData)}
          >
            <i className="i_property icon-sm fs-5"></i>
          </button>
          {/* <button type="button" className="btn btn-icon btn-outline-light btn_t_xs" disabled={btnDis} onClick={() => modUserGrpInfo(rowData, cell)}>
            <i className="i_modify icon-sm fs-5"></i>
          </button> */}
          <button
            type="button"
            className="btn btn-icon btn-outline-light btn_t_xs"
            disabled={btnDis}
            onClick={() => setUserGrpInfo(rowData, cell)}
          >
            <i className="i_memapply icon-sm fs-5"></i>
          </button>
          <button
            type="button"
            aria-expanded="false"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title={t("MUL_WD_0046") as string}
            className="btn btn-icon btn-outline-light btn_t_xs"
            disabled={btnDis}
            onClick={() => delUserGrpInfo(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  function setGrpPropInfo(rowData: any) {
    setEmsUserGrpInfo(rowData);
    onClickPropModal();
  }

  async function modUserGrpInfo(rowData: any, cell: any) {
    setEmsUserGrpInfo(rowData);
    onClickModModal();
  }

  async function setUserGrpInfo(rowData: any, cell: any) {
    setEmsUserGrpInfo(rowData);
    onClickSetUserModal();
  }

  async function delUserGrpInfo(rowData: any) {
    const delSrvrSn = rowData.tib_srvr_sn;
    const delSrvrNm = rowData.ems_alias;
    const delGrpNm = rowData.group_name;
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `Do you want to delete the following EMS User Group?\nTarget: ${delGrpNm} [ ${delSrvrNm} ]`;
    } else if (lang === "ko") {
      confirmVal = `다음의 EMS User 그룹을 삭제하시겠습니까?\n대상: ${delGrpNm} [ ${delSrvrNm} ]`;
    }
    if (confirm(confirmVal)) {
      const delUserData: any = [];
      const concatVal: any = {};
      concatVal.group_name = delGrpNm;
      concatVal.tib_srvr_sn = delSrvrSn;
      delUserData.push(concatVal);

      const bodyData = {
        case_method: "DEL",
        group_info_list: delUserData,
      };

      const res = await fetch(userGrpUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();

      if (data && data.code == "200") {
        alert(t("MUL_ST_00187"));
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
        alert(t("MUL_ST_00188"));
      }
    }
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("EMS_User_Group", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      if (fileType == "csv") {
        table.setColumns(downloadColumns);
        table.download(fileType, fullNm, { bom: true });
        table.setColumns(columns);
      } else if (fileType == "xlsx") {
        table.setColumns(downloadColumns);
        table.download(fileType, fullNm, { sheetName: "data" });
        table.setColumns(columns);
      }
    }
  };

  const callbackFunction = (data: any) => {
    if (data.code == "200" || data.code == "201") {
      fetchTableData();
    }
  };

  const addUserGrp = () => {
    onClickToggleModal();
  };

  const delUserGrp = async () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();
    const delGrpData: any = [];

    if (selectedData != "") {
      const grpNm = selectedData[0].group_name;
      const srvrNm = selectedData[0].ems_alias;
      const mapSize = selectedData.length;
      let confirmVal = "";

      if (mapSize > 1) {
        const mapCnt: any = mapSize - 1;
        if (lang === "en") {
          confirmVal = `Do you want to delete ${mapCnt} items other than the selected ${grpNm} (${srvrNm})?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ${grpNm} (${srvrNm}) 외 ${mapCnt} 건을 삭제하시겠습니까?`;
        }
      } else {
        if (lang === "en") {
          confirmVal = `Do you want to delete the selected ${grpNm}?`;
        } else if (lang === "ko") {
          confirmVal = `선택된 ${grpNm} 을 삭제하시겠습니까?`;
        }
      }

      if (confirm(confirmVal)) {
        selectedData.forEach((sData: any, idx: number) => {
          const concatVal: any = {};
          concatVal.group_name = sData.group_name;
          concatVal.tib_srvr_sn = sData.tib_srvr_sn;
          delGrpData.push(concatVal);
        });

        const bodyData = {
          case_method: "DEL",
          group_info_list: delGrpData,
        };

        const res = await fetch(userGrpUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_00189"));
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
          alert(t("MUL_ST_00191"));
        }
      }
    } else {
      alert(t("MUL_ST_00190"));
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

      {isOpenPropModal && (
        <PropModal
          onClickPropModal={handleClosePropModal}
          propInfo={emsUserGrpInfo}
          callbackFunction={callbackFunction}
        />
      )}

      {isOpenSetUserModal && (
        <UserModal
          onClickSetUserModal={handleCloseSetUserModal}
          userInfo={emsUserGrpInfo}
          callbackFunction={callbackFunction}
        />
      )}

      {isOpenModModal && (
        <ModModal
          onClickModModal={handleCloseModModal}
          grpInfo={emsUserGrpInfo}
          callbackFunction={callbackFunction}
        />
      )}

      <div className="mt-2 search-box justify-content-center">
        <div className="row col-md-12">
          <div className="row col-md-4">
            <label
              className="col-sm-4 col-form-label text-sm-end"
              htmlFor="sEmsSrvr"
            >
              EMS {t("MUL_WD_0009")}
            </label>
            <div className="col-sm-8">
              <SrvrSelect onServerSelected={handleSelectedServerAlias} />
            </div>
          </div>
          <div className="row col-md-4">
            <label
              className="col-sm-4 col-form-label text-sm-end"
              htmlFor="sGrpNm"
            >
              {t("MUL_WD_0020")} {t("MUL_WD_0072")}
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="sGrpNm"
                name="sGrpNm"
                onChange={onChangeSearch}
              />
            </div>
          </div>
          <div className="col-4 justify-content-start">
            <button
              type="button"
              onClick={handleSubmit}
              className="gap-2 btn btn-dark hstack"
            >
              <i className="i_view_search fs-5"></i>
              {t("MUL_WD_0022")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 row">
        <div className="col-md-6" style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="gap-2 btn btn-info hstack"
            onClick={() => addUserGrp()}
          >
            <i className="i_add fs-5"></i>
            {t("MUL_WD_0085")}
          </button>
          <button
            className="gap-2 btn btn-gray hstack"
            onClick={() => delUserGrp()}
          >
            {t("MUL_WD_0124")}
          </button>
        </div>

        <div className="d-flex col-md-6 justify-content-md-end">
          <button
            className="btn btn-icon btn-green mr_4"
            onClick={() => handleDataExport("xlsx")}
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-original-title={t("MUL_WD_0012") as string}
          >
            <i className="i_excel icon-lg fs-5"></i>
          </button>
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
    </>
  );
}
