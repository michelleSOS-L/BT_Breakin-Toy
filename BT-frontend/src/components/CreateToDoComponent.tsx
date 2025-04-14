import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createToDo } from '../services/ToDoService';
import { ToDo } from './ToDo'; 

const CreateToDoComponent: React.FC = () => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newToDo: ToDo = {
      text,
      creationDate: new Date().toISOString(),
      dueDate,
      completed: false,
      doneDate: null,
      priority,
    };

    try {
      await createToDo(newToDo);
      navigate('/'); 
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Create New Task</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label className="form-label">Task:</label>
              <input
                type="text"
                maxLength={100}
                placeholder="Enter task name or details"
                value={text}
                className="form-control"
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-2">
              <label className="form-label">Due Date:</label>
              <input
                type="date"
                value={dueDate}
                className="form-control"
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-2">
              <label className="form-label">Priority:</label>
              <select
                value={priority}
                className="form-control"
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success mt-3">
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateToDoComponent;