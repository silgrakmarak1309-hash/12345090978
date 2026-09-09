export interface Listing {
  id: string;
  title: string;
  category_id?: string;
  category_name?: string;
  location_id?: string;
  location_name?: string;
  state_name?: string;
  price: number;
  condition?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  images_json?: string;
  is_featured?: boolean;
  is_pro?: boolean;
  is_heavy_item?: boolean;
  status: 'pending' | 'active' | 'rejected' | string;
  seller_id?: string;
  seller_name?: string;
  seller_verified?: boolean;
  views_count?: number;
  created_at?: string | number;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  google_id?: string;
  city?: string;
  role: 'admin' | 'super_admin' | 'user' | 'delivery_partner' | string;
  is_pro: boolean;
  pro_status?: 'active' | 'inactive' | string;
  pro_expiry?: string | number;
  hardware_locked?: boolean;
  is_delivery_partner?: boolean;
  vehicle_type?: 'Bike' | 'Scooty' | 'Auto' | 'Commercial Auto' | string;
  vehicle_number?: string;
  partner_status?: 'pending' | 'approved' | 'rejected' | string;
  wallet_balance?: number;
  payout_upi_id?: string;
  payout_bank_name?: string;
  payout_account_no?: string;
  payout_ifsc_code?: string;
  payout_qr_image_url?: string;
  created_at?: string | number;
}

export interface DeliveryOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  pickup_address: string;
  delivery_address: string;
  item_description: string;
  listing_id?: string;
  listing_title?: string;
  listing_image?: string;
  product_price?: number;
  delivery_fee?: number;
  total_fare: number;
  total_paid?: number;
  weight_kg: number;
  distance_km: number;
  terrain_type: 'Plain' | 'Hill (5km/L)' | string;
  app_commission: number; // 20%
  partner_earning: number; // 80%
  payment_method?: 'online_upi' | 'advance_qr' | string;
  payment_status?: 'pending_verification' | 'approved' | 'verified' | 'rejected' | string;
  transaction_id?: string; // UTR Number
  payment_screenshot_url?: string;
  is_heavy_item?: boolean;
  fulfillment_type?: 'home_delivery' | 'self_pickup' | string;
  seller_name?: string;
  seller_phone?: string;
  seller_upi?: string;
  status: 'pending' | 'pending_verification' | 'verified' | 'payment_verified' | 'out_for_delivery' | 'delivered' | 'ready_for_pickup' | 'picked_up' | 'rejected' | 'cancelled' | string;
  delivery_partner_id?: string;
  delivery_partner_name?: string;
  delivery_partner_phone?: string;
  created_at: string;
  payment_verified_at?: string;
  accepted_at?: string;
  delivered_at?: string;
  rejection_reason?: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_role: string;
  amount: number;
  upi_id: string;
  bank_name?: string;
  account_no?: string;
  ifsc_code?: string;
  qr_code_url?: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  completed_at?: string;
  admin_notes?: string;
}

export const HEAVY_CATEGORIES = [
  'Cars & Vehicles',
  'Vehicles',
  'Bikes & Scooters',
  'Commercial Vehicles',
  'Vehicle Rental & Taxi',
  'Property & Real Estate',
  'Furniture & Home',
  'Large Home Appliances',
  'Heavy Machinery & Tools',
];

export function isHeavyItemCategory(categoryName?: string, title?: string): boolean {
  if (!categoryName && !title) return false;
  const lower = `${categoryName || ''} ${title || ''}`.toLowerCase();
  return (
    lower.includes('car') ||
    lower.includes('bike') ||
    lower.includes('scooter') ||
    lower.includes('vehicle') ||
    lower.includes('motorcycle') ||
    lower.includes('enfield') ||
    lower.includes('bullet') ||
    lower.includes('auto rickshaw') ||
    lower.includes('tempo') ||
    lower.includes('traveler') ||
    lower.includes('taxi') ||
    lower.includes('property') ||
    lower.includes('land') ||
    lower.includes('plot') ||
    lower.includes('furniture') ||
    lower.includes('sofa') ||
    lower.includes('bed') ||
    lower.includes('wardrobe') ||
    lower.includes('refrigerator') ||
    lower.includes('washing machine') ||
    lower.includes('almirah')
  );
}

export function calculateDeliveryFare(
  weightKg: number,
  distanceKm: number,
  terrain: 'Plain' | 'Hill (5km/L)'
): {
  totalFare: number;
  appCommission: number;
  partnerEarning: number;
} {
  const wt = Math.max(0, weightKg);
  const km = Math.max(0, distanceKm);
  let totalFare = 0;

  if (terrain === 'Hill (5km/L)') {
    // Hill (5km/L): Total = 30 + (wt * 10) + (km * 25)
    totalFare = 30 + wt * 10 + km * 25;
  } else {
    // Plain: Total = 20 + (wt * 5) + (km * 12)
    totalFare = 20 + wt * 5 + km * 12;
  }

  const appCommission = Math.round(totalFare * 0.2 * 100) / 100; // 20%
  const partnerEarning = Math.round((totalFare - appCommission) * 100) / 100; // 80%

  return {
    totalFare,
    appCommission,
    partnerEarning,
  };
}

export interface RechargeRequest {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  plan_name: string;
  amount: number;
  utr: string;
  screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  is_top_pro: boolean;
  listing_id?: string;
  listing_title?: string;
  created_at: string | number;
  approved_at?: string | number;
  admin_notes?: string;
}

export interface AdminSetting {
  id?: number | string;
  key: string;
  value: string;
  description?: string;
  updated_at?: string | number;
}

export interface ProPlan {
  id: string;
  name: string;
  price: number; // Total billed price (e.g., 199, 507, 894, 1440)
  monthlyPrice: number; // Per-month calculated equivalent (e.g., 199, 169, 149, 120)
  durationMonths: number;
  durationDays: number;
  durationLabel: string;
  billingSubtext: string;
  tag: string;
  boosts?: string;
  isBestValue?: boolean;
  isPopular?: boolean;
  isTopPro?: boolean;
  badge?: string;
  features: string[];
}

export interface ShopRegistration {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  shop_name: string;
  category: string;
  shop_id_proof_type: 'Trade License' | 'GSTIN' | 'Local Council Reg' | 'Shop Act / Other' | string;
  shop_id_no: string;
  owner_name: string;
  owner_id_type: 'Aadhaar Card' | 'Voter ID' | 'PAN Card' | 'Passport' | string;
  owner_id_no: string;
  owner_id_proof_url?: string;
  shop_address: string;
  city_locality: string;
  shop_banner_url?: string;
  description?: string;
  opening_hours?: string;
  payout_upi_id?: string;
  payout_bank_name?: string;
  payout_account_no?: string;
  payout_ifsc_code?: string;
  payout_qr_image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  rejection_reason?: string;
  created_at: string;
  verified_at?: string;
}

export interface VehicleRegistration {
  id: string;
  user_id: string;
  driver_name: string;
  driver_phone: string;
  driver_whatsapp?: string;
  driver_email?: string;
  vehicle_type: 'Local Cab / Taxi' | 'Traveler (12-26 Seater)' | 'Auto Rickshaw' | 'Commercial Bike' | 'Pickup / Commercial Van' | string;
  vehicle_reg_no: string;
  vehicle_model: string;
  vehicle_year?: string;
  driving_license_no: string;
  driving_license_proof_url?: string;
  vehicle_rc_no?: string;
  vehicle_rc_proof_url?: string;
  vehicle_photo_url?: string;
  operational_route: string;
  daily_rate_or_fare?: string;
  payout_upi_id?: string;
  payout_bank_name?: string;
  payout_account_no?: string;
  payout_ifsc_code?: string;
  payout_qr_image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  rejection_reason?: string;
  created_at: string;
  verified_at?: string;
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return '0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN');
}
