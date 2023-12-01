import "react-tabulator/lib/styles.css";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { EMSSrvrListData, PropListData } from "@/types/webComm";
import { useSelectedDataContext } from "@/constant/context/selectedDataContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

interface ModalDefaultType {
  changeState: any;
}

function SetStep1({ changeState }: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<EMSSrvrListData[]>([]);
  const [srvrGrpData, setSrvrGrpData] = useState<PropListData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [selectedGroup, setSelectedGroup] = useState<number[]>([]);
  const { setServerData } = useSelectedDataContext();

  let srvrInfoUrl = `/api/setting/ems/emsSrvrApi`;

  const fetchTableData = async () => {
    try {
      const bodyData = {
        case_method: "GRP_GET",
        alias: "",
        grp_sn_list: selectedGroup,
      };

      const res = await fetch(srvrInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();

      const dataInfo = data[0].data;
      const grpData = data[1].data;

      setTableData(dataInfo);
      setSrvrGrpData(grpData);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [selectedGroup]);

  const columns: ColumnDefinition[] = [
    {
      title: "",
      width: 40,
      formatter: (cell: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        const rowData = cell.getRow().getData();
        checkbox.addEventListener("change", () => {
          const row = cell.getRow();
          const isChecked = checkbox.checked;
          if (isChecked) {
            const selectedRows = tableRef.current?.table.getSelectedRows();
            if (selectedRows) {
              selectedRows.forEach((selectedRow: any) => {
                const selectedCheckbox = selectedRow
                  .getElement()
                  .querySelector("input[type='radio']");
                if (selectedCheckbox && selectedCheckbox !== checkbox) {
                  (selectedCheckbox as HTMLInputElement).checked = false;
                  selectedRow.toggleSelect();
                }
              });
            }
          }

          row.toggleSelect();
        });

        return checkbox;
      },
      hozAlign: "center",
      headerSort: false,
      headerTooltip: true,
      cssClass: "text-center",
    },
    {
      title: "ServerName",
      field: "tib_srvr_alias",
      headerTooltip: true,
      hozAlign: "center",
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
      title: "Group",
      field: "grp_nm",
      headerTooltip: true,
      hozAlign: "center",
      tooltip: formatTooltip,
    },
    {
      title: "GroupSn",
      field: "grp_sn",
      headerTooltip: true,
      hozAlign: "center",
      visible: false,
    },
  ];

  const langVal = t("MUL_ST_0009");

  const options: ReactTabulatorOptions = {
    maxHeight: 300,
    layout: "fitColumns",
    placeholder: langVal,
  };

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  // 데이터 필터링
  const filteredDataByCategory = selectedCategories.includes("All")
    ? tableData
    : tableData.filter((item) => selectedCategories.includes(item.grp_nm));

  // 서버 그룹 선택
  const handleSelectCategory = (category: string, groupSn: number) => {
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

  const fnNext = () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData && selectedData != "") {
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      const savedSelectedData = JSON.parse(
        localStorage.getItem("selectedData") || "[]"
      );

      if (savedSelectedData.length === 0) {
        toast.error(t("MUL_ST_0005"));
        return;
      }

      const selectedObjData = savedSelectedData[0];
      const dataArray = [
        {
          srvrSn: selectedObjData.tib_srvr_sn,
          srvrNm: selectedObjData.tib_srvr_alias,
          grpNm: selectedObjData.grp_nm,
          grpSn: selectedObjData.grp_sn,
        },
      ];
      const selectedDataArray = dataArray[0];
      setServerData(selectedDataArray);

      changeState(1);
    } else {
      alert(t("MUL_ST_0004"));
    }
  };

  return (
    <>
      <h4>EMS Server</h4>
      <div className="name_sel">
        <div
          className="gridjs-wrapper custom_butt"
          style={{ maxHeight: "80px" }}
        >
          <button
            className={
              selectedCategories.includes("All")
                ? "name_sel_butt active"
                : "name_sel_butt"
            }
            name="sSrvrGrp"
            key={"All"}
            value={"All"}
            onClick={() => handleSelectCategory("All", 0)}
          >
            All
          </button>
          {srvrGrpData.map((item: any) => (
            <button
              className={
                selectedCategories.includes(item.grp_nm)
                  ? "name_sel_butt active"
                  : "name_sel_butt"
              }
              name="sSrvrGrp"
              key={item.grp_sn}
              value={item.grp_sn}
              onClick={() => handleSelectCategory(item.grp_nm, item.grp_sn)}
            >
              {item.grp_nm}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 mb-2 table-responsive">
        <ReactTabulator
          key={filteredDataByCategory.length}
          ref={tableRef}
          autoResize={false}
          data={filteredDataByCategory}
          columns={columns}
          options={options}
        />
      </div>
      <div className="mt-3 t_c">
        <button
          type="button"
          className="btn btn-sm btn-gray"
          onClick={() => fnNext()}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default SetStep1;
