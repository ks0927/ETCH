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
      <div className="flex items-center justify-center w-20 h-20 mx-auto text-lg font-semibold bg-gray-200 rounded-full">
        <img
          src={src || defaultSrc || defaultProfile}
          alt={alt}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <button
        className="absolute w-8 h-8 p-0 bg-gray-100 border border-gray-200 rounded-full cursor-pointer -bottom-1 -right-1"
        onClick={onClick}
      >
        📷
      </button>
    </div>
  );
};

export default ProfileAvatar;
