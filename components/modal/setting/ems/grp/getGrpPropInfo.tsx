import React, { PropsWithChildren, useState, useEffect } from "react";
import CheckboxTree from "react-checkbox-tree";
import {
  PermissionNode,
  PermissionCheck,
  PermissionView,
} from "@/types/userPermission";
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

const nodes = PermissionNode;

interface ModalDefaultType {
  onClickPropModal: () => void;
  propInfo: any;
  callbackFunction: any;
}

function Modal(
  this: any,
  {
    onClickPropModal,
    propInfo,
    callbackFunction,
    children,
  }: PropsWithChildren<ModalDefaultType>
) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let userGrpUrl = `/api/setting/ems/userGrpApi`;

  const [pSrvrNm, setPSrvrNm] = useState("");
  const [pGrpNm, setPGrpNm] = useState("");
  const [checked, setChecked] = useState<any>([]);
  const [expanded, setExpanded] = useState<any>([]);

  const fetchTableData = async () => {
    try {
      const srvrSn = propInfo.tib_srvr_sn;
      const srvrNm = propInfo.ems_alias;
      const grpNm = propInfo.group_name;

      setPSrvrNm(srvrNm);
      setPGrpNm(grpNm);

      const bodyData = {
        case_method: "PROP_GET",
        tib_srvr_sn: srvrSn,
        grp_nm: grpNm,
      };

      const res = await fetch(userGrpUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;
      const propDataVal: any = [];
      const propExpanded: any = [];

      if (dataInfo && dataInfo != "") {
        const dataSplit = dataInfo.split(",");

        if (dataSplit[0] && dataSplit[0] == "all") {
          PermissionCheck.map((ch) => {
            propDataVal.push(ch.value);
          });

          for (var i = 1; i < dataSplit.length; i++) {
            const dataVal = dataSplit[i].toUpperCase();
            let data = dataVal.replace(/-/gi, "_");
            const firstChar = data.substring(0, 1);

            if (firstChar && firstChar == "_") {
              let dataVal = data.substring(1);
              if (dataVal == "SHUTDOWN") {
                dataVal = "SHUTDOWN_SERVER";
              }

              let idx = propDataVal.indexOf(dataVal);
              if (idx !== -1) {
                propDataVal.splice(idx, 1);
              }
            } else {
              if (data == "SHUTDOWN") {
                data = "SHUTDOWN_SERVER";
              }

              propDataVal.push(data);
            }
          }
        } else if (dataSplit[0] && dataSplit[0] == "view-all") {
          PermissionView.map((ch) => {
            propDataVal.push(ch.value);
          });

          for (var i = 1; i < dataSplit.length; i++) {
            const dataVal = dataSplit[i].toUpperCase();
            let data = dataVal.replace(/-/gi, "_");
            const firstChar = data.substring(0, 1);

            if (firstChar && firstChar == "_") {
              let dataVal = data.substring(1);
              if (dataVal == "SHUTDOWN") {
                dataVal = "SHUTDOWN_SERVER";
              }

              let idx = propDataVal.indexOf(dataVal);
              if (idx !== -1) {
                propDataVal.splice(idx, 1);
              }
            } else {
              if (data == "SHUTDOWN") {
                data = "SHUTDOWN_SERVER";
              }

              propDataVal.push(data);
            }
          }
        } else {
          dataSplit.map((checkVal: any) => {
            const dataVal = checkVal.toUpperCase();
            let data = dataVal.replace(/-/gi, "_");

            if (data == "SHUTDOWN") {
              data = "SHUTDOWN_SERVER";
            }
            propDataVal.push(data);
          });
        }
      }

      propExpanded.push("GLOBAL", "All");

      setExpanded(propExpanded);
      setChecked(propDataVal);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const fnAddProp = async () => {
    try {
      if (confirm(t("MUL_ST_0082") as string)) {
        const bodyData = {
          case_method: "PROP_POST",
          tib_srvr_sn: propInfo.tib_srvr_sn,
          principal: propInfo.group_name,
          grant_list: checked,
        };

        const res = await fetch(userGrpUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_0083"));
          if (onClickPropModal) {
            onClickPropModal();
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
    } catch (e) {
      console.log(e);
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
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="staticBackdropLabel"
                  style={{ color: "#000" }}
                >
                  {t("MUL_WD_0019")} {t("MUL_WD_0020")} {t("MUL_WD_0021")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickPropModal) {
                      onClickPropModal();
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <div className="content__boxed">
                  <div className="row col-md-12 justify-content-center">
                    <div className="mb-3 row">
                      <label
                        className="col-sm-4 col-form-label text-end"
                        htmlFor="iSrvrNm"
                      >
                        EMS {t("MUL_WD_0009")}
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          id="iSrvrNm"
                          value={pSrvrNm}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label
                        className="col-sm-4 col-form-label text-end"
                        htmlFor="iPrincipal"
                      >
                        Principal
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          id="iPrincipal"
                          value={pGrpNm}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mh_300">
                    <CheckboxTree
                      nodes={nodes}
                      checked={checked}
                      expanded={expanded}
                      onCheck={(checked) => setChecked(checked)}
                      onExpand={(expanded) => setExpanded(expanded)}
                      showNodeIcon={false}
                      icons={icons}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-deepgray btn-lg"
                    onClick={() => fnAddProp()}
                  >
                    {t("MUL_WD_0024")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickPropModal) {
                        onClickPropModal();
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
    </>
  );
}

export default Modal;
