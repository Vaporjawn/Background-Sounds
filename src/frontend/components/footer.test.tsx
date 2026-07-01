import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders the current copyright year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();

    expect(screen.getByText(`© ${currentYear} Background Sounds. All rights reserved.`)).toBeInTheDocument();
  });
});
