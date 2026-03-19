import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import pb from '../lib/pocketbase';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, AlertCircle, X, User, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function SignUp() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      setError(t.signup.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.signup.passwordTooShort);
      return;
    }

    setLoading(true);
    setError('');

    // Generate a simple username from email (part before @)
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);

    try {
      await pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm,
        name,
        role: 'student',
      });
      
      // Auto-login after successful signup
      await pb.collection('users').authWithPassword(email, password);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t.signup.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-zen-gray-light relative"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 p-2 rounded-full text-zen-gray hover:text-zen-orange hover:bg-zen-orange/5 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zen-orange/10 text-zen-orange mb-6">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-zen-gray-dark">{t.signup.title}</h1>
          <p className="text-zen-gray mt-2">{t.signup.subtitle}</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 space-y-4"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-zen-gray-dark font-medium">{t.signup.success}</p>
            <p className="text-sm text-zen-gray">Redirecting to login...</p>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider ml-1">
                  {t.signup.name}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-gray" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider ml-1">
                  {t.signup.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-gray" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider ml-1">
                  {t.signup.password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-gray" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider ml-1">
                  {t.signup.passwordConfirm}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-gray" />
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-zen-gray-dark hover:bg-zen-orange text-white rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.signup.signingUp}</span>
                  </>
                ) : (
                  <span>{t.signup.signUp}</span>
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-zen-gray">
                  {t.signup.hasAccount}{' '}
                  <Link to="/login" className="text-zen-orange font-bold hover:underline">
                    {t.signup.signIn}
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
