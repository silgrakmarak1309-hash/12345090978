import React, { useState } from 'react';
import { Plus, Eye, MessageCircle, Trash2, CheckCircle2, Clock, XCircle, Tag, MapPin } from 'lucide-react';
import { Listing, formatPrice } from '../types';
import { formatWhatsAppUrl } from './ListingDetailModal';

interface MyAdsManagementProps {
  myListings: Listing[];
  onOpenSubmitModal: () => void;
  onViewListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onToggleListingStatus: (id: string, currentStatus: string) => void;
}

export const MyAdsManagement: React.FC<MyAdsManagementProps> = ({
  myListings,
  onOpenSubmitModal,
  onViewListing,
  onDeleteListing,
  onToggleListingStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');

  const filtered = myListings.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Ads Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and manage your submitted listings, moderation status, and incoming WhatsApp inquiries.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Submit Listing Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'pending', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              filter === status
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status} ({myListings.filter((l) => (status === 'all' ? true : l.status === status)).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Tag className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No {filter} listings found</p>
          <p className="text-xs text-slate-400 mt-1">Submit your product listing to advertise locally.</p>
          <button
            onClick={onOpenSubmitModal}
            className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition"
          >
            Submit First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex gap-3.5">
                <img
                  src={
                    item.images_json ||
                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80'
                  }
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-emerald-600 font-black text-base">
                      ₹{formatPrice(item.price)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm truncate mt-0.5">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location_name}
                    </span>
                    <span>•</span>
                    <span>{item.category_name}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewListing(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>

                  <a
                    href={formatWhatsAppUrl(item.whatsapp || item.phone, item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onToggleListingStatus(
                        item.id,
                        item.status === 'active' ? 'rejected' : 'active'
                      )
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    {item.status === 'active' ? 'Pause Ad' : 'Activate'}
                  </button>
                  <button
                    onClick={() => onDeleteListing(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Ad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
