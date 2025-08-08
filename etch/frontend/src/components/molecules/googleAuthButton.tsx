import type { AdditionalButtonProps } from "../atoms/button";
import googleIcon from "../../assets/google-icon.png";

function GoogleAuthButton({ text }: AdditionalButtonProps) {
  const handleGoogleLogin = () => {
    window.location.href = "https://etch.it.kr/oauth2/authorization/google";
  };

  return (
    <>
      <button 
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold transition-all duration-200 border border-gray-300 rounded cursor-pointer hover:brightness-90"
      >
        <img src={googleIcon} alt="Google Icon" className="w-5 h-5 mr-2" />
        {text && <span className="text-gray-800">{text}</span>}
      </button>
    </>
  );
}

export default GoogleAuthButton;
