import axios from 'axios';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';

const Create = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    let peerConnections: any = {};

    const socket = io(`http://localhost:8000`);

    setCurrentSocket(socket);

    socket.on('answer', (id, description) => {
      console.log('answer이다');
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('watcher', (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      console.log('왓처다', peerConnection);
      let stream = videoRef.current!.srcObject;
      (stream as MediaStream)
        .getTracks()
        .forEach((track) =>
          peerConnection.addTrack(track, stream as MediaStream)
        );

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
          console.log('캔디데이트다 에밋', event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit('offer', id, peerConnection.localDescription);
        });
    });

    socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
      console.log('캔디데이트다 온', candidate);
    });

    socket.on('disconnectPeer', (id) => {
      peerConnections[id].close();
      console.log('디스커넥트다');
      delete peerConnections[id];
    });
  }, []);

  useEffect(() => {
    // console.log(streamState, videoRef);
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
  return (
    <>
      <StyledVideo ref={videoRef} autoPlay />
      <div>
        <button onClick={handleVideoClick}>비디오 연결하기</button>
        <button onClick={handleDisplayClick}>화면 공유하기</button>
      </div>
      <div>방송 만들기</div>
    </>
  );
};

const StyledVideo = styled.video`
  width: 80%;
  height: 400px;
`;

export default Create;
