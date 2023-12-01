import "react-tabulator/lib/styles.css";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { useSelectedDataContext } from "@/constant/context/selectedDataContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  changeState: any;
  // allData: any;
}

function SetStep3({
  changeState,
  // allData,
  children,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  //타입 명시를 위해
  const tableRef = useRef<ReactTabulator | null>(null);
  const [tableData, setTableData] = useState<[]>([]);
  const [selector, setSelector] = useState(
    localStorage.getItem("selector") || ""
  );

  const {
    serverData,
    destinationTypeData,
    setDestinationTypeData,
    setDestinationNameData,
    selectorData,
    setSelectorData,
  } = useSelectedDataContext();
  const [destinationType, setDestinationType] = useState(
    localStorage.getItem("destinationType") || "Queue"
  );

  const langVal = t("MUL_ST_0009");

  const options: ReactTabulatorOptions = {
    maxHeight: 300,
    layout: "fitColumns",
    placeholder: langVal,
  };

  // useEffect(() => {
  //   // 컴포넌트가 언마운트될 때 값을 로컬 스토리지에 저장
  //   localStorage.setItem("selector", selector);
  //   localStorage.setItem("destinationType", destinationType);
  //   setDestinationTypeData(destinationType);
  //   setSelectorData(selector);

  //   return () => {
  //     localStorage.removeItem("selector");
  //     localStorage.removeItem("destinationType");
  //     setDestinationTypeData("");
  //     setSelectorData("");
  //   };
  // }, [destinationType, selector]);

  const fnNext = () => {
    const tableInfo: any = tableRef.current;
    // 선택한 서버 데이터
    const selectedDestination = tableInfo.table.getSelectedData();

    if (selectedDestination.length === 0) {
      toast.error("Name을 선택해주세요.");
      return;
    }

    setDestinationTypeData(destinationType);
    setSelectorData(selector);
    setDestinationNameData(selectedDestination[0].name);

    changeState(3);
  };

  const fnPrev = () => {
    changeState(1);
  };

  const srvrNm = serverData?.srvrNm;
  const srvrSn = serverData?.srvrSn;

  function formatTooltip(cell: any) {
    let data = cell.getValue();
    return data;
  }

  const columns: ColumnDefinition[] = [
    {
      title: "",
      width: 40,
      formatter: (cell: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "radio";
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
      title: "Name",
      field: "name",
      headerTooltip: true,
      hozAlign: "center",
      tooltip: formatTooltip,
    },
  ];

  const url = "/api/setting/bridge/bridgeModalApi";

  const fetchTableDataAsync = async () => {
    try {
      const bodyData = {
        case_method: "GET",
        tib_srvr_sn: srvrSn,
        ems_qt: destinationType,
      };

      const res = await fetch(url, {
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
    fetchTableDataAsync();
  }, [destinationType]);

  const handleBtnClick = (val: any) => {
    setDestinationType(val);
    fetchTableDataAsync();
  };

  return (
    <>
      <h4>Destination</h4>
      <div className="mb-2 row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="input_ems2">
          ems
        </label>
        <div className="col-sm-8">
          {/* <input
            type="text"
            className="form-control"
            disabled
            id="input_ems2"
          /> */}
          <div className="form-control">{srvrNm}</div>
        </div>
      </div>
      <div className="row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="sel_type2">
          type
        </label>
        <div className="col-sm-8">
          <div className="input-group">
            <select
              className="form-select"
              id="sel_type"
              value={destinationType}
              // onChange={(e) => setDestinationType(e.target.value)}
              onChange={(e) => handleBtnClick(e.target.value)}
            >
              {/* <option hidden>{destinationTypeData}</option> */}
              <option selected value={"Queue"}>
                Queue
              </option>
              <option value={"Topic"}>Topic</option>
            </select>
            {/* <QueueTypeComponent /> */}
            {/* <button className="btn btn-gray btn-md" onClick={handleBtnClick}>
              조회
            </button> */}
          </div>
        </div>
      </div>
      <div className="mt-2 mb-2 table-responsive">
        <ReactTabulator
          key={tableData.length}
          ref={tableRef}
          autoResize={false}
          data={tableData}
          columns={columns}
          options={options}
        />
      </div>
      <div className="mb-2 row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="input_selector">
          Selector
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            id="input_selector"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
          />
        </div>
      </div>
      <div className="gap-1 mt-3 t_c">
        <button
          type="button"
          className="btn btn-sm btn-gray"
          onClick={() => fnPrev()}
          style={{ marginRight: "0.25rem" }}
        >
          Prev
        </button>
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

export default SetStep3;
