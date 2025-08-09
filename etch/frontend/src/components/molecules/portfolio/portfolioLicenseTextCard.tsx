import type { License } from "../../../types/portfolio/portfolioDatas";

function PortfolioLicenseTextCard({
  licenses,
  onRemove,
}: {
  licenses: License[];
  onRemove?: (index: number) => void;
}) {
  if (licenses.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        등록된 자격증이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {licenses.map((license, index) => (
        <div
          key={index}
          className="relative p-4 bg-green-50 border-l-4 border-green-400 rounded"
        >
          <div className="font-semibold text-green-700">
            {license.licenseName}
          </div>
          <div className="text-sm text-gray-700">{license.issuer}</div>
          <div className="text-sm text-gray-600">{license.getAt}</div>
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default PortfolioLicenseTextCard;
