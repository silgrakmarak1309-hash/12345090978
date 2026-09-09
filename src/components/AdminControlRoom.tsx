import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  Users,
  Settings as SettingsIcon,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Eye,
  Trash2,
  Award,
  RefreshCw,
  Copy,
  Plus,
  Store,
  Car,
  FileCheck,
  FileText,
  Phone,
  MapPin,
  ShieldCheck,
  Bike,
  Truck,
  ShoppingBag,
  CreditCard,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import {
  Listing,
  RechargeRequest,
  UserProfile,
  AdminSetting,
  ShopRegistration,
  VehicleRegistration,
  DeliveryOrder,
  formatPrice,
} from '../types';
import { supabase } from '../lib/supabase';
import { formatWhatsAppUrl } from './ListingDetailModal';

interface AdminControlRoomProps {
  listings: Listing[];
  rechargeRequests: RechargeRequest[];
  profiles: UserProfile[];
  settings: AdminSetting[];
  shopRegistrations?: ShopRegistration[];
  vehicleRegistrations?: VehicleRegistration[];
  deliveryOrders?: DeliveryOrder[];
  onRefresh: () => void;
  onViewListing: (listing: Listing) => void;
  onUpdateListingStatus: (id: string, status: string, isFeatured?: boolean, isPro?: boolean) => void;
  onApproveRecharge: (req: RechargeRequest) => void;
  onRejectRecharge: (id: string) => void;
  onToggleUserPro: (profile: UserProfile) => void;
  onUpdateUserRole: (id: string, newRole: string) => void;
  onUpdateDeliveryPartner?: (
    userId: string,
    isDeliveryPartner: boolean,
    partnerStatus: string,
    vehicleType?: string,
    vehicleNumber?: string
  ) => void;
  onSaveSetting: (key: string, value: string) => void;
  onApproveShopRegistration?: (id: string) => void;
  onRejectShopRegistration?: (id: string, reason?: string) => void;
  onApproveVehicleRegistration?: (id: string) => void;
  onRejectVehicleRegistration?: (id: string, reason?: string) => void;
  onVerifyOrderPayment?: (orderId: string, isApproved: boolean) => void;
}

export const AdminControlRoom: React.FC<AdminControlRoomProps> = ({
  listings,
  rechargeRequests,
  profiles,
  settings,
  shopRegistrations = [],
  vehicleRegistrations = [],
  deliveryOrders = [],
  onRefresh,
  onViewListing,
  onUpdateListingStatus,
  onApproveRecharge,
  onRejectRecharge,
  onToggleUserPro,
  onUpdateUserRole,
  onUpdateDeliveryPartner,
  onSaveSetting,
  onApproveShopRegistration,
  onRejectShopRegistration,
  onApproveVehicleRegistration,
  onRejectVehicleRegistration,
  onVerifyOrderPayment,
}) => {
  const [adminTab, setAdminTab] = useState<
    'listings' | 'orders_verification' | 'registrations' | 'recharges' | 'members' | 'settings'
  >('orders_verification');
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('pending');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending_verification' | 'verified' | 'delivered' | 'rejected'>('pending_verification');
  const [rechargeFilter, setRechargeFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [regFilter, setRegFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [regTypeFilter, setRegTypeFilter] = useState<'all' | 'shops' | 'vehicles'>('all');
  const [regSearch, setRegSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [inspectDocUrl, setInspectDocUrl] = useState<string | null>(null);
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'users' | 'delivery_partners' | 'admins'>('all');
  const [userSearch, setUserSearch] = useState('');

  // Local settings editor state
  const upiSetting =
    settings.find((s) => s.key === 'upi_id' || s.key === 'admin_upi_id')?.value ||
    'merilocalbazaar@oksbi';
  const qrSetting =
    settings.find((s) => s.key === 'qr_code_url' || s.key === 'admin_qr_url')?.value ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiSetting}`;
  const appAlertSetting =
    settings.find((s) => s.key === 'app_broadcast_alert')?.value ||
    'Welcome to Meri Local Bazaar Admin Verified Platform';

  const [editUpi, setEditUpi] = useState(upiSetting);
  const [editQr, setEditQr] = useState(qrSetting);
  const [editAlert, setEditAlert] = useState(appAlertSetting);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Filtered Listings
  const filteredListings = listings.filter((l) => {
    if (listingFilter === 'all') return true;
    return l.status === listingFilter;
  });

  const pendingListingsCount = listings.filter((l) => l.status === 'pending').length;
  const pendingOrdersCount = deliveryOrders.filter(
    (o) => o.payment_status === 'pending_verification' || o.status === 'pending_verification'
  ).length;
  const pendingRechargesCount = rechargeRequests.filter((r) => r.status === 'pending').length;
  const pendingShopsCount = shopRegistrations.filter((s) => s.status === 'pending').length;
  const pendingVehiclesCount = vehicleRegistrations.filter((v) => v.status === 'pending').length;
  const totalPendingRegistrations = pendingShopsCount + pendingVehiclesCount;

  // Filtered Orders
  const filteredOrders = deliveryOrders.filter((o) => {
    if (orderFilter !== 'all') {
      if (orderFilter === 'pending_verification') {
        if (o.payment_status !== 'pending_verification' && o.status !== 'pending_verification')
          return false;
      } else if (orderFilter === 'verified') {
        if (o.payment_status !== 'verified' && o.status !== 'pending' && o.status !== 'out_for_delivery')
          return false;
      } else if (orderFilter === 'delivered') {
        if (o.status !== 'delivered') return false;
      } else if (orderFilter === 'rejected') {
        if (o.status !== 'rejected' && o.payment_status !== 'rejected') return false;
      }
    }

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.customer_phone?.includes(q) ||
        o.transaction_id?.toLowerCase().includes(q) ||
        o.item_description?.toLowerCase().includes(q) ||
        o.pickup_address?.toLowerCase().includes(q) ||
        o.delivery_address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Recharges
  const filteredRecharges = rechargeRequests.filter((r) => {
    if (rechargeFilter === 'all') return true;
    return r.status === rechargeFilter;
  });

  // Filtered Registrations (Shops & Vehicles)
  const filteredShops = shopRegistrations.filter((s) => {
    if (regFilter !== 'all' && s.status !== regFilter) return false;
    if (regSearch) {
      const q = regSearch.toLowerCase();
      return (
        s.shop_name.toLowerCase().includes(q) ||
        s.owner_name.toLowerCase().includes(q) ||
        s.shop_id_no.toLowerCase().includes(q) ||
        s.user_phone.includes(q)
      );
    }
    return true;
  });

  const filteredVehicles = vehicleRegistrations.filter((v) => {
    if (regFilter !== 'all' && v.status !== regFilter) return false;
    if (regSearch) {
      const q = regSearch.toLowerCase();
      return (
        v.vehicle_reg_no.toLowerCase().includes(q) ||
        v.driver_name.toLowerCase().includes(q) ||
        v.driving_license_no.toLowerCase().includes(q) ||
        v.driver_phone.includes(q) ||
        v.vehicle_model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    if (
      userRoleFilter === 'users' &&
      (p.role === 'admin' ||
        p.role === 'super_admin' ||
        p.role === 'delivery_partner' ||
        p.is_delivery_partner)
    )
      return false;
    if (userRoleFilter === 'admins' && p.role !== 'admin' && p.role !== 'super_admin') return false;
    if (
      userRoleFilter === 'delivery_partners' &&
      p.role !== 'delivery_partner' &&
      !p.is_delivery_partner
    )
      return false;

    const q = userSearch.toLowerCase();
    return (
      (p.full_name && p.full_name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.vehicle_number && p.vehicle_number.toLowerCase().includes(q)) ||
      (p.vehicle_type && p.vehicle_type.toLowerCase().includes(q)) ||
      (p.payout_upi_id && p.payout_upi_id.toLowerCase().includes(q))
    );
  });

  const handleSaveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await onSaveSetting('upi_id', editUpi);
      await onSaveSetting('admin_upi_id', editUpi);
      await onSaveSetting('qr_code_url', editQr);
      await onSaveSetting('admin_qr_url', editQr);
      await onSaveSetting('app_broadcast_alert', editAlert);
      setSettingsSavedSuccess(true);
      setTimeout(() => setSettingsSavedSuccess(false), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Dashboard Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">Admin Control Room</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  100% Prepaid Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized moderation & authorization hub for Meri Local Bazaar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync DB
            </button>
          </div>
        </div>

        {/* Core Admin 6 Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setAdminTab('orders_verification')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'orders_verification'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Orders Pay
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">{deliveryOrders.length} Orders</div>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('listings')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'listings'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold">1. Post Listings</div>
              <div className="text-[11px] opacity-80 mt-0.5">{listings.length} Listings</div>
            </div>
            {pendingListingsCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                {pendingListingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('registrations')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'registrations'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold">2. Registrations</div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {shopRegistrations.length + vehicleRegistrations.length} Shops/Fleets
              </div>
            </div>
            {totalPendingRegistrations > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                {totalPendingRegistrations}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('recharges')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'recharges'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold">3. Recharges</div>
              <div className="text-[11px] opacity-80 mt-0.5">{rechargeRequests.length} Payments</div>
            </div>
            {pendingRechargesCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                {pendingRechargesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('members')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'members'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold">4. Partners & Users</div>
              <div className="text-[11px] opacity-80 mt-0.5">{profiles.length} Accounts</div>
            </div>
            <Users className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`p-3 rounded-2xl text-left transition flex items-center justify-between ${
              adminTab === 'settings'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold">5. QR & UPI</div>
              <div className="text-[11px] opacity-80 mt-0.5">Admin Settings</div>
            </div>
            <SettingsIcon className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>

      {/* FULL DOCUMENT / PAYMENT SCREENSHOT INSPECT MODAL */}
      {inspectDocUrl && (
        <div
          onClick={() => setInspectDocUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Payment & Verification Proof Inspector
              </span>
              <button
                onClick={() => setInspectDocUrl(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 rounded-2xl p-2 flex items-center justify-center">
              <img
                src={inspectDocUrl}
                alt="Document proof inspection"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="text-center">
              <a
                href={inspectDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open original image in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 0: ORDER & ADVANCE PAYMENT VERIFICATION PANEL (NEW PART 1 & 3) */}
      {/* ========================================================================= */}
      {adminTab === 'orders_verification' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                Customer Order Advance Payment Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect Buyer Transaction ID (UTR) and Payment Screenshot before verifying orders for Delivery Partner dispatch.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(
                [
                  { id: 'pending_verification', label: 'Pending Verif' },
                  { id: 'verified', label: 'Verified / Active' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'rejected', label: 'Rejected' },
                  { id: 'all', label: 'All Orders' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    orderFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order No (ORD-...), Customer Name, Phone, Transaction ID / UTR, Address..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-600">No orders found</div>
              <p className="text-xs text-slate-400 mt-0.5">
                {orderFilter === 'pending_verification'
                  ? 'All customer prepaid advance payments have been verified!'
                  : 'Try selecting a different filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const isPendingVerif =
                  ord.payment_status === 'pending_verification' || ord.status === 'pending_verification';

                return (
                  <div
                    key={ord.id}
                    className={`border rounded-2xl p-4 sm:p-5 transition shadow-xs ${
                      isPendingVerif
                        ? 'bg-amber-50/50 border-amber-300/80 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Order & Customer Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded-md">
                            {ord.order_number}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              ord.payment_status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.payment_status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            Payment: {ord.payment_status || 'pending_verification'}
                          </span>

                          <span className="bg-slate-800 text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Status: {ord.status}
                          </span>

                          {ord.fulfillment_type === 'self_pickup' && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Self-Pickup
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-slate-900 text-base">
                          {ord.item_description}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="font-bold text-slate-800">Customer:</span>{' '}
                            <span>{ord.customer_name}</span> ({ord.customer_phone})
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">Delivery Fare:</span>{' '}
                            <span className="font-mono font-black text-emerald-600">₹{ord.total_fare}</span>{' '}
                            <span className="text-[10px] text-slate-400">
                              (Rider: ₹{ord.partner_earning} / App: ₹{ord.app_commission})
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">Route:</span>{' '}
                            <span className="truncate">{ord.pickup_address} ➔ {ord.delivery_address}</span>
                          </div>
                        </div>

                        {/* Transaction ID & Screenshot */}
                        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">Bank UTR / Trans ID:</span>
                            <span className="font-mono font-black text-orange-600 bg-white px-2 py-0.5 rounded border border-slate-200 select-all">
                              {ord.transaction_id || 'Not provided'}
                            </span>
                          </div>

                          {ord.payment_screenshot_url && (
                            <button
                              onClick={() => setInspectDocUrl(ord.payment_screenshot_url || null)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition flex items-center gap-1.5 shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-orange-600" />
                              Inspect Payment Screenshot
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Verification Buttons */}
                      <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {isPendingVerif ? (
                          <>
                            <button
                              onClick={() => onVerifyOrderPayment?.(ord.id, true)}
                              className="flex-1 lg:w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              ✓ Approve & Verify
                            </button>
                            <button
                              onClick={() => onVerifyOrderPayment?.(ord.id, false)}
                              className="flex-1 lg:w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              ✕ Reject Payment
                            </button>
                          </>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                              ✓ Verified by Admin
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: LISTINGS MODERATION */}
      {/* ========================================================================= */}
      {adminTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Marketplace Classifieds Listings</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve community posts before they appear on the public feed.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['pending', 'active', 'rejected', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setListingFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    listingFilter === f
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={
                      item.images_json ||
                      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.is_featured && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                          ⭐ FEATURED
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-emerald-600">₹{formatPrice(item.price)}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Seller: {item.seller_name || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{item.location_name || 'Meghalaya'}</span>
                      <span>•</span>
                      <span>Cat: {item.category_name}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewListing(item)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition"
                  >
                    View Details
                  </button>
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onUpdateListingStatus(item.id, 'active')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => onUpdateListingStatus(item.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SHOPS & VEHICLE REGISTRATIONS */}
      {/* ========================================================================= */}
      {adminTab === 'registrations' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Business & Fleet Verification Requests
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect Shop Trade Licenses, GSTIN, and Driver Driving Licenses (DL & RC).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setRegTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    regTypeFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({shopRegistrations.length + vehicleRegistrations.length})
                </button>
                <button
                  onClick={() => setRegTypeFilter('shops')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    regTypeFilter === 'shops'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Shops ({shopRegistrations.length})
                </button>
                <button
                  onClick={() => setRegTypeFilter('vehicles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    regTypeFilter === 'vehicles'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vehicles ({vehicleRegistrations.length})
                </button>
              </div>
            </div>
          </div>

          {/* Registrations List */}
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base">{shop.shop_name}</span>
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Shop: {shop.category}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        <strong>License ({shop.shop_id_proof_type}):</strong>{' '}
                        <span className="font-mono text-orange-700 font-bold">{shop.shop_id_no}</span>
                      </div>
                      <div>
                        <strong>Owner ({shop.owner_id_type}):</strong>{' '}
                        <span>{shop.owner_name}</span> ({shop.user_phone})
                      </div>
                      <div>
                        <strong>Address:</strong> <span>{shop.shop_address}</span>
                      </div>
                      <div>
                        <strong>Payout UPI:</strong>{' '}
                        <span className="font-mono text-emerald-700 font-bold">
                          {shop.payout_upi_id || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {shop.owner_id_proof_url && (
                    <button
                      onClick={() => setInspectDocUrl(shop.owner_id_proof_url || null)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-600" />
                      Doc Proof
                    </button>
                  )}
                  {shop.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApproveShopRegistration?.(shop.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => onRejectShopRegistration?.(shop.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filteredVehicles.map((veh) => (
              <div
                key={veh.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base">
                        {veh.vehicle_model} ({veh.vehicle_reg_no})
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {veh.vehicle_type}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div>
                        <strong>Driver:</strong> <span>{veh.driver_name}</span> ({veh.driver_phone})
                      </div>
                      <div>
                        <strong>DL No:</strong>{' '}
                        <span className="font-mono text-blue-700 font-bold">{veh.driving_license_no}</span>
                      </div>
                      <div>
                        <strong>Route:</strong> <span>{veh.operational_route}</span>
                      </div>
                      <div>
                        <strong>Payout UPI:</strong>{' '}
                        <span className="font-mono text-emerald-700 font-bold">
                          {veh.payout_upi_id || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {veh.driving_license_proof_url && (
                    <button
                      onClick={() => setInspectDocUrl(veh.driving_license_proof_url || null)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      DL Proof
                    </button>
                  )}
                  {veh.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApproveVehicleRegistration?.(veh.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => onRejectVehicleRegistration?.(veh.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECHARGE REQUESTS */}
      {/* ========================================================================= */}
      {adminTab === 'recharges' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">VIP PRO Membership Upgrades</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify customer UTR payments for VIP badge & featured ad boosts.
              </p>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRechargeFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    rechargeFilter === f
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredRecharges.map((req) => (
              <div
                key={req.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{req.user_name}</span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ({req.user_phone})
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>Plan: <strong>{req.plan_name}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold font-mono">₹{req.amount}</span>
                    <span>•</span>
                    <span>UTR: <strong className="font-mono text-orange-600 select-all">{req.utr}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApproveRecharge(req)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✓ Activate PRO
                      </button>
                      <button
                        onClick={() => onRejectRecharge(req.id)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PARTNERS & USERS DIRECTORY */}
      {/* ========================================================================= */}
      {adminTab === 'members' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Community Members & Delivery Partner Fleet Directory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect registered users, riders, bank payout UPI accounts, and assign permissions.
              </p>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'delivery_partners', label: 'Delivery Fleet' },
                  { id: 'users', label: 'Users' },
                  { id: 'admins', label: 'Admins' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setUserRoleFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    userRoleFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredProfiles.map((p) => {
              const isPartner = p.is_delivery_partner || p.role === 'delivery_partner';

              return (
                <div
                  key={p.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {p.full_name || 'Anonymous User'}
                      </span>
                      {p.is_pro && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> PRO Member
                        </span>
                      )}
                      {isPartner && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Rider: {p.vehicle_type || 'Bike'} ({p.partner_status})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                      <div>
                        <strong>Phone:</strong> {p.phone || 'N/A'} • <strong>Email:</strong> {p.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Payout UPI:</strong>{' '}
                        <span className="font-mono text-emerald-700 font-bold">
                          {p.payout_upi_id || 'Not registered'}
                        </span>
                      </div>
                      {p.payout_bank_name && (
                        <div>
                          <strong>Bank:</strong> {p.payout_bank_name} • <strong>A/C:</strong>{' '}
                          {p.payout_account_no} • <strong>IFSC:</strong> {p.payout_ifsc_code}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPartner && p.partner_status === 'pending' && (
                      <button
                        onClick={() =>
                          onUpdateDeliveryPartner?.(
                            p.id,
                            true,
                            'approved',
                            p.vehicle_type,
                            p.vehicle_number
                          )
                        }
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        ✓ Approve Rider
                      </button>
                    )}
                    <button
                      onClick={() => onToggleUserPro(p)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition"
                    >
                      {p.is_pro ? 'Remove PRO' : 'Grant PRO'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ADMIN CONFIGURATION & QR */}
      {/* ========================================================================= */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Admin Payment & QR Configuration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the centralized Admin UPI ID and Dynamic QR Code used for customer advance checkout payments & PRO recharges.
            </p>
          </div>

          <form onSubmit={handleSaveAllSettings} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Central Admin UPI ID *
              </label>
              <input
                type="text"
                required
                value={editUpi}
                onChange={(e) => setEditUpi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Dynamic UPI Payment QR Code Image URL *
              </label>
              <input
                type="text"
                required
                value={editQr}
                onChange={(e) => setEditQr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* QR Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
              <img
                src={
                  editQr ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${editUpi}`
                }
                alt="QR Preview"
                className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 object-contain"
              />
              <div>
                <div className="text-xs font-bold text-slate-800">Live QR Preview</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Payable to: <span className="font-mono text-orange-600 font-bold">{editUpi}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <SettingsIcon className="w-4 h-4" />
                {savingSettings ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
