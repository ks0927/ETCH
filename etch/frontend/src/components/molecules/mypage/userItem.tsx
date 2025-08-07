import type { UserItemProps } from "../../atoms/listItem";
import ChatIcon from "../../svg/chatIcon";
import defaultProfile from "../../../assets/default-profile.png";

function UserItem({
  id,
  username,
  displayName,
  email,
  avatar,
  isFollowing,
  canChat,
  onChatClick,
  onFollowToggle,
}: UserItemProps) {
  const handleChatClick = () => {
    if (canChat) {
      onChatClick(id);
    }
  };

  const handleFollowClick = () => {
    onFollowToggle(id);
  };

  const getAvatarSrc = () => {
    return avatar || defaultProfile;
  };

  return (
    <div className="flex items-center px-8 py-5 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full mr-4 flex-shrink-0 overflow-hidden">
        <img 
          src={getAvatarSrc()} 
          alt={displayName} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <a 
          href={`/profile/${username}`} 
          className="block text-base font-semibold text-blue-600 hover:underline cursor-pointer mb-0.5"
        >
          {displayName}
        </a>
        <div className="text-sm text-gray-600">
          {email}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">
        {/* Chat Button */}
        <button
          onClick={handleChatClick}
          disabled={!canChat}
          className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-1 transition-all duration-200 ${
            canChat
              ? "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600"
              : "bg-gray-600 text-white border border-gray-600 opacity-60 cursor-not-allowed"
          }`}
          title={canChat ? "" : "팔로우 후 채팅 가능"}
        >
          <div className="w-3 h-3">
            <ChatIcon />
          </div>
          채팅
        </button>

        {/* Follow Button */}
        <button
          onClick={handleFollowClick}
          className={`px-4 py-2 rounded-md border text-xs font-medium transition-all duration-200 whitespace-nowrap ${
            isFollowing
              ? "bg-green-600 text-white border-green-600/40 hover:bg-red-600 hover:border-red-600/40"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default UserItem;
