import useUserStore from '../store/userStore';

export const getCurrentUserId = (): number => {
  const { memberInfo } = useUserStore.getState();
  return memberInfo?.id || 0;
};

export const getCurrentUserName = (): string => {
  const { memberInfo } = useUserStore.getState();
  return memberInfo?.nickname || '익명';
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem("access_token");
  console.log("현재 토큰:", token); // 디버깅용 로그 추가
  
  if (!token) {
    console.warn("토큰이 없습니다. 로그인이 필요합니다.");
    return null;
  }
  
  return token;
};
