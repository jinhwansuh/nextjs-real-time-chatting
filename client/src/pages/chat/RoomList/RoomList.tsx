import React from 'react';
import styled from 'styled-components';
import { RoomListProps } from '../../../types/chat';

const RoomList = ({
  socket,
  allUser,
  roomList,
  handleRoomChange,
  ...props
}: RoomListProps) => {
  return (
    <StyledWrapper {...props}>
      <StyledButton type="button">새로고침</StyledButton>
      <div>
        <button
          value={0}
          onClick={(e) => handleRoomChange(e.currentTarget.value)}
        >
          room1
        </button>
        <button
          value={1}
          onClick={(e) => handleRoomChange(e.currentTarget.value)}
        >
          room2
        </button>
        <button
          value={2}
          onClick={(e) => handleRoomChange(e.currentTarget.value)}
        >
          room3
        </button>
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
