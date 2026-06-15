import Card from '../components/Card.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../components/Hero.jsx';
import Navbar from '../components/Navbar.jsx';

const features = [
  {
    title: 'Crop Management',
    description:
      'Organize crop cycles, planting details, and farm activities in one future-ready workspace.',
  },
  {
    title: 'Weather Intelligence',
    description:
      'Prepare for changing field conditions with weather-focused insights and alert placeholders.',
  },
  {
    title: 'AI Assistant',
    description:
      'A clean interface prepared for Gemini-powered agricultural guidance and farmer support.',
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">
              Platform Modules
            </p>
            <h2 className="mt-3 text-3xl font-bold text-leaf-900 sm:text-4xl">
              Built for the future AgriSarthi ecosystem
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              These frontend cards represent the major features planned for upcoming backend,
              database, AI, and ML integration.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} title={feature.title} description={feature.description} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
