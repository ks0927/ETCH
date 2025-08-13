# 채팅 서버 연동 가이드

## 🔧 구현 완료 사항

### 1. 라이브러리 설치
- `@stomp/stompjs`: WebSocket STOMP 클라이언트
- `sockjs-client`: SockJS 클라이언트

### 2. 새로운 파일들
- `src/types/chat.ts`: 채팅 관련 타입 정의
- `src/services/chatService.ts`: WebSocket 연결 및 메시지 처리 서비스
- `src/contexts/chatContext.tsx`: 채팅 상태 관리 컨텍스트
- `src/utils/userUtils.ts`: 사용자 정보 유틸리티 함수
- `src/api/chatApi.tsx`: 채팅 REST API (기존 파일 완전 교체)

### 3. 업데이트된 컴포넌트들
- `src/components/common/chatModalContainer.tsx`: ChatProvider로 감싸서 상태 관리
- `src/components/pages/chat/chatListPage.tsx`: 실제 API에서 채팅방 목록 로드
- `src/components/pages/chat/chatRoomPage.tsx`: 실시간 메시지 표시 및 전송
- `src/components/organisms/chat/chatRoomList.tsx`: UIChatRoom 타입 사용
- `src/components/organisms/chat/chatMessageList.tsx`: UIChatMessage 타입 사용
- `src/components/molecules/modal/chatListHeader.tsx`: 채팅방 생성 기능 추가

## 🚀 테스트 방법

### 1. 채팅 서버 실행
채팅 서버가 `http://localhost:8083`에서 실행되고 있어야 합니다.

### 2. 프론트엔드 실행
```bash
npm run dev
```

### 3. 테스트 시나리오

#### 기본 기능 테스트
1. **로그인**: 유효한 토큰이 있어야 채팅 기능이 작동합니다.
2. **채팅 모달 열기**: 우하단 채팅 아이콘 클릭
3. **채팅방 목록 확인**: 기존 채팅방들이 로드되는지 확인
4. **채팅방 생성**: 헤더의 "+" 버튼으로 새 채팅방 생성
5. **채팅방 입장**: 목록에서 채팅방 클릭하여 입장
6. **메시지 전송**: 메시지 입력 후 전송
7. **실시간 수신**: 다른 사용자가 보낸 메시지 실시간 수신 확인

#### WebSocket 연결 확인
브라우저 개발자 도구 콘솔에서 다음 로그를 확인하세요:
```
STOMP Debug: ...
WebSocket 연결 성공
채팅방 {roomId} 구독 시작
메시지 전송: ...
```

## 🔍 주요 구현 내용

### WebSocket 연결 흐름
1. `ChatProvider` 마운트시 자동으로 WebSocket 연결
2. 토큰 기반 인증 (localStorage의 access_token 사용)
3. 채팅방 선택시 해당 방 구독 시작
4. 방 이동시 기존 구독 해제 후 새 방 구독

### 메시지 전송/수신 흐름
1. **전송**: `sendMessage` → WebSocket `/pub/chat/message`
2. **수신**: WebSocket `/sub/chat/room/{roomId}` 구독
3. 실시간으로 새 메시지가 UI에 자동 추가

### API 엔드포인트
- `GET /chat/rooms`: 채팅방 목록
- `POST /chat/room?name={roomName}`: 채팅방 생성
- `GET /chat/room/{roomId}`: 채팅방 정보
- `GET /chat/room/{roomId}/messages`: 메시지 내역
- `POST /chat/room/{roomId}/enter`: 채팅방 입장
- `POST /chat/room/{roomId}/exit`: 채팅방 퇴장

## 🐛 트러블슈팅

### 1. WebSocket 연결 실패
- 채팅 서버가 8083 포트에서 실행중인지 확인
- CORS 설정 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 2. 메시지 전송/수신 안됨
- 토큰이 유효한지 확인 (localStorage의 access_token)
- WebSocket 연결 상태 확인 (`isConnected` 상태)
- 채팅방에 정상적으로 입장했는지 확인

### 3. 채팅방 목록이 안보임
- API 서버 연결 상태 확인
- 네트워크 탭에서 API 호출 결과 확인
- 토큰 만료 여부 확인

## 🔄 향후 개선 사항

1. **파일 업로드**: 현재는 placeholder만 있음
2. **읽음 상태 처리**: 읽지 않은 메시지 수 표시
3. **사용자 온라인 상태**: 접속 상태 표시
4. **메시지 검색**: 메시지 내용 검색 기능
5. **알림**: 새 메시지 알림 기능
6. **이모지**: 이모지 반응 기능

## 📝 참고사항

- 채팅 서버 포트: `8083` (로컬), `https://etch.it.kr/chat` (운영)
- 기존 mock 데이터는 더 이상 사용하지 않음
- UI 스타일은 기존 디자인 유지
- 토큰 갱신은 기존 인증 로직과 동일하게 처리
