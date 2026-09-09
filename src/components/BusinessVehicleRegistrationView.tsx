import React, { useState, useEffect } from 'react';
import {
  Store,
  Car,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  Sparkles,
  MapPin,
  Phone,
  User,
  AlertCircle,
  Eye,
  PlusCircle,
  Truck,
  FileCheck,
  CreditCard,
  QrCode,
  Building,
} from 'lucide-react';
import { ShopRegistration, VehicleRegistration, UserProfile } from '../types';

interface BusinessVehicleRegistrationViewProps {
  currentUser: UserProfile;
  shopRegistrations: ShopRegistration[];
  vehicleRegistrations: VehicleRegistration[];
  onSubmitShop: (data: Omit<ShopRegistration, 'id' | 'created_at' | 'status'>) => void;
  onSubmitVehicle: (data: Omit<VehicleRegistration, 'id' | 'created_at' | 'status'>) => void;
}

const SHOP_CATEGORIES = [
  'Grocery & Daily Needs',
  'Electronics & Mobile Store',
  'Clothing & Fashion Boutique',
  'Pharmacy & Healthcare',
  'Hardware & Construction',
  'Restaurant & Fast Food',
  'Automobile Repair & Spare Parts',
  'Agriculture & Nursery',
  'Services & Printing Press',
  'Other Business / Retail',
];

const VEHICLE_TYPES = [
  'Local Cab / Taxi',
  'Traveler (12-26 Seater)',
  'Auto Rickshaw',
  'Commercial Bike',
  'Pickup / Commercial Van',
];

export const BusinessVehicleRegistrationView: React.FC<BusinessVehicleRegistrationViewProps> = ({
  currentUser,
  shopRegistrations,
  vehicleRegistrations,
  onSubmitShop,
  onSubmitVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'vehicle' | 'my_status'>('shop');
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Shop Form State
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState(SHOP_CATEGORIES[0]);
  const [shopIdType, setShopIdType] = useState('Trade License');
  const [shopIdNo, setShopIdNo] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.full_name || '');
  const [ownerIdType, setOwnerIdType] = useState('Aadhaar Card');
  const [ownerIdNo, setOwnerIdNo] = useState('');
  const [ownerIdProofUrl, setOwnerIdProofUrl] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [cityLocality, setCityLocality] = useState(currentUser?.city || 'Tura, Meghalaya');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [shopBannerUrl, setShopBannerUrl] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('9:00 AM - 8:00 PM');

  // Shop Payout State
  const [shopPayoutUpi, setShopPayoutUpi] = useState(currentUser?.payout_upi_id || '');
  const [shopBankName, setShopBankName] = useState(currentUser?.payout_bank_name || '');
  const [shopAccountNo, setShopAccountNo] = useState(currentUser?.payout_account_no || '');
  const [shopIfscCode, setShopIfscCode] = useState(currentUser?.payout_ifsc_code || '');
  const [shopQrUrl, setShopQrUrl] = useState(currentUser?.payout_qr_image_url || '');

  // Vehicle Form State
  const [driverName, setDriverName] = useState(currentUser?.full_name || '');
  const [driverPhone, setDriverPhone] = useState(currentUser?.phone || '');
  const [driverWhatsapp, setDriverWhatsapp] = useState(currentUser?.phone || '');
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]);
  const [vehicleRegNo, setVehicleRegNo] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('2023');
  const [drivingLicenseNo, setDrivingLicenseNo] = useState('');
  const [dlProofUrl, setDlProofUrl] = useState('');
  const [vehicleRcNo, setVehicleRcNo] = useState('');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState('');
  const [operationalRoute, setOperationalRoute] = useState('Tura to Guwahati / Local Tura');
  const [dailyRate, setDailyRate] = useState('');

  // Vehicle Payout State
  const [vehPayoutUpi, setVehPayoutUpi] = useState(currentUser?.payout_upi_id || '');
  const [vehBankName, setVehBankName] = useState(currentUser?.payout_bank_name || '');
  const [vehAccountNo, setVehAccountNo] = useState(currentUser?.payout_account_no || '');
  const [vehIfscCode, setVehIfscCode] = useState(currentUser?.payout_ifsc_code || '');
  const [vehQrUrl, setVehQrUrl] = useState(currentUser?.payout_qr_image_url || '');

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser?.full_name) {
      if (!ownerName) setOwnerName(currentUser.full_name);
      if (!driverName) setDriverName(currentUser.full_name);
    }
    if (currentUser?.phone) {
      if (!userPhone) setUserPhone(currentUser.phone);
      if (!driverPhone) setDriverPhone(currentUser.phone);
      if (!driverWhatsapp) setDriverWhatsapp(currentUser.phone);
    }
    if (currentUser?.payout_upi_id) {
      if (!shopPayoutUpi) setShopPayoutUpi(currentUser.payout_upi_id);
      if (!vehPayoutUpi) setVehPayoutUpi(currentUser.payout_upi_id);
    }
  }, [currentUser]);

  // User's own registrations
  const myShops = shopRegistrations.filter(
    (s) => s.user_id === currentUser?.id || s.user_phone === currentUser?.phone
  );
  const myVehicles = vehicleRegistrations.filter(
    (v) => v.user_id === currentUser?.id || v.driver_phone === currentUser?.phone
  );

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitShopForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !shopIdNo.trim() || !ownerIdNo.trim() || !userPhone.trim()) {
      alert('Please fill in Shop Name, Shop ID / License No, Owner ID No, and Contact Phone.');
      return;
    }
    if (!shopPayoutUpi.trim() || !shopPayoutUpi.includes('@')) {
      alert('Please enter a valid Shop Payout UPI ID (e.g. yourshop@oksbi).');
      return;
    }

    onSubmitShop({
      user_id: currentUser?.id || 'usr_anonymous',
      user_name: ownerName || currentUser?.full_name || 'Shop Owner',
      user_phone: userPhone,
      user_email: currentUser?.email,
      shop_name: shopName,
      category: shopCategory,
      shop_id_proof_type: shopIdType,
      shop_id_no: shopIdNo,
      owner_name: ownerName,
      owner_id_type: ownerIdType,
      owner_id_no: ownerIdNo,
      owner_id_proof_url:
        ownerIdProofUrl ||
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      shop_address: shopAddress,
      city_locality: cityLocality,
      shop_banner_url:
        shopBannerUrl ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      description: shopDescription,
      opening_hours: openingHours,
      payout_upi_id: shopPayoutUpi.trim(),
      payout_bank_name: shopBankName.trim() || undefined,
      payout_account_no: shopAccountNo.trim() || undefined,
      payout_ifsc_code: shopIfscCode.trim().toUpperCase() || undefined,
      payout_qr_image_url: shopQrUrl || undefined,
    });

    setSubmittedSuccess('Shop registration request submitted! Admin will verify and approve.');
    setActiveTab('my_status');
    setTimeout(() => setSubmittedSuccess(null), 5000);
  };

  const handleSubmitVehicleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleRegNo.trim() || !drivingLicenseNo.trim() || !driverPhone.trim() || !vehicleModel.trim()) {
      alert('Please fill in Vehicle Registration No, Driving License No, Vehicle Model, and Driver Phone.');
      return;
    }
    if (!vehPayoutUpi.trim() || !vehPayoutUpi.includes('@')) {
      alert('Please enter a valid Driver Payout UPI ID (e.g. driver@oksbi).');
      return;
    }

    onSubmitVehicle({
      user_id: currentUser?.id || 'usr_anonymous',
      driver_name: driverName || currentUser?.full_name || 'Driver / Owner',
      driver_phone: driverPhone,
      driver_whatsapp: driverWhatsapp || driverPhone,
      driver_email: currentUser?.email,
      vehicle_type: vehicleType,
      vehicle_reg_no: vehicleRegNo.toUpperCase(),
      vehicle_model: vehicleModel,
      vehicle_year: vehicleYear,
      driving_license_no: drivingLicenseNo.toUpperCase(),
      driving_license_proof_url:
        dlProofUrl ||
        'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&auto=format&fit=crop&q=80',
      vehicle_rc_no: vehicleRcNo.toUpperCase(),
      vehicle_photo_url:
        vehiclePhotoUrl ||
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
      operational_route: operationalRoute,
      daily_rate_or_fare: dailyRate,
      payout_upi_id: vehPayoutUpi.trim(),
      payout_bank_name: vehBankName.trim() || undefined,
      payout_account_no: vehAccountNo.trim() || undefined,
      payout_ifsc_code: vehIfscCode.trim().toUpperCase() || undefined,
      payout_qr_image_url: vehQrUrl || undefined,
    });

    setSubmittedSuccess('Vehicle registration request submitted! Admin will verify license & RC for approval.');
    setActiveTab('my_status');
    setTimeout(() => setSubmittedSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> Official Business & Fleet Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Shop & Vehicle Registration Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Register your local shop, taxi, cab, tempo traveler, or auto rickshaw with verified ID proof and driving license. Get a verified blue badge on Meri Local Bazaar!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/60 self-start md:self-center">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" /> Register Shop
            </button>
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'vehicle'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Register Vehicle
            </button>
            <button
              onClick={() => setActiveTab('my_status')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'my_status'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" /> My Submissions ({myShops.length + myVehicles.length})
            </button>
          </div>
        </div>
      </div>

      {/* 100% PREPAID PROTOCOL SECURITY ALERT */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
            <span>100% Prepaid Protocol Security Alert</span>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              No COD
            </span>
          </h3>
          <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
            "Yeh ek 100% Prepaid App hai. Customer se delivery ke waqt koi cash ya online paisa alag se nahi lena hai. Aapka delivery charge order complete hote hi aapke app wallet / UPI payout mein aa jayega."
          </p>
        </div>
      </div>

      {/* Toast alert */}
      {submittedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submittedSuccess}</span>
        </div>
      )}

      {/* TAB 1: SHOP REGISTRATION FORM */}
      {activeTab === 'shop' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-600" />
              Register Your Local Business / Retail Store
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your Trade License or GST document along with owner identity proof for admin verification.
            </p>
          </div>

          <form onSubmit={handleSubmitShopForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Shop Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Shop / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garo Hills Organic Hub & Spices"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Shop Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Business Category *
                </label>
                <select
                  value={shopCategory}
                  onChange={(e) => setShopCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  {SHOP_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-slate-900 font-semibold">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shop ID Proof Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Business Registration Document Type *
                </label>
                <select
                  value={shopIdType}
                  onChange={(e) => setShopIdType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Trade License" className="text-slate-900">Trade License (Municipal / Town Council)</option>
                  <option value="GSTIN" className="text-slate-900">GST Registration Certificate (GSTIN)</option>
                  <option value="Local Council Reg" className="text-slate-900">Autonomous District Council (GHADC) Reg</option>
                  <option value="Shop Act / Other" className="text-slate-900">Shops & Commercial Establishment Act</option>
                </select>
              </div>

              {/* Shop ID Number */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Business License / Reg Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TL-TURA-2024-8841 or 17AAACM1234F1Z9"
                  value={shopIdNo}
                  onChange={(e) => setShopIdNo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal uppercase focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Shop Owner Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silgrak Marak"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Owner ID Type & Number */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Owner Identity Proof (Aadhaar / Voter / PAN) *
                </label>
                <div className="flex gap-2">
                  <select
                    value={ownerIdType}
                    onChange={(e) => setOwnerIdType(e.target.value)}
                    className="w-1/3 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Aadhaar Card" className="text-slate-900">Aadhaar</option>
                    <option value="Voter ID" className="text-slate-900">Voter ID</option>
                    <option value="PAN Card" className="text-slate-900">PAN Card</option>
                    <option value="Passport" className="text-slate-900">Passport</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9823 4512 7789"
                    value={ownerIdNo}
                    onChange={(e) => setOwnerIdNo(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Business WhatsApp / Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* City / Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Locality / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tura Supermarket Complex, West Garo Hills"
                  value={cityLocality}
                  onChange={(e) => setCityLocality(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Shop Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Full Physical Address of Shop *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Shop No., Complex Name, Street, Landmark, Pincode"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* PART 2: SHOP PAYOUT DETAILS */}
            <div className="bg-orange-50/60 border-2 border-orange-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-orange-200 pb-2">
                <CreditCard className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-orange-950">
                    Shop Payout & Settlement Account (Paisa Pane Ka Account) *
                  </h3>
                  <p className="text-[11px] text-orange-800">
                    Online marketplace customer orders ka settlement is UPI / Bank mein transfer hoga.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-orange-600" /> Shop Payout UPI ID * (Mandatory)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. garoshop@oksbi or 9876543210@paytm"
                  value={shopPayoutUpi}
                  onChange={(e) => setShopPayoutUpi(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={shopBankName}
                    onChange={(e) => setShopBankName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30219845123"
                    value={shopAccountNo}
                    onChange={(e) => setShopAccountNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0000198"
                    value={shopIfscCode}
                    onChange={(e) => setShopIfscCode(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* QR Upload */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-orange-600" /> Shop QR Code Image (Optional)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setShopQrUrl)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-800"
                />
                {shopQrUrl && (
                  <img
                    src={shopQrUrl}
                    alt="Shop QR Preview"
                    className="w-20 h-20 object-contain rounded-xl border border-slate-200 bg-white p-1"
                  />
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-600" /> Trade License / GST Doc Photo
                  </span>
                  {ownerIdProofUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold">Uploaded ✓</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setOwnerIdProofUrl)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                />
                {ownerIdProofUrl && (
                  <img
                    src={ownerIdProofUrl}
                    alt="Doc Preview"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-orange-600" /> Shop Front / Signboard Photo
                  </span>
                  {shopBannerUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold">Uploaded ✓</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setShopBannerUrl)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                />
                {shopBannerUrl && (
                  <img
                    src={shopBannerUrl}
                    alt="Shop Front Preview"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Shop for Admin Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: VEHICLE REGISTRATION FORM */}
      {activeTab === 'vehicle' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Cab, Taxi, Traveler, Auto Rickshaw & Fleet Registration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your Driving License, Vehicle Registration Certificate (RC), and Route for admin approval.
            </p>
          </div>

          <form onSubmit={handleSubmitVehicleForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Vehicle Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Vehicle Service Type *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t} className="text-slate-900 font-semibold">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Plate Number */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Vehicle Plate / Reg No. (RC) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ML-08-A-4592"
                  value={vehicleRegNo}
                  onChange={(e) => setVehicleRegNo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Vehicle Model & Year */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Vehicle Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maruti Suzuki Dzire Tour / Force Traveler"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Driving License No */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Driving License Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ML08 20190004512"
                  value={drivingLicenseNo}
                  onChange={(e) => setDrivingLicenseNo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Driver Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Driver / Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dilseng Sangma"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Driver Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Driver Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9123456780"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Operational Route */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Operational Route / Service Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tura to Guwahati Airport & Shillong (24x7)"
                  value={operationalRoute}
                  onChange={(e) => setOperationalRoute(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* PART 2: VEHICLE DRIVER PAYOUT DETAILS */}
            <div className="bg-blue-50/60 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
                <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-blue-950">
                    Driver Payout & Settlement Account (Paisa Pane Ka Account) *
                  </h3>
                  <p className="text-[11px] text-blue-800">
                    Online customer bookings & trip fare settlements is account mein aayenge.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" /> Driver Payout UPI ID * (Mandatory)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. driver@oksbi or 9123456780@paytm"
                  value={vehPayoutUpi}
                  onChange={(e) => setVehPayoutUpi(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={vehBankName}
                    onChange={(e) => setVehBankName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30219845123"
                    value={vehAccountNo}
                    onChange={(e) => setVehAccountNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0000198"
                    value={vehIfscCode}
                    onChange={(e) => setVehIfscCode(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Driving License (DL) Photo
                  </span>
                  {dlProofUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold">Uploaded ✓</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setDlProofUrl)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
                {dlProofUrl && (
                  <img
                    src={dlProofUrl}
                    alt="DL Preview"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-indigo-600" /> Vehicle Exterior Photo
                  </span>
                  {vehiclePhotoUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold">Uploaded ✓</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setVehiclePhotoUrl)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
                {vehiclePhotoUrl && (
                  <img
                    src={vehiclePhotoUrl}
                    alt="Vehicle Preview"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Vehicle for Admin Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MY SUBMISSION STATUS */}
      {activeTab === 'my_status' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              My Registered Businesses & Fleet Status
            </h2>
            <p className="text-xs text-slate-500">
              Track the admin approval status of your submitted local shops, taxis, and fleet vehicles.
            </p>

            {myShops.length === 0 && myVehicles.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl">
                <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No applications submitted yet</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Use the tabs above to submit your shop or commercial vehicle details.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-4 border rounded-2xl bg-slate-50 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{shop.shop_name}</span>
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                          Shop
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {shop.category} • License: {shop.shop_id_no} • Payout UPI: {shop.payout_upi_id || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        shop.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : shop.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {shop.status}
                    </span>
                  </div>
                ))}

                {myVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    className="p-4 border rounded-2xl bg-slate-50 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {veh.vehicle_model} ({veh.vehicle_reg_no})
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {veh.vehicle_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Route: {veh.operational_route} • Payout UPI: {veh.payout_upi_id || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        veh.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
