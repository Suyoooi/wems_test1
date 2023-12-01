import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface QuickDatePickerProps {
  selectedDate: string;
  onSelectedDateChange: (date: Date | null) => void;
}
interface QuickOptionList {
  value: string;
  minutes: number;
}

const SingleCalendarWithTimePicker: React.FC<QuickDatePickerProps> = ({
  selectedDate,
  onSelectedDateChange,
}) => {
  const nowTime = new Date(Date.now());
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    nowTime
  );

  const singleDatePickerRef = useRef<any>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDateTime(date);
    onSelectedDateChange(date);
  };

  const openDatePicker = () => {
    singleDatePickerRef.current.setOpen(true);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <DatePicker
          className="custom-date-picker single-date-picker"
          ref={singleDatePickerRef}
          selected={selectedDateTime}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="yyyy.MM.dd HH:mm"
          timeFormat="HH:mm"
        />
        {/* <img
          src="/calender.png"
          style={{ width: 24, cursor: "pointer" }}
          onClick={openDatePicker}
        /> */}
      </div>
    </div>
  );
};

export default SingleCalendarWithTimePicker;
