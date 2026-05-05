import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('next/link', () => {
  const React = require('react');
  return function Link({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return React.createElement('a', { href, ...props }, children);
  };
});
