// components/common/PageLoading.tsx - 컴포넌트만 있는 파일
const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    <span className="ml-2">로딩 중...</span>
  </div>
);

export default Loading;
