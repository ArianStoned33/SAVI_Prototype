import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders Inicio with balance and action grid', () => {
  render(<App />);
  // Top bar
  expect(screen.getByText(/Banco Ejemplo/i)).toBeInTheDocument();
  // Balance card title (pick the first one)
  expect(screen.getAllByText(/Disponible/i)[0]).toBeInTheDocument();
  // Action buttons
  expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Transferir/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Retirar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /CLABE/i })).toBeInTheDocument();
});
