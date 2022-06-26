import { MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Create = () => {
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(streamState, videoRef);
    if (videoRef.current)
      videoRef.current.srcObject = streamState ? streamState : null;
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
