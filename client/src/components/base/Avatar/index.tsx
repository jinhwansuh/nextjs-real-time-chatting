import { CSSProperties, memo } from 'react';
import styled from 'styled-components';

interface Props {
  src: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

function Avatar({ src, ...props }: Props) {
  return <AvatarImage src={src} alt="avatar" {...props} />;
}

const AvatarImage = styled.img<Props>`
  width: ${(props) => props.width ?? '40px'};
  height: ${(props) => props.height ?? '40px'};
  border-radius: 50%;
`;

export default memo(Avatar);
