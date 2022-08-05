import { CSSProperties, RefObject } from 'react';
import styled from 'styled-components';

interface Props {
  width: string;
  height: string;
  videoRef: RefObject<HTMLVideoElement>;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  backColor?: string;
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
    <StyledVideoWrapper {...props}>
      <StyledVideo
        ref={videoRef}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
      />
    </StyledVideoWrapper>
  );
};

const StyledVideoWrapper = styled.div<
  Pick<Props, 'width' | 'height' | 'backColor'>
>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.backColor || '#ccc'};
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
`;

export default Video;
