import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trash2, Compass, Bookmark, ExternalLink } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';

export default function SavedDestinations({
  savedDestinations = [],
  onRemove,
  isRemoving = false,
}) {
  if (savedDestinations.length === 0) {
    return (
      <EmptyState
        title="No saved destinations yet"
        description="Explore world cities and bookmark destinations to your bucket list."
        icon={Bookmark}
        actionLabel="Explore Cities & Activities"
        onAction={() => (window.location.href = '/activities')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedDestinations.map((item) => {
        const city = item.city;
        if (!city) return null;

        return (
          <Card
            key={item.id}
            className="overflow-hidden flex flex-col group hover:shadow-md transition-all border-slate-200/90"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={
                  city.imageUrl ||
                  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
                }
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />

              <button
                type="button"
                onClick={() => onRemove(city.id)}
                disabled={isRemoving}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs shadow-xs transition-colors"
                title="Remove from saved"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <span className="text-[10px] uppercase font-bold text-sky-300">
                  {city.country}
                </span>
                <h4 className="text-base font-bold drop-shadow-md truncate">
                  {city.name}
                </h4>
              </div>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {city.description || 'Explore local sights, culture, and cuisine.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-brand-600" />
                  {city._count?.activities || 6} Activities
                </span>

                <Link to={`/activities?cityId=${city.id}`}>
                  <Button variant="subtle" size="sm" className="text-xs font-bold gap-1">
                    <span>View Sights</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
