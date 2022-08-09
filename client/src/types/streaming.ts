export type ServerStreamingRoom = {
  _id: string;
  streamer: string;
  roomName: string;
  roomUser: [];
  isLive: boolean;
};

export interface ServerToClientStreamingInitData {
  allUserCount: number;
  createdRoom: ServerStreamingRoom[];
}

export interface MakeServerRoom {
  roomId: string;
  streamer: string;
  roomName: string;
}
