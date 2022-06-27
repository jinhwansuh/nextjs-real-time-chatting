import { MouseEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { VideoEventActions } from '../../../types/constants';

const Create = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let peerConnections: any = {};
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    const socket = io(`http://localhost:8000`);

    setCurrentSocket(socket);

    socket.on(VideoEventActions.ANSWER, (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on(VideoEventActions.WATCHER, (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      let stream = videoRef.current!.srcObject;
      (stream as MediaStream)
        .getTracks()
        .forEach((track) =>
          peerConnection.addTrack(track, stream as MediaStream)
        );

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(VideoEventActions.CANDIDATE, id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            VideoEventActions.OFFER,
            id,
            peerConnection.localDescription
          );
        });
    });

    socket.on(VideoEventActions.CANDIDATE, (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on(VideoEventActions.DISCONNECT_PEER, (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
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
    console.log(currentSocket);
    currentSocket?.emit(VideoEventActions.BROADCASTER);
  };

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
