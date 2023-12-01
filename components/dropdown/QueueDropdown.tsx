import React, { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { CellComponent, RowComponent } from "tabulator-tables";
import "react-tabulator/lib/styles.css";
import axios from "axios";
import { QueueTableData } from "@/types/webComm";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface QueueDropdownProps {
  id: string;
  queueSelected: (queueNm: string[]) => void;
  serverData: number[];
}

const QueueDropdown: React.FC<QueueDropdownProps> = ({
  id,
  queueSelected,
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
  const [selectedQueueNames, setSelectedQueueNames] = useState<string[]>([]);
  const [selectedServerCount, setSelectedServerCount] = useState<number>(0);
  const [rowData, setRowData] = useState<QueueTableData[]>([]);
  const [selectedPattern, setSelectedPattern] = useState("");

  const columns = [
    {
      title: "",
      width: 40,
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
      title: "QueueName",
      field: "ems_que_nm",
      headerTooltip: true,
      hozAlign: "center",
    },
  ];

  // QueueList
  const fetchTableDataAsync = async () => {
    try {
      const params = {
        tib_srvr_list: serverData,
        pattern: selectedPattern,
      };

      // 필터된 매개 변수 생성
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => !isEmpty(value))
      );

      const paramString = Object.entries(filteredParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              Array.isArray(value) && value.length
                ? value.join(",")
                : value.toString()
            )}`
        )
        .join("&");

      const url = `/api/v2/monitor/queue?${paramString}`;

      const response = await axios.get(url, {});
      const queueList = response.data.data;

      // 중복 ems_que_nm을 제거하기 위해 Set 객체를 사용
      const uniqueQueues = [];
      const queueSet = new Set();
      for (const queue of queueList) {
        const ems_que_nm = queue.ems_que_nm;
        if (!queueSet.has(ems_que_nm)) {
          queueSet.add(ems_que_nm);
          uniqueQueues.push(queue);
        }
      }
      setRowData(uniqueQueues);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 데이터 필터링
  const filteredData = searchTerm
    ? rowData.filter((item) =>
        item.ems_que_nm.toLowerCase().includes(searchTerm.toLowerCase())
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

  // 적용 버튼 눌렀을 때
  const handleConfirm = () => {
    const selectedRows = tableRef.current?.table.getSelectedRows() || [];
    const selectedCount = selectedRows.length;
    const selectedItems = selectedRows.map((row: RowComponent) =>
      row.getData()
    );
    const selectedQueueNames = selectedItems.map(
      (item: QueueTableData) => item.ems_que_nm
    );
    if (selectedCount > 0) {
      queueSelected(selectedQueueNames);

      setSelectedQueueNames(selectedQueueNames);
      setSelectedServerCount(selectedCount);
    } else if (selectedCount === 0) {
      queueSelected([]);
      setSelectedQueueNames(["server"]);
    } else {
      // toast.error("No Queue selected");
      setSelectedQueueNames([]);
      setSelectedServerCount(0);
    }

    setDropdownMenu(false);
  };

  // 드롭다운 열기 버튼
  const handleDropdownVisible = () => {
    setSearchTerm("");
    setDropdownMenu(!dropdownMenu);
  };

  // 취소 버튼
  const handleCancelClick = () => {
    setDropdownMenu(false);
  };

  const dropdownText =
    selectedServerCount > 0
      ? `${selectedQueueNames[0]}외 ${selectedServerCount - 1}건`
      : "queue";

  const selectedOptionName =
    selectedServerCount === 1 ? selectedQueueNames[0] : "";

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

export default QueueDropdown;
