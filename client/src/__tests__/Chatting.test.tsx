import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Chat from '../pages/chat';

jest.mock('uuid', () => ({ v4: () => 'adfd01fb-309b-4e1c-9117-44d003f5d7fc' }));

beforeAll(() => {
  sessionStorage.setItem('test--name', 'gfdg');
});
afterAll(() => {
  sessionStorage.clear();
});
window.HTMLElement.prototype.scrollTo = function () {};

describe('initial render', () => {
  it('loading should render', () => {
    render(
      <RecoilRoot>
        <Chat />
      </RecoilRoot>
    );

    const textEl = screen.getByText(/로딩중/);
    expect(textEl).toBeInTheDocument();
  });
});
