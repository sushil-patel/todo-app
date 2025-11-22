import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTodo, setNewTodo] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (editingId != null && editInputRef.current) {
      editInputRef.current.focus();
      const len = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(len, len);
    }
  }, [editingId]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/todos");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setAdding(true);
      await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });

      setNewTodo("");
      await loadTodos();
    } catch (err) {
      alert("Error adding todo: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const toggleCompleted = async (todo) => {
    try {
      await fetch(`http://localhost:8080/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });
      await loadTodos();
    } catch (err) {
      alert("Error updating todo: " + err.message);
    }
  };

  const deleteTodo = async (id) => {
    if (!confirm("Delete this todo?")) return;
    try {
      await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: "DELETE",
      });
      await loadTodos();
    } catch (err) {
      alert("Error deleting todo: " + err.message);
    }
  };

  const startInlineEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveInlineEdit = async () => {
    if (editingId == null) return;
    const trimmed = editingText.trim();
    if (!trimmed) {
      alert("Title cannot be empty");
      return;
    }
    try {
      setSavingEdit(true);
      const todo = todos.find((t) => t.id === editingId);
      await fetch(`http://localhost:8080/api/todos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: trimmed,
          completed: todo?.completed || false,
        }),
      });
      setEditingId(null);
      setEditingText("");
      await loadTodos();
    } catch (err) {
      alert("error saving todo: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const onEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveInlineEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelInlineEdit();
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4">Error: {error}</div>;

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Todo List</h1>

      {/* Add Todo Form */}
      <form className="mb-4" onSubmit={addTodo}>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Add new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button className="btn btn-primary" disabled={adding}>
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {/* Todo List */}
      <ul className="list-group">
        {sortedTodos.map((t) => {
          const isEditing = editingId === t.id;
          return (
            <li
              key={t.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div
                className="d-flex align-items-center"
                style={{ minWidth: 0 }}
              >
                {/* Checkbox */}
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleCompleted(t)}
                  id={`chk-${t.id}`}
                />

                {/* Text or Inline Edit Input */}
                <div className="ms-2" style={{ minWidth: 0, flex: 1 }}>
                  {!isEditing ? (
                    // Normal view (double-click to edit)
                    <label
                      htmlFor={`chk-${t.id}`}
                      onDoubleClick={() => startInlineEdit(t)}
                      className={
                        "mb-0 d-block text-truncate " +
                        (t.completed
                          ? "text-decoration-line-through text-muted"
                          : "")
                      }
                      title={t.title}
                      style={{ cursor: "text" }}
                    >
                      {t.title}
                    </label>
                  ) : (
                    // Inline edit input
                    <input
                      ref={editInputRef}
                      className="form-control form-control-sm"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={onEditKeyDown}
                      onBlur={saveInlineEdit}
                    />
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 ms-3">
                {!isEditing ? (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => startInlineEdit(t)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTodo(t.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={saveInlineEdit}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "Saving..." : "Save"}
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelInlineEdit}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
