import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Live from '../pages/live';
import RoomId from '../pages/live/[roomId]';

let user;

jest.mock('uuid', () => 'eb7b7961-395d-4b4c-afc6-9ebcadaf0150');
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { roomId: 'myValue' },
  }),
}));

beforeAll(() => {
  // sessionStorage.setItem('test--name', 'john Doe');
  // user = sessionStorage.getItem('test--name');
});

describe('asd', () => {
  it('should render loading... ', () => {
    render(<Live />);
    const textEl = screen.getByText(/로딩중/);

    expect(textEl).toBeInTheDocument();
  });

  it('should render several broadcasts channel after fetching', () => {});
});

describe('Streaming Room should', () => {
  window.HTMLElement.prototype.scrollTo = function () {};

  it('should join a room', () => {
    render(
      <RecoilRoot>
        <RoomId />
      </RecoilRoot>
    );
    expect(screen.getByText(/스트리밍/)).toBeInTheDocument();
  });
});

afterAll(() => {
  sessionStorage.clear();
});
