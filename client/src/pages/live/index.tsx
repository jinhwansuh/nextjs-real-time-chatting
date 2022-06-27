import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { VideoEventActions } from '../../types/constants';

const Live: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let peerConnection = {} as RTCPeerConnection;

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const socket = io(`http://localhost:8000`);

    socket.on('connect', () => {
      socket.emit(VideoEventActions.WATCHER);
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
        setStreamState(event.streams[0]);
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
      socket.emit(VideoEventActions.WATCHER);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      console.log(streamState);
      videoRef.current.srcObject = streamState ? streamState : null;
    }
  }, [streamState]);

  return (
    <>
      <div>현재 방송들 : 222개</div>
      <div>
        <StyledVideo ref={videoRef} autoPlay playsInline />
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
