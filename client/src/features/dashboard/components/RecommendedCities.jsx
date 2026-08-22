import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bookmark, BookmarkCheck, Star, Compass, ArrowRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function RecommendedCities({
  cities = [],
  savedCityIds = [],
  onToggleSave,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Recommended Destinations
          </h2>
          <p className="text-xs text-slate-500">
            Handpicked global destinations with top-rated cultural and adventure experiences.
          </p>
        </div>
        <Link
          to="/activities"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <span>Explore All Activities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cities.map((city) => {
          const isSaved = savedCityIds.includes(city.id);
          const activityCount = city._count?.activities || 6;

          return (
            <Card
              key={city.id}
              className="overflow-hidden flex flex-col group hover:shadow-lg transition-all border-slate-200/90"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={
                    city.imageUrl ||
                    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />

                {/* Save button top right */}
                <button
                  type="button"
                  onClick={() => onToggleSave(city.id)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                    isSaved
                      ? 'bg-brand-600 text-white shadow-brand-500/30'
                      : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
                  }`}
                  title={isSaved ? 'Remove from Saved' : 'Save to Bucket List'}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-sky-200">
                    {city.country}
                  </span>
                  <h3 className="text-xl font-black tracking-tight mt-1 drop-shadow-md">
                    {city.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {city.description || 'Iconic international city boasting vibrant culture, cuisine, and sightseeing.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-brand-600" />
                    {activityCount} Experiences
                  </span>

                  <Link to={`/activities?cityId=${city.id}`}>
                    <Button variant="subtle" size="sm" className="text-xs font-bold">
                      View Sights
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
