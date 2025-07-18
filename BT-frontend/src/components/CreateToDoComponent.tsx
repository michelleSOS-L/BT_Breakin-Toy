import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createToDo } from '../services/ToDoService';
import { ToDo } from './ToDo';

const CreateToDoComponent: React.FC = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();

    // ✅ Validate text input
    if (!trimmedText) {
      alert("Task cannot be empty.");
      return;
    }

    if (trimmedText.length > 100) {
      alert("Task must be 100 characters or fewer.");
      return;
    }

    // ✅ Validate due date (must be today or later)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Due date cannot be in the past.");
      return;
    }

    // ✅ Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(priority)) {
      alert("Please select a valid priority.");
      return;
    }

    const newToDo: ToDo = {
      text: trimmedText,
      creationDate: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      completed: false,
      doneDate: null,
      priority,
    };

    try {
      setIsSubmitting(true);
      await createToDo(newToDo);
      alert("Task created successfully.");
      navigate('/');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Create New Task</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label className="form-label" htmlFor="taskText">Task:</label>
              <input
                id="taskText"
                type="text"
                maxLength={100}
                placeholder="Enter task name or details"
                value={text}
                className="form-control"
                onChange={(e) => setText(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group mb-2">
              <label className="form-label" htmlFor="dueDate">Due Date:</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                className="form-control"
                onChange={(e) => setDueDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group mb-2">
              <label className="form-label" htmlFor="priority">Priority:</label>
              <select
                id="priority"
                value={priority}
                className="form-control"
                onChange={(e) => setPriority(e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateToDoComponent;
