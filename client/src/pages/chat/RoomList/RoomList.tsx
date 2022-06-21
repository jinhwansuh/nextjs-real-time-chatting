import styled from 'styled-components';
import { RoomListProps } from '../../../types/chat';

const RoomList = ({
  allUser,
  roomState,
  roomList,
  clientInRoom,
  handleRoomChange,
  ...props
}: RoomListProps) => {
  return (
    <StyledWrapper {...props}>
      <div>전체 인원 : {allUser}</div>
      {roomState === undefined ? (
        <div>방을 선택해주세요</div>
      ) : (
        <div>
          {roomState}번 방 인원 {clientInRoom}
        </div>
      )}
      <div>
        {roomList.map((room, index) => (
          <div key={room + index}>
            <StyledButton
              value={index}
              onClick={(e) => handleRoomChange(e.currentTarget.value)}
            >
              {room}
            </StyledButton>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
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

const StyledButton = styled.button`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  margin: 6px;
  width: calc(100% - 12px);
  box-sizing: border-box;
  cursor: pointer;
`;

export default RoomList;
