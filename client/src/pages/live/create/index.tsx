import { MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Create = () => {
  const [streamState, setStreamState] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current)
      videoRef.current.srcObject = streamState ? streamState : null;
  }, [streamState]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStreamState(() => stream);

      e.currentTarget.disabled = true;
    } catch (e) {
      // handleError(e);
    }
  };

  return (
    <>
      <StyledVideo ref={videoRef} autoPlay />
      <button onClick={handleClick}>열기</button>
      <div>방송 만들기</div>
    </>
  );
};

const StyledVideo = styled.video`
  width: 50%;
  height: 400px;
`;

export default Create;
