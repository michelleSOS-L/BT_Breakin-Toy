import React, { useEffect, useState } from "react";
import { listToDos } from "../services/ToDoService";
import { updateToDo } from "../services/ToDoService";
import { getCompletionStats } from "../services/ToDoService";
import{deleteToDo}from "../services/ToDoService";
import { getPaginatedToDos } from "../services/ToDoService";

import { ToDo } from "./ToDo";
import ToDoComponent from "./ToDoComponent";
import { CompletionStats } from "./Stats";
import EditModal from "./EditModal";
const ListToDoComponent = () => {
   

  const [todos, setToDos] = useState<ToDo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const[stats, setStats]=useState<CompletionStats[]>([]);
  const [editingTodo, setEditingTodo]=useState<ToDo|null>(null);
  const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const pageSize = 5;

const refreshToDos = () => {
    getPaginatedToDos(currentPage, pageSize)
      .then((res) => {
        setToDos(res.data.todos);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Pagination load failed", err));
  };

  useEffect(() => {
    refreshToDos();
  }, [currentPage]);
  
  


  const handleFormClose = () => setShowForm(false);

  const handleFormSaved = () => {
    setShowForm(false);
    refreshToDos();
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toISOString().split("T")[0];
  };
  const loadStats=()=>{
      getCompletionStats()
      .then(res=>setStats(res.data))
      .catch(err=>console.error("Failed to load stats", err));
  };
  useEffect(()=>{
      loadStats();
  }, [todos]);




  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="text-center">To Do List</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                placeholder="Search by task name"
                className="form-control"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="col">
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="col">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="DONE">Done</option>
                <option value="UNDONE">Undone</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary mb-2"
            onClick={() => setShowForm(true)}
          >
            Add To Do
          </button>

          {showForm && (
            <ToDoComponent onClose={handleFormClose} onSaved={handleFormSaved} />
          )}<table className="table table-striped table-bordered">
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          checked={todos.length > 0 && todos.every((todo) => !!todo.completed)}
          onChange={async (e) => {
            const markAllDone = e.target.checked;
            const updatedTasks = todos.map(todo => ({
              ...todo,
              completed: markAllDone ? true : !!todo.completed,
              doneDate: markAllDone && !todo.completed ? new Date().toISOString() : todo.doneDate,
            }));

            try {
              await Promise.all(
                updatedTasks.map((todo) =>
                  updateToDo(todo.id ?? 0, todo)
                )
              );
              refreshToDos();
            } catch (err) {
              console.error("Error updating all tasks", err);
              alert("Failed to mark task as done");
            }
          }}
        />
      </th>
      <th>Task</th>
      <th>Priority</th>
      <th>Due Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {todos
      .filter((todo) =>
        todo.text.toLowerCase().includes(filterText.toLowerCase()) &&
        (filterPriority === 'ALL' || todo.priority === filterPriority) &&
        (filterStatus === 'ALL' ||
          (filterStatus === 'DONE' && !!todo.completed) ||
          (filterStatus === 'UNDONE' && !todo.completed))
      )
      .map((todo, index) => {
        const isDone = !!todo.completed;
        const style = { textDecoration: isDone ? "line-through" : "none" };

        return (
          <tr key={todo.id ?? index}>
            <td>
              <input
                type="checkbox"
                checked={isDone}
                onChange={async () => {
                  if (todo.id == null) return;
                  const updated = {
                    ...todo,
                    completed: !isDone,
                    doneDate: !isDone ? new Date().toISOString() : null,
                  };
                  try {
                    await updateToDo(todo.id, updated);
                    refreshToDos();
                  } catch (err) {
                    console.error("Update failed", err);
                    alert("Could not update task.");
                  }
                }}
              />
            </td>
            <td style={style}>{todo.text}</td>
            <td style={style}>{todo.priority}</td>
            <td style={style}>{formatDate(todo.dueDate)}</td>
            <td>
            <td>
  <button
    className="btn btn-sm btn-outline-warning me-2"
    onClick={() => setEditingTodo(todo)}
  >
    Edit
  </button>
  <button
    className="btn btn-sm btn-outline-danger"
    onClick={async () => {
      const confirm = window.confirm("Are you sure you want to delete this task?");
      if (!confirm) {
        alert("No changes made.");
        return;
      }

      try {
        await deleteToDo(todo.id ?? 0);
        alert("Task deleted.");
        refreshToDos();
      } catch (err: any) {
        console.error("Delete failed", err);
        alert(`Could not delete task: ${err?.response?.data ?? err.message}`);
      }
    }}
  >
    Delete
  </button>
</td>
            </td>
          </tr>
        );
      })}
  </tbody>
</table>
<nav className="mt-3">
  <ul className="pagination justify-content-center">
    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>«</button>
    </li>

    {[...Array(totalPages)].map((_, index) => (
      <li key={index} className={`page-item ${index === currentPage ? "active" : ""}`}>
        <button className="page-link" onClick={() => setCurrentPage(index)}>
          {index + 1}
        </button>
      </li>
    ))}

    <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>»</button>
    </li>
  </ul>
</nav>
{editingTodo && (
  <EditModal
    todo={editingTodo}
    onClose={() => setEditingTodo(null)}
    onSave={async (updated) => {
      try {
        await updateToDo(updated.id ?? 0, updated);
        alert("Task updated.");
        refreshToDos();
        setEditingTodo(null);
      } catch (err) {
        console.error("Update failed", err);
        alert("Could not update task.");
      }
    }}
  />
)}



<div className="card mt-4">
  <div className="card-body">
    <h5>Average time to finish tasks:</h5>
    <p>
      {stats.find(s => s.priority === "ALL")?.average.toFixed(2) ?? "N/A"} minutes
    </p>
    <h5>Average time by priority:</h5>
    <ul>
      <li>
        Low: {stats.find(s => s.priority === "LOW")?.average.toFixed(2) ?? "N/A"} mins
      </li>
      <li>
        Medium: {stats.find(s => s.priority === "MEDIUM")?.average.toFixed(2) ?? "N/A"} mins
      </li>
      <li>
        High: {stats.find(s => s.priority === "HIGH")?.average.toFixed(2) ?? "N/A"} mins
      </li>
    </ul>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default ListToDoComponent;
