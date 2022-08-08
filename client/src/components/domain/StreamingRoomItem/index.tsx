import { useRouter } from 'next/router';
import { memo } from 'react';
import styled from 'styled-components';
import { ServerStreamingRoom } from '../../../types/streaming';
import { Avatar } from '../../base';

const StreamingRoomItem = ({
  _id,
  roomName,
  roomUser,
  streamer,
  isLive,
}: ServerStreamingRoom) => {
  const router = useRouter();

  return (
    <StyledRoomWrapper>
      <StyledStreamingRoom
        key={_id}
        onClick={() => router.push(`/live/${_id}`)}
      >
        {isLive && <StyledIsLive>L I V E</StyledIsLive>}
      </StyledStreamingRoom>
      <StyledDetailsWrapper>
        <Avatar src={'https://www.fillmurray.com/40/40'} />
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
  margin: 15px;
`;

const StyledStreamingRoom = styled.div`
  position: relative;
  width: 288px;
  height: ${288 / 1.78}px;
  background-color: #ddd;
  background-image: url('https://loremflickr.com/288/162');
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
