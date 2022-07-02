import { CSSProperties, RefObject } from 'react';
import styled from 'styled-components';

interface Props {
  videoRef: RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  style?: CSSProperties;
}

const Video = ({
  videoRef,
  autoPlay = true,
  playsInline,
  muted,
  ...props
}: Props) => {
  return (
    <StyledVideo
      {...props}
      ref={videoRef}
      autoPlay={autoPlay}
      playsInline={playsInline}
      muted={muted}
    />
  );
};

const StyledVideo = styled.video`
  width: 500px;
  height: 400px;
`;

export default Video;
