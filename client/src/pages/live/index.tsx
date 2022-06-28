import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { VideoEventActions } from '../../types/constants';

const Live: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const room = '123';

  useEffect(() => {
    let peerConnection: RTCPeerConnection;

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const socket = io(`http://localhost:8000/streaming`);

    socket.on('connect', () => {
      socket.emit(VideoEventActions.WATCHER, { room });
    });

    setCurrentSocket(socket);

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
      socket.emit(VideoEventActions.WATCHER, { room });
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <div>현재 방송들 : 222개</div>
      <div>
        <StyledVideo ref={videoRef} autoPlay playsInline muted />
      </div>
      <Link href="live/create">
        <div>방송 생성하기</div>
      </Link>
    </>
  );
};

const StyledVideo = styled.video`
  width: 80%;
  height: 400px;
`;

export default Live;
