import React, { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { CellComponent, RowComponent } from "tabulator-tables";
import "react-tabulator/lib/styles.css";
import { TopicTableData } from "@/types/webComm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface TopicDropdownProps {
  topicSelected: any;
  cleanVal: any;
  serverData: any;
}

const TopicDropdown: React.FC<TopicDropdownProps> = ({
  topicSelected,
  serverData,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [selectedTopicNames, setSelectedTopicNames] = useState<string[]>([]);
  const [selectedServerCount, setSelectedServerCount] = useState<number>(0);
  const [rowData, setRowData] = useState<TopicTableData[]>([]);
  const [selectedPattern, setSelectedPattern] = useState("ALL");

  const columns = [
    {
      title: "",
      width: 40,
      frozen: true,
      formatter: (cell: CellComponent) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.addEventListener("change", () => {
          const row = cell.getRow();
          const isChecked = checkbox.checked;

          if (isChecked) {
            const selectedRows = tableRef.current?.table.getSelectedRows();
            if (selectedRows) {
              selectedRows.forEach((selectedRow: RowComponent) => {
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
      title: "topicName",
      field: "ems_tpc_nm",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  let url = "/api/situation/topic/topicListApi";

  // TopicList
  const fetchTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_list: serverData,
        pattern: selectedPattern,
        name: "",
      };
      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const topicList = data.data;

      const uniqueTopics = [];
      const topicSet = new Set();
      for (const topic of topicList) {
        const ems_tpc_nm = topic.ems_tpc_nm;
        if (!topicSet.has(ems_tpc_nm)) {
          topicSet.add(ems_tpc_nm);
          uniqueTopics.push(topic);
        }
      }
      setRowData(uniqueTopics);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, [serverData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 데이터 필터링
  const filteredData = searchTerm
    ? rowData.filter((item) =>
        item.ems_tpc_nm.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rowData;

  const options = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    placeholder: t("MUL_ST_0009"),
    // maxHeight: 250,
    height: 250,
    pagination: true,
    paginationSize: 10,
  };

  // 검색 삭제
  const clearSearch = () => {
    setSearchTerm("");
    tableRef.current?.table.clearFilter();
  };

  // 적용 버튼 눌렀을 때
  const handleConfirm = () => {
    const tableInfo: any = tableRef.current;
    const selectedData = tableInfo.table.getSelectedData();

    if (selectedData && selectedData != "") {
      topicSelected(selectedData[0].ems_tpc_nm);
      const selArr = [];
      selArr.push(selectedData[0].ems_tpc_nm);

      setSelectedTopicNames(selArr);
      setSelectedServerCount(1);
      setDropdownMenu(false);
    } else {
      alert(t("MUL_ST_0019"));
      // setSelectedTopicNames([]);
      // setSelectedServerCount(0);
    }
  };

  // 드롭다운 열기 버튼
  const handleDropdownVisible = () => {
    // fetchTableDataAsync();
    setSearchTerm("");
    setDropdownMenu(!dropdownMenu);
  };

  // 취소 버튼
  const handleCancelClick = () => {
    setDropdownMenu(false);
  };

  const dropdownText =
    selectedServerCount > 0
      ? `${selectedTopicNames[0]}외 ${selectedServerCount - 1}건`
      : "topic";

  const selectedOptionName =
    selectedServerCount === 1 ? selectedTopicNames[0] : "";

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef as React.RefObject<HTMLDivElement>}>
      {/* === 입력 창 === */}
      <div className="select_box p_r">
        <div
          className="form-select"
          id="sel_server"
          style={{ cursor: "pointer" }}
          onClick={handleDropdownVisible}
        >
          {selectedServerCount === 1 ? selectedOptionName : dropdownText}
        </div>
        {/* === 드롭 다운 메뉴 === */}
        {dropdownMenu ? (
          <div className="ems_sel_ly">
            <div className="sel_all_cont">
              {/* === 검색 기능 === */}
              <div className="search_area">
                <div className="col-sm-11 float-start">
                  <input
                    className="form-control input_30"
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* === 검색 기능 === */}
              <div className="p_5 table-responsive">
                <ReactTabulator
                  key={filteredData.length}
                  ref={tableRef}
                  data={filteredData}
                  columns={columns}
                  options={options}
                  layout={"fitData"}
                />
              </div>
            </div>
            <div>
              {/* === 확인/취소 버튼 === */}
              <div className="bott_button">
                <div className="mt-2 mb-2 d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="btn btn-xs btn-light mr_3"
                  >
                    {t("MUL_WD_0024")}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="btn btn-xs btn-light"
                  >
                    {t("MUL_WD_0023")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default TopicDropdown;
