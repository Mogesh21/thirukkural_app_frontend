import React from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

const DateSelector = ({ date, setDate }) => {
  const rangePresets = [
    { label: "Current Month", value: [dayjs().startOf("month"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const handleDateChange = (val) => {
    setDate({
      start: dayjs(val[0]),
      end: dayjs(val[1]),
    });
  };

  return (
    <RangePicker
      value={[dayjs(date.start), dayjs(date.end)]}
      className={`max-w-[25rem]`}
      format={"DD MMM YYYY"}
      presets={rangePresets}
      onChange={handleDateChange}
      suffixIcon={null}
      // prefix="From"
    />
  );
};

export default DateSelector;
