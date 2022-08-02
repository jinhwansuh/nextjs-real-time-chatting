import { NextPage } from 'next';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { StreamingChattingArea, Video } from '../../components/domain';
import { RTC_CONFIG } from '../../constants/RTCpeerConnection';
import useUserState from '../../hooks/useUserState';
import { Message } from '../../types/chat';
import { VideoEventActions } from '../../types/constants';

const Create: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userState = useUserState();
  const [streamData, setStreamData] = useState({
    isLive: false,
    title: '',
    streamKey: '',
    streamURL: '',
  });
  const [currentViewer, setCurrentViewer] = useState(0);
  const roomId = '123';

  useEffect(() => {
    const peerConnections: { [id: string]: RTCPeerConnection } = {};
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`);

    setCurrentSocket(socket);
    socket.on('connect', () => {
      socket.emit(VideoEventActions.ENTER_ROOM, {
        roomId: roomId,
        name: userState.name,
        userSocketId: userState.userSocketId,
      });
    });
    socket.on(VideoEventActions.ANSWER, (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on(VideoEventActions.WATCHER, (viewer) => {
      console.log(peerConnections);
      peerConnections[viewer.id] = new RTCPeerConnection(RTC_CONFIG);

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
      setChatListState((prev) => [...prev, { ...data }]);
    });

    return () => {
      // // socket.on(VideoEventActions.DISCONNECT_BROADCASTER, (id) => {})
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
      return;
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
    try {
      const title = prompt('write streaming title!');
      if (title) {
        currentSocket?.emit(VideoEventActions.BROADCASTER, roomId);
        setStreamData((prev) => ({
          ...prev,
          isLive: true,
          title: title,
          streamKey: userState.userSocketId,
          streamURL: `${window.location.origin}/live/${roomId}`,
        }));
      }
    } catch (e) {}
  };

  /* 
    TODO:
    1. 공유 중지를 눌렀을 때, 이벤트
    2. 화면이 꺼졌을 때 이벤트
  */

  return (
    <StyledMain>
      <StyledContainer>
        <StyledTitle>
          <div>
            <Video videoRef={videoRef} autoPlay />
            <div>
              <button data-testid="videoConnect" onClick={handleVideoClick}>
                비디오 연결하기
              </button>
              <button data-testid="screenConnect" onClick={handleDisplayClick}>
                화면 공유하기
              </button>
              <div>
                <button
                  disabled={!streamState || streamData.isLive}
                  data-testid="createButton"
                  onClick={handleStartStreaming}
                >
                  Go Streaming
                </button>
              </div>
              <div>
                <StyledIcon
                  style={{
                    backgroundColor: streamData.isLive ? 'green' : 'grey',
                  }}
                />
                {streamData.isLive ? 'Live!' : `No Data`}
              </div>
            </div>
          </div>
          <div>
            <div>
              Title
              <div> {streamData.isLive ? streamData.title : '-----'}</div>
            </div>
            <StyledDetails>
              <div>
                Concurrent viewers
                <div> {currentViewer}</div>
              </div>
              <div>
                Likes
                <div> asd</div>
              </div>
            </StyledDetails>
          </div>
        </StyledTitle>

        <StyledSettingWrapper>
          STREAM SETTING
          <div>
            Stream URL
            <div> {streamData.isLive ? streamData.streamURL : '-----'}</div>
          </div>
          <div>
            Stream key
            <div> {streamData.isLive ? streamData.streamKey : '-----'}</div>
          </div>
        </StyledSettingWrapper>
      </StyledContainer>

      <StreamingChattingArea
        chatListState={chatListState}
        roomId={roomId as string}
        currentSocket={currentSocket}
      ></StreamingChattingArea>
    </StyledMain>
  );
};

const StyledMain = styled.main`
  display: flex;
`;

const StyledContainer = styled.div`
  margin-right: 20px;
`;

const StyledDetails = styled.div`
  display: flex;
`;

const StyledTitle = styled.div`
  display: flex;
  background-color: #eee;
`;

const StyledSettingWrapper = styled.div`
  margin-top: 20px;
  background-color: #eee;
`;

const StyledIcon = styled.div`
  display: inline-block;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
`;

export default Create;
