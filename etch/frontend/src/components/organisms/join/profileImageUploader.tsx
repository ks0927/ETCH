import { useState } from "react";
import FileUploadButton from "../../molecules/join/FileUploadButton";
import ProfileImagePreview from "../../molecules/join/ProfileImagePreview";

interface ProfileImageUploaderProps {
  onChange?: (value: string) => void;
}

function ProfileImageUploader({ onChange }: ProfileImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    // onChange가 있을 때만 호출
    if (onChange) {
      // 일단 파일 이름을 전달 (나중에 실제 업로드 URL로 변경)
      onChange(file.name);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <ProfileImagePreview imageUrl={imageUrl} />
      <FileUploadButton text="파일 업로드" onFileSelect={handleFileSelect} />
      <p className="text-xs text-center text-gray-500">
        JPG, PNG 파일만 업로드 가능합니다
      </p>
    </div>
  );
}

export default ProfileImageUploader;
