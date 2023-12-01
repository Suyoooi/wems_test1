import React, {
  PropsWithChildren,
  useRef,
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
  reactFormatter,
} from "react-tabulator";
import type {
  AddEmsGrpInputBody,
  EMSSrvrListData,
  PropListData,
} from "@/types/webComm";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  callbackFunction: any;
}

function Modal({
  onClickToggleModal,
  callbackFunction,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const schema = yup
    .object()
    .shape({
      inGrpNm: yup.string().required(t("MUL_ST_00168") as string),
      inDesc: yup.string().default(""),
    })
    .required();

  const defaultValues = {
    inGrpNm: "",
    inDesc: "",
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<AddEmsGrpInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<AddEmsGrpInputBody> = (data) => {
    addGrpList(data);
  };
  const headleError = (errors: any) => {};

  const tableRef = useRef<ReactTabulator | null>(null);
  const grpTableRef = useRef<ReactTabulator | null>(null);

  const [tableData, setTableData] = useState<EMSSrvrListData[]>([]);
  const [grpTableData, setGrpTableData] = useState<EMSSrvrListData[]>([]);
  const [srvrGrpData, setSrvrGrpData] = useState<PropListData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);

  const [inputData, setInputData] = useState({
    inGrpNm: "",
    inDesc: "",
  });

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
  let grpInfoUrl = `/api/setting/ems/userGrpApi`;

  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GRP_GET",
        alias: sSrvrNm,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const queuePropData = await res.json();
      const dataInfo = queuePropData[0].data;
      const grpData = queuePropData[1].data;

      setTableData(dataInfo);
      setSrvrGrpData(grpData);
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
      field: "tib_srvr_sn",
      width: 100,
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "GroupSn",
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
    {
      title: "Group",
      field: "grp_nm",
      width: 100,
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "ServerName",
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  const options = {
    height: 300,
    width: 100,
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
  };

  const grpColumns: ColumnDefinition[] = [
    {
      title: "Group Name",
      field: "group_nm",
      headerTooltip: true,
      hozAlign: "center",
    },
    {
      title: "Description",
      field: "group_desc",
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
      formatter: reactFormatter(<GrpActionButton />),
    },
  ];

  const langVal = t("MUL_ST_0009");

  const grpOptions: ReactTabulatorOptions = {
    height: 250,
    width: 100,
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
            onClick={() => delGrpList(rowData, cell)}
          >
            <i className="i_delete icon-sm fs-5"></i>
          </button>
        </div>
      </>
    );
  }

  const handleSelectCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      const updatedCategories = selectedCategories.includes("All")
        ? [category]
        : selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(updatedCategories);

      if (updatedCategories.length === 0) {
        setSelectedCategories(["All"]);
      } else {
        setSelectedCategories(updatedCategories);
      }
    }
  };

  const searchSrvr = async () => {
    try {
      const btnVal = document.getElementsByName("sSrvrGrp");

      var selVal = [];
      for (var i = 0; i < btnVal.length; i++) {
        if (
          btnVal[i].classList.contains("active") === true &&
          btnVal[i].getAttribute("value") != "All"
        ) {
          selVal.push(btnVal[i].getAttribute("value"));
        }
      }

      const bodyData = {
        case_method: "SRVR_GET",
        alias: sSrvrNm,
        grp_sn_list: selVal,
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

  async function addGrpList(dataVal: any) {
    const tableInfo: any = grpTableRef.current?.table;
    const tableData = tableInfo.getData();
    const filterData = tableData.filter(
      (d: any) => dataVal.inGrpNm === d.group_nm
    );

    if (filterData.length > 0) {
      alert(t("MUL_ST_00167"));
    } else {
      tableInfo.addRow(
        { group_nm: dataVal.inGrpNm, group_desc: dataVal.inDesc },
        true
      );
    }
  }

  async function delGrpList(dataVal: any, cell: any) {
    cell.getRow().delete();
  }

  const grpInfoCreate = async () => {
    const tableInfo: any = tableRef.current;
    const grpTableInfo: any = grpTableRef.current;

    const selectedData = tableInfo.table.getSelectedData();
    const addGrpData = grpTableInfo.table.getData();

    const srvrSnData: any = [];
    const grpListData: any = [];

    if (selectedData != "") {
      if (addGrpData && addGrpData != "") {
        if (confirm(t("MUL_ST_00166") as string)) {
          selectedData.forEach((sData: any, idx: number) => {
            srvrSnData.push(sData.tib_srvr_sn);
          });

          addGrpData.forEach((gData: any, idx: number) => {
            const concatVal: any = {};
            concatVal.group_name = gData.group_nm;
            concatVal.description = gData.group_desc;
            grpListData.push(concatVal);
          });

          const bodyData = {
            case_method: "GRP_POST",
            tib_srvr_list: srvrSnData,
            group_add_info_list: grpListData,
          };

          const res = await fetch(grpInfoUrl, {
            body: JSON.stringify(bodyData),
            method: "POST",
          });

          const data = await res.json();

          if (data && data.code == "200") {
            alert(t("MUL_ST_0078"));

            if (onClickToggleModal) {
              onClickToggleModal();
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
            alert(t("MUL_ST_0079"));
          }
        }
      } else {
        alert(t("MUL_ST_0080"));
      }
    } else {
      alert(t("MUL_ST_0081"));
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w_900">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ color: "black" }}
                  id="staticBackdropLabel"
                >
                  {t("MUL_WD_0106")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClickToggleModal) {
                      onClickToggleModal();
                    }
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit(handleRegistration, headleError)}>
                <div className="modal-body">
                  <div className="content__boxed">
                    <div className="row col-md-12 justify-content-center">
                      <div className="col-md-6">
                        <div className="name_sel">
                          <div
                            className="gridjs-wrapper"
                            style={{ maxHeight: "80px" }}
                          >
                            <button
                              type="button"
                              className={
                                selectedCategories.includes("All")
                                  ? "name_sel_butt active"
                                  : "name_sel_butt"
                              }
                              name="sSrvrGrp"
                              key={"All"}
                              value={"All"}
                              onClick={() => handleSelectCategory("All")}
                            >
                              All
                            </button>
                            {srvrGrpData.map((item: any) => (
                              <button
                                type="button"
                                className={
                                  selectedCategories.includes(item.grp_nm)
                                    ? "name_sel_butt active"
                                    : "name_sel_butt"
                                }
                                name="sSrvrGrp"
                                key={item.grp_sn}
                                value={item.grp_sn}
                                onClick={() =>
                                  handleSelectCategory(item.grp_nm)
                                }
                              >
                                {item.grp_nm}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-10 boder_bt1">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control input_radius_r"
                              id="sSrvrNm"
                              name="sSrvrNm"
                              onChange={onChangeSearch}
                            />
                            <button
                              type="button"
                              className="btn btn-icon btn-deepgray input_radius_l"
                              onClick={() => searchSrvr()}
                            >
                              <i className="i_xs_search"></i>
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 table-responsive">
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
                      <div className="row col-md-6">
                        <div className="mb-2 row col-md-12">
                          <label
                            className="col-sm-4 col-form-label text-sm-end"
                            htmlFor="inGrpNm"
                          >
                            * {t("MUL_WD_0020")} {t("MUL_WD_0072")}
                          </label>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.inGrpNm ? "is-invalid" : ""
                              }`}
                              id="inGrpNm"
                              {...register("inGrpNm")}
                            />
                            <div className="invalid-feedback">
                              {errors.inGrpNm?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 row col-md-12">
                          <label
                            className="col-sm-4 col-form-label text-sm-end"
                            htmlFor="inDesc"
                          >
                            {t("MUL_WD_0105")}
                          </label>
                          <div className="col-sm-8">
                            <textarea
                              id="inDesc"
                              className="form-control"
                              placeholder="comment"
                              rows={3}
                              {...register("inDesc")}
                            ></textarea>
                          </div>
                        </div>

                        <div className="mt-2 d-flex justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-sm btn-gray"
                            disabled={isSubmitting}
                          >
                            {t("MUL_WD_0029")}
                          </button>
                        </div>
                        <div className="table-responsive">
                          <ReactTabulator
                            key={grpTableData.length}
                            ref={grpTableRef}
                            autoResize={false}
                            data={grpTableData}
                            columns={grpColumns}
                            options={grpOptions}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer justify-content-center">
                  <div className="flex-wrap gap-2 mt-3 d-flex">
                    <button
                      type="button"
                      className="btn btn-deepgray btn-lg"
                      onClick={() => grpInfoCreate()}
                    >
                      {t("MUL_WD_0024")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light btn-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onClickToggleModal) {
                          onClickToggleModal();
                        }
                      }}
                    >
                      {t("MUL_WD_0023")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
