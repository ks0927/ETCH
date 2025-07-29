interface InputProps {
  value: string; // input안에 들어올 내용
  type: string; // 어떤 형식인지(ex.email, password, text 등등)
  placeholder: string; //   placeholder에 적을 말
  onChange: (value: string) => void;
}

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
