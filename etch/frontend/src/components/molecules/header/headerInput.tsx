import type { InputProps } from "../../atoms/input";

function HeaderInput({
  value,
  type,
  placeholderText: placeholder,
  onChange,
  onKeyEnter,
}: InputProps) {
  return (
    <input
      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#007DFC] rounded-full focus:outline-none focus:ring-2 focus:ring-[#007DFC] focus:ring-opacity-50 caret-[#007DFC] text-sm sm:text-base placeholder:text-gray-400"
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyEnter}
    />
  );
}
export default HeaderInput;
