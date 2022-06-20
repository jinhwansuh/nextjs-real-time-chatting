import React, { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { ChattingAreaProps } from '../../../types/chat';

function ChattingArea({
  socket,
  chatList,
  handleChatSubmit,
  chatInputState,
  setChatInputState,
  ...props
}: ChattingAreaProps) {
  return (
    <StyledContainer {...props}>
      <StyledEmailWrapper>
        {chatList.length > 0 &&
          chatList?.map((chat, index) => (
            <li key={chat.name + index}>
              {chat.name} : {chat.message}
            </li>
          ))}
      </StyledEmailWrapper>
      <StyledForm onSubmit={handleChatSubmit}>
        <StyledTextArea
          // onKeyPress={handleKeyPress}
          value={chatInputState}
          onChange={(e) => setChatInputState(e.target.value)}
        />
        <StyledButton type="submit" disabled={!chatInputState.trim().length}>
          전송
        </StyledButton>
      </StyledForm>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  overflow-y: auto;
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

const StyledEmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 30px;
  min-height: calc(100% - (65px + 12px));
  box-sizing: border-box;
`;

const StyledForm = styled.form`
  position: sticky;
  bottom: 0px;
  width: 100%;
  height: calc(65px + 12px);
  display: flex;
  background-color: #ffffff;
  padding: 6px;
  box-sizing: border-box;
`;

const StyledTextArea = styled.input`
  height: 100%;
  flex: 1;
  margin-right: 5px;
  padding: 6px;
  resize: none;
  box-sizing: border-box;
`;
const StyledButton = styled.button`
  height: 100%;
  width: 45px;
`;

export default ChattingArea;
