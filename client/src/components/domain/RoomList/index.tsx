import styled from 'styled-components';
import { RoomListProps } from '../../../types/chat';

const RoomList = ({
  serverData,
  roomState,
  clientInRoom,
  handleFetchRoomData,
  handleRoomChange,
  handleCreateRoomClick,
  ...props
}: RoomListProps) => {
  if (!serverData) {
    return (
      <StyledContainer {...props}>
        <div>소켓 연결에 실패했습니다.</div>
      </StyledContainer>
    );
  }
  return (
    <StyledContainer {...props}>
      <StyledTitleWrapper>
        <div>All Clients : {serverData.allUserCount}</div>

        {roomState.name === '' ? (
          <div style={{ color: 'purple' }}>
            <strong>Choose a Room</strong>
          </div>
        ) : (
          <div>
            <strong>{clientInRoom}</strong> - clients in room [
            <strong>{roomState.name}</strong>]
          </div>
        )}
        <StyledRefreshButton onClick={handleFetchRoomData}>
          refresh
        </StyledRefreshButton>
      </StyledTitleWrapper>
      <StyledContentsContainer>
        <StyledRoomWrapper>
          {serverData.createdRoom.map((room) => (
            <StyledRoom
              key={room._id}
              onClick={() =>
                handleRoomChange({
                  id: room._id,
                  name: room.roomName,
                })
              }
            >
              {room.roomName}
            </StyledRoom>
          ))}
        </StyledRoomWrapper>
        <StyledCreateRoom onClick={handleCreateRoomClick}>
          Create a new Chat Room
        </StyledCreateRoom>
      </StyledContentsContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
`;
const StyledTitleWrapper = styled.div`
  position: relative;
  background-color: #70b4f4;
  height: 130px;
`;
const StyledRefreshButton = styled.button`
  position: absolute;
  bottom: 10px;
  width: 80%;
  left: 50%;
  transform: translate(-50%, 0);
  border: none;
  background-color: #b9ddff;
  cursor: pointer;
  &:hover {
    background-color: #e1aacb;
  }
`;

const StyledContentsContainer = styled.div`
  overflow-y: auto;
  position: relative;
  background-color: #ffffff;
  padding-top: 20px;
  height: calc(100% - 130px);
`;
const StyledRoomWrapper = styled.div`
  min-height: calc(100% - (40px + 11px));
`;

const StyledRoom = styled.div`
  padding: 4px;
  margin-bottom: 10px;
  width: 100%;
  height: 40px;
  border: 1px solid #aaa;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #c6c6f3;
  }
`;

const StyledCreateRoom = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #ddd;
  height: 40px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #aaa;
  }
`;

export default RoomList;
