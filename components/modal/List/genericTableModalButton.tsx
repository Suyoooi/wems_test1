import { useState } from "react";
import GenericTableModal from "./genericTableModal";

interface GenericTableModalButtonProps {
  columns: any[];
  rowData: any[];
  title: string;
  buttonText?: string;
}

const GenericTableModalButton: React.FC<GenericTableModalButtonProps> = ({
  columns,
  rowData,
  title,
  buttonText,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleButtonClick = () => {
    setOpenModal(!openModal);
  };

  return (
    <>
      <div style={{ display: "flex", marginTop: 30, marginLeft: 50 }}>
        <button
          onClick={handleButtonClick}
          style={{
            width: 180,
            height: 30,
            color: "black",
            borderRadius: 10,
            backgroundColor: "ivory",
            border: "2px solid black",
          }}
        >
          {buttonText || title}
        </button>
      </div>

      {openModal && (
        <GenericTableModal
          handleClose={handleButtonClick}
          columns={columns}
          rowData={rowData}
          title={title}
        />
      )}
    </>
  );
};

export default GenericTableModalButton;
