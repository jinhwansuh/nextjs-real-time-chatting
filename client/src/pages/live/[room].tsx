import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Video } from '../../components/domain';
import { VideoEventActions } from '../../types/constants';

const StreamingRoom: NextPage = () => {
  const router = useRouter();
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const room = router.pathname.split('/')[2];
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
      <div>스트리밍</div>
      <div>
        <Video videoRef={videoRef} autoPlay playsInline muted />
      </div>
    </>
  );
};

export default StreamingRoom;
