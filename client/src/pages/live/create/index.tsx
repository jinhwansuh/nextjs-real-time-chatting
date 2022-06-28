import { MouseEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { VideoEventActions } from '../../../types/constants';

const Create = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const room = '123';

  useEffect(() => {
    const peerConnections: { [id: string]: RTCPeerConnection } = {};
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    const socket = io(`http://localhost:8000/streaming`);

    setCurrentSocket(socket);

    socket.on(VideoEventActions.ANSWER, (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on(VideoEventActions.WATCHER, (viewer) => {
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
      연결이 끊어졌을때 peer삭제
     */

    // socket.on(VideoEventActions.DISCONNECT_PEER, (id) => {
    //   peerConnections[id].close();
    //   delete peerConnections[id];
    // });

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
    currentSocket?.emit(VideoEventActions.BROADCASTER, room);
  };

  /* 
    TODO:
    1. 공유 중지를 눌렀을 때, 이벤트
    2. 화면이 꺼졌을 때 이벤트
  */

  return (
    <>
      <StyledVideo ref={videoRef} autoPlay />
      <div>
        <button onClick={handleVideoClick}>비디오 연결하기</button>
        <button onClick={handleDisplayClick}>화면 공유하기</button>
      </div>
      <div onClick={handleStartStreaming}>방송 만들기</div>
    </>
  );
};

const StyledVideo = styled.video`
  width: 80%;
  height: 400px;
`;

export default Create;
