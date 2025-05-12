// File: tests/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from '@components/layout/Header';
import { vi } from 'vitest';

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header Component', () => {
  it('renders the site name', () => {
    render(<Header />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Lessons')).toBeInTheDocument();
    expect(screen.getByText('Renascend')).toBeInTheDocument();
  });

  it('renders sign in and sign up buttons', () => {
    render(<Header />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});
