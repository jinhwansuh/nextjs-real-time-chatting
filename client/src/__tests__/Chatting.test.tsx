import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Chat from '../pages/chat';

jest.mock('uuid', () => 'eb7b7961-395d-4b4c-afc6-9ebcadaf0150');
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
