import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Button } from '../components/ui';

function Profile() {
  const { user, logout } = useAuth();

  const getAccountProvider = () => {
    if (user?.googleId) return 'Google OAuth';
    if (user?.githubId) return 'GitHub OAuth';
    return 'Email & Password';
  };

  const getProviderIcon = () => {
    if (user?.googleId) return '🔑 Google';
    if (user?.githubId) return '🐙 GitHub';
    return '✉️ Email';
  };

  return (
    <div className="flex min-h-screen flex-col bg-field dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-soft sm:p-8 dark:bg-gray-900 dark:border-gray-800">
            <div className="border-b border-gray-100 pb-6 dark:border-gray-800">
              <h1 className="text-3xl font-extrabold text-leaf-900 dark:text-leaf-50 tracking-tight">
                Farmer Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your credentials and view security telemetry.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Profile card details */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-5 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Name</span>
                  <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">{user?.name || 'N/A'}</p>
                </div>
                
                <div className="rounded-xl bg-slate-50 p-5 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</span>
                  <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">{user?.email}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Method</span>
                  <p className="mt-1.5 text-lg font-bold text-leaf-700 dark:text-leaf-400 flex items-center gap-1.5">
                    {getProviderIcon()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registration Date</span>
                  <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Just now'}
                  </p>
                </div>
              </div>

              {/* Security Telemetry Badge */}
              <div className="rounded-xl border border-leaf-100 bg-leaf-50/50 p-5 dark:border-leaf-900/30 dark:bg-leaf-950/10">
                <h3 className="text-sm font-bold text-leaf-800 dark:text-leaf-400 flex items-center gap-2">
                  🛡️ Security Verification Active
                </h3>
                <p className="mt-1.5 text-xs text-leaf-700/80 dark:text-leaf-400/70 leading-relaxed">
                  Your session is authenticated via a cryptographically signed JSON Web Token (JWT). API requests are protected against tampering and access from unauthenticated clients. Rate-limit limits and input validations are enforced server-side.
                </p>
              </div>

              {/* Logout Area */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  User ID: {user?.id}
                </p>
                <Button 
                  variant="danger" 
                  onClick={logout}
                  className="font-bold flex items-center gap-1.5 px-6"
                >
                  🚪 Log Out Account
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
