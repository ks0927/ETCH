import type { DocumentItemProps } from "../../atoms/listItem";

const DocumentItem = ({ id, title, date, onClick }: DocumentItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex space-x-2">
        <button 
          className="border border-gray-300 bg-white text-black px-3 py-1 rounded-md text-sm hover:bg-gray-50 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Edit document ${id}`);
          }}
        >
          ✏️
        </button>
        <button 
          className="border border-gray-300 bg-white text-black px-3 py-1 rounded-md text-sm hover:bg-gray-50 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Delete document ${id}`);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;