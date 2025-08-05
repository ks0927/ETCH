import type { StatsButtonProps } from "../../atoms/button";

const StatsButton = ({ count, label, onClick }: StatsButtonProps) => {
  return (
    <button className="text-center hover:text-blue-600" onClick={onClick}>
      <div className="font-semibold text-lg">{count}</div>
      <div className="text-gray-500">{label}</div>
    </button>
  );
};

export default StatsButton;