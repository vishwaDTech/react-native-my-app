import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  MapPin, 
  CalendarCheck, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="text-white w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}
      </div>
    </div>
    <h3 className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    destinations: 0,
    bookings: 0,
    activeTrips: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await axios.get('/users');
        setStats({
          users: userRes.data.count,
          destinations: 24, // Mock data until endpoints exist
          bookings: 156,    // Mock data
          activeTrips: 12   // Mock data
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
          <Clock size={16} className="text-primary" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Users" 
          value={stats.users} 
          icon={Users} 
          color="bg-primary"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard 
          title="Destinations" 
          value={stats.destinations} 
          icon={MapPin} 
          color="bg-secondary"
          trend="up"
          trendValue="8.2%"
        />
        <StatCard 
          title="Bookings" 
          value={stats.bookings} 
          icon={CalendarCheck} 
          color="bg-accent"
          trend="down"
          trendValue="3.1%"
        />
        <StatCard 
          title="Active Trips" 
          value={stats.activeTrips} 
          icon={TrendingUp} 
          color="bg-slate-900"
          trend="up"
          trendValue="18.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table (Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500">U</div>
                  <div>
                    <p className="font-bold text-slate-900">User #{i}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Swiss Alps Expedition</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$1,200</p>
                  <p className="text-xs text-emerald-500 font-bold uppercase">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <span className="font-bold">Add Destination</span>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                <Users size={20} />
              </div>
              <span className="font-bold">Create Admin</span>
            </button>
          </div>

          <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">System Status</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">API Server</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-500 uppercase">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-500 uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
