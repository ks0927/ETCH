import type { InputProps } from "../../types/input";

export default function Input({
  value,
  type,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <input
      className=" px-4 border border-[#007DFC] rounded-4xl focus:outline-none caret-[#007DFC]"
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
