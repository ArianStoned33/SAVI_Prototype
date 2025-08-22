import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders bank home and CoDI chip', () => {
  render(<App />);
  expect(screen.getByText(/Banco Ejemplo/i)).toBeInTheDocument();
  expect(screen.getByText(/CoDI®/i)).toBeInTheDocument();
});
