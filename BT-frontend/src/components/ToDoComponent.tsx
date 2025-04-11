import React, { useState } from "react";
import { createToDo } from "../services/ToDoService";
import { ToDo } from "./ToDo";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}
const ToLocalDateTime = (date: string): string => {
    return date.includes("T") ? date : `${date}T00:00:00`;
  };
const ToDoComponent: React.FC<Props> = ({ onClose, onSaved }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDue = new Date(dueDate);
    selectedDue.setHours(0, 0, 0, 0);

    if (text.length > 100) {
      alert("Task must be 100 characters or fewer.");
      return;
    }

    if (selectedDue < today) {
      alert("Are you going back in time?!");
      return;
    }

    const newToDo: ToDo = {
      text,
      creationDate: new Date().toISOString(),
      dueDate:ToLocalDateTime(dueDate),
      completed: false,
      doneDate: null,
      priority,
    };

    try {
      await createToDo(newToDo);
      alert("Task added successfully.");
      setText('');
      setDueDate('');
      setPriority('');
      onSaved();   
      onClose();   
    } catch (error) {
      alert("Failed to save task. Please try again.");
      console.error("Failed to save task:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-content card">
          <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="modal-title">Add Task</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="form-label">Task:</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Enter task details"
                  name="text"
                  value={text}
                  className="form-control"
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={dueDate}
                  className="form-control"
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Priority:</label>
                <select
                  name="priority"
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

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToDoComponent;