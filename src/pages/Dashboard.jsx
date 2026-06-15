import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

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
  return (
    <div className="flex min-h-screen flex-col bg-field">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-leaf-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-leaf-900 sm:text-4xl">
              Farm Overview Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
