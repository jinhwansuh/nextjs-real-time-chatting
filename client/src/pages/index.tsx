import type { NextPage } from 'next';
import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '../styles/Home.module.css';

const socket = io(`http://localhost:8000`, {
  transports: ['websocket'],
});

const Home: NextPage = () => {
  const [chat, setChat] = useState('');
  const [chatList, setChatList] = useState<string[]>([]);

  const handleChat = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('chat message', chat);
    setChat('');
  };

  useEffect(() => {
    socket.on('send message', (message: string) => {
      setChatList([...chatList, message]);
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Real time chatting</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <br />

        <form onSubmit={handleChat}>
          <input
            type="text"
            value={chat}
            onChange={(e) => setChat(e.target.value)}
          />
          <button onClick={handleChat}> send </button>
        </form>
      </div>

      <br />
      {chatList.length > 0 &&
        chatList?.map((chat, index) => <li key={index}>{chat}</li>)}
    </div>
  );
};

export default Home;
