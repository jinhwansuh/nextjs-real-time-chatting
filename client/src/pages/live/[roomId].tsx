import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { StreamingChattingArea, Video } from '../../components/domain';
import { RTC_CONFIG } from '../../constants/RTCpeerConnection';
import useUserState from '../../hooks/useUserState';
import { Message } from '../../types/chat';
import { VideoEventActions } from '../../types/constants';

interface Props {
  title: string;
}

const StreamingRoom: NextPage<Props> = ({ title }) => {
  const router = useRouter();
  const userState = useUserState();
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { roomId } = router.query;

  useEffect(() => {
    if (!roomId) return;
    let peerConnection: RTCPeerConnection;

    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`);

    socket.on('connect', () => {
      socket.emit(VideoEventActions.WATCHER, { roomId });
      socket.emit(VideoEventActions.ENTER_ROOM, {
        roomId,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
    });

    setCurrentSocket(socket);

    socket.on(VideoEventActions.CHAT_MESSAGE, (data: Message) => {
      setChatListState((prev) => [
        ...prev,
        {
          id: data.id,
          userSocketId: data.userSocketId,
          name: data.name,
          roomId: data.roomId,
          message: data.message,
        },
      ]);
    });

    socket.on(VideoEventActions.OFFER, (id, description) => {
      peerConnection = new RTCPeerConnection(RTC_CONFIG);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            VideoEventActions.ANSWER,
            id,
            peerConnection.localDescription
          );
        });

      peerConnection.ontrack = (event: any) => {
        videoRef.current!.srcObject = event.streams[0]
          ? event.streams[0]
          : null;
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(VideoEventActions.CANDIDATE, id, event.candidate);
        }
      };
    });

    socket.on(VideoEventActions.CANDIDATE, (id, candidate) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.on(VideoEventActions.BROADCASTER, () => {
      socket.emit(VideoEventActions.WATCHER, { roomId });
    });

    return () => {
      socket.emit(VideoEventActions.LEAVE_ROOM, {
        roomId,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
      socket.close();
    };
  }, [roomId, userState.name]);

  //
  return (
    <>
      <Head>
        <title>{roomId ? roomId : title}</title>
      </Head>

      <h1>Streaming</h1>
      <StyledStreamingWrapper>
        <div>
          <Video width={600} videoRef={videoRef} autoPlay playsInline muted />
        </div>
        <StreamingChattingArea
          chatListState={chatListState}
          roomId={roomId as string}
          currentSocket={currentSocket}
        ></StreamingChattingArea>
      </StyledStreamingWrapper>
    </>
  );
};

const StyledStreamingWrapper = styled.div`
  display: flex;
`;

StreamingRoom.getInitialProps = () => ({
  title: 'Room',
});
export default StreamingRoom;
