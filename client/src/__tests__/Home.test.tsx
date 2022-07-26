import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Home is rendered', () => {
  it('should render a title', () => {
    render(<Home />);

    const titleEl = screen.getByText(/Try Real Time App/);
    expect(titleEl).toBeInTheDocument();
  });
});
