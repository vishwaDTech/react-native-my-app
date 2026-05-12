import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock,
  Tag,
  Star,
  Image as ImageIcon
} from 'lucide-react';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: 'Beach',
    price: '',
    duration: '',
    rating: 4.5,
    image: ''
  });

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/destinations');
      setDestinations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/destinations/${editingId}`, formData);
      } else {
        await axios.post('/destinations', formData);
      }
      handleCloseModal();
      fetchDestinations();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await axios.delete(`/destinations/${id}`);
        fetchDestinations();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination._id);
    setFormData({
      name: destination.name,
      description: destination.description,
      location: destination.location,
      category: destination.category,
      price: destination.price.toString(),
      duration: destination.duration,
      rating: destination.rating,
      image: destination.image
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      category: 'Beach',
      price: '',
      duration: '',
      rating: 4.5,
      image: ''
    });
  };

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Destinations</h1>
          <p className="text-slate-500 mt-1">Manage travel packages and discoverable locations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span className='text-slate-900'>Add Destination</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search destinations or locations..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Destinations Grid/Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Destination</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Category</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Price</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Duration</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500">Loading destinations...</td></tr>
            ) : filteredDestinations.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500">No destinations found</td></tr>
            ) : filteredDestinations.map((dest) => (
              <tr key={dest._id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden">
                      <img 
                        src={dest.image.startsWith('http') ? dest.image : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80'} 
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{dest.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {dest.location}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
                    {dest.category}
                  </span>
                </td>
                <td className="px-6 py-5 font-bold text-slate-900">
                  ${dest.price}
                </td>
                <td className="px-6 py-5 text-slate-500 text-sm flex items-center gap-2">
                  <Clock size={14} /> {dest.duration}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(dest)}
                      className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dest._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
              <p className="text-slate-500 mt-1">Fill in the details for the travel package</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination Name</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="City">City</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="number" required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" required
                      placeholder="e.g. 3 Days, 2 Nights"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    rows="4" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-slate-700  font-bold rounded-2xl transition-all shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Update Destination' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destinations;
