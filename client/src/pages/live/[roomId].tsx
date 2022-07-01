import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { user } from '../../atoms/user';
import { Video } from '../../components/domain';
import { Message } from '../../types/chat';
import { VideoEventActions } from '../../types/constants';

const StreamingRoom: NextPage = () => {
  const router = useRouter();
  const userState = useRecoilValue(user);
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [chatInputState, setChatInputState] = useState('');
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { roomId } = router.query;

  useEffect(() => {
    if (!roomId) return;
    let peerConnection: RTCPeerConnection;

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const socket = io(`http://localhost:8000/streaming`);

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
          userSocketId: data.userSocketId,
          name: data.name,
          roomId: data.roomId,
          message: data.message,
        },
      ]);
    });

    socket.on(VideoEventActions.OFFER, (id, description) => {
      peerConnection = new RTCPeerConnection(config);
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
  }, [roomId]);

  const handleChatSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Message = {
      name: userState.name,
      roomId: roomId as string,
      message: chatInputState,
      userSocketId: userState.userSocketId,
    };
    currentSocket?.emit(VideoEventActions.CHAT_MESSAGE, data);
    setChatInputState('');
  };
  //
  return (
    <>
      <h1>스트리밍</h1>
      <div>
        <Video videoRef={videoRef} autoPlay playsInline muted />
      </div>
      <StyledChattingContainer>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
        soluta vitae tenetur tempore accusantium impedit magnam voluptatum rem.
        Officiis vero qui ut quas, illo officia eius reiciendis repellat aut
        nesciunt.
        {chatListState.map((chat) => (
          <StyledChatItem key={v4()}>
            {chat.name} : {chat.message}
          </StyledChatItem>
        ))}
        <form onSubmit={handleChatSubmit}>
          <input
            value={chatInputState}
            onChange={(e) => setChatInputState(e.target.value)}
          />
          <button type="submit" disabled={!chatInputState.trim().length}>
            전송
          </button>
        </form>
      </StyledChattingContainer>
    </>
  );
};

const StyledChattingContainer = styled.div`
  overflow-y: auto;
  background-color: #eee;
  width: 80%;
  height: 250px;
`;

const StyledChatItem = styled.div`
  background-color: #ababef;
`;
export default StreamingRoom;
