import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Book } from '../types';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Fingerprint,
  BookOpen,
  Pencil,
  X,
  FileText
} from 'lucide-react';

export default function Profile() {
  const { t } = useLanguage();
  const user = pb.authStore.model;
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Contributions state
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');

  useEffect(() => {
    if (!user) return;
    
    const controller = new AbortController();

    const fetchMyBooks = async () => {
      try {
        const records = await pb.collection('books').getFullList<Book>({
          filter: `uploaded_by = "${user.id}"`,
          sort: '-created',
          signal: controller.signal,
        });
        setMyBooks(records);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching contributions:', err);
          setError('Failed to load your contributions.');
        }
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchMyBooks();

    return () => {
      controller.abort();
    };
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await pb.collection('users').update(user.id, { name });
      setSuccess(t.profile.updateSuccess);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== passwordConfirm) {
      setError(t.signup.passwordMismatch);
      return;
    }

    if (newPassword.length < 8) {
      setError(t.signup.passwordTooShort);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await pb.collection('users').update(user.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: passwordConfirm,
      });
      setSuccess(t.profile.passwordSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordConfirm('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setSubmitting(true);
    setError('');
    
    try {
      const updated = await pb.collection('books').update<Book>(editingBook.id, {
        title: editTitle,
        summary: editSummary,
      });
      setMyBooks(myBooks.map(b => b.id === editingBook.id ? updated : b));
      setSuccess(t.admin.updateSuccess);
      setEditingBook(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update book.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditSummary(book.summary);
    setError('');
    setSuccess('');
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-zen-orange/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-zen-orange" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-zen-gray-dark">{t.profile.title}</h1>
            <p className="text-zen-gray">{user.email}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-green-50 text-green-600 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {/* Account Info (Read-only) */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-zen-gray-light space-y-6">
              <h2 className="text-xl font-serif font-bold text-zen-gray-dark flex items-center gap-2">
                <Shield className="w-5 h-5 text-zen-orange" />
                Account Details
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.email}</label>
                  <div className="flex items-center space-x-2 p-3 bg-zen-cream rounded-xl border border-zen-gray-light text-zen-gray-dark">
                    <Mail className="w-4 h-4 text-zen-gray" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.userId}</label>
                  <div className="flex items-center space-x-2 p-3 bg-zen-cream rounded-xl border border-zen-gray-light text-zen-gray-dark">
                    <Fingerprint className="w-4 h-4 text-zen-gray" />
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.role}</label>
                  <div className="flex items-center space-x-2 p-3 bg-zen-cream rounded-xl border border-zen-gray-light">
                    <Shield className="w-4 h-4 text-zen-gray" />
                    <span className="capitalize font-medium text-zen-gray-dark">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Name */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-zen-gray-light space-y-6">
              <h2 className="text-xl font-serif font-bold text-zen-gray-dark flex items-center gap-2">
                <User className="w-5 h-5 text-zen-orange" />
                {t.profile.fullName}
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.fullName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                    placeholder={t.profile.fullName}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-zen-orange hover:bg-zen-orange-light text-white rounded-xl font-bold transition-all shadow-lg shadow-zen-orange/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{t.profile.updateName}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* My Contributions */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-zen-gray-light">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-zen-orange" />
                  <h2 className="text-xl font-serif font-bold text-zen-gray-dark">{t.profile.myContributions}</h2>
                </div>
                <span className="text-sm text-zen-gray font-medium">{myBooks.length} {t.admin.booksCount}</span>
              </div>

              {loadingBooks ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-zen-orange animate-spin" />
                </div>
              ) : myBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {myBooks.map((book) => (
                    <div key={book.id} className="flex space-x-4 p-4 rounded-2xl bg-zen-cream border border-zen-gray-light group hover:border-zen-orange transition-all">
                      <div className="w-20 h-28 bg-zen-gray-light rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img 
                          src={pb.files.getUrl(book, book.cover)} 
                          alt="" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          width="80"
                          height="112"
                        />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-zen-gray-dark truncate">{book.title}</h3>
                          <p className="text-xs text-zen-gray truncate">{book.author}</p>
                        </div>
                        <button
                          onClick={() => openEditModal(book)}
                          className="mt-2 flex items-center space-x-1 text-xs font-bold text-zen-orange hover:text-zen-orange-light transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>{t.admin.updateBook}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-zen-cream rounded-2xl border border-dashed border-zen-gray-light">
                  <p className="text-zen-gray">{t.profile.noContributions}</p>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-zen-gray-light space-y-6">
              <h2 className="text-xl font-serif font-bold text-zen-gray-dark flex items-center gap-2">
                <Key className="w-5 h-5 text-zen-orange" />
                {t.profile.changePassword}
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.currentPassword}</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.newPassword}</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zen-gray uppercase tracking-wider">{t.profile.confirmNewPassword}</label>
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-zen-gray-dark hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      <span>{t.profile.changePassword}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Contribution Modal */}
      <AnimatePresence>
        {editingBook && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-zen-gray-light"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Pencil className="w-5 h-5 text-zen-orange" />
                  <h3 className="text-xl font-serif font-bold text-zen-gray-dark">{t.profile.editContribution}</h3>
                </div>
                <button 
                  onClick={() => setEditingBook(null)}
                  className="p-2 text-zen-gray hover:text-zen-orange transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditBook} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider">{t.admin.bookTitle}</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zen-gray-dark uppercase tracking-wider">{t.admin.summary}</label>
                  <textarea
                    required
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-zen-cream border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="flex-1 py-3 border border-zen-gray-light text-zen-gray-dark rounded-xl font-bold hover:bg-zen-cream transition-all"
                  >
                    {t.admin.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-zen-orange hover:bg-zen-orange-light text-white rounded-xl font-bold transition-all shadow-lg shadow-zen-orange/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>{t.admin.saveChanges}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
