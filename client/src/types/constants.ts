export const ChatEventTypes = {
  welcome: 'welcome',
  joinRoom: 'joinRoom',
  leaveRoom: 'leaveRoom',
  'chat-message': 'chat-message',
} as const;

export const VideoEventTypes = {
  broadcaster: 'broadcaster',
  watcher: 'watcher',
  offer: 'offer',
  answer: 'answer',
  candidate: 'candidate',
} as const;
