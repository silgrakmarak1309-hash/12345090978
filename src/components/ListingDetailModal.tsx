import React from 'react';
import {
  X,
  MapPin,
  Tag,
  ShieldCheck,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  User,
  ShoppingBag,
  Truck,
  AlertTriangle,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { Listing, formatPrice, isHeavyItemCategory } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onOrderNow?: (listing: Listing) => void;
  onModerate?: (id: string, status: 'active' | 'rejected', isFeatured?: boolean, isPro?: boolean) => void;
  isAdmin?: boolean;
}

export function formatWhatsAppUrl(rawPhone: string | undefined, listing: Listing): string {
  const digits = (rawPhone || listing?.phone || '9876543210').replace(/\D/g, '');
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  const priceDisplay = formatPrice(listing?.price);
  const titleDisplay = listing?.title || 'Product Listing';
  const message = `Hello! I am inquiring about your listing: "${titleDisplay}" (₹${priceDisplay}) listed on Meri Local Bazaar. Is it still available?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onOrderNow,
  onModerate,
  isAdmin = false,
}) => {
  if (!listing) return null;

  const rawPhone = listing.phone || listing.whatsapp || '9876543210';
  const cleanPhoneDigits = rawPhone.replace(/\D/g, '');
  const telUrl = `tel:${cleanPhoneDigits.length === 10 ? `+91${cleanPhoneDigits}` : rawPhone}`;
  const whatsappUrl = formatWhatsAppUrl(listing.whatsapp || listing.phone, listing);

  const isHeavy = isHeavyItemCategory(listing.category_name, listing.title);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col my-auto border border-slate-200"
      >
        {/* Full Image Header */}
        <div className="h-56 sm:h-72 bg-slate-900 relative shrink-0">
          <img
            src={
              listing.images_json ||
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
            }
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute(
                'src',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
              );
            }}
          />

          {/* Close Button Top-Right */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition shadow-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
            {listing.status === 'pending' && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                ⏳ Pending Moderation
              </span>
            )}
            {listing.is_featured && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                ⭐ TOP FEATURED
              </span>
            )}
            {listing.is_pro && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED PRO
              </span>
            )}
          </div>

          {listing.condition && (
            <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs">
              {listing.condition}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              ₹{formatPrice(listing.price)}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">
              {listing.title}
            </h3>

            <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {listing.location_name || 'India'}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {listing.category_name || 'General'}
              </span>
            </div>
          </div>

          {/* Heavy Product Restriction Warning or Fast Delivery badge */}
          {isHeavy ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Heavy Product / Vehicle Notice:</strong>
                <span>
                  Yeh item heavy category (Vehicle/Property/Furniture) mein aata hai. Iska home delivery courier available nahi hai — sirf <strong>Self-Pickup & Direct Buyer Inspection</strong> permissible hai.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-emerald-900 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Prepaid Delivery:</strong> Local dispatch available across Garo Hills.
                </span>
              </div>
              <span className="text-[10px] font-black uppercase bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Prepaid
              </span>
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Item Details & Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {listing.description || 'No additional description provided by the seller.'}
            </p>
          </div>

          {/* Seller Profile Summary */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {listing.seller_name?.charAt(0) || 'S'}
              </div>
              <div>
                <div className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                  Verified Local Seller
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {listing.seller_name || 'Community Member'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {listing.phone || 'Phone verified'}
                </div>
              </div>
            </div>
            {listing.seller_verified && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            )}
          </div>

          {/* Admin Moderation Actions if opened from Admin panel */}
          {isAdmin && onModerate && listing.status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-amber-900">
                Admin Control Moderation
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onModerate(listing.id, 'active', true, true);
                    onClose();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  ✓ Approve & Feature
                </button>
                <button
                  onClick={() => {
                    onModerate(listing.id, 'active', false, false);
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  ✓ Approve Standard
                </button>
                <button
                  onClick={() => {
                    onModerate(listing.id, 'rejected', false, false);
                    onClose();
                  }}
                  className="px-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Sheet at the bottom: Buy Now + WhatsApp + Call */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50/95 shrink-0 space-y-2.5">
          {/* Primary Action: 100% Prepaid Order Button */}
          {onOrderNow && (
            <button
              onClick={() => {
                onClose();
                onOrderNow(listing);
              }}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl text-center text-sm transition shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {isHeavy ? 'Order with Self-Pickup (Advance Pay)' : '⚡ Buy Now with 100% Prepaid Delivery'}
              </span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-center text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Seller</span>
            </a>

            {/* Call Seller Native Phone Dialer Button */}
            <a
              href={telUrl}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-center text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Seller</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-2xl text-xs border border-slate-200 transition shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
