function Pagenation() {
  return (
    <>
      {/* 페이지네이션 섹션 */}
      <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 페이지 번호 */}
          <div className="flex items-center justify-center space-x-2">
            <button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              20
            </button>

            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* 페이지 정보 */}
          <div className="text-sm text-gray-600 text-center">
            <span className="font-medium">1-10</span> of{" "}
            <span className="font-medium">200</span> 결과
          </div>
        </div>
      </section>
    </>
  );
}

export default Pagenation;
