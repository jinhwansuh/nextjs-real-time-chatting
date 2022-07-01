export const ChatEventActions = {
  WELCOME: 'welcome',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  CHAT_MESSAGE: 'chatMessage',
  LEAVE_PAGE: 'leavePage',
} as const;

export const VideoEventActions = {
  WELCOME: 'welcome',
  BROADCASTER: 'broadcaster',
  WATCHER: 'watcher',
  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
  DISCONNECT_PEER: 'disconnectPeer',
  ENTER_ROOM: 'enterRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  CHAT_MESSAGE: 'chatMessage',
  LEAVE_PAGE: 'leavePage',
} as const;
