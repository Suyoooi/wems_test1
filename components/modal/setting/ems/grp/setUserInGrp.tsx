import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import React, { PropsWithChildren, useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";

interface ModalDefaultType {
  onClickSetUserModal: () => void;
  userInfo: any;
  callbackFunction: any;
}

function Modal({
  onClickSetUserModal,
  userInfo,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const userTableRef = useRef<ReactTabulator | null>(null);
  const [userTableData, setUserTableData] = useState([]);
  const [emsUserLst, setEmsUserLst] = useState<any[]>([]);

  let userInfoUrl = `/api/setting/ems/groupListApi`;

  const setDataInfo = async () => {
    try {
      const bodyData = {
        case_method: "USER_INFO",
        tib_srvr_sn: userInfo.tib_srvr_sn,
      };

      const res = await fetch(userInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setEmsUserLst(dataInfo);

      const userList = userInfo.user;
      const tableInfo: any = userTableRef.current?.table;
      const userCnt = userInfo.user_cnt;

      if (userCnt && userCnt > 0) {
        const splitVal = userList.split(",");
        splitVal.map((dataVal: string) => {
          let aType = /\[/gi;
          let dType = /\]/gi;

          const listVal = dataVal.replace(aType, "").replace(dType, "").trim();

          tableInfo.addRow({ userNm: listVal }, true);
        });
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    setDataInfo();
  }, []);

  const userColumns: ColumnDefinition[] = [
    {
      title: "No",
      field: "dataNo",
      frozen: true,
      formatter: "rownum",
      headerTooltip: true,
      width: 70,
      headerSort: false,
      hozAlign: "center",
    },
    {
      title: "User Name",
      field: "userNm",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "",
      field: "custom",
      width: 40,
      headerTooltip: true,
      headerHozAlign: "center",
      hozAlign: "center",
      headerSort: false,
      formatter: reactFormatter(<UserActionButton />),
    },
  ];

  const userOptions: ReactTabulatorOptions = {
    height: 230,
    width: 100,
    layout: "fitColumns",
    placeholder: "",
  };

  function UserActionButton(props: any) {
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
            onClick={() => delUserList(rowData, cell)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  async function addUserInGrp() {
    const selOption: any = document.getElementById(
      "userSel"
    ) as HTMLInputElement;
    const selectedVal = selOption.options[selOption.selectedIndex].value;
    const tableInfo: any = userTableRef.current?.table;
    const tableData = tableInfo.getData();

    if (selectedVal && selectedVal != "") {
      const filterData = tableData.filter((d: any) => selectedVal === d.userNm);

      if (filterData.length > 0) {
        alert(t("MUL_ST_00170"));
      } else {
        tableInfo.addRow({ userNm: selectedVal }, true);
      }
    } else {
      alert(t("MUL_ST_00232"));
    }
  }

  async function delUserList(dataVal: any, cell: any) {
    cell.getRow().delete();
  }

  async function submitUser() {
    try {
      if (confirm(t("MUL_ST_00231") as string)) {
        const tableInfo: any = userTableRef.current?.table;
        const tableVal = tableInfo.getData();

        let userListVal: any = [];
        tableVal.map((usVal: any) => {
          userListVal.push(usVal.userNm);
        });

        const bodyData = {
          case_method: "ADD_USR",
          group_name: userInfo.group_name,
          tib_srvr_sn: userInfo.tib_srvr_sn,
          user_name_list: userListVal,
        };

        const res = await fetch(userInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_0087"));
          if (onClickSetUserModal) {
            onClickSetUserModal();
          }
          callbackFunction(data);
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
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  }

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_500">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="staticBackdropLabel"
                  style={{ color: "#000" }}
                >
                  {t("MUL_ST_00230")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickSetUserModal) {
                      onClickSetUserModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12 justify-content-center">
                    <div className="row col-md-12">
                      <div className="col-sm-12">
                        <div className="row">
                          <label className="col-sm-2 col-form-label text-sm-end">
                            User
                          </label>
                          <div className="col-sm-8">
                            <select className="form-select" id="userSel">
                              <option value="" key="all">
                                == {t("MUL_ST_00229")} ==
                              </option>
                              {emsUserLst &&
                                emsUserLst.map((userInfo: any) => (
                                  <option
                                    value={userInfo.user_name}
                                    key={userInfo.user_name}
                                  >
                                    {userInfo.user_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="col-sm-2">
                            <button
                              className="btn btn-md btn-gray"
                              onClick={() => addUserInGrp()}
                            >
                              add
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="table-responsive">
                            <ReactTabulator
                              key={userTableData.length}
                              ref={userTableRef}
                              autoResize={false}
                              data={userTableData}
                              columns={userColumns}
                              options={userOptions}
                            />
                          </div>
                        </div>
                        <div className="modal-footer justify-content-center">
                          <div className="flex-wrap gap-2 mt-3 d-flex">
                            <button
                              type="button"
                              className="btn btn-deepgray btn-lg"
                              onClick={() => submitUser()}
                            >
                              {t("MUL_WD_0024")}
                            </button>
                            <button
                              type="button"
                              className="btn btn-light btn-lg"
                              onClick={(e) => {
                                e.preventDefault();
                                if (onClickSetUserModal) {
                                  onClickSetUserModal();
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
