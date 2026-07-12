import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { Button, Input, Toast, Loader } from '../components/ui';

function Login() {
  const { user, login, register, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  // Toast notification state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  // Redirect if already logged in or if OAuth token is present in URL
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }

    const token = searchParams.get('token');
    if (token) {
      handleOAuthCallback(token);
    }
  }, [user, searchParams]);

  const handleOAuthCallback = async (token) => {
    setLoading(true);
    try {
      await loginWithToken(token);
      showToast('Successfully signed in with OAuth!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'OAuth sign-in failed.');
      showToast('OAuth sign-in failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMsg('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isRegister && !formData.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegister) {
        await register(formData.name.trim(), formData.email.trim(), formData.password);
        showToast('Registration successful! Please login.', 'success');
        setIsRegister(false);
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        await login(formData.email.trim(), formData.password);
        showToast('Welcome back to AgriSarthi!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth submit error:', err);
      setErrorMsg(err.message || 'Authentication request failed.');
      showToast(err.message || 'Failed to authenticate.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    // Redirect browser to backend OAuth endpoints
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-field dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft sm:p-8 dark:bg-gray-900 dark:border-gray-800">
          <p className="text-xs font-bold uppercase tracking-widest text-leaf-600 dark:text-leaf-400">
            {isRegister ? 'Join Us' : 'Portal Access'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-leaf-900 dark:text-leaf-50 tracking-tight">
            {isRegister ? 'Register Account' : 'Farmer Login'}
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Secure full-stack database authorization portal for AgriSarthi.
          </p>

          {errorMsg && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-600 border border-red-100 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              ⚠️ {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" className="mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">
                Authenticating credentials...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isRegister && (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  placeholder="Bhumika Bahuguna"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                />
              )}

              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
              />

              <Button
                type="submit"
                className="w-full bg-leaf-600 hover:bg-leaf-700 font-bold py-3 mt-2"
              >
                {isRegister ? 'Register' : 'Login'}
              </Button>

              {/* Divider */}
              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-gray-800"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Or Sign In With</span>
                <div className="flex-grow border-t border-slate-100 dark:border-gray-800"></div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  id="google-login-btn"
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 font-semibold text-xs py-2.5"
                >
                  🔑 Google
                </Button>
                <Button
                  id="github-login-btn"
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin('github')}
                  className="flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 font-semibold text-xs py-2.5"
                >
                  🐙 GitHub
                </Button>
              </div>

              {/* Toggle Mode */}
              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMsg('');
                    setFormErrors({});
                  }}
                  className="font-bold text-leaf-600 hover:text-leaf-700 dark:text-leaf-400 hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </form>
          )}
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

export default Login;
