import { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Button, Input, Modal, Toast, Loader } from '../components/ui';

const stats = [
  {
    title: 'Active Farms',
    value: '08',
    description: 'Sample farm profiles ready for future database integration.',
  },
  {
    title: 'Current Crops',
    value: '14',
    description: 'Static crop count placeholder for dashboard presentation.',
  },
  {
    title: 'Weather Alerts',
    value: '03',
    description: 'Example alert cards prepared for upcoming weather intelligence.',
  },
];

function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Toggle dark mode by adding/removing 'dark' class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen flex-col bg-field dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-leaf-900 dark:text-leaf-50 sm:text-4xl">
              Farm Overview Dashboard
            </h1>
            <Button 
              variant="outline" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </Button>
          </div>
          
          <div className="rounded-lg border border-leaf-100 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600 dark:text-leaf-400">
              Dashboard
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 dark:text-slate-300">
              This placeholder dashboard previews the analytics area where farmers will later see
              farm activity, crop progress, weather alerts, harvest tracking, and AI-generated
              recommendations.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
              />
            ))}
          </div>

          {/* Component Library Demo Section */}
          <div className="mt-16 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Component Library Demo</h2>
            
            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              {/* Inputs */}
              <div className="max-w-md">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Inputs</h3>
                <Input 
                  id="demo-input" 
                  label="Sample Input" 
                  placeholder="Type something..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              {/* Loader */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Loaders</h3>
                <div className="flex gap-4 items-center">
                  <Loader size="sm" />
                  <Loader size="md" />
                  <Loader size="lg" />
                </div>
              </div>

              {/* Modal & Toast Triggers */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Overlays</h3>
                <div className="flex gap-4">
                  <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                  <Button variant="secondary" onClick={() => setIsToastVisible(true)}>Show Toast</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>This is a demonstration of the modal component from our UI library. It supports dark mode and responsive design!</p>
      </Modal>

      {/* Demo Toast */}
      <Toast 
        message="Action completed successfully!" 
        type="success"
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

      <Footer />
    </div>
  );
}

export default Dashboard;
