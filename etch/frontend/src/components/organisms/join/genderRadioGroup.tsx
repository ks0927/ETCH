import RadioInput from "../../molecules/join/radioInput";

interface GenderRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
}

function GenderRadioGroup({ value, onChange }: GenderRadioGroupProps) {
  const handleGenderChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <div className="flex gap-6">
      <RadioInput
        type="radio"
        name="gender"
        value="male"
        checked={value === "male"}
        onChange={handleGenderChange}
        placeholder="남성"
      />
      <RadioInput
        type="radio"
        name="gender"
        value="female"
        checked={value === "female"}
        onChange={handleGenderChange}
        placeholder="여성"
      />
    </div>
  );
}

export default GenderRadioGroup;
