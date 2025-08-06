import type { ProjectCardProps } from "../../atoms/card";
import LikeSVG from "../../svg/likeSVG";
import ViewSVG from "../../svg/viewSVG";

function ProjectModalCard({
  img,
  content,
  title,
  stack,
  category,
  github,
  createTime,
  viewCount,
  likeCount,
  writer,
  writerImg,
}: ProjectCardProps) {
  return (
    <div className="space-y-6">
      {/* 작성자 정보 */}
      <section className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={writerImg}
            alt="작성자"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50"
          />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{writer}</h2>
            <p className="text-xs text-gray-500">{createTime}</p>
          </div>
        </div>
      </section>

      {/* 프로젝트 이미지 */}
      <section>
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          <img
            src={img}
            alt={title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* 상호작용 정보 */}
      <section className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <LikeSVG />
            <span className="font-medium">{likeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <ViewSVG />
            <span className="font-medium">{viewCount}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">{createTime}</span>
      </section>

      {/* 프로젝트 제목과 내용 */}
      <section className="space-y-3">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-gray-700 leading-relaxed text-sm">{content}</p>
      </section>

      {/* 카테고리 */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
          카테고리
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(category) ? (
            category.map((cat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
              {category}
            </span>
          )}
        </div>
      </section>

      {/* 기술 스택 */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-green-500 rounded-full"></span>
          기술 스택
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(stack) ? (
            stack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
              {stack}
            </span>
          )}
        </div>
      </section>

      {/* GitHub 링크 */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-800 rounded-full"></span>
          GitHub
        </h3>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          코드 보러가기
        </a>
      </section>
    </div>
  );
}

export default ProjectModalCard;
