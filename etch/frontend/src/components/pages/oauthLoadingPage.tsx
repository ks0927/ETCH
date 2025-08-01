const OAuthLoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl mx-4 text-center">
        {/* 로고 섹션 */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">E:TCH</h1>
          <p className="text-lg text-gray-600">IT 취업의 새로운 시작</p>
        </div>

        {/* 로딩 애니메이션 카드 */}
        <div className="p-12 mb-6 bg-white shadow-sm rounded-2xl min-h-[320px] min-w-[400px] flex flex-col justify-center">
          {/* 메인 로딩 스피너 */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* 회전하는 링 - 더 명확한 회전 효과 */}
            <div className="absolute inset-0 border-4 rounded-full border-brand-100 border-t-brand-500 animate-spin"></div>
            {/* Google 아이콘 (간단한 G) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-500">G</span>
            </div>
          </div>

          {/* 로딩 메시지 */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              로그인 중...
            </h2>
            <p className="text-gray-600">잠시만 기다려 주세요</p>

            {/* 점 애니메이션 */}
            <div className="flex justify-center pt-2 space-x-1">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthLoadingPage;
