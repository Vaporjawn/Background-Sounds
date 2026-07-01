import { render, screen } from '@testing-library/react';
import Header from './header';

describe('Header', () => {
  it('renders the extension title', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { level: 1, name: 'Background Sounds' })).toBeInTheDocument();
  });
});
