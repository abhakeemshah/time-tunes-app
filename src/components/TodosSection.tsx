/**
 * ─────────────────────────────────────────
 * 📝 TASKS SECTION: Redesigned modern interface
 * ─────────────────────────────────────────
 * 
 * Purpose: Sleek task management system with improved UI/UX
 * Dependencies: useTheme for color matching, Lucide icons
 * 
 * Features:
 * - Redesigned modern card interface
 * - Smooth 3D animations (300ms duration)
 * - Improved visual hierarchy
 * - Mobile-responsive layout
 * - Better spacing and typography
 * - Centered popup dialog
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const notebookTasks = [
  'Read a book',
  'Complete the session',
  'Take a short walk',
];

const initialTodos = notebookTasks.map((text, i) => ({
  id: (i + 1).toString(),
  text,
  completed: false,
  createdAt: new Date(),
}));

const TodosSection = () => {
  const { currentTheme } = useTheme();
  const [todos, setTodos] = useState(initialTodos);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', checkFullscreen);
    checkFullscreen();
    return () => document.removeEventListener('fullscreenchange', checkFullscreen);
  }, []);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo.trim(), completed: false, createdAt: new Date() }
      ]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  if (isFullscreen) return null;

  return (
    <>
      {/* Floating Tasks Button removed */}
      {/* Notebook Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }} onClick={() => setIsOpen(false)}>
          <div
            className="relative shadow-2xl animate-fade-scale-in"
            style={{
              width: 370,
              minHeight: 500,
              background: `repeating-linear-gradient(white, white 38px, #f3f3f3 39px, white 40px)`,
              borderRadius: 18,
              border: '2px solid #e0e0e0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Spiral binding */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between z-10" style={{ width: 24, padding: '18px 0' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-yellow-200 border-2 border-yellow-400 mx-auto mb-2" />
              ))}
            </div>
            {/* Decorative leaves/branches */}
            <div className="absolute left-8 right-8 top-0 flex justify-between z-10" style={{ height: 48 }}>
              <span style={{ fontSize: 28, color: '#b5c99a' }}>🌿</span>
              <span style={{ fontSize: 28, color: '#b5c99a' }}>🍃</span>
              <span style={{ fontSize: 28, color: '#b5c99a' }}>🍂</span>
            </div>
            {/* Close button */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 text-gray-700 flex items-center justify-center shadow">
              <X className="w-5 h-5" />
            </button>
            {/* Title */}
            <div className="text-center pt-8 pb-2" style={{ fontFamily: 'Indie Flower, cursive', fontSize: 22, color: '#888' }}>
              to-do list
            </div>
            {/* Tasks */}
            <ul className="px-10 pt-2 pb-8" style={{ fontFamily: 'Indie Flower, cursive', fontSize: 20, color: '#222', listStyle: 'disc', marginLeft: 24 }}>
              {todos.map((todo, i) => (
                <li
                  key={todo.id}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#222',
                    cursor: 'pointer',
                    marginBottom: 6,
                    textDecorationThickness: 2,
                    textDecorationColor: '#888',
                    userSelect: 'none',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span onClick={() => toggleTodo(todo.id)} style={{ flex: 1 }}>{
                    editingId === todo.id ? (
                      <input
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(todo.id); }}
                        autoFocus
                        style={{ fontFamily: 'Indie Flower, cursive', fontSize: 20, width: '90%' }}
                      />
                    ) : (
                      todo.text
                    )
                  }</span>
                  <button onClick={() => startEdit(todo.id, todo.text)} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }} title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#e57373' }} title="Delete">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
            {/* Add new task */}
            <div className="flex gap-2 px-10 pb-6">
              <input
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
                placeholder="Add a new task..."
                style={{ fontFamily: 'Indie Flower, cursive', fontSize: 18, flex: 1, borderRadius: 8, border: '1px solid #eee', padding: '6px 12px' }}
              />
              <button onClick={addTodo} style={{ background: '#b5c99a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontFamily: 'Indie Flower, cursive', fontSize: 18, cursor: 'pointer' }}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodosSection;

