import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface QuickDatePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  defaultTime: Date | null;
}
interface QuickOptionList {
  value: string;
  minutes: number;
}

const QuickDatePicker: React.FC<QuickDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  defaultTime,
}) => {
  // const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const nowTime = new Date(Date.now());
  const [startDateTime, setStartDateTime] = useState<Date | null>(defaultTime);
  const [endDateTime, setEndDateTime] = useState<Date | null>(nowTime);
  const startDatePickerRef = useRef<any>(null);
  const endDatePickerRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const BeforeQuickList: QuickOptionList[] = [
    { value: t("MUL_WD_0027"), minutes: 1 },
    { value: t("MUL_WD_0127"), minutes: 5 },
    { value: t("MUL_WD_0128"), minutes: 10 },
    { value: t("MUL_WD_0129"), minutes: 20 },
    { value: t("MUL_WD_0130"), minutes: 30 },
  ];

  const AfterQuickList: QuickOptionList[] = [
    { value: t("MUL_WD_0028"), minutes: 1 },
    { value: t("MUL_WD_0131"), minutes: 5 },
    { value: t("MUL_WD_0132"), minutes: 10 },
    { value: t("MUL_WD_0133"), minutes: 20 },
    { value: t("MUL_WD_0134"), minutes: 30 },
  ];

  const handleStartDateChange = (date: Date | null) => {
    setStartDateTime(date);
    onStartDateChange(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDateTime(date);
    onEndDateChange(date);
  };

  const isTimeAvailable = (time: Date) => {
    if (!startDateTime) return true;
    return time.getTime() > startDateTime.getTime();
  };

  const handleButtonClick = () => {
    setOpenModal(!openModal);
  };

  // 백그라운드 클릭했을 때 모달 닫히도록 설정
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // DatePicker 클릭 시 모달 닫기
  const handleDatePickerClick = () => {
    setOpenModal(false);
  };

  const handleQuickSelect = (value: string, minutes: number) => {
    const currentTime = new Date();
    let newEndDateTime;
    let newStartDateTime;

    if (value.includes("후")) {
      newStartDateTime = new Date(
        startDateTime!.getTime() + minutes * 60 * 1000
      );
      newEndDateTime =
        newStartDateTime > currentTime ? currentTime : newStartDateTime;
      setEndDateTime(newStartDateTime);
    } else if (value.includes("최근")) {
      newEndDateTime = new Date(currentTime.getTime());
      newStartDateTime = new Date(currentTime.getTime() - minutes * 60 * 1000);
      setEndDateTime(newEndDateTime);
      setStartDateTime(newStartDateTime);
    } else {
      return;
    }
    onStartDateChange(newStartDateTime);
    onEndDateChange(newEndDateTime);
  };

  const closeQuickModal = () => {
    setOpenModal(false);
  };

  const handleReset = () => {
    // const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const nowTime = new Date(Date.now());
    setStartDateTime(defaultTime);
    setEndDateTime(nowTime);
    onStartDateChange(defaultTime);
    onEndDateChange(nowTime);
    setOpenModal(false);
  };

  return (
    <div ref={dropdownRef as React.RefObject<HTMLDivElement>}>
      <div
        // className="date-picker-container react-datepicker__time-container "
        style={{ display: "flex" }}
      >
        <div style={{ display: "flex" }} onClick={handleDatePickerClick}>
          <DatePicker
            className="custom-date-picker left-date-picker"
            // className="form-control"
            ref={startDatePickerRef}
            selected={startDateTime}
            onChange={handleStartDateChange}
            showTimeSelect
            dateFormat="yyyy.MM.dd HH:mm"
            timeFormat="HH:mm"
            selectsStart
            startDate={startDateTime}
            // endDate={endDateTime}
          />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="middle-date-picker"
          >
            ~
          </span>
          <DatePicker
            className="custom-date-picker right-date-picker "
            ref={endDatePickerRef}
            selected={endDateTime}
            onChange={handleEndDateChange}
            showTimeSelect
            dateFormat="yyyy.MM.dd HH:mm"
            timeFormat="HH:mm"
            selectsEnd
            // startDate={startDateTime}
            endDate={endDateTime}
            minDate={startDateTime || new Date()}
            filterTime={isTimeAvailable}
          />
        </div>
        <div>
          <button
            type="button"
            className="btn btn-icon btn-deepgray input_radius_l"
            onClick={handleButtonClick}
          >
            <i className="i_calendar icon-lg fs-5"></i>
          </button>
        </div>
        {/* === 모달창 === */}
        {/* <!-- Time range --> */}
        {openModal ? (
          <div
            className="modal_timerange"
            style={{ zIndex: 100, marginTop: 38 }}
          >
            <div className="modal-header-timerange">
              <h5 className="modal-title-timerange" style={{ color: "black" }}>
                Time Range
              </h5>
              <div className="justify-content-md-end">
                <button
                  className="btn btn-icon btn-outline-light btn_t_xs"
                  onClick={handleReset}
                >
                  <i className="i_reset"></i>
                </button>
              </div>
            </div>
            <div className="p-10 mt-2">
              <div className="row">
                <div className="row col-md-12">
                  {BeforeQuickList.map((data) => (
                    <div className="mt-1 col-sm-3">
                      <button
                        key={data.value}
                        onClick={() => {
                          handleQuickSelect(data.value, data.minutes);
                          closeQuickModal();
                        }}
                        className="btn btn-sm btn-gray btn_timesel"
                      >
                        {data.value}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="mt-2 row col-md-12">
                  {AfterQuickList.map((data) => (
                    <div className="mt-1 col-sm-3">
                      <button
                        key={data.value}
                        onClick={() => {
                          handleQuickSelect(data.value, data.minutes);
                          closeQuickModal();
                        }}
                        className="btn btn-sm btn-deepgray btn_timesel"
                      >
                        {data.value}
                      </button>
                    </div>
                  ))}
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

export default QuickDatePicker;
