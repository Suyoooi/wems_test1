import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import DownloadFileNm from "@/utils/downloadFileNm";
import type { GrpInputBody, GrpListData } from "@/types/webComm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SET_GRP_INFO_COLUMNS } from "@/constant/excel/columns";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleGrpModal: () => void;
  callbackFunction: any;
}

function Modal({
  onClickToggleGrpModal,
  callbackFunction,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  let grpInfoUrl = `/api/setting/ems/groupListApi`;

  const schema = yup.object().shape({
    inGrpNm: yup.string().required(t("MUL_ST_00185") as string),
    inGrpDesc: yup.string().default(""),
  });

  const defaultValues = {
    inGrpNm: "",
    inGrpDesc: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<GrpInputBody>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleRegistration: SubmitHandler<GrpInputBody> = (data) => {
    addGrpInfo(data);
  };
  const headleError = (errors: any) => {};

  const [inputData, setInputData] = useState({
    inGrpNm: "",
    inGrpDesc: "",
  });

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<GrpListData[]>([]);
  const { inGrpNm, inGrpDesc } = inputData;
  const [popTitle, setPopTitle] = useState<String>();
  const [popBtn, setPopBtn] = useState<String>();

  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GET",
      };

      const res = await fetch(grpInfoUrl, {
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
      title: t("MUL_WD_0047"),
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: t("MUL_WD_0107"),
      field: "grp_desc",
      headerTooltip: true,
      hozAlign: "left",
    },
    {
      title: t("MUL_WD_0104"),
      field: "count",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "",
      field: "custom",
      headerTooltip: true,
      width: 40,
      headerHozAlign: "center",
      hozAlign: "center",
      headerSort: false,
      formatter: reactFormatter(<GrpActionButton />),
    },
  ];

  const langVal = t("MUL_ST_0009");

  const options: ReactTabulatorOptions = {
    height: 250,
    layout: "fitColumns",
    placeholder: langVal,
  };

  function GrpActionButton(props: any) {
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
            onClick={() => delGrpInfo(rowData)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("EMS_Server_Group", fileType);

    if (tableRef.current && tableRef.current.table) {
      const table = tableRef.current.table;

      table.setColumns(SET_GRP_INFO_COLUMNS);
      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
      table.setColumns(columns);
    }
  };

  async function addGrpInfo(dataVal: any) {
    try {
      const inData = tableData.some(
        (item: any) => item.grp_nm === dataVal.inGrpNm
      );

      if (inData) {
        alert(t("MUL_ST_0073"));
      } else {
        if (confirm(t("MUL_ST_0072") as string)) {
          const inputDataVal = {
            case_method: "POST",
            grpNm: dataVal.inGrpNm,
            description: dataVal.inGrpDesc,
          };

          const res = await fetch(grpInfoUrl, {
            body: JSON.stringify(inputDataVal),
            method: "POST",
          });

          const data = await res.json();

          if (data && data.code == "200") {
            alert(t("MUL_ST_0070"));
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
            alert(t("MUL_ST_0071"));
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function delGrpInfo(dataVal: any) {
    try {
      const confirmVal = t("MUL_ST_0076")
        // .concat("MUL_ST_0077")
        .concat(dataVal.grp_nm);
      if (confirm(confirmVal)) {
        const bodyData = {
          case_method: "DEL",
          grpSn: dataVal.grp_sn,
        };

        const res = await fetch(grpInfoUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data && data.code == "200") {
          alert(t("MUL_ST_0074"));
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
          alert(t("MUL_ST_0075"));
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {/* <div className="modal_ly_bg"></div> */}
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_800">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  {t("MUL_WD_0085")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickToggleGrpModal) {
                      onClickToggleGrpModal();
                    }
                  }}
                ></button>
              </div>

              <form onSubmit={handleSubmit(handleRegistration, headleError)}>
                <div className="modal-body">
                  <div className="row col-md-12">
                    <div className="row col-sm-8">
                      <div className="d-flex col-md-12 justify-content-md-end">
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
                    <div className="mt-2 col-sm-4">
                      <div className="mb-4">
                        <h4>{t("MUL_WD_0108")}</h4>
                      </div>
                      <div className="mb-2">
                        <h5>
                          {t("MUL_WD_0020")} {t("MUL_WD_0072")}
                        </h5>
                        <input
                          type="text"
                          className={`form-control col-sm-12 ${
                            errors.inGrpNm ? "is-invalid" : ""
                          }`}
                          id="inGrpNm"
                          {...register("inGrpNm")}
                        />
                        <div className="invalid-feedback">
                          {errors.inGrpNm?.message}
                        </div>
                      </div>
                      <div className="mb-3">
                        <h5>{t("MUL_WD_0107")}</h5>
                        <input
                          type="text"
                          className="form-control col-sm-12"
                          id="inGrpDesc"
                          {...register("inGrpDesc")}
                        />
                      </div>

                      <div className="row">
                        <button
                          type="submit"
                          className="btn btn-md btn-gray"
                          disabled={isSubmitting}
                        >
                          {t("MUL_WD_0029")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="modal-footer justify-content-center">
                <div className="flex-wrap gap-2 mt-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickToggleGrpModal) {
                        onClickToggleGrpModal();
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
