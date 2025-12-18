import { render } from '@testing-library/react';
import Top from './Top';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
      },
    },
    status: 'authenticated',
  })),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

describe('Top', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Top credits={0} />);
    expect(baseElement).toBeTruthy();
  });
});
