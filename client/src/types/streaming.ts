export type ServerStreamingRoom = {
  _id: string;
  streamer: string;
  roomName: string;
  roomUser: [];
};

export interface ServerToClientStreamingInitData {
  allUserCount: number;
  createdRoom: ServerStreamingRoom[];
}
