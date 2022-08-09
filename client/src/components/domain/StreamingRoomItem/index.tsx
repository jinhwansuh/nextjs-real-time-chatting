import { useRouter } from 'next/router';
import { memo } from 'react';
import styled from 'styled-components';
import { ServerStreamingRoom } from '../../../types/streaming';
import { Avatar } from '../../base';

interface Props extends ServerStreamingRoom {
  avatarUrl: string;
  thumbnailUrl: string;
}

const StreamingRoomItem = ({
  _id,
  roomName,
  roomUser,
  streamer,
  isLive,
  avatarUrl,
  thumbnailUrl,
}: Props) => {
  const router = useRouter();

  return (
    <StyledRoomWrapper>
      <StyledStreamingRoom
        key={_id}
        onClick={() => router.push(`/live/${_id}`)}
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      >
        {isLive && <StyledIsLive>L I V E</StyledIsLive>}
      </StyledStreamingRoom>
      <StyledDetailsWrapper>
        <Avatar src={avatarUrl} />
        <StyledDetails>
          <div style={{ fontWeight: 'bold' }}> {roomName}</div>
          <div> {streamer}</div>
          <div>{roomUser.length} watching </div>
        </StyledDetails>
      </StyledDetailsWrapper>
    </StyledRoomWrapper>
  );
};
const StyledRoomWrapper = styled.div`
  width: 288px;
  margin: 15px;
`;

const StyledStreamingRoom = styled.div`
  position: relative;
  width: 288px;
  height: ${288 / 1.78}px;
  background-color: #ddd;
  cursor: pointer;
`;

const StyledIsLive = styled.span`
  position: absolute;
  left: 6px;
  top: 6px;
  width: 70px;
  height: 30px;
  background-color: #de2424;
  color: white;
  font-size: 20px;
  text-align: center;
`;

const StyledDetailsWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;
const StyledDetails = styled.div`
  margin-left: 15px;
`;
export default memo(StreamingRoomItem);
