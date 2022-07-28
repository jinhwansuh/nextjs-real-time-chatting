import type { AppProps } from 'next/app';
import { GlobalStyle } from '../styles/globals';
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}

export default MyApp;
