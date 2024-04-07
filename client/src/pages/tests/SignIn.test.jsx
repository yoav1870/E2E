// Import statements
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SignIn from '../SignIn'; // Adjust the import path as necessary

// Mocks
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useNavigate: () => jest.fn(),
}));

// Helper function to render the component within a Router, as it uses useNavigate
const renderSignIn = () =>
  render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>
  );

describe('SignIn Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.post.mockClear();
  });

  it('renders correctly', () => {
    renderSignIn();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('submits the form and navigates on success', async () => {
    axios.post.mockResolvedValue({ data: { token: 'fake-token' } });

    renderSignIn();
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    // Here, you would normally check for navigation, but since navigation is handled by window.location.href,
    // it's a bit tricky to test without an actual browser environment. Consider mocking window.location.href
    // or using MemoryRouter for more controlled testing of navigation behavior.
  });

  it('displays an error message on failure', async () => {
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValue({
      response: {
        data: errorMessage,
      },
    });

    renderSignIn();
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    // Depending on your implementation of error handling (e.g., setting state and displaying the error),
    // you would assert that the error message is displayed to the user.
    // This might require adjusting your component to make it more test-friendly.
  });
});
