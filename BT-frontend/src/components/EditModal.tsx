import React, { useState } from "react";
import { ToDo } from "./ToDo";

interface Props {
  todo: ToDo;
  onClose: () => void;
  onSave: (updated: ToDo) => void;
}

const EditModal: React.FC<Props> = ({ todo, onClose, onSave }) => {
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState(todo.dueDate?.split("T")[0] ?? "");
  const [priority, setPriority] = useState(todo.priority);

  const handleSave = () => {
    if (
      text === todo.text &&
      dueDate === (todo.dueDate?.split("T")[0] ?? "") &&
      priority === todo.priority
    ) {
      alert("No changes made.");
      return;
    }

    if (!window.confirm("Are you sure you want to apply these changes?")) return;

    const updated: ToDo = {
      ...todo,
      text,
      dueDate:new Date(dueDate).toISOString(),
      priority,
    };
    onSave(updated);
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "#00000088" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="form-group mb-2">
              <label>Task</label>
              <input
                className="form-control"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Due Date</label>
              <input
                className="form-control"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => {
              alert("No changes made.");
              onClose();
            }}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;