import "react-tabulator/lib/styles.css";
import {
  ReactTabulator,
  ReactTabulatorOptions,
  ColumnDefinition,
} from "react-tabulator";
import { useRef } from "react";
import DownloadFileNm from "@/utils/downloadFileNm";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

const GetHeader = (props: any) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const setData = props.setData;
  const setHeaderData = setData.sys_header;
  const tableHeaderRef = useRef<ReactTabulator | null>(null);

  const headerColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const downloadHeaderColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const langVal = t("MUL_ST_0009");

  const headerOptions: ReactTabulatorOptions = {
    height: 350,
    layout: "fitColumns",
    placeholder: langVal,
  };

  const headerDataVal: any = [];

  var keys = Object.keys(setHeaderData);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    let concatVal: any = {};
    concatVal.key = key;
    concatVal.value = setHeaderData[key];
    headerDataVal.push(concatVal);
  }

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Browse_Header", fileType);

    if (tableHeaderRef.current && tableHeaderRef.current.table) {
      const table = tableHeaderRef.current.table;
      table.setColumns(downloadHeaderColumns);
      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
      table.setColumns(headerColumns);
    }
  };

  return (
    <>
      <div id="headerForm" style={{ display: "block" }}>
        <div className="d-flex justify-content-md-end">
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
            key={headerDataVal.length}
            ref={tableHeaderRef}
            autoResize={false}
            data={headerDataVal}
            columns={headerColumns}
            options={headerOptions}
          />
        </div>
      </div>
    </>
  );
};

export default GetHeader;
