import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, CheckCircle, Clock, Trash2, User, ArrowDownUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTodos, setUserTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(() => {
    const data = localStorage.getItem("userDetails");
    return data ? JSON.parse(data) : null;
  });

  const navigate = useNavigate();

  // Fetch all users
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/all_users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "role": userDetails?.role.toLowerCase() || 'user',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users...');
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos for selected user
  const getUserTodos = async (userId) => {
    setLoading(true);
    setUserTodos([]);
    try {
      const response = await fetch(`${API_BASE_URL}/todos/all_todos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "owner_id": userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      if(response.status === 404) {
        setUserTodos([]);
        setError(data.detail);
      } else {
        setUserTodos(data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch user todos...');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete_user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          "user_id": userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      getAllUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
        setUserTodos([]);
      }
      setError('');
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getUserTodos(selectedUser.id);
    }
  }, [selectedUser]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      maxWidth: '1200px',
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
    navigationBar: {
      padding: '0.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'right',
      justifyContent: 'right',
      transition: 'background-color 0.2s'
    },
    backButton: {
      backgroundColor: '#6b7280',
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
    logoutButton: {
      backgroundColor: 'white',
      color: 'black',
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
    dashboardContainer: {
      display: 'grid',
      gridTemplateColumns: selectedUser ? '1fr 1fr' : '1fr',
      gap: '2rem',
      alignItems: 'start'
    },
    usersPanel: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    panelHeader: {
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    panelTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    usersList: {
      maxHeight: '600px',
      overflowY: 'auto'
    },
    userItem: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    userItemHover: {
      backgroundColor: '#f1f5f9'
    },
    userItemSelected: {
      backgroundColor: '#e0f2fe',
      borderLeft: '4px solid #0284c7'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    userDetails: {
      flex: 1
    },
    userName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem'
    },
    userRole: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    todosPanel: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    todosList: {
      maxHeight: '600px',
      overflowY: 'auto'
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
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    todoItemCompleted: {
      backgroundColor: '#f8fafc',
      opacity: 0.8
    },
    todoContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    },
    todoDetails: {
      flex: 1
    },
    todoTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#1f2937'
    },
    todoTitleCompleted: {
      textDecoration: 'line-through',
      color: '#9ca3af'
    },
    todoDescription: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    todoMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
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
    priorityBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: '#e0e7ff',
      color: '#3730a3'
    },
    loadingSpinner: {
      padding: '2rem',
      textAlign: 'center',
      color: '#6b7280'
    },
    statsContainer: {
      display: 'flex',
      gap: '1rem',
      padding: '1rem 1.5rem',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.875rem'
    }
  };

  const completedTodos = userTodos.filter(todo => todo.completed || todo.status === 'completed').length;
  const pendingTodos = userTodos.length - completedTodos;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome <b>{userDetails?.username}</b>, Manage users and their todos
          </p>
        </div>

        {/* Navigation */}
        <div style={styles.navigationBar}>
          <button 
            style={styles.logoutButton}
            onClick={() => navigate('/')}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Main Dashboard */}
        <div style={styles.dashboardContainer}>
          {/* Users Panel */}
          <div style={styles.usersPanel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                <Users size={20} />
                All Users ({users.length})
              </h2>
            </div>
            <div style={styles.usersList}>
              {loading && users.length === 0 ? (
                <div style={styles.loadingSpinner}>Loading users...</div>
              ) : users.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>👥</div>
                  <h3 style={styles.emptyTitle}>No users found</h3>
                  <p>No users are registered in the system.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      ...styles.userItem,
                      ...(selectedUser && selectedUser.id === user.id ? styles.userItemSelected : {}),
                      ':hover': styles.userItemHover
                    }}
                    onClick={() => setSelectedUser(user)}
                    onMouseEnter={(e) => {
                      if (selectedUser?.id !== user.id) {
                        e.target.style.backgroundColor = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedUser?.id !== user.id) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={styles.userInfo}>
                      <div style={styles.userAvatar}>
                        <User size={20} />
                      </div>
                      <div style={styles.userDetails}>
                        <div style={styles.userName}>{user.username}</div>
                        <div style={styles.userRole}>Role: {user.role}</div>
                      </div>
                    </div>
                    <button
                      style={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(user.id);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ef4444';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Todos Panel */}
          {selectedUser && (
            <div style={styles.todosPanel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>
                  📝 {selectedUser.username}'s Todos ({userTodos.length})
                </h2>
              </div>
              {userTodos.length > 0 && (
                <div style={styles.statsContainer}>
                  <div style={styles.statItem}>
                    <CheckCircle size={16} color="#10b981" />
                    <span>{completedTodos} Completed</span>
                  </div>
                  <div style={styles.statItem}>
                    <Clock size={16} color="#f59e0b" />
                    <span>{pendingTodos} Pending</span>
                  </div>
                </div>
              )}
              <div style={styles.todosList}>
                {loading ? (
                  <div style={styles.loadingSpinner}>Loading todos...</div>
                ) : userTodos.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📝</div>
                    <h3 style={styles.emptyTitle}>No todos found</h3>
                    <p>{selectedUser.username} hasn't created any todos yet.</p>
                  </div>
                ) : (
                  userTodos.map((todo, index) => (
                    <div
                      key={todo.id}
                      style={{
                        ...styles.todoItem,
                        ...(todo.completed || todo.status === 'completed' ? styles.todoItemCompleted : {}),
                        ...(index === userTodos.length - 1 ? { borderBottom: 'none' } : {})
                      }}
                    >
                      <div style={styles.todoContent}>
                        <div style={styles.todoDetails}>
                          <h3 style={{
                            ...styles.todoTitle,
                            ...(todo.completed || todo.status === 'completed' ? styles.todoTitleCompleted : {})
                          }}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p style={styles.todoDescription}>{todo.description}</p>
                          )}
                          <div style={styles.todoMeta}>
                            {todo.priority && (
                              <div style={styles.priorityBadge}>
                                <ArrowDownUp size={12} />
                                Priority: {todo.priority}
                              </div>
                            )}
                            <span style={{
                              ...styles.statusBadge,
                              ...(todo.completed || todo.status === 'completed' ? styles.statusCompleted : styles.statusPending)
                            }}>
                              {todo.completed || todo.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Admin Dashboard - Built with React, CSS, FastAPI, and PostgreSQL</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;