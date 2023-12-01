import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface GenericTableProps {
  handleClose: () => void;
  columns: any[];
  rowData: any[];
  title: string;
}

const GenericTableModal: React.FC<GenericTableProps> = ({
  handleClose,
  columns,
  rowData,
  title,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [openModal, setOpenModal] = useState<boolean>(true);

  const options = {
    layout: "fitColumns",
    printAsHtml: true,
    printVisibleRowsOnly: true,
    movableColumns: true,
    placeholder: t("MUL_ST_0009"),
  };
  const handleButtonClick = () => {
    handleClose();
  };

  return (
    <div style={{ zIndex: 10 }}>
      {openModal === true && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              paddingTop: 20,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              background: "white",
              textAlignLast: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 20 }}>{title}</div>
              <img src="/download.png" style={{ cursor: "pointer" }}></img>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: 300,
              }}
            >
              <table className="w-full border-collapse">
                <ReactTabulator
                  key={rowData.length}
                  data={rowData}
                  columns={columns}
                  options={options}
                  layout={"fitData"}
                />
              </table>
            </div>
            <button
              style={{
                width: 60,
                height: 30,
                marginTop: 10,
                backgroundColor: "ivory",
                border: "2px solid grey",
                borderRadius: 8,
              }}
              onClick={handleButtonClick}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericTableModal;
