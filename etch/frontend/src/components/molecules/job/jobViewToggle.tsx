interface JobViewToggleProps {
  currentView: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export default function JobViewToggle({
  currentView,
  onViewChange,
}: JobViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange("calendar")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          currentView === "calendar"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        캘린더
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          currentView === "list"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        리스트
      </button>
    </div>
  );
}
