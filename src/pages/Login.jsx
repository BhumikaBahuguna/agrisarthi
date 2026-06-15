import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-field">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-lg border border-leaf-100 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">Login</p>
          <h1 className="mt-3 text-3xl font-bold text-leaf-900">Farmer Login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Placeholder authentication screen for the future AgriSarthi farmer portal.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="farmer@example.com"
                className="mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="mt-2 w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-leaf-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-leaf-700 focus:outline-none focus:ring-4 focus:ring-leaf-100"
            >
              Login
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
