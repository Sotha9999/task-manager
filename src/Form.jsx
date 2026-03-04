import React, { useState, useEffect, useMemo } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Work',
    priority: 'Medium', // Default value
    dueDate: ''
  });

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbybCl7j3dN7-Yd3REZby6pjEjP6UE6mgXjiI10oG5jj4fodIqXcxRSmXcOoVEbE0oXu/exec";

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(SCRIPT_URL, { redirect: 'follow' });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, action: 'add', id: Date.now() };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(payload)
      });
      setFormData({ title: '', description: '', type: 'Work', priority: 'Medium', dueDate: '' });
      setTimeout(fetchTasks, 1500);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ id, action })
      });
      setTimeout(fetchTasks, 1500);
    } catch (err) {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = (task.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                            (task.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, filterPriority]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Management</h1>
            <p className="text-slate-500">Task Managed System</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              placeholder="Search tasks..."
              className="px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Professional Input Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10 transition-all hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Task Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                placeholder="What is the objective?"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Due Date</label>
              <input 
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Notes / Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 h-16 resize-none"
                placeholder="Briefly describe the requirements..."
              />
            </div>

            <div className="flex items-end">
              <button 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:bg-slate-300 shadow-lg shadow-indigo-100 active:scale-95"
              >
                {loading ? 'Uploading...' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>

        {/* Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Active Registry</h2>
            <select 
              className="text-xs font-bold bg-transparent outline-none text-indigo-600"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="All">Show All Priorities</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>

          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className={`font-bold ${task.status === 'Completed' ? 'line-through text-slate-300 italic' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      task.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {task.status !== 'Completed' && (
                        <button onClick={() => handleAction(task.id, 'complete')} className="text-xs font-bold text-indigo-600 hover:underline">Complete</button>
                      )}
                      <button onClick={() => handleAction(task.id, 'delete')} className="text-xs font-bold text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTasks.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium">No records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;