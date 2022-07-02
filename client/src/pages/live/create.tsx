import { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';
import { user } from '../../atoms/user';
import { StreamingChattingArea, Video } from '../../components/domain';
import Layout from '../../components/layout';
import { Message } from '../../types/chat';
import { VideoEventActions } from '../../types/constants';
import { NextPageWithLayout } from '../_app';

const Create: NextPageWithLayout = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userState = useRecoilValue(user);
  const room = '123';

  useEffect(() => {
    const peerConnections: { [id: string]: RTCPeerConnection } = {};
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`);

    setCurrentSocket(socket);
    socket.on('connect', () => {
      socket.emit(VideoEventActions.ENTER_ROOM, {
        roomId: room,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
    });
    socket.on(VideoEventActions.ANSWER, (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on(VideoEventActions.WATCHER, (viewer) => {
      console.log(peerConnections);
      peerConnections[viewer.id] = new RTCPeerConnection(config);

      const stream = videoRef.current!.srcObject;
      (stream as MediaStream)
        .getTracks()
        .forEach((track) =>
          peerConnections[viewer.id].addTrack(track, stream as MediaStream)
        );

      peerConnections[viewer.id].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(VideoEventActions.CANDIDATE, viewer.id, event.candidate);
        }
      };

      peerConnections[viewer.id]
        .createOffer()
        .then((sdp) => peerConnections[viewer.id].setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            VideoEventActions.OFFER,
            viewer.id,
            peerConnections[viewer.id].localDescription
          );
        });
    });

    socket.on(VideoEventActions.CANDIDATE, (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
      console.log(peerConnections);
    });
    /* 
      TODO:
      연결이 끊어졌을때 peer삭제, 끊어졌다는 알림
     */

    // socket.on(VideoEventActions.DISCONNECT_PEER, (id) => {
    //   peerConnections[id].close();
    //   delete peerConnections[id];
    // });

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

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = streamState ? streamState : null;
    }
  }, [streamState]);

  const handleVideoClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      setStreamState(stream);

      e.currentTarget.disabled = true;
    } catch (e) {
      // handleError(e);
    }
  };
  const handleDisplayClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStreamState(stream);

      e.currentTarget.disabled = true;
    } catch (e) {
      // handleError(e);
    }
  };

  const handleStartStreaming = () => {
    console.log('클릭');
    currentSocket?.emit(VideoEventActions.BROADCASTER, room);
  };

  /* 
    TODO:
    1. 공유 중지를 눌렀을 때, 이벤트
    2. 화면이 꺼졌을 때 이벤트
  */

  return (
    <>
      <Video videoRef={videoRef} autoPlay />
      <div>
        <button onClick={handleVideoClick}>비디오 연결하기</button>
        <button onClick={handleDisplayClick}>화면 공유하기</button>
        <div onClick={handleStartStreaming}>방송 만들기</div>
      </div>
      <StreamingChattingArea
        chatListState={chatListState}
        roomId={room as string}
        currentSocket={currentSocket}
      ></StreamingChattingArea>
    </>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Create;
