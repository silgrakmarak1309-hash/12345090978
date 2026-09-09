import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Bike,
  Save,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface AccountSecurityProps {
  currentUser: UserProfile;
  onUpgradeClick: () => void;
  onSignOut?: () => void;
  onUpdateDeliveryPartner?: (
    userId: string,
    isDeliveryPartner: boolean,
    partnerStatus: string,
    vehicleType?: string,
    vehicleNumber?: string
  ) => void;
}

export const AccountSecurity: React.FC<AccountSecurityProps> = ({
  currentUser,
  onUpgradeClick,
  onSignOut,
  onUpdateDeliveryPartner,
}) => {
  const [editingPartner, setEditingPartner] = useState(false);
  const [isPartner, setIsPartner] = useState(currentUser.is_delivery_partner || currentUser.role === 'delivery_partner');
  const [vehicleType, setVehicleType] = useState(currentUser.vehicle_type || 'Bike');
  const [vehicleNumber, setVehicleNumber] = useState(currentUser.vehicle_number || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSavePartnerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDeliveryPartner?.(
      currentUser.id,
      isPartner,
      currentUser.partner_status || 'pending',
      vehicleType,
      vehicleNumber
    );
    setSavedMessage(true);
    setEditingPartner(false);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name || 'User'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-2xl shrink-0">
                {currentUser.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.full_name || 'User'}</h2>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {currentUser.role}
                </span>
                {currentUser.is_delivery_partner && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Bike className="w-3 h-3" /> Delivery Partner
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {currentUser.is_pro ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                ⭐ PRO Membership Active
              </span>
            ) : (
              <button
                onClick={onUpgradeClick}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow hover:from-amber-600 hover:to-orange-600 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Upgrade to PRO
              </button>
            )}

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 transition flex items-center gap-1 text-xs font-bold"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Registered Email
            </div>
            <div className="text-sm font-semibold text-slate-800">{currentUser.email}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact Phone
            </div>
            <div className="text-sm font-semibold text-slate-800">{currentUser.phone || '+91 9876543210'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account Security Status
            </div>
            <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Device Bound & Verified
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> PRO Status Expiry
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {currentUser.is_pro ? (currentUser.pro_expiry ? String(currentUser.pro_expiry) : '365 Days Active') : 'No Active Subscription'}
            </div>
          </div>
        </div>

        {/* DELIVERY PARTNER ROLES & VEHICLE SECTION */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delivery Partner Profile</h3>
                <p className="text-[11px] text-slate-500">Local parcel, food & grocery delivery partner role in Meri Local Bazaar</p>
              </div>
            </div>

            {!editingPartner && (
              <button
                onClick={() => setEditingPartner(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                {currentUser.is_delivery_partner ? 'Edit Vehicle Info' : 'Join as Delivery Partner'}
              </button>
            )}
          </div>

          {savedMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Delivery partner vehicle details saved successfully!</span>
            </div>
          )}

          {!editingPartner ? (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Partner Status</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      currentUser.partner_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentUser.partner_status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentUser.partner_status || (currentUser.is_delivery_partner ? 'pending' : 'Not Registered')}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Vehicle Type</div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {currentUser.vehicle_type || 'Not Assigned (Bike / Scooty / Auto)'}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Vehicle Plate No</div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                  {currentUser.vehicle_number || 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSavePartnerInfo} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_partner_checkbox"
                  checked={isPartner}
                  onChange={(e) => setIsPartner(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <label htmlFor="is_partner_checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Activate Delivery Partner (is_delivery_partner = TRUE)
                </label>
              </div>

              {isPartner && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Bike">Bike (Motorcycle)</option>
                      <option value="Scooty">Scooty</option>
                      <option value="Auto">Auto Rickshaw</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Vehicle Number (Plate No) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ML-08-A-4592"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPartner(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Delivery Info
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

