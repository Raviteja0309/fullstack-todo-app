import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Plus, Check, X, LogOut, ArrowDownUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [userID, setUserID] = useState(() => {
    const data = localStorage.getItem("userDetails");
    return data ? JSON.parse(data).id : null;
  });
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(() => {
    const data = localStorage.getItem("userDetails");
    return data ? JSON.parse(data) : null;
  });
  const [userRole, setUserRole] = useState(userDetails.role);



  const navigate = useNavigate();

  const getTodos = async () => {
    console.log(userID);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/all_todos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "owner_id": userID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch TODOS...');
    }
  };

  useEffect(() => {
    getTodos()
  }, [userID]);

  // Add new todo
  const addTodo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/add_todo`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "owner_id": userID,
          "title": newTodo.trim(),
          "description": description.trim(),
          "priority": priority,
          "status": "pending",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add');
      }

      const data = await response.json();
      if (response.status === 200) {
        setNewTodo('');
        setDescription('')
        setPriority('')
      }
      getTodos();
      setError('');
    } catch (err) {
      setError('Failed to add TODO...');
    }
  };


  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/delete_todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          "owner_id": userID,
          "todo_id": id,
        }),
      })
      getTodos()
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setEditDescription(todo.description);
    setEditPriority(todo.priority);
  };

  // Update todo
  const updateTodo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/update_todo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          "owner_id": userID,
          "todo_id": editingId,
          "title": editText.trim(),
          "description": editDescription.trim(),
          "priority": editPriority,
          "status": "pending",
        }),
      })
      setEditingId(null);
      setEditText('');
      setEditDescription('');
      setEditPriority('');
      getTodos()
      setError('');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  // Save edit
  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, title: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const styles = {
    inputRow: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    addSection: {
      marginBottom: '20px',
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    input: {
      padding: '12px 15px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '100%',
    },
    inputSmall: {
      padding: '10px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      minWidth: '160px',
      flex: '1',
    },
    addButton: {
      padding: '10px 15px',
      fontSize: '14px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#cbd5e1',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    addButtonDisabled: {
      backgroundColor: '#e2e8f0',
      cursor: 'not-allowed',
    },
    logoutButton: {
      padding: '1px 5px',
      fontSize: '14px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#6366f1',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    UserListButton: {
      padding: '8px 15px',
      fontSize: '14px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#6366f1',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: 'white'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9
    },
    errorAlert: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#c33',
      cursor: 'pointer',
      fontSize: '1.2rem'
    },
    addSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    inputContainer: {
      display: 'flex',
      gap: '0.75rem'
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    inputFocus: {
      borderColor: '#667eea'
    },
    addButton: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.2s'
    },
    addButtonDisabled: {
      backgroundColor: '#cbd5e0',
      cursor: 'not-allowed'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.25rem'
    },
    statLabel: {
      color: '#64748b',
      fontSize: '0.875rem'
    },
    todosList: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    emptyState: {
      padding: '3rem 1rem',
      textAlign: 'center',
      color: '#64748b'
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    todoItem: {
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0',
      transition: 'background-color 0.15s'
    },
    todoItemCompleted: {
      backgroundColor: '#f8fafc'
    },
    todoItemHover: {
      backgroundColor: '#f1f5f9'
    },
    todoContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    checkbox: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '2px solid #cbd5e0',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    },
    checkboxCompleted: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: 'white'
    },
    todoDetails: {
      flex: 1
    },
    todoTitle: {
      fontSize: '1.1rem',
      marginBottom: '0.25rem'
    },
    todoTitleCompleted: {
      textDecoration: 'line-through',
      color: '#9ca3af'
    },
    todoMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    statusCompleted: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    actions: {
      display: 'flex',
      gap: '0.5rem'
    },
    actionButton: {
      background: 'none',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    editButton: {
      color: '#3b82f6'
    },
    deleteButton: {
      color: '#ef4444'
    },
    editContainer: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    },
    editInput: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    saveButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>ToDo App</h1>
          <p style={styles.subtitle}>
            Welcome <b>{userDetails?.username}</b>, Keep your thoughts here...
          </p>
        </div>
        {/* Error Alert */}
        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
            <button onClick={() => setError('')} style={styles.closeButton}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Add Todo Section */}
        <div style={styles.addSection}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Todo Input */}
            <input
              type="text"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              style={styles.input}
              disabled={loading}
            />

            {/* Row: Description + Priority + Buttons */}
            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Priority..."
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <button
                onClick={addTodo}
                disabled={loading || !newTodo.trim()}
                style={{
                  ...styles.addButton,
                  ...(loading || !newTodo.trim() ? styles.addButtonDisabled : {})
                }}
              >
                <Plus size={20} />
                {loading ? 'Adding...' : 'Add'}
              </button>
              <button style={styles.logoutButton} onClick={() => navigate('/')}>
                <LogOut />
              </button>
            </div>
          </div>
        </div>


        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: '#374151' }}>{todos.length}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: '#10b981' }}>{completedCount}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statNumber, color: '#f59e0b' }}>{pendingCount}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
        </div>

        {/* Todos List */}
        <div style={styles.todosList}>
          {todos.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <h3 style={styles.emptyTitle}>No todos yet</h3>
              <p>Add your first todo above to get started!</p>
            </div>
          ) : (
            <div>
              {todos.map((todo, index) => (
                <div
                  key={todo.id}
                  style={{
                    ...styles.todoItem,
                    ...(todo.completed ? styles.todoItemCompleted : {}),
                    ...(index === todos.length - 1 ? { borderBottom: 'none' } : {})
                  }}
                >
                  <div style={styles.todoContent}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      style={{
                        ...styles.checkbox,
                        ...(todo.completed ? styles.checkboxCompleted : {})
                      }}
                    >
                      {todo.completed && <Check size={16} />}
                    </button>

                    {/* Todo Content */}
                    <div style={styles.todoDetails}>
                      {editingId === todo.id ? (
                        <div style={styles.editContainer}>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateTodo()}
                            style={styles.editInput}
                            autoFocus
                            placeholder='Edit title...'
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateTodo()}
                            style={styles.editInput}
                            autoFocus
                            placeholder='Edit description...'
                          />
                          <input
                            type="text"
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateTodo()}
                            style={styles.editInput}
                            autoFocus
                            placeholder='Edit priority...'
                          />
                          <button onClick={updateTodo} style={styles.saveButton}>
                            <Check size={16} />
                          </button>
                          <button onClick={cancelEdit} style={styles.cancelButton}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 style={{
                            ...styles.todoTitle,
                            ...(todo.completed ? styles.todoTitleCompleted : {})
                          }}>
                            {todo.title} - {<span style={{ fontWeight: 'lighter' }}>{todo.description}</span>}
                          </h3>
                          <div style={styles.todoMeta}>
                            <ArrowDownUp size={15} />
                            <span>Priority: {todo.priority}</span>
                            <span style={{
                              ...styles.statusBadge,
                              ...(todo.completed ? styles.statusCompleted : styles.statusPending)
                            }}>
                              {todo.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {editingId !== todo.id && (
                      <div style={styles.actions}>
                        <button
                          onClick={() => startEdit(todo)}
                          style={{ ...styles.actionButton, ...styles.editButton }}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          style={{ ...styles.actionButton, ...styles.deleteButton }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Built with React, CSS, FastAPI, and PostgreSQL</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;