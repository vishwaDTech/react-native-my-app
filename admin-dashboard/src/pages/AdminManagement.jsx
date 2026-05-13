import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter,
  UserCog,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/users');
      // Filter only admins and superadmins
      const adminUsers = response.data.data.filter(u => u.role === 'admin' || u.role === 'superadmin');
      setAdmins(adminUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      navigate('/');
      return;
    }
    fetchAdmins();
  }, [currentUser, navigate]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Use the new dedicated endpoint
      await axios.post('/users/create-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
      alert('Admin created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (id === currentUser?._id) {
      alert("You cannot delete yourself!");
      return;
    }

    if (window.confirm('Are you sure you want to delete this administrator? This will revoke all dashboard access.')) {
      try {
        await axios.delete(`/users/${id}`);
        fetchAdmins();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <button 
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Users</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Management</h1>
              <p className="text-slate-500 font-medium">Control panel for platform administrators</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all shadow-xl shadow-secondary/20 active:scale-95"
        >
          <UserPlus size={25} className="text-slate-700" />
          <span className='text-slate-700'>Register New Admin</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Admins</p>
          <p className="text-4xl font-black text-slate-900">{admins.filter(a => a.role === 'admin').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Super Admins</p>
          <p className="text-4xl font-black text-slate-900">{admins.filter(a => a.role === 'superadmin').length}</p>
        </div>
        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 shadow-sm">
          <p className="text-primary/70 text-sm font-bold uppercase tracking-widest mb-1">Your Status</p>
          <p className="text-2xl font-black text-primary uppercase">Super Admin</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search administrators by name or email..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary/30 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 font-bold">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Admins Grid/Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Administrator</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Level</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Access Granted</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="px-8 py-24 text-center text-slate-400 font-medium">Syncing with security database...</td></tr>
            ) : filteredAdmins.length === 0 ? (
              <tr><td colSpan="4" className="px-8 py-24 text-center text-slate-400 font-medium">No administrators found matching your search</td></tr>
            ) : filteredAdmins.map((admin) => (
              <tr key={admin._id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                      admin.role === 'superadmin' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{admin.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {admin.role === 'superadmin' ? (
                    <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest bg-secondary/10 px-4 py-2 rounded-xl w-fit">
                      <ShieldAlert size={14} />
                      Super Admin
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl w-fit">
                      <UserCog size={14} />
                      Admin
                    </div>
                  )}
                </td>
                <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                  {new Date(admin.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 hover:bg-slate-200 rounded-xl text-slate-600 transition-all active:scale-90">
                      <Edit3 size={20} />
                    </button>
                    {currentUser?._id !== admin._id && admin.role !== 'superadmin' && (
                      <button 
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="p-3 hover:bg-red-50 rounded-xl text-red-500 transition-all active:scale-90"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
                <UserPlus size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Register New Admin</h2>
              <p className="text-slate-500 font-medium mt-2 text-lg">Grant administrative access to a new team member</p>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Admin Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary/30 transition-all font-bold text-slate-900"
                    placeholder="e.g. John Wick"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Corporate Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary/30 transition-all font-bold text-slate-900"
                    placeholder="admin@travel.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">Initial Access Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary/30 transition-all font-bold text-slate-900"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-5 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-5 bg-secondary hover:bg-secondary/90 text-slate-700 font-black rounded-2xl transition-all shadow-xl shadow-secondary/20 active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
