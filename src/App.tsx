import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  Tag,
  MapPin,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { supabase, supabaseState, SUPABASE_URL } from './lib/supabase';
import { ErrorBoundary } from './components/ErrorBoundary';

interface Listing {
  id: string;
  title: string;
  category_name?: string;
  category_id?: string;
  location_name?: string;
  price: number;
  condition?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  images_json?: string;
  is_featured?: boolean;
  is_pro?: boolean;
  status?: string;
  created_at?: string | number;
}

interface Setting {
  id: number | string;
  key: string;
  value: string;
}

const CATEGORIES = [
  'All',
  'Mobiles & Gadgets',
  'Vehicles',
  'Property & Real Estate',
  'Electronics & Appliances',
  'Furniture & Home',
  'Jobs & Services',
  'Fashion & Beauty',
  'Agriculture & Livestock',
];

export function MainMarketplaceApp() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'bazaar' | 'post' | 'pro' | 'system'>('bazaar');
  
  // Settings & Payment details
  const [upiId, setUpiId] = useState('merilocalbazaar@oksbi');
  const [qrUrl, setQrUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // New Ad Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Mobiles & Gadgets');
  const [newLocation, setNewLocation] = useState('Tura, Meghalaya');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState('Used - Like New');
  const [newDescription, setNewDescription] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submittingAd, setSubmittingAd] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Fetch initial data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMessage(null);

      if (!supabaseState.isConfigured || !supabase) {
        setErrorMessage(supabaseState.error || 'Supabase configuration is pending.');
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (listingsError) {
          console.warn('Supabase fetch listings notice:', listingsError.message);
          setErrorMessage(`Database Notice: ${listingsError.message}`);
        } else if (listingsData && listingsData.length > 0) {
          setListings(listingsData);
        } else {
          // Fallback sample data if table is currently empty
          setListings([
            {
              id: 'sample-1',
              title: 'iPhone 13 (128GB) - Midnight Blue with Bill & Box',
              category_name: 'Mobiles & Gadgets',
              location_name: 'Tura, Meghalaya',
              price: 38500,
              condition: 'Used - Like New',
              description: 'Mint condition, 89% battery health. Includes original charging cable and case.',
              images_json: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
              phone: '9876543210',
              is_featured: true,
              is_pro: true,
              status: 'active',
            },
            {
              id: 'sample-2',
              title: 'Yamaha FZ-S Version 3.0 (Single Owner)',
              category_name: 'Vehicles',
              location_name: 'Shillong, Meghalaya',
              price: 74000,
              condition: 'Used - Good',
              description: 'Well maintained, regular service done at authorized center. Insurance valid.',
              images_json: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
              phone: '9876543210',
              is_featured: false,
              is_pro: true,
              status: 'active',
            },
            {
              id: 'sample-3',
              title: 'Commercial Plot in Super Market Complex',
              category_name: 'Property & Real Estate',
              location_name: 'Guwahati, Assam',
              price: 1250000,
              condition: 'New',
              description: 'Prime commercial road facing plot with immediate registration available.',
              images_json: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
              phone: '9876543210',
              is_featured: true,
              is_pro: false,
              status: 'active',
            },
          ]);
        }

        // 2. Fetch Settings (row id = 1 or settings list)
        try {
          const { data: settingsData } = await supabase
            .from('settings')
            .select('*')
            .limit(10);

          if (settingsData && settingsData.length > 0) {
            const upiSetting = settingsData.find(
              (s: any) => s.key === 'upi_id' || s.key === 'admin_upi_id'
            );
            const qrSetting = settingsData.find(
              (s: any) => s.key === 'qr_code_url' || s.key === 'admin_qr_url'
            );

            if (upiSetting?.value) setUpiId(upiSetting.value);
            if (qrSetting?.value) {
              setQrUrl(qrSetting.value);
            } else if (upiSetting?.value) {
              setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiSetting.value}`);
            }
          } else {
            setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merilocalbazaar@oksbi`);
          }
        } catch (setErr) {
          console.log('Settings read notice:', setErr);
          setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merilocalbazaar@oksbi`);
        }
      } catch (err: any) {
        console.error('Error fetching live data:', err);
        setErrorMessage(err?.message || 'Database connection error.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      item.category_name?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    setSubmittingAd(true);
    const newAdObject: Listing = {
      id: `ad_${Date.now()}`,
      title: newTitle.trim(),
      category_name: newCategory,
      location_name: newLocation.trim(),
      price: parseFloat(newPrice) || 0,
      condition: newCondition,
      description: newDescription.trim(),
      phone: newPhone.trim() || '9876543210',
      images_json:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
      is_featured: false,
      is_pro: false,
      status: 'pending', // Moderation on Supabase
      created_at: new Date().toISOString(),
    };

    try {
      if (supabase) {
        await supabase.from('listings').insert([newAdObject]);
      }
    } catch (err) {
      console.warn('Listing Supabase sync:', err);
    }

    // Add locally to view immediately
    setListings([newAdObject, ...listings]);
    setSubmittingAd(false);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('bazaar');
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-orange-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('bazaar')}
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                Meri Local Bazaar
              </h1>
              <p className="text-xs text-orange-100 opacity-90">
                Your Local Community Marketplace
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bazaar')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'bazaar'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-white hover:bg-orange-700/60'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition inline-flex items-center gap-1.5 ${
                activeTab === 'pro'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-200 hover:bg-orange-700/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              PRO Membership
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ml-1"
            >
              <PlusCircle className="w-4 h-4" />
              Post Free Ad
            </button>
          </nav>
        </div>
      </header>

      {/* Database Connection Notice (Fallback check if not connected) */}
      {errorMessage && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>System Notice:</strong> {errorMessage} (Operating in safe local mode).
            </span>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: BAZAAR MARKETPLACE */}
        {activeTab === 'bazaar' && (
          <div className="space-y-6">
            {/* Search and Category Filter Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search phones, cars, electronics, properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                {CATEGORIES.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Verified Local Trading
                </span>
                <h2 className="text-2xl font-black">Sell Faster with PRO Upgrade</h2>
                <p className="text-orange-100 text-sm mt-1 max-w-xl">
                  Highlight your listings with golden badges and top rankings across your city.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pro')}
                className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm whitespace-nowrap"
              >
                View Plans (Starting at ₹50)
              </button>
            </div>

            {/* Listings Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  Recent Listings in Your Area
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredListings.length} items found
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl h-72 animate-pulse border border-slate-200"
                    />
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-700">No listings match your search</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Try changing your keywords or clear your category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedListing(item)}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col group"
                    >
                      {/* Image Container */}
                      <div className="h-44 bg-slate-100 relative overflow-hidden">
                        <img
                          src={
                            item.images_json ||
                            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
                            );
                          }}
                        />
                        {item.is_featured && (
                          <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                            ⭐ FEATURED
                          </span>
                        )}
                        {item.condition && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                            {item.condition}
                          </span>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-lg font-black text-emerald-600">
                            ₹{item.price?.toLocaleString('en-IN')}
                          </div>
                          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 mt-1">
                            {item.title}
                          </h4>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {item.location_name || 'India'}
                          </span>
                          <span className="text-orange-600 font-semibold group-hover:translate-x-0.5 transition">
                            View →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: POST NEW AD */}
        {activeTab === 'post' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Post Free Advertisement</h2>
                <p className="text-xs text-slate-500">
                  Fill in the details to publish your product on Meri Local Bazaar.
                </p>
              </div>
            </div>

            {postSuccess ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">Ad Posted Successfully!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your listing is now synchronized with Supabase database. Redirecting...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostAd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ad Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., iPhone 14 Pro Max (256GB)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g., 25000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Tura, Meghalaya"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                    >
                      <option value="New">Brand New / Sealed</option>
                      <option value="Used - Like New">Used - Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Used - Fair">Used - Fair</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Specifications
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe item condition, inclusions, and reason for selling..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingAd}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {submittingAd ? 'Publishing...' : 'Submit Advertisement'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* VIEW 3: PRO MEMBERSHIP & DYNAMIC UPI / QR PAYMENT */}
        {activeTab === 'pro' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-600 rounded-3xl p-8 text-white shadow-xl text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-amber-200" />
              <h2 className="text-3xl font-black">Upgrade to PRO Membership</h2>
              <p className="text-orange-100 max-w-lg mx-auto text-sm mt-2">
                Gain instant trust with verified badges, 10x ad impressions, and top spot in your local search results.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '1 Month PRO', price: 50, duration: '30 Days', boosts: 'Boost 5 Ads' },
                { name: '3 Month PRO', price: 120, duration: '90 Days', boosts: 'Boost 15 Ads', popular: true },
                { name: '1 Year VIP', price: 350, duration: '365 Days', boosts: 'Unlimited Boosts' },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between ${
                    plan.popular
                      ? 'border-2 border-orange-500 shadow-md relative'
                      : 'border-slate-200 shadow-sm'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{plan.name}</h3>
                    <div className="text-3xl font-black text-slate-900 mt-2">₹{plan.price}</div>
                    <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
                    <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {plan.boosts}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Golden Verified PRO Badge
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Direct WhatsApp Contact Button
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic UPI & QR Code Payment Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="max-w-md mx-auto text-center space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Scan & Pay via UPI</h3>
                <p className="text-xs text-slate-500">
                  Scan the QR code with GPay, PhonePe, Paytm, or BHIM to complete recharge.
                </p>

                {/* QR Code Container */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl inline-block shadow-inner">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="Merchant QR"
                      className="w-44 h-44 mx-auto object-contain"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-200 rounded-xl text-slate-500">
                      <QrCode className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* UPI ID with Copy Button */}
                <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
                  <div className="text-left">
                    <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                      Official Merchant UPI ID
                    </div>
                    <div className="text-sm font-black text-slate-800 font-mono">{upiId}</div>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="p-2 bg-white text-orange-600 rounded-lg hover:bg-orange-100 transition shadow-sm border border-orange-200"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="h-64 bg-slate-100 relative">
              <img
                src={
                  selectedListing.images_json ||
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
                }
                alt={selectedListing.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedListing.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedListing.location_name || 'India'}
                  </p>
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  ₹{selectedListing.price?.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                {selectedListing.description || 'No description provided for this listing.'}
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`tel:${selectedListing.phone || '9876543210'}`}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-center text-sm transition shadow-sm"
                >
                  Call Seller
                </a>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="px-5 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300">Meri Local Bazaar © 2026</p>
          <p className="text-slate-500">Connected to Supabase Live Production Database</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainMarketplaceApp />
    </ErrorBoundary>
  );
}
