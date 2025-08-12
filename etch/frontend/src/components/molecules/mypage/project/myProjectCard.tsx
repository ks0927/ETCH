import noImg from "../../../../assets/noImg.png"; // noImg import 추가

interface Props {
  // 🎯 ProjectCardProps 대신 ProjectData 사용하고 필요한 필드만 추출
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  onCardClick: (id: number) => void; // 부모 컴포넌트에서 모달 상태를 관리
  type: "project";
}

function MyProjectCard({
  id,
  title,
  content,
  thumbnailUrl,
  onCardClick,
}: Props) {
  const handleClick = () => {
    onCardClick(id);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <section className="w-full h-36">
        <img
          className="w-full object-cover h-full"
          src={thumbnailUrl || noImg} // thumbnailUrl이 없으면 noImg 사용
          alt="카드 이미지"
          onError={(e) => {
            e.currentTarget.src = noImg; // 이미지 로딩 실패시에도 noImg 사용
          }}
        />
      </section>
      <section className="p-3 sm:p-4">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-2 text-gray-800 mb-2">
          {title}
        </div>
        <div className="text-sm sm:text-base text-gray-600 line-clamp-2">
          {content}
        </div>
      </section>
    </div>
  );
}

export default MyProjectCard;
