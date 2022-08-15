import type { AppProps } from 'next/app';
import { GlobalStyle } from '../styles/globals';
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import AuthLayout from '../layout/AuthLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <RecoilRoot>
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
