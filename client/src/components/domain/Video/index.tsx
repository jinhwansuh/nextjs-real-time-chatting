import React, { CSSProperties, ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';

interface Props {
  width: number;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  backColor?: string;
  style?: CSSProperties;
}

const Video = (
  { autoPlay = true, playsInline, muted, ...props }: Props,
  videoRef: ForwardedRef<HTMLVideoElement>
) => {
  console.log;
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

const StyledVideoWrapper = styled.div<Pick<Props, 'width' | 'backColor'>>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.width / 1.78}px;
  background-color: ${(props) => props.backColor || '#ccc'};
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
`;

export default forwardRef(Video);
