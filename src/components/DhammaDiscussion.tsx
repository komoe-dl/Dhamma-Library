import React, { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';
import { Comment, Book } from '../types';
import { useLanguage } from '../lib/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Loader2, 
  Flower2, 
  User, 
  Calendar,
  Heart
} from 'lucide-react';

interface DhammaDiscussionProps {
  bookId: string;
  initialSadhuCount?: number;
}

export default function DhammaDiscussion({ bookId, initialSadhuCount = 0 }: DhammaDiscussionProps) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sadhuCount, setSadhuCount] = useState(initialSadhuCount);
  const [isSadhuAnimating, setIsSadhuAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = pb.authStore.model;
  const isLoggedIn = pb.authStore.isValid;

  useEffect(() => {
    fetchComments();
    // Subscribe to real-time updates for comments
    pb.collection('comments').subscribe('*', (e) => {
      if (e.action === 'create' && e.record.book === bookId) {
        fetchComments();
      } else if (e.action === 'delete') {
        setComments(prev => prev.filter(c => c.id !== e.record.id));
      }
    }, { expand: 'user' });

    return () => {
      pb.collection('comments').unsubscribe('*');
    };
  }, [bookId]);

  const fetchComments = async () => {
    try {
      const records = await pb.collection('comments').getFullList<Comment>({
        filter: `book = "${bookId}"`,
        sort: '-created',
        expand: 'user',
        requestKey: null,
      });
      setComments(records);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn || !user) return;

    setSubmitting(true);
    try {
      await pb.collection('comments').create({
        text: newComment,
        user: user.id,
        book: bookId,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm(t.admin.deleteConfirm)) return;

    try {
      await pb.collection('comments').delete(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleSadhu = async () => {
    setIsSadhuAnimating(true);
    setSadhuCount(prev => prev + 1);
    
    try {
      // Increment sadhu_count in books collection
      await pb.collection('books').update(bookId, {
        'sadhu_count+': 1
      });
    } catch (error) {
      console.error('Error updating sadhu count:', error);
    }

    setTimeout(() => setIsSadhuAnimating(false), 2000);
  };

  const canDelete = (comment: Comment) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return comment.user === user.id;
  };

  return (
    <div className="mt-12 pt-12 border-t border-zen-gray-light space-y-12">
      {/* Sadhu Section */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <button
            onClick={handleSadhu}
            className="group flex items-center space-x-3 px-8 py-4 bg-zen-orange/10 hover:bg-zen-orange/20 text-zen-orange rounded-full font-bold transition-all transform hover:scale-105 active:scale-95"
          >
            <Flower2 className={`w-6 h-6 ${isSadhuAnimating ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
            <span className="text-xl">{t.modal.sadhu}</span>
            <span className="bg-zen-orange text-white px-3 py-1 rounded-full text-sm">
              {sadhuCount}
            </span>
          </button>

          <AnimatePresence>
            {isSadhuAnimating && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: -40, scale: 1.2 }}
                exit={{ opacity: 0, y: -80, scale: 1.5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap text-2xl font-serif font-bold text-zen-orange pointer-events-none"
              >
                {t.modal.sadhuMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discussion Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-zen-orange/10 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-zen-orange" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-zen-gray-dark">
          {t.modal.dhammaDiscussion}
        </h3>
      </div>

      {/* Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t.modal.addComment}
              rows={3}
              className="w-full px-6 py-4 rounded-2xl bg-white border border-zen-gray-light focus:outline-none focus:ring-2 focus:ring-zen-orange/20 focus:border-zen-orange transition-all text-lg resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="absolute bottom-4 right-4 p-3 bg-zen-orange text-white rounded-xl hover:bg-zen-orange-light transition-all disabled:opacity-50 disabled:hover:bg-zen-orange"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-zen-cream rounded-2xl border border-dashed border-zen-gray-light text-center">
          <p className="text-zen-gray">{t.login.subtitle}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-zen-orange animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl border border-zen-gray-light shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-zen-cream rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-zen-gray" />
                  </div>
                  <div>
                    <span className="font-bold text-zen-gray-dark">
                      {comment.expand?.user?.name || 'Dhamma Student'}
                    </span>
                    <div className="flex items-center text-xs text-zen-gray space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(comment.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {canDelete(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-2 text-zen-gray hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-zen-gray-dark leading-relaxed text-lg">
                {comment.text}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-zen-gray">
            {t.modal.noComments}
          </div>
        )}
      </div>
    </div>
  );
}
