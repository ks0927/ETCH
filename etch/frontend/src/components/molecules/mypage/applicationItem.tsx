import type { ApplicationItemProps } from "../../atoms/listItem";

const ApplicationItem = ({ 
  id, 
  company, 
  position, 
  applyDate, 
  status, 
  statusText, 
  stage, 
  onClick, 
  onStatusChange 
}: ApplicationItemProps) => {
  
  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600';
      case 'document_submitted':
      case 'interview': return 'bg-yellow-600';
      case 'passed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'document_submitted':
      case 'interview': return 'bg-yellow-100 text-yellow-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status)}`}></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{company}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(status)}`}>
              {statusText}
            </span>
          </div>
          <p className="text-sm text-gray-600">{position}</p>
          <p className="text-xs text-gray-500">지원: {applyDate}</p>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}></div>
            <span className="text-xs text-gray-600">{stage}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange?.(id);
          }}
        >
          상태 변경
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;