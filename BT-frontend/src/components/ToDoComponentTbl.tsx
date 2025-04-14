import React, { useEffect, useState } from "react";
import {
  getPaginatedToDos,
  updateToDo,
  deleteToDo,
  getCompletionStats,
  getAllToDos,
} from "../services/ToDoService";
import { ToDo } from "./ToDo";
import { CompletionStats } from "./Stats";
import ToDoComponent from "./ToDoComponent";
import EditModal from "./EditModal";

const ListToDoComponent = () => {
  const [todos, setToDos] = useState<ToDo[]>([]);
  const [allToDos, setAllToDos] = useState<ToDo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [stats, setStats] = useState<CompletionStats[]>([]);
  const [sortBy, setSortBy] = useState<"text" | "priority" | "dueDate" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const isFiltering = filterText || filterPriority !== "ALL" || filterStatus !== "ALL";

  const refreshToDos = () => {
    if (isFiltering) {
      getAllToDos()
        .then((res) => {
          setAllToDos(res.data);
        })
        .catch((err) => console.error("Get all todos failed", err));
    } else {
      getPaginatedToDos(currentPage, pageSize)
        .then((res) => {
          setToDos(res.data.todos);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => console.error("Pagination load failed", err));
    }
  };

  useEffect(() => {
    refreshToDos();
  }, [currentPage, filterText, filterPriority, filterStatus]);

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

  const loadStats = () => {
    getCompletionStats()
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to load stats", err));
  };

  useEffect(() => {
    loadStats();
  }, [todos, allToDos]);

  const getRowClass = (dueDate: string): string => {
    const due = new Date(dueDate);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = due.getTime() - todayMidnight.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "no-due-date";
    if (diffDays <= 7) return "due-soon";
    if (diffDays <= 14) return "due-warning";
    return "due-safe";
  };

  const sortToDos = (list: ToDo[]): ToDo[] => {
    if (!sortBy) return list;
    return [...list].sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      if (sortBy === "text") {
        aVal = a.text.toLowerCase();
        bVal = b.text.toLowerCase();
      } else if (sortBy === "priority") {
        const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
        aVal = priorityOrder[a.priority as keyof typeof priorityOrder];
        bVal = priorityOrder[b.priority as keyof typeof priorityOrder];
      } else if (sortBy === "dueDate") {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredToDos = (isFiltering ? allToDos : todos).filter((todo) =>
    todo.text.toLowerCase().includes(filterText.toLowerCase()) &&
    (filterPriority === 'ALL' || todo.priority === filterPriority) &&
    (filterStatus === 'ALL' ||
      (filterStatus === 'DONE' && !!todo.completed) ||
      (filterStatus === 'UNDONE' && !todo.completed))
  );

  const sortedToDos = sortToDos(filteredToDos);

  const paginatedToDos = isFiltering
    ? sortedToDos.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
    : sortedToDos;

  useEffect(() => {
    if (isFiltering) {
      const totalFiltered = sortedToDos.length;
      setTotalPages(Math.ceil(totalFiltered / pageSize));
      if (currentPage > Math.floor(totalFiltered / pageSize)) {
        setCurrentPage(0);
      }
    }
  }, [sortedToDos, isFiltering]);

  return (
    <div className="app-background">
      <div className="card-pretty">
        <div className="header-container">
          <h2 className="text-center pretty-title">To Do List</h2>
        </div>

        <div className="filter-panel mb-4">
          <div className="row g-2">
            <div className="col">
              <input
                type="text"
                placeholder="Search by task name"
                className="form-control"
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </div>
            <div className="col">
              <select className="form-select" value={filterPriority} onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(0);
              }}>
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="col">
              <select className="form-select" value={filterStatus} onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(0);
              }}>
                <option value="ALL">All</option>
                <option value="DONE">Done</option>
                <option value="UNDONE">Undone</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-end mb-3">
          <button className="btn btn-pretty" onClick={() => setShowForm(true)}>
            + New To Do
          </button>
        </div>

        {showForm && (
          <ToDoComponent onClose={handleFormClose} onSaved={handleFormSaved} />
        )}

        <table className="table table-bordered pretty-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={paginatedToDos.length > 0 && paginatedToDos.every((todo) => !!todo.completed)}
                  onChange={async (e) => {
                    const markAllDone = e.target.checked;
                    const updatedTasks = paginatedToDos.map(todo => ({
                      ...todo,
                      completed: markAllDone,
                      doneDate: markAllDone && !todo.completed ? new Date().toISOString() : todo.doneDate,
                    }));
                    try {
                      await Promise.all(updatedTasks.map((todo) => updateToDo(todo.id ?? 0, todo)));
                      refreshToDos();
                    } catch (err) {
                      console.error("Error updating all tasks", err);
                      alert("Failed to mark tasks");
                    }
                  }}
                />
              </th>
              <th onClick={() => {
                const isSame = sortBy === "text";
                setSortBy("text");
                setSortDirection(isSame && sortDirection === "asc" ? "desc" : "asc");
              }} style={{ cursor: "pointer" }}>
                Task {sortBy === "text" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => {
                const isSame = sortBy === "priority";
                setSortBy("priority");
                setSortDirection(isSame && sortDirection === "asc" ? "desc" : "asc");
              }} style={{ cursor: "pointer" }}>
                Priority {sortBy === "priority" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => {
                const isSame = sortBy === "dueDate";
                setSortBy("dueDate");
                setSortDirection(isSame && sortDirection === "asc" ? "desc" : "asc");
              }} style={{ cursor: "pointer" }}>
                Due Date {sortBy === "dueDate" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedToDos.map((todo, index) => {
              const isDone = !!todo.completed;
              const rowClass = getRowClass(todo.dueDate);
              return (
                <tr key={todo.id ?? index} className={rowClass}>
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
                  <td className={isDone ? "strike-text" : ""}>{todo.text}</td>
                  <td className={isDone ? "strike-text" : ""}>{todo.priority}</td>
                  <td className={isDone ? "strike-text" : ""}>{formatDate(todo.dueDate)}</td>
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
                        if (!window.confirm("Are you sure you want to delete this task?")) return;
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
                </tr>
              );
            })}
          </tbody>
        </table>

        <nav className="mt-4">
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

        <div className="stats-panel mt-5">
          <h5><strong>Average time to finish tasks:</strong></h5>
          <p>{stats.find(s => s.priority === "ALL")?.average.toFixed(2) ?? "N/A"} minutes</p>
          <h5><strong>Average time by priority:</strong></h5>
          <ul>
            <li><strong>Low:</strong> {stats.find(s => s.priority === "LOW")?.average.toFixed(2) ?? "N/A"} mins</li>
            <li><strong>Medium: </strong>{stats.find(s => s.priority === "MEDIUM")?.average.toFixed(2) ?? "N/A"} mins</li>
            <li><strong>High:</strong> {stats.find(s => s.priority === "HIGH")?.average.toFixed(2) ?? "N/A"} mins</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListToDoComponent;