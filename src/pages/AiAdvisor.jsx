import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Button, Input, Loader, Toast } from '../components/ui';

function AiAdvisor() {
  const { token, logout } = useAuth();
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

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
      ...prev.slice(0, 9),
    ]);
  };

  // Fetch farmer's crops on mount
  useEffect(() => {
    const fetchCrops = async () => {
      const startTime = Date.now();
      const url = 'http://localhost:5000/api/crops';
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const latency = Date.now() - startTime;
        logApiCall('GET', url, res.status, latency);

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) throw new Error('Failed to load crops.');
        const data = await res.json();
        setCrops(data);
      } catch (err) {
        console.error(err);
        showToast('Failed to load crop list.', 'error');
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCrops();
  }, [token]);

  // Find currently selected crop details
  const selectedCrop = crops.find(c => c.id === selectedCropId);

  // Submit Query to AI endpoint
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      showToast('Please enter a query or choose a template.', 'error');
      return;
    }

    setLoadingAdvice(true);
    setAdvice('');
    
    const startTime = Date.now();
    const url = 'http://localhost:5000/api/ai/advise';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          cropId: selectedCropId || null,
          query: query.trim()
        })
      });
      const latency = Date.now() - startTime;
      logApiCall('POST', url, res.status, latency);

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI request failed.');
      }

      setAdvice(data.advice);
      showToast('AI Advisor recommendations loaded!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'AI request failed.', 'error');
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Click handler for Quick Advice Templates
  const handleApplyTemplate = (templateQuery) => {
    setQuery(templateQuery);
    showToast('Template query selected! Click Ask AI.', 'success');
  };

  // Simple, safe Markdown parser matching our Tailwind leaf themes
  const renderAdviceHtml = (text) => {
    if (!text) return '';
    
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Headers (## and ###)
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-leaf-800 dark:text-leaf-400 mt-6 mb-3 border-b border-leaf-50 pb-1">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">$1</h3>');
    
    // Bold text (**text**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-leaf-700 dark:text-leaf-300">$1</strong>');
    
    // Bullet points (* items)
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc text-sm text-slate-600 dark:text-slate-400 mb-1.5 leading-relaxed">$1</li>');
    
    // Paragraph spaces (double newlines)
    html = html.replace(/\n\n/g, '</p><p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">');
    
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    
    return `<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">${html}</p>`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-field dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-leaf-900 dark:text-leaf-50 tracking-tight">
              🌱 AgriSarthi AI Agronomist
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Get contextual advisory reports, fertilizer plans, and irrigation recommendations tailored to your active crops.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Input Panel Column */}
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:bg-gray-900 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Configure Inquiry</h2>
                
                {/* Crop Dropdown Selector */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <label htmlFor="crop-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Target Crop Context
                  </label>
                  {loadingCrops ? (
                    <div className="h-10 w-full bg-slate-100 dark:bg-gray-800 rounded animate-pulse" />
                  ) : (
                    <select
                      id="crop-select"
                      value={selectedCropId}
                      onChange={(e) => setSelectedCropId(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    >
                      <option value="">General Farming (No Context)</option>
                      {crops.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          🌾 {crop.name} ({crop.variety})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Selected Crop details snapshot */}
                {selectedCrop && (
                  <div className="mb-6 rounded-xl bg-leaf-50/50 border border-leaf-100 p-4 dark:bg-leaf-950/10 dark:border-leaf-900/30">
                    <span className="text-[10px] font-bold text-leaf-700 dark:text-leaf-400 uppercase tracking-widest">Active Context loaded</span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mt-1">{selectedCrop.name}</h3>
                    <div className="mt-2 text-xs space-y-1 text-slate-500 dark:text-slate-400 font-mono">
                      <p>Stage: {selectedCrop.status}</p>
                      <p>Acreage: {selectedCrop.fieldArea} ac</p>
                      <p>Category: {selectedCrop.type}</p>
                    </div>
                  </div>
                )}

                {/* Prompt query input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    id="ai-query"
                    name="query"
                    label="Agronomist Inquiry"
                    placeholder="Ask about fertilizer, water levels, or pests..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <Button
                    id="submit-ai-btn"
                    type="submit"
                    className="w-full bg-leaf-600 hover:bg-leaf-700 font-bold flex items-center justify-center gap-1.5"
                    disabled={loadingAdvice}
                  >
                    🚀 Ask AI Agronomist
                  </Button>
                </form>
              </div>

              {/* Quick Advice Templates Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:bg-gray-900 dark:border-gray-800">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Quick Advice Templates</h2>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleApplyTemplate("Provide a split fertilizer schedule for this crop variety, listing nitrogen, potassium, and phosphorus proportions.")}
                    className="w-full text-left rounded-xl bg-slate-50 hover:bg-leaf-50 border border-slate-100 hover:border-leaf-200 p-3 text-xs font-semibold text-slate-700 hover:text-leaf-800 transition dark:bg-gray-800/40 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    📋 Generate Nutrient & Fertilizer Schedule
                  </button>
                  <button
                    onClick={() => handleApplyTemplate("What are the most common pests, leaf blights, or viruses for this crop status, and how do I prevent them?")}
                    className="w-full text-left rounded-xl bg-slate-50 hover:bg-leaf-50 border border-slate-100 hover:border-leaf-200 p-3 text-xs font-semibold text-slate-700 hover:text-leaf-800 transition dark:bg-gray-800/40 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    🐛 Check Pest & Disease Defenses
                  </button>
                  <button
                    onClick={() => handleApplyTemplate("Audit my water requirements. Based on the acreage and planting dates, how often should I irrigate?")}
                    className="w-full text-left rounded-xl bg-slate-50 hover:bg-leaf-50 border border-slate-100 hover:border-leaf-200 p-3 text-xs font-semibold text-slate-700 hover:text-leaf-800 transition dark:bg-gray-800/40 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    💧 Optimize Irrigation Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* AI Advisor Response Display Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:bg-gray-900 dark:border-gray-800 min-h-[400px] flex flex-col justify-between">
                
                {/* Advice Output Panel */}
                <div className="flex-1">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Advisor Recommendations</h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-150 text-slate-500 rounded font-mono dark:bg-gray-800 dark:text-gray-400">
                      Model: gemini-1.5-flash
                    </span>
                  </div>

                  {loadingAdvice ? (
                    /* Loading state skeleton template */
                    <div id="ai-loading-state" className="space-y-4 py-4">
                      <div className="flex items-center gap-3">
                        <Loader size="sm" />
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold animate-pulse">AgriSarthi AI is analyzing crop telemetry...</p>
                      </div>
                      <div className="space-y-2 mt-6">
                        <div className="h-4 w-3/4 bg-slate-100 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-100 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-100 dark:bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-slate-100 dark:bg-gray-800 rounded animate-pulse" />
                      </div>
                    </div>
                  ) : advice ? (
                    /* Render formatted markdown output */
                    <div
                      id="ai-output-response"
                      className="prose dark:prose-invert max-w-none pt-2"
                      dangerouslySetInnerHTML={{ __html: renderAdviceHtml(advice) }}
                    />
                  ) : (
                    /* Initial guide page */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <span className="text-5xl mb-4">🌾</span>
                      <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">Consultation Desk</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                        Choose a crop context and select a quick advice template or enter your query to get custom, database-scoped recommendations from the AI agronomist.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  AgriSarthi AI Advisor answers are generated automatically using active telemetry context. Please cross-reference recommendations locally.
                </div>
              </div>

              {/* SYSTEM API TELEMETRY PANEL */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-slate-900 text-slate-200 dark:border-gray-800 p-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-sm font-bold text-slate-50 font-mono">AgriSarthi AI API Telemetry Log</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                    Host: http://localhost:5000
                  </span>
                </div>
                
                <div className="font-mono text-xs space-y-2 max-h-[150px] overflow-y-auto">
                  {apiLogs.length === 0 ? (
                    <p className="text-slate-500 italic py-2">No API requests recorded yet. Interact with the advisor page to trigger REST calls.</p>
                  ) : (
                    <div className="space-y-1">
                      {apiLogs.map((log) => {
                        const isSuccess = log.status >= 200 && log.status < 300;
                        return (
                          <div key={log.id} className="flex flex-wrap items-center justify-between py-1 border-b border-slate-800/40 last:border-b-0 hover:bg-slate-800/20 px-2 rounded">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-semibold">{log.timestamp}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.method === 'GET' ? 'bg-blue-900/40 text-blue-300' : 'bg-emerald-900/40 text-emerald-300'
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

            </div>

          </div>
        </section>
      </main>

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

export default AiAdvisor;
