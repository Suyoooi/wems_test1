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

const GetMapBody = (props: any) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const setData = props.setData;
  const bodyData = setData.sys_body.map_body;
  const mapData = bodyData.data;
  const tableBodyRef = useRef<ReactTabulator | null>(null);

  const bodyColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const downloadBodyColumns: ColumnDefinition[] = [
    { title: "Property", field: "key", headerTooltip: true },
    { title: "Value", field: "value", headerTooltip: true },
  ];

  const langVal = t("MUL_ST_0009");

  const bodyOptions: ReactTabulatorOptions = {
    height: 350,
    layout: "fitColumns",
    placeholder: langVal,
  };

  const handleDataExport = (fileType: string) => {
    const fullNm = DownloadFileNm("Browse_MapBody", fileType);

    if (tableBodyRef.current && tableBodyRef.current.table) {
      const table = tableBodyRef.current.table;
      table.setColumns(downloadBodyColumns);
      if (fileType == "csv") {
        table.download(fileType, fullNm, { bom: true });
      } else if (fileType == "xlsx") {
        table.download(fileType, fullNm, { sheetName: "data" });
      }
      table.setColumns(bodyColumns);
    }
  };

  return (
    <>
      <div id="mapBodyForm">
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
            key={mapData.length}
            ref={tableBodyRef}
            autoResize={false}
            data={mapData}
            columns={bodyColumns}
            options={bodyOptions}
          />
        </div>
      </div>
    </>
  );
};

export default GetMapBody;
