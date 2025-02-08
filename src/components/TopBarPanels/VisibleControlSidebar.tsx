import React, { useState } from "react";

import {
  CheckSquare,
  Settings,
  MessageSquare,

  Plus,
  Edit,
  Trash2,Sun
} from "lucide-react";
/* Sidebar Control */
function VisibleControlSidebar  ()  {

  const [activeTab, setActiveTab] = useState('home');

  // Demo data
  const users = [
    { id: 1, name: 'Tyler', message: 'Praesent tristique diam...', time: 'Just now' },
    { id: 2, name: 'Luke', message: 'Cras tempor diam...', time: '33 min ago' },
    { id: 3, name: 'Evan', message: 'In posuere tortor vel...', time: '42 min ago' }
  ];

  const todos = [
    { id: 1, text: 'Review project proposal', time: '2 mins', done: true },
    { id: 2, text: 'Meet with design team', time: '4 hours', done: false },
    { id: 3, text: 'Finalize documentation', time: '1 day', done: false }
  ];

  return (
    <div className="flex min-h-screen">






      <div className={` bg-white shadow-xl transform transition-transform duration-300 `}>
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 p-4 ${activeTab === 'home' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <MessageSquare className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 p-4 ${activeTab === 'settings' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Settings className="w-5 h-5 mx-auto" />
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 p-4 ${activeTab === 'todo' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <CheckSquare className="w-5 h-5 mx-auto" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Users</h3>
                <Plus className="w-5 h-5 text-gray-600" />
              </div>
              
              {users.map(user => (
                <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src="/api/placeholder/40/40" alt={user.name} className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.message}</p>
                      <span className="text-xs text-gray-400">{user.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4 w-full">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Dark Mode</span>
                <button className="p-2 rounded-full bg-gray-200">
                  <Sun className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>RTL Mode</span>
                <button className="p-2 rounded-full bg-gray-200">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="mb-2">Theme Colors</h4>
                <div className="grid grid-cols-5 gap-2">
                  {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'].map((color, i) => (
                    <div key={i} className={`w-full h-8 rounded ${color}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'todo' && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Todo List</h3>
                <Plus className="w-5 h-5 text-gray-600" />
              </div>

              {todos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    className="rounded border-gray-300"
                    onChange={() => {}}
                  />
                  <span className={todo.done ? 'line-through text-gray-400' : ''}>
                    {todo.text}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {todo.time}
                    </span>
                    <Edit className="w-4 h-4" />
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisibleControlSidebar
