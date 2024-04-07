import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateReport from '../../../__mocks__/CreateReport';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the axios request
jest.mock('axios');

// Mock the decodeJWT function from the Header component
jest.mock('../../component/Header', () => ({
  decodeJWT: jest.fn(() => ({ role: 'user' })),
}));

// Mock the LoadingComponent
jest.mock('../../component/Loading', () => () => <div>Loading...</div>);

describe('CreateReport', () => {
  beforeEach(() => {
    // Mock the localStorage
    localStorage.setItem('token', 'mock_token');
    localStorage.setItem('user', JSON.stringify({ _id: 'mock_user_id' }));
  });

  afterEach(() => {
    // Clear the mocked localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the CreateReport component', () => {
    act(() => {
      render(
        <Router>
          <CreateReport isLoading={false} />
        </Router>
      );
    });
    expect(screen.getByText('Create Report')).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    act(() => {
      render(
        <Router>
          <CreateReport isLoading={false} />
        </Router>
      );
    });

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test description' },
    });
    fireEvent.change(screen.getByLabelText('Profession'), {
      target: { value: 'electrician' },
    });
    fireEvent.change(screen.getByLabelText('Urgency (1-5)'), {
      target: { value: '3' },
    });
    fireEvent.change(screen.getByLabelText('Range (1-100)'), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByLabelText('Date of Resolve'), {
      target: { value: '2023-05-01' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit Report'));

    // Add assertions to check console logs or other expected behavior
  });
});