import { useState } from "react";
import BirthDropdown from "../../molecules/join/birthDropdown";

function BirthDateSelector() {
  const [selectedDate, setSelectedDate] = useState({
    year: "",
    month: "",
    day: "",
  });
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: `${new Date().getFullYear() - i}년`,
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}월`,
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}일`,
  }));

  const handleYearChange = (value: string) => {
    setSelectedDate((prev) => ({ ...prev, year: value }));
  };

  const handleMonthChange = (value: string) => {
    setSelectedDate((prev) => ({ ...prev, month: value }));
  };

  const handleDayChange = (value: string) => {
    setSelectedDate((prev) => ({ ...prev, day: value }));
  };

  return (
    <div className="flex gap-2">
      <BirthDropdown
        options={years}
        value={selectedDate.year}
        onChange={handleYearChange}
        placeholder="년도"
      />
      <BirthDropdown
        options={months}
        value={selectedDate.month}
        onChange={handleMonthChange}
        placeholder="월"
      />
      <BirthDropdown
        options={days}
        value={selectedDate.day}
        onChange={handleDayChange}
        placeholder="일"
      />
    </div>
  );
}

export default BirthDateSelector;
