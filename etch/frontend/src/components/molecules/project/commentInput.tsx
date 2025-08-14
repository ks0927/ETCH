import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}

function CommentInput({ onSubmit, isSubmitting = false }: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={2} // 높이를 2줄로 고정
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
           className="
            bg-blue-500 hover:bg-blue-600 text-white font-medium
            px-5 py-2.5  
            rounded-md
            text-base 
            flex items-center justify-center    
            h-10          
            min-w-[64px]  
          "
          >
          등록
        </button>
      </div>
    </form>
  );
}

export default CommentInput;
