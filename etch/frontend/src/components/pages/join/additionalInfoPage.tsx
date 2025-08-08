import { useState } from "react";
import NicknameInput from "../../molecules/join/nicknameInput";
import TelInput from "../../molecules/join/telInput";
import BirthDateSelector from "../../organisms/join/BirthDateSelector";
import GenderRadioGroup from "../../organisms/join/genderRadioGroup";
import ProfileImageUploader from "../../organisms/join/profileImageUploader";
import CompletionButton from "../../molecules/join/completionButton";

function AdditionalInfoPage() {
  const [nickname, setNickname] = useState("");
  const [tel, setTel] = useState("");

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleTelChange = (value: string) => {
    setTel(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">프로필 설정</h1>
          <p className="text-gray-600">
            추가 정보를 입력하여 회원가입을 완료하세요
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              *닉네임
            </p>
          </div>
          <NicknameInput
            value={nickname}
            type="text"
            placeholder="사용할 닉네임을 입력하세요"
            onChange={handleNicknameChange}
          />
          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              *생년월일
            </p>
            <BirthDateSelector />
          </div>

          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              *성별
            </p>
            <GenderRadioGroup />
          </div>

          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              *전화번호
            </p>
            <TelInput
              value={tel}
              type="tel"
              placeholder="01000000000"
              onChange={handleTelChange}
            />
          </div>

          <div>
            <p className="block mb-2 text-sm font-medium text-gray-700">
              프로필 사진
            </p>
            <ProfileImageUploader />
          </div>

          <div className="pt-4">
            <CompletionButton
              text="완료"
              onClick={() => {
                console.log("프로필 설정 완료");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdditionalInfoPage;
