import { useRouter } from 'next/router';
import { CSSProperties, memo } from 'react';
import styled from 'styled-components';
import { ServerStreamingRoom } from '../../../types/streaming';

interface Props extends ServerStreamingRoom {
  style?: CSSProperties;
}

const StreamingRoomItem = ({
  _id,
  roomName,
  roomUser,
  streamer,
  ...props
}: Props) => {
  const router = useRouter();

  return (
    <StyledStreamingRoom
      {...props}
      key={_id}
      onClick={() => router.push(`/live/${_id}`)}
    >
      Title: {roomName} Broadcaster: {streamer}
    </StyledStreamingRoom>
  );
};

const StyledStreamingRoom = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ddd;
  cursor: pointer;
`;

export default memo(StreamingRoomItem);
