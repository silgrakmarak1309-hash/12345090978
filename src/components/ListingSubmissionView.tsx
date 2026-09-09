import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Listing } from '../types';

interface ListingSubmissionViewProps {
  onSuccess: (newListing: Listing) => void;
  onCancel: () => void;
  userPhone?: string;
  userName?: string;
  userId?: string;
  isProUser?: boolean;
}

const CATEGORIES = [
  'Shops',
  'Local Jobs & Services',
  'Local Cab & Taxi',
  'Travelers & Tour',
  'Bike & Auto Rickshaw',
  'Mobiles & Gadgets',
  'Vehicles',
  'Property & Real Estate',
  'Electronics & Appliances',
  'Furniture & Home',
  'Fashion & Beauty',
  'Agriculture & Livestock',
  'Commercial Equipment',
];

export const ListingSubmissionView: React.FC<ListingSubmissionViewProps> = ({
  onSuccess,
  onCancel,
  userPhone = '9876543210',
  userName = 'Silgrak Marak',
  userId = 'usr_admin',
  isProUser = true,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mobiles & Gadgets');
  const [location, setLocation] = useState('Tura, Meghalaya');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Like New');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(userPhone);
  const [whatsapp, setWhatsapp] = useState(userPhone);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setError(null);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageBase64(result);
    };
    reader.onerror = () => {
      setError('Failed to read image file from device storage.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || parseFloat(price) <= 0) {
      setError('Please provide a valid listing title and price.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const listingPayload: Listing = {
      id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      category_name: category,
      location_name: location.trim(),
      state_name: location.split(',').pop()?.trim() || 'Meghalaya',
      price: parseFloat(price),
      condition,
      description: description.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      images_json:
        imageBase64 ||
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      is_featured: isProUser,
      is_pro: isProUser,
      status: 'pending', // Strict moderation requirement
      seller_id: userId,
      seller_name: userName,
      seller_verified: true,
      views_count: 1,
      created_at: new Date().toISOString(),
    };

    try {
      if (supabase) {
        const { error: dbError } = await supabase.from('listings').insert([listingPayload]);
        if (dbError) {
          console.warn('Supabase listing insert notice:', dbError.message);
        }
      }
      onSuccess(listingPayload);
    } catch (err: any) {
      console.error('Error submitting listing:', err);
      // Fallback success locally
      onSuccess(listingPayload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              Moderated Submission
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Submit Listing Request</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              All submissions are verified by our Admin Control Room before going live.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Local Device Image File Upload System */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Product Media Upload *
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {imageBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 h-56 flex items-center justify-center group">
              <img src={imageBase64} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-slate-100"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageBase64('');
                    setImageFileName('');
                  }}
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                ✓ {imageFileName || 'Image Attached'}
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-300 hover:border-orange-400 bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click to browse photo or drag & drop here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Upload clear product picture from your device (PNG, JPG, Max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Ad Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Listing Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Enfield Classic 350 (2022 Single Owner)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Category & Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="text-slate-900 font-semibold">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Price (₹ INR) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 145000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              City / Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tura, Meghalaya"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Item Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            >
              <option value="Brand New" className="text-slate-900 font-semibold">Brand New / Sealed Box</option>
              <option value="Used - Like New" className="text-slate-900 font-semibold">Used - Like New</option>
              <option value="Used - Good" className="text-slate-900 font-semibold">Used - Good</option>
              <option value="Used - Fair" className="text-slate-900 font-semibold">Used - Fair Condition</option>
            </select>
          </div>
        </div>

        {/* Contact WhatsApp Protocol */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Contact Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              WhatsApp Inquiry Number *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit WhatsApp number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Full Description & Specs
          </label>
          <textarea
            rows={4}
            placeholder="Detailed description, purchase year, inclusions, bills/warranty, and reason for selling..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50"
          >
            {submitting ? 'Submitting to Moderation Queue...' : 'Submit Listing for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};
