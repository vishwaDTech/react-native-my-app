import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCcw,
  Search,
  ChevronDown
} from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/bookings');
      setBookings(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-600';
      case 'Cancelled': return 'bg-rose-100 text-rose-600';
      case 'Completed': return 'bg-blue-100 text-blue-600';
      default: return 'bg-amber-100 text-amber-600'; // Pending
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.destination?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
          <p className="text-slate-500 mt-1">Manage user trip requests and update statuses</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by user or destination..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">User</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Destination</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Date</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase">Status</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500">Loading bookings...</td></tr>
            ) : filteredBookings.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500">No bookings found</td></tr>
            ) : filteredBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {booking.user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{booking.user?.name}</p>
                      <p className="text-xs text-slate-500">{booking.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <p className="font-medium text-slate-700">{booking.destination?.name}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                      className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-500 transition-all"
                      title="Confirm Booking"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                      className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all"
                      title="Cancel Booking"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
