import React, { useEffect, useRef, useState } from "react";
import "react-tabulator/lib/styles.css";
import moment from "moment";
import SingleCalendarWithTimePicker from "../timeSetting/SingleCalendarWithTimePicker";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";

interface DropdownComponentProps {
  onSelectedDate: (date: string) => void;
  onSelectedTime: (selectedTime: string) => void;
  onInputChange: (inputValue: string) => void;
}

const DatePickerDropdown: React.FC<DropdownComponentProps> = ({
  onSelectedDate,
  onSelectedTime,
  onInputChange,
}) => {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [dropdownText, setDropdownText] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState("after");
  const [date, setDate] = useState(
    moment().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss")
  );

  const handleDropdownVisible = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const handleCancelClick = () => {
    setDropdownMenu(false);
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
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

  const comparisonSymbol = () => {
    if (selectedTime === "after") {
      return ">";
    } else if (selectedTime === "before") {
      return "<";
    }
    return "";
  };

  const dateString = date;
  const dateObject = new Date(dateString);
  const timestampValue = dateObject.getTime();

  //   const dropdownText = `JMSTimestamp ${comparisonSymbol()} ${timestampValue}`;

  const [inputValue, setInputValue] = useState(dropdownText);

  const handleConfirm = () => {
    setDropdownMenu(false);
    const newDropdownText = `JMSTimestamp ${comparisonSymbol()} ${timestampValue}`;
    setInputValue(newDropdownText);
    onInputChange(newDropdownText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    onInputChange(inputValue);
  };

  const initialDate = moment()
    .subtract(10, "minutes")
    .format("YYYY-MM-DD HH:mm:ss");
  const initialSelectedTime = "after";

  const handleReset = () => {
    setDate(initialDate);
    setSelectedTime(initialSelectedTime);
    onSelectedDate(initialDate);
    onSelectedTime(initialSelectedTime);
  };

  return (
    <div ref={dropdownRef as React.RefObject<HTMLDivElement>}>
      {/* === 입력 창 === */}
      <div className="select_box p_r d-flex">
        <input
          className="form-control input_radius_r"
          style={{ cursor: "pointer" }}
          value={inputValue}
          onChange={handleInputChange}
          required
        />
        <button
          type="button"
          className="btn btn-icon btn-gray input_radius_l"
          onClick={handleDropdownVisible}
        >
          <i className="i_morehoriz icon-lg fs-5"></i>
        </button>
        {/* === 드롭 다운 메뉴 === */}
        {dropdownMenu ? (
          <div
            className="ems_sel_ly"
            style={{ marginTop: 38, width: 300, height: 98 }}
          >
            <div
              className="modal_selector"
              style={{
                display: "flex",
                gap: 10,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SingleCalendarWithTimePicker
                selectedDate={date}
                onSelectedDateChange={(date) =>
                  setDate(moment(date).format("YYYY-MM-DD HH:mm:ss"))
                }
              />
              <div className="col-sm-5">
                <select
                  className="form-select"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="after">After</option>
                  <option value="before">Before</option>
                </select>
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

export default DatePickerDropdown;
