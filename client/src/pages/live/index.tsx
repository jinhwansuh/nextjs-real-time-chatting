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

  const room = '123';

  useEffect(() => {
    let peerConnections: { [id: string]: RTCPeerConnection } = {};

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const socket = io(`http://localhost:8000/streaming`);

    socket.on('connect', () => {
      socket.emit(VideoEventActions.WATCHER, { room });
    });

    setCurrentSocket(socket);

    socket.on(VideoEventActions.OFFER, (broadcaster, description) => {
      peerConnections[broadcaster.id] = new RTCPeerConnection(config);
      peerConnections[broadcaster.id]
        .setRemoteDescription(description)
        .then(() => peerConnections[broadcaster.id].createAnswer())
        .then((sdp) => {
          peerConnections[broadcaster.id].setLocalDescription(sdp);
          socket.emit(VideoEventActions.ANSWER, {
            type: 'answer',
            sdp: sdp,
            room: room,
          });
        });

      peerConnections[broadcaster.id].ontrack = (event: any) => {
        // setStreamState(event.streams[0]);
        videoRef.current!.srcObject = event.streams[0]
          ? event.streams[0]
          : null;
      };
      peerConnections[broadcaster.id].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(VideoEventActions.CANDIDATE, {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          });
        }
      };
    });

    socket.on(VideoEventActions.CANDIDATE, (id, event) => {
      peerConnections[id]
        .addIceCandidate(
          new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          })
        )
        .catch((e) => console.error(e));
    });

    socket.on(VideoEventActions.BROADCASTER, () => {
      socket.emit(VideoEventActions.WATCHER, { room });
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
  }, [videoRef, streamState]);

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
