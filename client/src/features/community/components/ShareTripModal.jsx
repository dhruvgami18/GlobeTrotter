import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import communityService from '../../../services/communityService';

export default function ShareTripModal({
  isOpen,
  onClose,
  trip,
  onTripUpdated,
}) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!trip) return null;

  const isPublic = Boolean(trip.isPublic && trip.shareToken);
  const publicPath = isPublic ? `/public/trips/${trip.shareToken}` : '';
  const fullPublicUrl = isPublic
    ? `${window.location.origin}${publicPath}`
    : '';

  const handleTogglePublish = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      if (isPublic) {
        await communityService.unpublishTrip(trip.id);
        if (onTripUpdated) {
          onTripUpdated({ ...trip, isPublic: false });
        }
        setFeedback({ type: 'info', text: 'Trip is now private.' });
      } else {
        const res = await communityService.publishTrip(trip.id);
        if (onTripUpdated && res.data) {
          onTripUpdated({
            ...trip,
            isPublic: true,
            shareToken: res.data.shareToken,
          });
        }
        setFeedback({
          type: 'success',
          text: 'Trip published! Share the link with friends or fellow travelers.',
        });
      }
    } catch (err) {
      console.error('Publish toggle error:', err);
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to update trip sharing status.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!fullPublicUrl) return;
    try {
      await navigator.clipboard.writeText(fullPublicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      prompt('Copy your public trip link:', fullPublicUrl);
    }
  };

  const handleNativeShare = async () => {
    if (!fullPublicUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} — GlobeTrotter Itinerary`,
          text: `Check out my travel itinerary for ${trip.title} on GlobeTrotter!`,
          url: fullPublicUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      // Fallback
      handleCopyLink();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Travel Itinerary"
      subtitle="Publish your curated route, activities, and budget to the GlobeTrotter community or share with friends."
    >
      <div className="space-y-5">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Public vs Private Status Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isPublic
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isPublic
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {isPublic ? 'Your trip is public!' : 'Trip is currently private'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isPublic
                    ? 'Anyone with the link can view your itinerary & copy it.'
                    : 'Only you can see this itinerary.'}
                </p>
              </div>
            </div>

            <Button
              variant={isPublic ? 'outline' : 'primary'}
              onClick={handleTogglePublish}
              isLoading={isLoading}
              className="text-xs"
            >
              {isPublic ? 'Make Private' : 'Publish Trip'}
            </Button>
          </div>
        </div>

        {/* Link Sharing Box (When Public) */}
        {isPublic && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Shareable Public URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={fullPublicUrl}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono select-all focus:outline-none"
                />
                <Button
                  variant="primary"
                  onClick={handleCopyLink}
                  className="shrink-0 flex items-center gap-1.5 text-xs px-3.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href={publicPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview Public Page</span>
              </a>

              <Button
                variant="outline"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share...</span>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
