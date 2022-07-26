import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Create from '../pages/live/create';

jest.mock('uuid', () => 'eb7b7961-395d-4b4c-afc6-9ebcadaf0150');

describe('a broadcaster start streaming', () => {
  window.HTMLElement.prototype.scrollTo = function () {};

  it('button should be disabled when first rendered', () => {
    render(
      <RecoilRoot>
        <Create />
      </RecoilRoot>
    );

    const createButtonEl = screen.getByTestId('createButton');

    expect(createButtonEl).toBeDisabled();
  });

  it('button should not be disabled when broadcaster connect camera', async () => {
    render(
      <RecoilRoot>
        <Create />
      </RecoilRoot>
    );

    const createButtonEl = screen.getByTestId('createButton');
    fireEvent.click(screen.getByTestId('videoConnect'));
    waitFor(() => expect(createButtonEl).not.toBeDisabled());
  });
});
