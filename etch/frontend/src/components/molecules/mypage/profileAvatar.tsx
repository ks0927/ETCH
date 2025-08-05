import type { ImageProps } from "../../atoms/image";
import defaultProfile from "../../../assets/default-profile.png";

const ProfileAvatar = ({
  src,
  alt,
  defaultSrc,
  onClick,
}: ImageProps & { onClick?: () => void }) => {
  return (
    <div className="relative inline-block">
      <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold">
        <img 
          src={src || defaultSrc || defaultProfile} 
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <button 
        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-gray-100 border border-gray-200"
        onClick={onClick}
      >
        📷
      </button>
    </div>
  );
};

export default ProfileAvatar;
