import { render, screen } from '@testing-library/react';
import HomePage from './homePage';

describe('HomePage', () => {
  it('renders the header, timer, and footer', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Background Sounds' })).toBeInTheDocument();
    expect(screen.getByText('0.00 seconds')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
