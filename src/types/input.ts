export interface InputProps {
  value: string; // input안에 들어올 내용
  type: string; // 어떤 형식인지(ex.email, password, text 등등)
  placeholder: string; //   placeholder에 적을 말
  onChange: (value: string) => void;
}
