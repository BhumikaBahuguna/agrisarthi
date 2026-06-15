import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">About</p>
          <h1 className="mt-3 text-3xl font-bold text-leaf-900 sm:text-4xl">About AgriSarthi</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            AgriSarthi is planned as an AI-powered smart agriculture management platform that helps
            farmers manage farms, crops, weather insights, recommendations, disease detection, yield
            prediction, and harvest tracking from a single digital experience.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
