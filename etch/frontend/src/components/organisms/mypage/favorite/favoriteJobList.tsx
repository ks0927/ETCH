// import { Link } from "react-router";
// import FavoriteJob from "../../../molecules/mypage/favorite/favoriteJob";
// import SeeMore from "../../../svg/seeMore";

// interface Props {
//   titleText: string;
//   subText: string;
// }

// function FavoriteJobList({ titleText, subText }: Props) {
//   return (
//     <div className="bg-white rounded-xl space-y-3 shadow-sm border border-gray-100 p-6 h-fit">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900 mb-1">
//             {titleText} ({favoriteData.length})
//           </h1>
//           <p className="text-sm text-gray-500">{subText}</p>
//         </div>
//         <div className="flex items-center h-full">
//           <Link to={"/mypage/favorites/jobs"}>
//             <SeeMore />
//           </Link>
//         </div>
//       </div>
//       {/* List Section */}
//       <div className="space-y-3">
//         {favoriteData.length > 0 ? (
//           favoriteData
//             .slice(0, 5)
//             .map((data) => <FavoriteJob key={data.id} {...data} />)
//         ) : (
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <svg
//                 className="w-8 h-8 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-500 text-sm font-medium">
//               관심 공고가 없습니다
//             </p>
//             <p className="text-gray-400 text-xs mt-1">
//               관심있는 채용공고를 북마크해보세요
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FavoriteJobList;
