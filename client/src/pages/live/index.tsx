import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ServerStreamingRoom } from '../../types/streaming';

const Live: NextPage = () => {
  const router = useRouter();
  const [streamingData, setStreamingData] = useState<ServerStreamingRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStreamingData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/streaming`
      );
      setStreamingData([...response.data]);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStreamingData();
  }, []);

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <>
      <div>현재 방송들 : 222개</div>
      <button onClick={fetchStreamingData} disabled={isLoading}>
        새로고침
      </button>
      <StyledStreamingRoomWrapper>
        {streamingData.length === 0 ? (
          <div>방송중인 사람이 없습니다</div>
        ) : (
          streamingData?.map((room) => (
            <StyledStreamingRoom
              key={room._id}
              onClick={() => router.push(`/live/${room._id}`)}
            >
              방송 제목: {room.roomName} 스트리머: {room.streamer}
            </StyledStreamingRoom>
          ))
        )}
      </StyledStreamingRoomWrapper>

      <Link href="/live/create">
        <a>방송 생성하기</a>
      </Link>
    </>
  );
};

const StyledRoomContainer = styled.div``;

const StyledStreamingRoomWrapper = styled.div``;

const StyledStreamingRoom = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ddd;
  cursor: pointer;
`;

export default Live;
