import React, { useEffect, useRef, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { RowComponent } from "tabulator-tables";
import "react-tabulator/lib/styles.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface TableDataItem {
  id: number;
  grp_nm: string;
  tib_srvr_alias: string;
  tib_srvr_sn: number;
  grp_sn: number;
}

interface ServerGroupDataItem {
  grp_nm: string;
  grp_sn: number;
}

interface DropdownComponentProps {
  onServerSelected: (tib_srvr_sn: number[]) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  onServerSelected,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const tableRef = useRef<ReactTabulator | null>(null);
  const [rowData, setRowData] = useState<TableDataItem[]>([]);
  const [groupData, setGroupData] = useState<ServerGroupDataItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [selectedServerNames, setSelectedServerNames] = useState<string[]>([]);
  const [selectedServerCount, setSelectedServerCount] = useState<number>(0);

  const columns = [
    {
      title: "",
      width: 40,
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      cssClass: "text-center",
      cellClick: function (_e: any, cell: { getRow: () => any }) {
        const row = cell.getRow();
        row.toggleSelect();
      },
    },
    {
      title: t("MUL_WD_0020"),
      field: "grp_nm",
      hozAlign: "left",
      headerTooltip: true,
      width: 100,
    },
    {
      title: t("MUL_WD_0069"),
      field: "tib_srvr_alias",
      hozAlign: "left",
      headerTooltip: true,
      width: 125,
    },
    {
      title: t("MUL_WD_0043"),
      field: "grp_desc",
      hozAlign: "left",
      headerTooltip: true,
      width: 160,
    },
  ];

  let url = "/api/common/serverDropdown";

  // 서버 조회
  const fetchTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET_LIST",
        alias: "",
        grp_sn_list: selectedGroup,
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setRowData(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  // 서버 그룹 조회
  const fetchGroupDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET_GROUP",
      };

      const res = await fetch(url, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setGroupData(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchTableDataAsync();
    fetchGroupDataAsync();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 데이터 필터링
  const filteredData = searchTerm
    ? rowData.filter((item) =>
        item.tib_srvr_alias.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rowData;

  const filteredDataByCategory = selectedCategories.includes("All")
    ? filteredData
    : filteredData.filter((item) => selectedCategories.includes(item.grp_nm));

  // 서버 그룹 선택
  const handleSelectCategory = (category: string, groupSn: number) => {
    setSelectedGroup([groupSn]);
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

  const options = {
    layout: "fitColumns",
    placeholder: t("MUL_ST_0009"),
    height: 300,
  };

  // 검색 삭제
  const clearSearch = () => {
    setSearchTerm("");
    tableRef.current?.table.clearFilter();
  };

  const toastOptions = {
    autoClose: 2500,
    hideProgressBar: true,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
  };

  // 조회 버튼 눌렀을 때
  const handleConfirm = () => {
    const selectedRows = tableRef.current?.table.getSelectedRows() || [];
    const selectedCount = selectedRows.length;
    const selectedItems = selectedRows.map((row: RowComponent) =>
      row.getData()
    );
    const selectedServerNames = selectedItems.map(
      (item: TableDataItem) => item.tib_srvr_alias
    );
    const selectedServerSerialNumber = selectedItems.map(
      (item: TableDataItem) => item.tib_srvr_sn
    );
    let confirmVal = "";
    if (lang === "en") {
      confirmVal = `You have selected ${selectedCount} servers.`;
    } else if (lang === "ko") {
      confirmVal = `서버 ${selectedCount}건을 선택했습니다.`;
    }

    if (selectedCount > 0) {
      toast.success(
        <div>
          <p>{confirmVal}</p>
          <div>{t("MUL_ST_0069")}</div>
          <div>{`${selectedServerNames.join(", ")}`}</div>
        </div>,
        toastOptions
      );

      onServerSelected(selectedServerSerialNumber);
      setSelectedServerNames(selectedServerNames);
      setSelectedServerCount(selectedCount);
    } else if (selectedCount === 0) {
      onServerSelected([]);
      setSelectedServerNames(["server"]);
      toast.success(
        <div>
          <p>{confirmVal}</p>
          <div>{t("MUL_ST_0069")}</div>
          <div>{`${selectedServerNames.join(", ")}`}</div>
        </div>,
        toastOptions
      );
    } else {
      toast.error("No servers selected");
      setSelectedServerNames([]);
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
      ? `${selectedServerNames[0]}외 ${selectedServerCount - 1}건`
      : "server";

  const selectedOptionName =
    selectedServerCount === 1 ? selectedServerNames[0] : "";

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
              {/* === 카테고리 === */}
              <div className="name_sel">
                <div
                  className="gridjs-wrapper custom_butt"
                  style={{ maxHeight: "80px" }}
                >
                  <button
                    key="All"
                    onClick={() => handleSelectCategory("All", 0)}
                    className={
                      selectedCategories.includes("All")
                        ? "name_sel_butt active"
                        : "name_sel_butt"
                    }
                  >
                    All
                  </button>
                  {Array.isArray(groupData) &&
                    groupData.map((group) => (
                      <button
                        key={group.grp_sn}
                        onClick={() =>
                          handleSelectCategory(group.grp_nm, group.grp_sn)
                        }
                        className={
                          selectedCategories.includes(group.grp_nm)
                            ? "name_sel_butt active"
                            : "name_sel_butt"
                        }
                      >
                        {group.grp_nm}
                      </button>
                    ))}
                </div>
              </div>
              {/* === 카테고리 === */}

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
                  key={filteredDataByCategory.length}
                  ref={tableRef}
                  data={filteredDataByCategory}
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
                    onClick={handleConfirm}
                    className="btn btn-xs btn-light mr_3"
                  >
                    {t("MUL_WD_0024")}
                  </button>
                  <button
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

export default DropdownComponent;
