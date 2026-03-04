import React, { useState, useEffect, useMemo } from 'react';

const TaskManager = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    type: 'Work',
    priority: 'Medium', 
    status: 'Pending', 
    progressUpdate: '',
    dueDate: '', 
    completionDate: ''
  });

  const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

  // --- Date Correction Logic (Prevents -1 Day Error) ---
  const getExactDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const date = new Date(dateStr);
    if (dateStr.includes('T')) {
      const hours = date.getUTCHours();
      if (hours >= 12) {
        date.setUTCDate(date.getUTCDate() + 1);
      }
    }
    return date.toISOString().split('T')[0];
  };

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

  const handleEditInitiation = (task) => {
    setEditId(task.id);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      type: task.type || 'Work',
      priority: task.priority || 'Medium',
      status: task.status || 'Pending',
      progressUpdate: task.progressUpdate || '',
      dueDate: getExactDate(task.dueDate), 
      completionDate: getExactDate(task.completionDate)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, action: editId ? 'edit' : 'add', id: editId || Date.now() };
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
      setEditId(null);
      setFormData({ title: '', description: '', type: 'Work', priority: 'Medium', status: 'Pending', progressUpdate: '', dueDate: '', completionDate: '' });
      setTimeout(fetchTasks, 1500);
    } catch (err) { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    if (action === 'delete' && !window.confirm("Remove this entry permanently?")) return;
    setLoading(true);
    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ id, action }) });
      setTimeout(fetchTasks, 1500);
    } catch (err) { setLoading(false); }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const content = `${task.title} ${task.description} ${task.progressUpdate}`.toLowerCase();
      const matchesSearch = content.includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, filterPriority]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-indigo-700">TaskFlow <span className="text-slate-400">Pro</span></h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Asset Management</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              placeholder="Filter by title, desc, or progress..."
              className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={onLogout} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${editId ? 'bg-indigo-50 border-indigo-200 shadow-xl' : 'bg-white border-slate-200 shadow-sm'} mb-10`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Task Objective</label>
              <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 font-medium" placeholder="Ex: Quarterly Audit" />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Workflow Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-indigo-600">
                <option>Pending</option><option>In Progress</option><option>Completed</option><option>On Hold</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">Full Description</label>
              <textarea rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm resize-none" placeholder="Provide background details..." />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">Progress Update</label>
              <textarea rows="2" value={formData.progressUpdate} onChange={(e) => setFormData({...formData, progressUpdate: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 outline-none focus:border-indigo-500 bg-indigo-50/30 text-sm resize-none" placeholder="Current update for the team..." />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Due Date</label>
              <input type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm"/>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Completion Date</label>
              <input type="date" value={formData.completionDate} onChange={(e) => setFormData({...formData, completionDate: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm"/>
            </div>

            <div className="md:col-span-4 flex items-end gap-3 pt-2">
               <button disabled={loading} className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all text-sm text-white ${editId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:bg-slate-300`}>
                 {loading ? 'PROCESSING...' : editId ? 'UPDATE RECORD' : 'SAVE NEW ENTRY'}
               </button>
               {editId && <button type="button" onClick={() => setEditId(null)} className="px-8 py-4 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 text-sm">CANCEL</button>}
            </div>
          </div>
        </form>

        {/* Task List Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Objective & Insights</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <StatusBadge status={task.status || 'Pending'} />
                  </td>
                  <td className="px-8 py-6">
                    {/* Title */}
                    <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                    
                    {/* Description - Directly after title */}
                    {task.description && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic font-medium leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Progress Update - Distinct Box */}
                    {task.progressUpdate && (
                      <div className="mt-3 flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md w-fit">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <p className="text-[9px] text-indigo-700 font-black uppercase">
                          Update: {task.progressUpdate}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                     <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-300 uppercase w-8">Due</span>
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {getExactDate(task.dueDate)}
                        </span>
                      </div>
                      {task.completionDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-emerald-400 uppercase w-8">Done</span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {getExactDate(task.completionDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEditInitiation(task)} className="text-indigo-600 text-xs font-bold hover:underline">Edit</button>
                      <button onClick={() => handleAction(task.id, 'delete')} className="text-slate-300 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && !loading && (
            <div className="py-20 text-center text-slate-400 text-sm">No matching records found in database.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// UI Components
const StatusBadge = ({ status }) => {
  const styles = { 
    'Pending': 'bg-slate-100 text-slate-500 border-slate-200', 
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100', 
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'On Hold': 'bg-purple-50 text-purple-600 border-purple-100'
  };
  return <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${styles[status] || styles['Pending']}`}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const colors = { High: 'text-red-500', Medium: 'text-amber-500', Low: 'text-emerald-500' };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
      <span className={`text-[10px] font-bold uppercase ${colors[priority]}`}>{priority}</span>
    </div>
  );
};

export default TaskManager;