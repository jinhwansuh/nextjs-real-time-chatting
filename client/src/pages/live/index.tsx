import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ServerStreamingRoom } from '../../types/streaming';

const Live: NextPage = () => {
  const router = useRouter();
  const [streamingData, setStreamingData] = useState<ServerStreamingRoom[]>();

  const fetchStreamingData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/streaming');
      setStreamingData([...response.data]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStreamingData();
  }, []);

  if (!streamingData) {
    return <div>방송중인 사람이 없습니다</div>;
  }

  return (
    <>
      <div>현재 방송들 : 222개</div>
      <div>
        {streamingData?.map((room) => (
          <StyledRoomWrapper
            key={room._id}
            onClick={() => router.push(`/live/${room._id}`)}
          >
            방송 제목: {room.roomName} 스트리머: {room.streamer}
          </StyledRoomWrapper>
        ))}
      </div>

      <Link href="/live/create">
        <a>방송 생성하기</a>
      </Link>
    </>
  );
};

const StyledRoomContainer = styled.div``;

const StyledRoomWrapper = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ddd;
  cursor: pointer;
`;

export default Live;
