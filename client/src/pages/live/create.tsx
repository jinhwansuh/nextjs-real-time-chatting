import { NextPage } from 'next';
import Head from 'next/head';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { userStateAtom } from '../../atoms/user';
import { Text } from '../../components/base';
import { StreamingChattingArea, Video } from '../../components/domain';
import { RTC_CONFIG } from '../../constants/RTCpeerConnection';
import { Message } from '../../types/chat';
import { VideoEventActions } from '../../types/constants';
import { MakeServerRoom } from '../../types/streaming';

const Create: NextPage = () => {
  const [currentSocket, setCurrentSocket] = useState<Socket>();
  const [streamState, setStreamState] = useState<MediaStream>();
  const [chatListState, setChatListState] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userState = useRecoilValue(userStateAtom);
  const [streamData, setStreamData] = useState({
    isLive: false,
    title: '',
    streamKey: '',
    streamURL: '',
  });
  const [currentViewer, setCurrentViewer] = useState(0);
  const roomId = useMemo(() => v4(), []);

  useEffect(() => {
    if (!userState.name) return;

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

    socket.on(VideoEventActions.DISCONNECT_PEER, (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
    });

    socket.on(VideoEventActions.CHAT_MESSAGE, (data: Message) => {
      setChatListState((prev) => [...prev, { ...data }]);
    });

    return () => {
      socket.emit(VideoEventActions.DISCONNECT_BROADCASTER, { roomId });
      socket.close();
    };
  }, [userState.name]);

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
        currentSocket?.emit(VideoEventActions.MAKE_ROOM, {
          roomId,
          roomName: title,
          streamer: userState.name,
        } as MakeServerRoom);
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
    <>
      <Head>
        <title>{'create'}</title>
      </Head>

      <StyledMain>
        <StyledContainer>
          <StyledVideoWrapper>
            <div>
              <Video width={400} videoRef={videoRef} autoPlay />
              <StyledIsLiveWrapper>
                <StyledIcon
                  style={{
                    backgroundColor: streamData.isLive ? 'green' : 'grey',
                  }}
                />
                {streamData.isLive ? 'Live!' : `No Data`}
              </StyledIsLiveWrapper>
            </div>
            <StyledDetailsWrapper>
              <StyleTitle>Title</StyleTitle>
              <StyledStreamDetails>
                {streamData.isLive ? streamData.title : '-----'}
              </StyledStreamDetails>
              <StyledDetails>
                <StyleTitle>
                  Concurrent viewers
                  <StyledStreamDetails> {currentViewer}</StyledStreamDetails>
                </StyleTitle>

                <StyleTitle>
                  Likes<StyledStreamDetails> asd</StyledStreamDetails>
                </StyleTitle>
              </StyledDetails>
              <br />
              <br />
              <br />

              <div>
                <button data-testid="videoConnect" onClick={handleVideoClick}>
                  비디오 연결하기
                </button>
                <button
                  data-testid="screenConnect"
                  onClick={handleDisplayClick}
                >
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
              </div>
            </StyledDetailsWrapper>
          </StyledVideoWrapper>

          <StyledSettingWrapper>
            <Text size={25} strong>
              STREAM SETTINGS
            </Text>
            <StyleTitle>Stream URL</StyleTitle>
            <StyledStreamDetails>
              {streamData.isLive ? streamData.streamURL : '-----'}
            </StyledStreamDetails>
            <StyleTitle>Stream key</StyleTitle>
            <StyledStreamDetails>
              {streamData.isLive ? streamData.streamKey : '-----'}
            </StyledStreamDetails>
          </StyledSettingWrapper>
        </StyledContainer>

        <StreamingChattingArea
          chatListState={chatListState}
          roomId={roomId as string}
          currentSocket={currentSocket}
        ></StreamingChattingArea>
      </StyledMain>
    </>
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

const StyledVideoWrapper = styled.div`
  display: flex;
  padding: 20px;
  background-color: #eee;
`;

const StyledSettingWrapper = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #eee;
`;

const StyledIsLiveWrapper = styled.div`
  margin-top: 15px;
`;

const StyledIcon = styled.div`
  display: inline-block;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
`;

const StyledDetailsWrapper = styled.div`
  width: 300px;
  padding-left: 15px;
`;

const StyleTitle = styled.div`
  margin-top: 10px;
  font-size: 15px;
  padding-left: 10px;
  color: #eeeeeef;
`;

const StyledStreamDetails = styled.div`
  font-size: 20px;
  padding-left: 10px;
  font-weight: bold;
`;

export default Create;
