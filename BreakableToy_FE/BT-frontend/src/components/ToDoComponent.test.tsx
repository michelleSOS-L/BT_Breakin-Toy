import { render, screen, fireEvent } from '@testing-library/react';
import ToDoComponent from './ToDoComponent';
import { createToDo } from '../services/ToDoService';

jest.mock('../services/ToDoService', () => ({
  createToDo: jest.fn().mockResolvedValue({}),
}));

describe('ToDoComponent (modal)', () => {
  const onClose = jest.fn();
  const onSaved = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ToDoComponent onClose={onClose} onSaved={onSaved} />);

    expect(screen.getByLabelText(/Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/No Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  });

  it('shows alert if task is too long', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ToDoComponent onClose={onClose} onSaved={onSaved} />);

    const longText = 'x'.repeat(101);
    fireEvent.change(screen.getByLabelText(/Task/i), { target: { value: longText } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: new Date().toISOString().split('T')[0] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    expect(alertMock).toHaveBeenCalledWith('Task must be 100 characters or fewer.');
    alertMock.mockRestore();
  });

  it('rejects past due dates', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ToDoComponent onClose={onClose} onSaved={onSaved} />);

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/Task/i), { target: { value: 'Test task' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: yesterday } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'LOW' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Task/i }));
    expect(alertMock).toHaveBeenCalledWith('Are you going back in time?!');
    alertMock.mockRestore();
  });

  it('submits valid task and calls createToDo()', async () => {
    render(<ToDoComponent onClose={onClose} onSaved={onSaved} />);

    const today = new Date().toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/Task/i), { target: { value: 'Feed the cat' } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: today } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'MEDIUM' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Task/i }));

    expect(await screen.findByText(/Add Task/i)).toBeInTheDocument();
    expect(createToDo).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Feed the cat',
        priority: 'MEDIUM',
        completed: false,
      })
    );

    expect(onClose).toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalled();
  });
});
