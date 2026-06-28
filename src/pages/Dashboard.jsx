import { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Button, Input, Modal, Toast, Loader } from '../components/ui';

const API_BASE = 'http://localhost:5000/api/crops';

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({
    activeFarms: '00',
    currentCrops: '00',
    weatherAlerts: '00',
    totalArea: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Real-time API Telemetry Logs for W4 Verification
  const [apiLogs, setApiLogs] = useState([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [cropToDelete, setCropToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    type: 'Grain',
    status: 'Growing',
    plantedDate: '',
    expectedHarvestDate: '',
    fieldArea: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast notification state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
  });

  // Toggle dark mode by adding/removing 'dark' class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load crops and stats on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch data whenever search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCropsList(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const logApiCall = (method, url, status, latency) => {
    const relativeUrl = url.replace('http://localhost:5000', '');
    setApiLogs((prev) => [
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: relativeUrl,
        status,
        latency: `${latency}ms`,
      },
      ...prev.slice(0, 9), // Keep latest 10 logs
    ]);
  };

  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchCropsList()]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to connect to the backend server. Please make sure it is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const latency = Date.now() - startTime;
      logApiCall('GET', `${API_BASE}/stats`, response.status, latency);
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats({
        activeFarms: String(data.activeFarms).padStart(2, '0'),
        currentCrops: String(data.currentCrops).padStart(2, '0'),
        weatherAlerts: String(data.weatherAlerts).padStart(2, '0'),
        totalArea: data.totalArea || 0,
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
      throw err;
    }
  };

  const fetchCropsList = async (query = '') => {
    const startTime = Date.now();
    try {
      const url = query.trim() 
        ? `${API_BASE}/search?q=${encodeURIComponent(query)}`
        : API_BASE;
      const response = await fetch(url);
      const latency = Date.now() - startTime;
      logApiCall('GET', url, response.status, latency);

      if (!response.ok) throw new Error('Failed to fetch crops list');
      const data = await response.json();
      setCrops(data);
    } catch (err) {
      console.error('Crops fetch error:', err);
      showToast('Error loading crop cycles.', 'error');
    }
  };

  // Handle open modal for creating
  const handleOpenCreateModal = () => {
    setEditingCrop(null);
    setFormData({
      name: '',
      variety: '',
      type: 'Grain',
      status: 'Growing',
      plantedDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      fieldArea: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety,
      type: crop.type,
      status: crop.status,
      plantedDate: crop.plantedDate || '',
      expectedHarvestDate: crop.expectedHarvestDate || '',
      fieldArea: crop.fieldArea,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Form field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If status changes to Planned, plantedDate is not required/can be cleared
      if (name === 'status' && value === 'Planned') {
        updated.plantedDate = '';
      }
      return updated;
    });
    // Clear validation error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Crop name is required.';
    if (!formData.variety.trim()) errors.variety = 'Variety is required.';
    if (!formData.type.trim()) errors.type = 'Crop category is required.';
    if (formData.status !== 'Planned' && !formData.plantedDate) {
      errors.plantedDate = 'Planting date is required.';
    }
    if (!formData.expectedHarvestDate) errors.expectedHarvestDate = 'Harvest date is required.';
    
    const parsedArea = parseFloat(formData.fieldArea);
    if (isNaN(parsedArea) || parsedArea <= 0) {
      errors.fieldArea = 'Area must be a positive number.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please correct validation errors.', 'error');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    try {
      const payload = {
        ...formData,
        fieldArea: parsedArea,
      };

      const url = editingCrop ? `${API_BASE}/${editingCrop.id}` : API_BASE;
      const method = editingCrop ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const latency = Date.now() - startTime;
      logApiCall(method, url, response.status, latency);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected the request.');
      }

      showToast(
        editingCrop ? 'Crop cycle updated successfully!' : 'Crop cycle created successfully!',
        'success'
      );
      setIsFormModalOpen(false);
      
      // Refresh the page data
      await fetchStats();
      await fetchCropsList(searchQuery);
    } catch (err) {
      console.error('Submit error:', err);
      showToast(err.message || 'Failed to save crop cycle.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening delete confirmation
  const handleOpenDeleteModal = (crop) => {
    setCropToDelete(crop);
    setIsDeleteModalOpen(true);
  };

  // Perform delete request
  const handleDeleteConfirm = async () => {
    if (!cropToDelete) return;
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE}/${cropToDelete.id}`, {
        method: 'DELETE',
      });
      const latency = Date.now() - startTime;
      logApiCall('DELETE', `${API_BASE}/${cropToDelete.id}`, response.status, latency);

      if (!response.ok) throw new Error('Deletion failed.');

      showToast('Crop cycle deleted successfully.', 'success');
      setIsDeleteModalOpen(false);
      setCropToDelete(null);

      // Refresh list and stats
      await fetchStats();
      await fetchCropsList(searchQuery);
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete crop cycle.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter crops based on status dropdown
  const filteredCrops = crops.filter((crop) => {
    if (statusFilter === 'All') return true;
    return crop.status === statusFilter;
  });

  // Calculate elapsed progress percent for the progress bar
  const getCropProgress = (crop) => {
    if (crop.status === 'Planned') return 0;
    if (crop.status === 'Harvested') return 100;
    
    const start = new Date(crop.plantedDate).getTime();
    const end = new Date(crop.expectedHarvestDate).getTime();
    const now = Date.now();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Growing':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30';
      case 'Planted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30';
      case 'Harvested':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800/30';
      case 'Planned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-field dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Header Dashboard Title & Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-leaf-900 dark:text-leaf-50 sm:text-4xl tracking-tight">
                Farm Overview Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your crop lifecycles and farm telemetry. Connected to local database server.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 hover:bg-slate-200/50 dark:hover:bg-gray-800 shadow-sm"
            >
              {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </Button>
          </div>
          
          {/* Dynamic statistics cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="Active Farms"
              value={stats.activeFarms}
              description="Total active farm sites registered under telemetry supervision."
            />
            <Card
              title="Current Crops"
              value={stats.currentCrops}
              description="Active crop schedules currently logged in memory store."
            />
            <Card
              title="Weather Alerts"
              value={stats.weatherAlerts}
              description="Automated weather risks based on crop sensitivities."
            />
          </div>

          {/* Crop Management UI Header & Filter Bar */}
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Crop Cycle Management
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Track planting, growth, harvest schedules, and acreage.
                </p>
              </div>
              <Button 
                onClick={handleOpenCreateModal} 
                className="flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700 font-semibold"
              >
                <span>➕</span> Add New Crop Cycle
              </Button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Input
                  id="search-crops"
                  type="text"
                  placeholder="🔍 Search crops by name, variety, category, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5 min-w-[180px]">
                <label htmlFor="filter-status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status Filter
                </label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                >
                  <option value="All">All Statuses</option>
                  <option value="Planned">Planned</option>
                  <option value="Planted">Planted</option>
                  <option value="Growing">Growing</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>
            </div>

            {/* Crops list state handler */}
            {loading && crops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader size="lg" className="mb-4" />
                <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading cultivation data...</p>
              </div>
            ) : filteredCrops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <span className="text-5xl mb-4">🌾</span>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No crop cycles found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  {searchQuery || statusFilter !== 'All' 
                    ? "Try adjusting your search query or status filter criteria."
                    : "No crops added yet. Click 'Add New Crop Cycle' to start tracking your fields!"}
                </p>
                {!(searchQuery || statusFilter !== 'All') && (
                  <Button onClick={handleOpenCreateModal} className="mt-4 bg-leaf-600 hover:bg-leaf-700 text-sm">
                    Add First Crop
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCrops.map((crop) => {
                  const progress = getCropProgress(crop);
                  return (
                    <div 
                      key={crop.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-leaf-300 hover:shadow-soft dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    >
                      <div>
                        {/* Status Badge & Area */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(crop.status)}`}>
                            {crop.status}
                          </span>
                          <span className="text-sm font-semibold text-leaf-700 dark:text-leaf-400">
                            🚜 {crop.fieldArea} Acres
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-leaf-700 dark:group-hover:text-leaf-400 transition-colors">
                          {crop.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                          Variety: <span className="text-slate-600 dark:text-slate-300 normal-case">{crop.variety}</span>
                        </p>

                        {/* Detail parameters */}
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Category:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{crop.type}</span>
                          </div>
                          {crop.status !== 'Planned' && (
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Planted:</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{crop.plantedDate}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Est. Harvest:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{crop.expectedHarvestDate}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-5">
                          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                            <span>Cycle Progress</span>
                            <span className="text-leaf-600 dark:text-leaf-400 font-bold">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-leaf-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenEditModal(crop)}
                          className="h-8 px-3 text-xs flex items-center gap-1 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300"
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleOpenDeleteModal(crop)}
                          className="h-8 px-3 text-xs flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SYSTEM API TELEMETRY PANEL (W4 Verification Console) */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-slate-900 text-slate-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base font-bold text-slate-50 font-mono">AgriSarthi API Telemetry Log</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                Host: http://localhost:5000
              </span>
            </div>
            
            <div className="font-mono text-xs space-y-2 max-h-[220px] overflow-y-auto">
              {apiLogs.length === 0 ? (
                <p className="text-slate-500 italic py-4">No API requests recorded yet. Interact with the dashboard to trigger REST calls.</p>
              ) : (
                <div className="space-y-1.5">
                  {apiLogs.map((log) => {
                    const isSuccess = log.status >= 200 && log.status < 300;
                    return (
                      <div key={log.id} className="flex flex-wrap items-center justify-between py-1 border-b border-slate-800/40 last:border-b-0 hover:bg-slate-800/20 px-2 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-semibold">{log.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.method === 'GET' ? 'bg-blue-900/40 text-blue-300' :
                            log.method === 'POST' ? 'bg-emerald-900/40 text-emerald-300' :
                            log.method === 'PUT' ? 'bg-amber-900/40 text-amber-300' :
                            'bg-rose-900/40 text-rose-300'
                          }`}>
                            {log.method}
                          </span>
                          <span className="text-slate-300 select-all">{log.url}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSuccess ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                          }`}>
                            HTTP {log.status} {isSuccess ? 'OK' : 'Error'}
                          </span>
                          <span className="text-slate-500">{log.latency}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </section>
      </main>

      {/* Dynamic Creation / Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={editingCrop ? "✏️ Edit Crop Cycle Details" : "🌱 Add New Cultivation Cycle"}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit} className="bg-leaf-600 hover:bg-leaf-700">
              {editingCrop ? 'Save Changes' : 'Record Crop Cycle'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <Input 
            id="name" 
            name="name"
            label="Crop Name" 
            placeholder="e.g. Wheat, Basmati Rice, Tomatoes" 
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
          />
          <Input 
            id="variety" 
            name="variety"
            label="Variety" 
            placeholder="e.g. Kalyan Sona, Roma, CO-86032" 
            value={formData.variety}
            onChange={handleInputChange}
            error={formErrors.variety}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Crop Category
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="Grain">Grain</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
                <option value="Cash Crop">Cash Crop</option>
                <option value="Legume">Legume</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Crop Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="Planned">Planned</option>
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>
          </div>

          <Input 
            id="fieldArea" 
            name="fieldArea"
            type="number"
            step="0.1"
            label="Field Area (Acres)" 
            placeholder="e.g. 5.5" 
            value={formData.fieldArea}
            onChange={handleInputChange}
            error={formErrors.fieldArea}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              id="plantedDate" 
              name="plantedDate"
              type="date"
              label="Planting Date" 
              value={formData.plantedDate}
              onChange={handleInputChange}
              error={formErrors.plantedDate}
              disabled={formData.status === 'Planned'}
              className={formData.status === 'Planned' ? 'opacity-50' : ''}
            />
            <Input 
              id="expectedHarvestDate" 
              name="expectedHarvestDate"
              type="date"
              label="Expected Harvest Date" 
              value={formData.expectedHarvestDate}
              onChange={handleInputChange}
              error={formErrors.expectedHarvestDate}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="⚠️ Delete Crop Cycle?"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Yes, Delete Cycle</Button>
          </>
        }
      >
        <div className="space-y-2 py-2 text-sm text-gray-600 dark:text-gray-400">
          <p>Are you sure you want to delete this crop cycle?</p>
          {cropToDelete && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
              <span className="font-bold text-gray-900 dark:text-gray-100">{cropToDelete.name} ({cropToDelete.variety})</span>
              <p className="text-xs text-slate-500 mt-1">Acreage: {cropToDelete.fieldArea} ac | Category: {cropToDelete.type}</p>
            </div>
          )}
          <p className="text-xs text-red-500 font-medium">This action cannot be undone and will erase this crop timeline from the telemetry database.</p>
        </div>
      </Modal>

      {/* Toast popup */}
      <Toast 
        message={toast.message} 
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <Footer />
    </div>
  );
}

export default Dashboard;


