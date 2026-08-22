import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Compass, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function CityCard({
  city,
  onAddToTrip,
}) {
  if (!city) return null;

  const activityCount = city._count?.activities || (city.activities?.length) || 6;
  const costIndex = city.costIndex || 50;
  const popularity = city.popularityScore || 85;

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200/90 bg-white">
      {/* City Photo Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={
            city.imageUrl ||
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
          }
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-75" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
            {city.country}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full text-xs font-bold shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{popularity}% Popular</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-black tracking-tight drop-shadow-md">
            {city.name}
          </h3>
        </div>
      </div>

      {/* Description & Stats */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {city.description || 'Vibrant destination offering world-class cultural attractions, dining, and landmarks.'}
        </p>

        {/* Cost Index & Activities Count */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold mb-3">
          <span className="flex items-center gap-1 text-slate-500">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            {activityCount} Experiences
          </span>
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            Cost Index: {costIndex}/100
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link to={`/activities?cityId=${city.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs font-bold">
              View Sights
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToTrip(city)}
            icon={Plus}
            className="flex-1 text-xs font-bold"
          >
            Add to Trip
          </Button>
        </div>
      </div>
    </Card>
  );
}
