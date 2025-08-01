import { useState } from "react";
import RadioInput from "../molecules/radioInput";

function GenderRadioGroup() {
  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
  };

  return (
    <div className="flex gap-6">
      <RadioInput
        type="radio"
        name="gender"
        value="male"
        checked={selectedGender === "male"}
        onChange={handleGenderChange}
        placeholder="남성"
      />
      <RadioInput
        type="radio"
        name="gender"
        value="female"
        checked={selectedGender === "female"}
        onChange={handleGenderChange}
        placeholder="여성"
      />
    </div>
  );
}

export default GenderRadioGroup;
