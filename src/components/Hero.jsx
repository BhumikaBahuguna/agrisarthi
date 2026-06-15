import { Link } from 'react-router-dom';
import heroImage from '../assets/agrisarthi-hero.png';

function Hero() {
  return (
    <section className="relative overflow-hidden bg-field">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Smart agriculture field with AI insights"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/20" />
      </div>

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-leaf-100 bg-white/80 px-4 py-2 text-sm font-semibold text-leaf-700 shadow-sm">
            AgriSarthi Smart Farming
          </p>
          <h1 className="text-4xl font-bold leading-tight text-leaf-900 sm:text-5xl lg:text-6xl">
            AI-Powered Smart Agriculture Platform
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
            Helping farmers manage crops, weather insights, and AI-powered guidance.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-leaf-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-leaf-700 focus:outline-none focus:ring-4 focus:ring-leaf-100"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
