import { Link } from "react-router";
import { MapPin, Clock, Users, Bus } from "lucide-react";

export default function TicketCard({ ticket }) {
  const {
    _id,
    image,
    title,
    from,
    to,
    departureTime,
    transportType,
    availableQuantity:quantity,
    perks = [],
    price,
    isAdvertised:isFeatured,
  } = ticket;

  // Format departure time
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link to={`/ticket/${_id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 h-full flex flex-col">
        
        {/* Image */}
        <div className="relative h-48 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />

          {isFeatured && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Route */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-teal-600 shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {from} → {to}
            </span>
          </div>

          {/* Meta */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <Bus size={14} className="text-teal-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">{transportType}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={14} className="shrink-0" />
                <span className="truncate">{formatDate(departureTime)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users size={14} className="shrink-0" />
                <span>{quantity} left</span>
              </div>
            </div>
          </div>

          {/* Perks */}
          {perks.length > 0 && (
            <div className="flex gap-1 mb-4 flex-wrap">
              {perks.slice(0, 2).map((perk, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">
                  {perk}
                </span>
              ))}

              {perks.length > 2 && (
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                  +{perks.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">From</p>
              <p className="text-2xl font-bold text-teal-600">৳ {price?.toLocaleString() || price}</p>
            </div>

            <button className="px-4 py-2 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
