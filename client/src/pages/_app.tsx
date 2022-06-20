import type { AppProps } from 'next/app';
import { GlobalStyle } from '../styles/globals';
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <GlobalStyle />
      <RecoilRoot>{getLayout(<Component {...pageProps} />)}</RecoilRoot>
    </>
  );
}

export default MyApp;
