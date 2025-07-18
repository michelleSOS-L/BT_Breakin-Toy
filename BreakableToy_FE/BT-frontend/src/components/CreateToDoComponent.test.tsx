import { render, screen, fireEvent } from '@testing-library/react';
import CreateToDoComponent from './CreateToDoComponent';
import { BrowserRouter } from 'react-router-dom';
import { createToDo } from '../services/ToDoService';

jest.mock('../services/ToDoService', () => ({
  createToDo: jest.fn().mockResolvedValue({}),
}));

describe('CreateToDoComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form inputs', () => {
    render(
      <BrowserRouter>
        <CreateToDoComponent />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save task/i })).toBeInTheDocument();
  });

  it('shows an alert if the task is empty', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <CreateToDoComponent />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/task/i), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(alertMock).toHaveBeenCalledWith('Task cannot be empty.');
    alertMock.mockRestore();
  });

  it('rejects past due dates', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <CreateToDoComponent />
      </BrowserRouter>
    );

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/task/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: yesterday } });
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'LOW' } });

    fireEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(alertMock).toHaveBeenCalledWith('Due date cannot be in the past.');
    alertMock.mockRestore();
  });

  it('submits valid task and calls createToDo', async () => {
    render(
      <BrowserRouter>
        <CreateToDoComponent />
      </BrowserRouter>
    );

    const today = new Date().toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/task/i), { target: { value: 'Do homework' } });
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: today } });
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'MEDIUM' } });

    fireEvent.click(screen.getByRole('button', { name: /save task/i }));

    expect(await screen.findByText(/Create New Task/i)).toBeInTheDocument();
    expect(createToDo).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Do homework',
        priority: 'MEDIUM',
        completed: false,
      })
    );
  });
});
