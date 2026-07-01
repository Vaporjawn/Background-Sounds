import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the home page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Background Sounds' })).toBeInTheDocument();
    expect(screen.getByText('0.00 seconds')).toBeInTheDocument();
  });
});
