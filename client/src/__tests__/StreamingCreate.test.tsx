import Router from 'next/router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Create from '../pages/live/create';
import React from 'react';

jest.mock('uuid', () => ({ v4: () => 'adfd01fb-309b-4e1c-9117-44d003f5d7fc' }));

beforeAll(() => {
  sessionStorage.setItem('test--name', 'gfdg');
});
afterAll(() => {
  sessionStorage.clear();
});
window.HTMLElement.prototype.scrollTo = function () {};

describe('initial render', () => {
  it('button should be disabled or not be disabled when first rendered', () => {
    render(
      <RecoilRoot>
        <Create />
      </RecoilRoot>
    );
    const createButtonEl = screen.getByTestId('createButton');
    expect(screen.getByTestId('videoConnect')).not.toBeDisabled();
    expect(screen.getByTestId('screenConnect')).not.toBeDisabled();
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

    // await waitFor(() => expect(createButtonEl).not.toBeDisabled());
  });
});

describe('when broadcaster start broadcasting', () => {});
