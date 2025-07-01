
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

import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodosSection = () => {
  const { currentTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete focus session', completed: false, createdAt: new Date() },
    { id: '2', text: 'Review project notes', completed: false, createdAt: new Date() },
    { id: '3', text: 'Plan tomorrow\'s goals', completed: false, createdAt: new Date() }
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <>
      {/* ─────────────────────────────────────────
          🎯 FLOATING ACTION BUTTON: Modern design
          ───────────────────────────────────────── */}
      <div className="fixed bottom-20 right-4 z-30">
        <Button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-3 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:scale-110 transform-gpu opacity-70 hover:opacity-100 font-sora font-medium"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.color}20, ${currentTheme.color}10)`,
            backdropFilter: 'blur(20px)',
            borderColor: `${currentTheme.color}40`,
            boxShadow: `0 8px 32px ${currentTheme.color}30, 0 0 0 1px rgba(255,255,255,0.1)`,
            color: 'white'
          }}
        >
          Tasks
        </Button>
      </div>

      {/* ─────────────────────────────────────────
          📱 CENTERED POPUP: Redesigned interface
          ───────────────────────────────────────── */}
      {isPopupOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-all duration-300 flex items-center justify-center p-4"
            onClick={() => setIsPopupOpen(false)}
          >
            <div 
              className="w-full max-w-md max-h-[80vh] transition-all duration-300 transform-gpu animate-fade-scale-in"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                backdropFilter: 'blur(24px) saturate(1.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '24px',
                boxShadow: `0 32px 64px ${currentTheme.color}20, 0 0 0 1px rgba(255,255,255,0.1)`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                {/* ─────────────────────────────────────────
                    📊 HEADER: Improved design
                    ───────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-sora text-xl font-semibold text-white">
                      Tasks
                    </h3>
                    <p className="text-white/60 text-sm font-inter">
                      {completedCount} of {totalCount} completed
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsPopupOpen(false)}
                    className="w-10 h-10 p-0 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* ─────────────────────────────────────────
                    📋 TASKS LIST: Improved card design with visible checkboxes
                    ───────────────────────────────────────── */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {todos.map((todo, index) => (
                    <div
                      key={todo.id}
                      className={`group p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] transform-gpu animate-fade-in ${
                        todo.completed
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                            todo.completed
                              ? 'border-transparent shadow-lg'
                              : 'border-white/60 hover:border-white/80 hover:scale-110 bg-white/10'
                          }`}
                          style={todo.completed ? {
                            background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                            boxShadow: `0 4px 12px ${currentTheme.color}40`
                          } : {}}
                        >
                          {todo.completed && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                        
                        <span className={`flex-1 font-inter transition-all duration-300 ${
                          todo.completed 
                            ? 'line-through opacity-60 text-white/60' 
                            : 'text-white'
                        }`}>
                          {todo.text}
                        </span>
                        
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ─────────────────────────────────────────
                    ➕ ADD NEW TASK: Modern input design
                    ───────────────────────────────────────── */}
                <div className="flex gap-3">
                  <input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-3 text-white placeholder-white/50 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-white/40 transition-all duration-300 font-inter"
                    style={{
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Button
                    onClick={addTodo}
                    disabled={!newTodo.trim()}
                    className="w-12 h-12 p-0 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.color}, ${currentTheme.color}dd)`,
                      boxShadow: `0 4px 12px ${currentTheme.color}40`
                    }}
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────
          🎨 CUSTOM SCROLLBAR: Themed scrollbar styles
          ───────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${currentTheme.color};
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.color}dd;
          }
        `
      }} />
    </>
  );
};

export default TodosSection;
