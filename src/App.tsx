import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Plus,
  Tag,
  CreditCard,
  User,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Store,
  Car,
  FileCheck,
  Bike,
  Truck,
  Package,
  LogIn,
  LogOut,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import {
  Listing,
  RechargeRequest,
  UserProfile,
  AdminSetting,
  ShopRegistration,
  VehicleRegistration,
  DeliveryOrder,
} from './types';
import { AdminControlRoom } from './components/AdminControlRoom';
import { UserMarketplace } from './components/UserMarketplace';
import { ListingSubmissionView } from './components/ListingSubmissionView';
import { MyAdsManagement } from './components/MyAdsManagement';
import { TransactionLogs } from './components/TransactionLogs';
import { AccountSecurity } from './components/AccountSecurity';
import { ProUpgradeView } from './components/ProUpgradeView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BusinessVehicleRegistrationView } from './components/BusinessVehicleRegistrationView';
import { DeliveryPartnerRegistration } from './components/DeliveryPartnerRegistration';
import { DeliveryPartnerDashboard } from './components/DeliveryPartnerDashboard';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { LoginScreen } from './components/LoginScreen';
import { CheckoutModal } from './components/CheckoutModal';

// Resilient initial data for fast load & offline fallback
const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'ad_101',
    title: 'Apple iPhone 14 Pro Max (128GB Deep Purple)',
    category_name: 'Mobiles & Gadgets',
    location_name: 'Tura, Meghalaya',
    state_name: 'Meghalaya',
    price: 68000,
    condition: 'Used - Like New',
    description: '100% battery health, Indian invoice available with Apple box and lightning cable.',
    phone: '9876543210',
    whatsapp: '9876543210',
    images_json: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: true,
    status: 'active',
    seller_id: 'usr_admin',
    seller_name: 'Silgrak Marak',
    seller_verified: true,
    views_count: 142,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ad_102',
    title: 'Royal Enfield Hunter 350 Dapper Ash (2023)',
    category_name: 'Vehicles',
    location_name: 'Shillong, Meghalaya',
    state_name: 'Meghalaya',
    price: 135000,
    condition: 'Used - Like New',
    description: 'Single owner, only 4,500 kms driven, comprehensive insurance valid till 2028.',
    phone: '9123456780',
    whatsapp: '9123456780',
    images_json: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: true,
    status: 'active',
    seller_id: 'usr_seller2',
    seller_name: 'Dilseng Sangma',
    seller_verified: true,
    views_count: 45,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ad_103',
    title: 'Commercial Land / Plot 5000 Sqft near Main Road',
    category_name: 'Property & Real Estate',
    location_name: 'Williamnagar, Meghalaya',
    state_name: 'Meghalaya',
    price: 1850000,
    condition: 'Brand New',
    description: 'Prime commercial plot with clear title deed, road touch, ideal for warehouse or commercial complex.',
    phone: '9862012345',
    whatsapp: '9862012345',
    images_json: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    is_featured: false,
    is_pro: false,
    status: 'active',
    seller_id: 'usr_seller3',
    seller_name: 'Tengkim Momin',
    seller_verified: false,
    views_count: 18,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ad_104',
    title: 'Tura to Guwahati & Shillong 24x7 AC Cab Service',
    category_name: 'Local Cab & Taxi',
    location_name: 'Tura, Meghalaya',
    state_name: 'Meghalaya',
    price: 2500,
    condition: 'Verified Service',
    description: 'Comfortable Dzire & Ertiga cabs for local dropping, airport transfers to Guwahati and Shillong round trips with experienced local driver.',
    phone: '9876543210',
    whatsapp: '9876543210',
    images_json: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: true,
    status: 'active',
    seller_id: 'usr_admin',
    seller_name: 'Silgrak Marak',
    seller_verified: true,
    views_count: 89,
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'ad_105',
    title: 'Luxury Force Traveler 17-Seater for Tour & Wedding Trips',
    category_name: 'Travelers & Tour',
    location_name: 'Shillong, Meghalaya',
    state_name: 'Meghalaya',
    price: 6500,
    condition: 'Verified Service',
    description: 'Fully AC 17-seater Tempo Traveler with pushback seats, music system, and roof carrier. Available for Kaziranga, Cherrapunji, Dawki and Meghalaya tours.',
    phone: '9123456780',
    whatsapp: '9123456780',
    images_json: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: true,
    status: 'active',
    seller_id: 'usr_seller2',
    seller_name: 'Dilseng Sangma',
    seller_verified: true,
    views_count: 64,
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 'ad_106',
    title: 'Daily Auto Rickshaw & Local Bike Parcel / Ride Service',
    category_name: 'Bike & Auto Rickshaw',
    location_name: 'Tura Market, Meghalaya',
    state_name: 'Meghalaya',
    price: 150,
    condition: 'Verified Service',
    description: 'Quick local bazaar pickup, parcel delivery, and passenger auto service across Tura market, Dobasipara, and New Tura areas.',
    phone: '9862012345',
    whatsapp: '9862012345',
    images_json: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    is_featured: false,
    is_pro: false,
    status: 'active',
    seller_id: 'usr_seller3',
    seller_name: 'Tengkim Momin',
    seller_verified: false,
    views_count: 32,
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'ad_107',
    title: 'Marak Traders Retail & Wholesale Grocery Store',
    category_name: 'Shops',
    location_name: 'Supermarket, Tura',
    state_name: 'Meghalaya',
    price: 50,
    condition: 'Verified Shop',
    description: 'All kinds of daily groceries, fresh organic Garo Hills spices, packaged food, and household provisions at wholesale rates.',
    phone: '9876543210',
    whatsapp: '9876543210',
    images_json: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: true,
    status: 'active',
    seller_id: 'usr_admin',
    seller_name: 'Silgrak Marak',
    seller_verified: true,
    views_count: 58,
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'ad_108',
    title: 'Certified Home Electrician, Inverter & Plumbing Service',
    category_name: 'Local Jobs & Services',
    location_name: 'Hawakhana, Tura',
    state_name: 'Meghalaya',
    price: 350,
    condition: 'Verified Professional',
    description: '24x7 local electrical wiring, short circuit fixes, fan/geyser repair, and pipeline plumbing services with warranty.',
    phone: '9123456780',
    whatsapp: '9123456780',
    images_json: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    is_featured: true,
    is_pro: false,
    status: 'active',
    seller_id: 'usr_seller2',
    seller_name: 'Dilseng Sangma',
    seller_verified: true,
    views_count: 73,
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
];

const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'usr_admin',
    full_name: 'Silgrak Marak (Admin)',
    email: 'merilocalbazaar@gmail.com',
    phone: '9876543210',
    role: 'admin',
    is_pro: true,
    pro_status: 'active',
    pro_expiry: '2028-12-31',
    hardware_locked: true,
    is_delivery_partner: false,
    partner_status: 'approved',
  },
  {
    id: 'usr_seller2',
    full_name: 'Dilseng Sangma',
    email: 'dilseng@gmail.com',
    phone: '9123456780',
    role: 'delivery_partner',
    is_pro: true,
    pro_status: 'active',
    pro_expiry: '2026-10-15',
    hardware_locked: true,
    is_delivery_partner: true,
    vehicle_type: 'Auto',
    vehicle_number: 'ML-08-A-4592',
    partner_status: 'approved',
  },
  {
    id: 'usr_seller3',
    full_name: 'Tengkim Momin',
    email: 'tengkim@gmail.com',
    phone: '9862012345',
    role: 'user',
    is_pro: false,
    pro_status: 'inactive',
    hardware_locked: true,
    is_delivery_partner: true,
    vehicle_type: 'Bike',
    vehicle_number: 'ML-08-B-7712',
    partner_status: 'pending',
  },
  {
    id: 'usr_rider4',
    full_name: 'Sengbat Sangma',
    email: 'sengbat@gmail.com',
    phone: '9774019823',
    role: 'delivery_partner',
    is_pro: false,
    pro_status: 'inactive',
    hardware_locked: true,
    is_delivery_partner: true,
    vehicle_type: 'Scooty',
    vehicle_number: 'ML-08-E-3390',
    partner_status: 'approved',
  },
];

const INITIAL_RECHARGES: RechargeRequest[] = [
  {
    id: 'rec_001',
    user_name: 'Dilseng Sangma',
    user_email: 'dilseng@gmail.com',
    user_phone: '9123456780',
    plan_name: '1 Month Plan (₹199)',
    amount: 199,
    utr: '423985712093',
    status: 'pending',
    is_top_pro: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'rec_002',
    user_name: 'Silgrak Marak',
    user_email: 'merilocalbazaar@gmail.com',
    user_phone: '9876543210',
    plan_name: '1 Year Plan (₹1,440)',
    amount: 1440,
    utr: '419827364512',
    status: 'approved',
    is_top_pro: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    approved_at: new Date(Date.now() - 86000000).toISOString(),
  },
];

const INITIAL_SETTINGS: AdminSetting[] = [
  { id: 1, key: 'upi_id', value: 'merilocalbazaar@oksbi' },
  { id: 2, key: 'admin_upi_id', value: 'merilocalbazaar@oksbi' },
  {
    id: 3,
    key: 'qr_code_url',
    value: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merilocalbazaar@oksbi',
  },
  {
    id: 4,
    key: 'app_broadcast_alert',
    value: 'Meri Local Bazaar - Verified Community Marketplace',
  },
];

const INITIAL_SHOP_REGISTRATIONS: ShopRegistration[] = [
  {
    id: 'shop_001',
    user_id: 'usr_admin',
    user_name: 'Silgrak Marak',
    user_phone: '9876543210',
    user_email: 'merilocalbazaar@gmail.com',
    shop_name: 'Garo Hills Organic Hub & Spices',
    category: 'Grocery & Daily Needs',
    shop_id_proof_type: 'Trade License',
    shop_id_no: 'TL-TURA-2024-8841',
    owner_name: 'Silgrak Marak',
    owner_id_type: 'Aadhaar Card',
    owner_id_no: '9823 4512 7789',
    owner_id_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    shop_address: 'Shop #4, Super Market Complex, Ring Road, Tura, Meghalaya - 794001',
    city_locality: 'Tura, West Garo Hills',
    shop_banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh organic spices, Garo sticky rice, ginger, and wild forest honey.',
    opening_hours: '8:30 AM - 7:30 PM (Mon-Sat)',
    payout_upi_id: 'silgrak@oksbi',
    status: 'approved',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    verified_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'shop_002',
    user_id: 'usr_seller3',
    user_name: 'Tengkim Momin',
    user_phone: '9862012345',
    user_email: 'tengkim@gmail.com',
    shop_name: 'Momin Mobile & Laptop Care',
    category: 'Electronics & Mobile Store',
    shop_id_proof_type: 'GSTIN',
    shop_id_no: '17AAACM1234F1Z9',
    owner_name: 'Tengkim Momin',
    owner_id_type: 'Voter ID',
    owner_id_no: 'WXY9821345',
    owner_id_proof_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    shop_address: 'Bazar Ghat Road, Near Police Point, Tura, Meghalaya',
    city_locality: 'Tura, Meghalaya',
    shop_banner_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    description: 'Smartphones, accessories, chip level repair and second hand gadgets.',
    opening_hours: '9:00 AM - 8:00 PM',
    payout_upi_id: 'tengkim@paytm',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

const INITIAL_VEHICLE_REGISTRATIONS: VehicleRegistration[] = [
  {
    id: 'veh_001',
    user_id: 'usr_seller2',
    driver_name: 'Dilseng Sangma',
    driver_phone: '9123456780',
    driver_whatsapp: '9123456780',
    driver_email: 'dilseng@gmail.com',
    vehicle_type: 'Local Cab / Taxi',
    vehicle_reg_no: 'ML-08-A-4592',
    vehicle_model: 'Maruti Suzuki Dzire (AC)',
    vehicle_year: '2023',
    driving_license_no: 'ML08 20190004512',
    driving_license_proof_url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&auto=format&fit=crop&q=80',
    vehicle_rc_no: 'ML08A4592',
    vehicle_photo_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
    operational_route: 'Tura to Guwahati Airport & Local Tura Trips (24x7)',
    daily_rate_or_fare: '₹3,500 Tura-Guwahati trip',
    payout_upi_id: 'dilseng@oksbi',
    status: 'approved',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    verified_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'veh_002',
    user_id: 'usr_seller3',
    driver_name: 'Tengkim Momin',
    driver_phone: '9862012345',
    driver_whatsapp: '9862012345',
    driver_email: 'tengkim@gmail.com',
    vehicle_type: 'Traveler (12-26 Seater)',
    vehicle_reg_no: 'ML-08-C-9814',
    vehicle_model: 'Force Tempo Traveler (17-Seater AC Luxury)',
    vehicle_year: '2022',
    driving_license_no: 'ML08 20210081234',
    driving_license_proof_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    vehicle_rc_no: 'ML08C9814',
    vehicle_photo_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
    operational_route: 'Tura - Shillong - Cherrapunji Tour Packages & Wedding Bookings',
    daily_rate_or_fare: '₹6,500/day outstation',
    payout_upi_id: 'tengkim@paytm',
    status: 'pending',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

const INITIAL_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: 'ord_del_001',
    order_number: 'ORD-7812',
    customer_name: 'Dilseng Sangma',
    customer_phone: '9862012345',
    pickup_address: 'Supermarket, Chandmari, Tura',
    delivery_address: 'Hawakhana Bazaar, Tura, Meghalaya',
    item_description: 'Organic Fresh Garo Vegetables & Wild Forest Honey',
    weight_kg: 4,
    distance_km: 6,
    terrain_type: 'Hill (5km/L)',
    total_fare: 220,
    app_commission: 44,
    partner_earning: 176,
    payment_method: 'online_upi',
    payment_status: 'pending_verification',
    transaction_id: 'UTR849201948271',
    fulfillment_type: 'home_delivery',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ord_del_002',
    order_number: 'ORD-9421',
    customer_name: 'Ropesh Marak',
    customer_phone: '9856098765',
    pickup_address: 'Ringrey Market, Tura Main Road',
    delivery_address: 'Phulbari Highway Crossroad, West Garo Hills',
    item_description: 'Electronics Solar Inverter & Battery Cable Pack',
    weight_kg: 8,
    distance_km: 15,
    terrain_type: 'Plain',
    total_fare: 240,
    app_commission: 48,
    partner_earning: 192,
    payment_method: 'online_upi',
    payment_status: 'verified',
    transaction_id: 'UTR192837465012',
    fulfillment_type: 'home_delivery',
    status: 'pending',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ord_del_003',
    order_number: 'ORD-5104',
    customer_name: 'Sengman Ch. Momin',
    customer_phone: '9436123456',
    pickup_address: 'Dakopgre Craft Village, Tura',
    delivery_address: 'Danakgre, West Garo Hills',
    item_description: 'Traditional Handloom Fabric & Garo Dakmanda',
    weight_kg: 3,
    distance_km: 8,
    terrain_type: 'Hill (5km/L)',
    total_fare: 260,
    app_commission: 52,
    partner_earning: 208,
    payment_method: 'online_upi',
    payment_status: 'verified',
    transaction_id: 'UTR582910394821',
    fulfillment_type: 'home_delivery',
    status: 'out_for_delivery',
    delivery_partner_id: 'usr_me1',
    delivery_partner_name: 'Silgrak Marak',
    delivery_partner_phone: '9876543210',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    accepted_at: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'ord_del_004',
    order_number: 'ORD-3329',
    customer_name: 'Cheana Sangma',
    customer_phone: '9774012345',
    pickup_address: 'Tura Civil Hospital Pharmacy',
    delivery_address: 'Araimile, Tura, Meghalaya',
    item_description: 'Prescription Medical Care Package',
    weight_kg: 2,
    distance_km: 5,
    terrain_type: 'Hill (5km/L)',
    total_fare: 175,
    app_commission: 35,
    partner_earning: 140,
    payment_method: 'online_upi',
    payment_status: 'verified',
    transaction_id: 'UTR998877665544',
    fulfillment_type: 'home_delivery',
    status: 'delivered',
    delivery_partner_id: 'usr_me1',
    delivery_partner_name: 'Silgrak Marak',
    delivery_partner_phone: '9876543210',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    accepted_at: new Date(Date.now() - 82800000).toISOString(),
    delivered_at: new Date(Date.now() - 79200000).toISOString(),
  },
];

type AppRoute = 'user' | 'admin' | 'delivery_register' | 'delivery_dashboard';

type UserNavTab =
  | 'marketplace'
  | 'submit'
  | 'registrations'
  | 'delivery_register'
  | 'delivery_dashboard'
  | 'my_ads'
  | 'transactions'
  | 'account'
  | 'pro_upgrade';

export function App() {
  // 1. ROUTE MANAGEMENT: Support both window.location.pathname & hash routing
  const getInitialRoute = (): AppRoute => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (
      path.startsWith('/admin') ||
      hash.includes('/admin') ||
      hash.includes('admin') ||
      search.includes('route=admin') ||
      search.includes('path=/admin')
    ) {
      return 'admin';
    }

    if (
      path.startsWith('/delivery/register') ||
      hash.includes('/delivery/register') ||
      hash.includes('delivery/register') ||
      search.includes('route=delivery_register')
    ) {
      return 'delivery_register';
    }

    if (
      path.startsWith('/delivery/dashboard') ||
      path.startsWith('/delivery') ||
      hash.includes('/delivery/dashboard') ||
      hash.includes('delivery/dashboard') ||
      search.includes('route=delivery_dashboard')
    ) {
      return 'delivery_dashboard';
    }

    return 'user';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [userActiveTab, setUserActiveTab] = useState<UserNavTab>('marketplace');

  // Listen to browser navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = getInitialRoute();
      setCurrentRoute(detected);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute, userTab?: UserNavTab) => {
    setCurrentRoute(route);
    if (userTab) setUserActiveTab(userTab);

    let targetPath = '/';
    if (route === 'admin') targetPath = '/admin';
    else if (route === 'delivery_register') targetPath = '/delivery/register';
    else if (route === 'delivery_dashboard') targetPath = '/delivery/dashboard';

    if (window.location.pathname !== targetPath) {
      try {
        window.history.pushState({}, '', targetPath);
      } catch (_) {
        // Fallback for strict iframe sandbox
        window.location.hash = targetPath;
      }
    }
  };

  // 2. DATABASE STATES (Shared with Supabase)
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>(INITIAL_RECHARGES);
  const [settings, setSettings] = useState<AdminSetting[]>(INITIAL_SETTINGS);
  const [shopRegistrations, setShopRegistrations] = useState<ShopRegistration[]>(
    INITIAL_SHOP_REGISTRATIONS
  );
  const [vehicleRegistrations, setVehicleRegistrations] = useState<VehicleRegistration[]>(
    INITIAL_VEHICLE_REGISTRATIONS
  );
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(INITIAL_DELIVERY_ORDERS);

  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedListingForCheckout, setSelectedListingForCheckout] = useState<Listing | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active User Profile with Google Auth State (Checking persistent localStorage session)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('mlb_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTargetFeature, setAuthTargetFeature] = useState('this feature');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Protected route action wrapper
  const handleRequireAuth = (featureName: string, action: () => void) => {
    if (currentUser) {
      action();
    } else {
      setAuthTargetFeature(featureName);
      setPendingAuthAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mlb_active_user', JSON.stringify(user));
    } catch (_) {}
    setProfiles((prev) => {
      const exists = prev.some((p) => p.email === user.email || p.id === user.id);
      if (exists) {
        return prev.map((p) => (p.email === user.email || p.id === user.id ? user : p));
      }
      return [user, ...prev];
    });
    // Automatically redirect to marketplace post-login
    setUserActiveTab('marketplace');
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('mlb_active_user');
    } catch (_) {}
    setCurrentUser(null);
    setUserActiveTab('marketplace');
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  // Dynamic system settings
  const upiId =
    settings.find((s) => s.key === 'upi_id' || s.key === 'admin_upi_id')?.value ||
    'merilocalbazaar@oksbi';
  const qrCodeUrl =
    settings.find((s) => s.key === 'qr_code_url' || s.key === 'admin_qr_url')?.value ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}`;
  const broadcastAlert =
    settings.find((s) => s.key === 'app_broadcast_alert')?.value ||
    'Welcome to Meri Local Bazaar - Verified Community Marketplace';

  // Live Supabase Data Fetcher
  const fetchData = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    try {
      // 1. Listings
      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsData && listingsData.length > 0) {
        setListings(listingsData);
      }

      // 2. Profiles
      const { data: profilesData } = await supabase.from('profiles').select('*');
      if (profilesData && profilesData.length > 0) {
        setProfiles(profilesData);
      }

      // 3. Recharge Requests
      const { data: rechargesData } = await supabase
        .from('recharge_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (rechargesData && rechargesData.length > 0) {
        setRechargeRequests(rechargesData);
      }

      // 4. Settings
      const { data: settingsData } = await supabase.from('settings').select('*');
      if (settingsData && settingsData.length > 0) {
        setSettings(settingsData);
      }

      // 5. Shop Registrations
      const { data: shopsData } = await supabase
        .from('shop_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      if (shopsData && shopsData.length > 0) {
        setShopRegistrations(shopsData);
      }

      // 6. Vehicle Registrations
      const { data: vehiclesData } = await supabase
        .from('vehicle_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      if (vehiclesData && vehiclesData.length > 0) {
        setVehicleRegistrations(vehiclesData);
      }

      // 7. Delivery Orders
      const { data: deliveriesData } = await supabase
        .from('delivery_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (deliveriesData && deliveriesData.length > 0) {
        setDeliveryOrders(deliveriesData);
      }
    } catch (err) {
      console.warn('Supabase fetch notification (using verified local state):', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Admin Listing Moderation Action
  const handleUpdateListingStatus = async (
    id: string,
    status: string,
    isFeatured: boolean = false,
    isPro: boolean = false
  ) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              is_featured: isFeatured ?? l.is_featured,
              is_pro: isPro ?? l.is_pro,
            }
          : l
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('listings')
          .update({ status, is_featured: isFeatured, is_pro: isPro })
          .eq('id', id);
      } catch (e) {
        console.error('Failed to update listing status:', e);
      }
    }
  };

  // Admin Approve Recharge
  const handleApproveRecharge = async (req: RechargeRequest) => {
    const approvedTimestamp = new Date().toISOString();
    setRechargeRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: 'approved', approved_at: approvedTimestamp }
          : r
      )
    );

    setProfiles((prev) =>
      prev.map((p) =>
        p.email === req.user_email || p.phone === req.user_phone
          ? {
              ...p,
              is_pro: true,
              pro_status: 'active',
              pro_expiry: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            }
          : p
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('recharge_requests')
          .update({ status: 'approved', approved_at: approvedTimestamp })
          .eq('id', req.id);

        await supabase
          .from('profiles')
          .update({
            is_pro: true,
            pro_status: 'active',
            pro_expiry: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          })
          .or(`email.eq.${req.user_email},phone.eq.${req.user_phone}`);
      } catch (e) {
        console.error('Failed to approve recharge in database:', e);
      }
    }
  };

  // Admin Reject Recharge
  const handleRejectRecharge = async (id: string) => {
    setRechargeRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );

    if (supabase) {
      try {
        await supabase.from('recharge_requests').update({ status: 'rejected' }).eq('id', id);
      } catch (e) {
        console.error('Failed to reject recharge:', e);
      }
    }
  };

  // Admin Toggle User PRO
  const handleToggleUserPro = async (user: UserProfile) => {
    const newProState = !user.is_pro;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === user.id
          ? {
              ...p,
              is_pro: newProState,
              pro_status: newProState ? 'active' : 'inactive',
              pro_expiry: newProState
                ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
                : undefined,
            }
          : p
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            is_pro: newProState,
            pro_status: newProState ? 'active' : 'inactive',
          })
          .eq('id', user.id);
      } catch (e) {
        console.error('Failed to toggle PRO in database:', e);
      }
    }
  };

  // Admin Update Role
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
    );

    if (supabase) {
      try {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      } catch (e) {
        console.error('Failed to update role:', e);
      }
    }
  };

  // Delivery Partner Role & Status Update Handler
  const handleUpdateDeliveryPartner = async (
    userId: string,
    isDeliveryPartner: boolean,
    partnerStatus: string,
    vehicleType?: string,
    vehicleNumber?: string
  ) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === userId
          ? {
              ...p,
              is_delivery_partner: isDeliveryPartner,
              partner_status: partnerStatus,
              vehicle_type: vehicleType || p.vehicle_type,
              vehicle_number: vehicleNumber || p.vehicle_number,
              role: isDeliveryPartner && p.role === 'user' ? 'delivery_partner' : p.role,
            }
          : p
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            is_delivery_partner: isDeliveryPartner,
            partner_status: partnerStatus,
            vehicle_type: vehicleType,
            vehicle_number: vehicleNumber,
          })
          .eq('id', userId);
      } catch (e) {
        console.error('Failed to update delivery partner status in Supabase:', e);
      }
    }
  };

  // Admin Save Settings
  const handleSaveSetting = async (key: string, value: string) => {
    setSettings((prev) => {
      const exists = prev.some((s) => s.key === key);
      if (exists) {
        return prev.map((s) => (s.key === key ? { ...s, value } : s));
      }
      return [...prev, { id: Date.now(), key, value }];
    });

    if (supabase) {
      try {
        await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
      } catch (e) {
        console.error('Failed to save setting:', e);
      }
    }
  };

  // User Actions
  const handleListingSubmitted = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    setUserActiveTab('my_ads');
  };

  const handleDeleteListing = async (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    if (supabase) {
      try {
        await supabase.from('listings').delete().eq('id', id);
      } catch (e) {
        console.error('Failed to delete listing:', e);
      }
    }
  };

  const handleToggleListingStatus = async (id: string, newStatus: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (supabase) {
      try {
        await supabase.from('listings').update({ status: newStatus }).eq('id', id);
      } catch (e) {
        console.error('Failed to toggle status:', e);
      }
    }
  };

  const handleSubmitRecharge = async (
    reqData: Omit<RechargeRequest, 'id' | 'created_at' | 'status'>
  ) => {
    const newReq: RechargeRequest = {
      id: `rec_${Date.now()}`,
      ...reqData,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setRechargeRequests((prev) => [newReq, ...prev]);

    if (supabase) {
      await supabase.from('recharge_requests').insert([newReq]);
    }
  };

  // User & Admin Shop & Vehicle Registration Handlers
  const handleShopSubmitted = async (newShop: ShopRegistration) => {
    setShopRegistrations((prev) => [newShop, ...prev]);
    if (supabase) {
      try {
        await supabase.from('shop_registrations').insert([newShop]);
      } catch (e) {
        console.error('Shop registration Supabase sync:', e);
      }
    }
  };

  const handleVehicleSubmitted = async (newVeh: VehicleRegistration) => {
    setVehicleRegistrations((prev) => [newVeh, ...prev]);
    if (supabase) {
      try {
        await supabase.from('vehicle_registrations').insert([newVeh]);
      } catch (e) {
        console.error('Vehicle registration Supabase sync:', e);
      }
    }
  };

  const handleSubmitShop = (
    data: Omit<ShopRegistration, 'id' | 'created_at' | 'status'>
  ) => {
    const newShop: ShopRegistration = {
      id: `shop_${Date.now()}`,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    handleShopSubmitted(newShop);
  };

  const handleSubmitVehicle = (
    data: Omit<VehicleRegistration, 'id' | 'created_at' | 'status'>
  ) => {
    const newVeh: VehicleRegistration = {
      id: `veh_${Date.now()}`,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    handleVehicleSubmitted(newVeh);
  };

  const handleApproveShopRegistration = async (id: string) => {
    const verifiedTimestamp = new Date().toISOString();
    setShopRegistrations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved', verified_at: verifiedTimestamp } : s))
    );
    if (supabase) {
      try {
        await supabase
          .from('shop_registrations')
          .update({ status: 'approved', verified_at: verifiedTimestamp })
          .eq('id', id);
      } catch (e) {
        console.error('Approve shop registration:', e);
      }
    }
  };

  const handleRejectShopRegistration = async (id: string, reason?: string) => {
    setShopRegistrations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected', rejection_reason: reason } : s))
    );
    if (supabase) {
      try {
        await supabase
          .from('shop_registrations')
          .update({ status: 'rejected', rejection_reason: reason })
          .eq('id', id);
      } catch (e) {
        console.error('Reject shop registration:', e);
      }
    }
  };

  const handleApproveVehicleRegistration = async (id: string) => {
    const verifiedTimestamp = new Date().toISOString();
    setVehicleRegistrations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'approved', verified_at: verifiedTimestamp } : v))
    );
    if (supabase) {
      try {
        await supabase
          .from('vehicle_registrations')
          .update({ status: 'approved', verified_at: verifiedTimestamp })
          .eq('id', id);
      } catch (e) {
        console.error('Approve vehicle registration:', e);
      }
    }
  };

  const handleRejectVehicleRegistration = async (id: string, reason?: string) => {
    setVehicleRegistrations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'rejected', rejection_reason: reason } : v))
    );
    if (supabase) {
      try {
        await supabase
          .from('vehicle_registrations')
          .update({ status: 'rejected', rejection_reason: reason })
          .eq('id', id);
      } catch (e) {
        console.error('Reject vehicle registration:', e);
      }
    }
  };

  // Delivery Partner Handlers
  const handleRegisterDeliveryPartner = async (data: {
    fullName: string;
    phone: string;
    vehicleType: 'Bike' | 'Scooty' | 'Auto' | 'Commercial Auto';
    vehicleNumber: string;
  }) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentUser.id
          ? {
              ...p,
              full_name: data.fullName,
              phone: data.phone,
              is_delivery_partner: true,
              vehicle_type: data.vehicleType,
              vehicle_number: data.vehicleNumber,
              partner_status: 'pending',
              role: p.role === 'user' ? 'delivery_partner' : p.role,
            }
          : p
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            phone: data.phone,
            is_delivery_partner: true,
            vehicle_type: data.vehicleType,
            vehicle_number: data.vehicleNumber,
            partner_status: 'pending',
          })
          .eq('id', currentUser.id);
      } catch (e) {
        console.error('Supabase delivery partner registration sync:', e);
      }
    }
  };

  const handleAcceptDeliveryOrder = async (orderId: string) => {
    const acceptedTime = new Date().toISOString();
    setDeliveryOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'out_for_delivery',
              delivery_partner_id: currentUser.id,
              delivery_partner_name: currentUser.full_name || 'Silgrak Marak',
              delivery_partner_phone: currentUser.phone || '9876543210',
              accepted_at: acceptedTime,
            }
          : o
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('delivery_orders')
          .update({
            status: 'out_for_delivery',
            delivery_partner_id: currentUser.id,
            delivery_partner_name: currentUser.full_name || 'Silgrak Marak',
            delivery_partner_phone: currentUser.phone || '9876543210',
            accepted_at: acceptedTime,
          })
          .eq('id', orderId);
      } catch (e) {
        console.error('Accept delivery order in Supabase:', e);
      }
    }
  };

  const handleUpdateDeliveryOrderStatus = async (
    orderId: string,
    newStatus: 'out_for_delivery' | 'delivered'
  ) => {
    const deliveredTime = newStatus === 'delivered' ? new Date().toISOString() : undefined;
    setDeliveryOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              delivered_at: deliveredTime || o.delivered_at,
            }
          : o
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('delivery_orders')
          .update({
            status: newStatus,
            delivered_at: deliveredTime,
          })
          .eq('id', orderId);
      } catch (e) {
        console.error('Update delivery order status in Supabase:', e);
      }
    }
  };

  const handleCreateSampleDeliveryOrder = async (
    orderData: Omit<DeliveryOrder, 'id' | 'created_at'>
  ) => {
    const newOrder: DeliveryOrder = {
      id: `ord_${Date.now()}`,
      ...orderData,
      created_at: new Date().toISOString(),
    };

    setDeliveryOrders((prev) => [newOrder, ...prev]);

    if (supabase) {
      try {
        await supabase.from('delivery_orders').insert([newOrder]);
      } catch (e) {
        console.error('Insert delivery order in Supabase:', e);
      }
    }
  };

  // Order Placement & Payment Verification Handlers
  const handleOrderPlaced = async (newOrder: DeliveryOrder) => {
    setDeliveryOrders((prev) => [newOrder, ...prev]);
    if (supabase) {
      try {
        await supabase.from('delivery_orders').insert([newOrder]);
      } catch (e) {
        console.error('Supabase order insert sync:', e);
      }
    }
    setSelectedListingForCheckout(null);
  };

  const handleVerifyOrderPayment = async (orderId: string, isApproved: boolean) => {
    const newPayStatus = isApproved ? 'verified' : 'rejected';
    const newStatus = isApproved ? 'pending' : 'rejected';
    setDeliveryOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: newPayStatus,
              status: newStatus,
            }
          : o
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('delivery_orders')
          .update({
            payment_status: newPayStatus,
            status: newStatus,
          })
          .eq('id', orderId);
      } catch (e) {
        console.error('Verify order payment Supabase sync:', e);
      }
    }
  };

  // =========================================================================
  // ROOT LEVEL AUTHENTICATION GATE (SECURITY FIRST)
  // If user is not logged in, display the clean, distraction-free Login Screen
  // User cannot access Marketplace listings, categories, or dashboards until login
  // =========================================================================
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // =========================================================================
  // ROUTE 3: ISOLATED DELIVERY PARTNER REGISTRATION ('/delivery/register')
  // =========================================================================
  if (currentRoute === 'delivery_register') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow font-black text-xl">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-white">Delivery Fleet Onboarding</span>
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      /delivery/register
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Join Garo Hills Local Logistics & Earn 80% per Delivery
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigateTo('delivery_dashboard')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  Delivery Dashboard
                </button>
                <button
                  onClick={() => navigateTo('user', 'marketplace')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  User Marketplace
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <DeliveryPartnerRegistration
            currentUser={currentUser}
            onSubmit={handleRegisterDeliveryPartner}
            onNavigateToDashboard={() => navigateTo('delivery_dashboard')}
            onNavigateHome={() => navigateTo('user', 'marketplace')}
          />
        </main>
      </div>
    );
  }

  // =========================================================================
  // ROUTE 4: ISOLATED DELIVERY ORDERS DASHBOARD ('/delivery/dashboard')
  // =========================================================================
  if (currentRoute === 'delivery_dashboard') {
    return (
      <DeliveryPartnerDashboard
        currentUser={currentUser}
        orders={deliveryOrders}
        onAcceptOrder={handleAcceptDeliveryOrder}
        onUpdateOrderStatus={handleUpdateDeliveryOrderStatus}
        onCreateSampleOrder={handleCreateSampleDeliveryOrder}
        onNavigateToRegister={() => navigateTo('delivery_register')}
        onNavigateHome={() => navigateTo('user', 'marketplace')}
        onRefresh={fetchData}
        onUpdatePartnerProfile={handleRegisterDeliveryPartner}
      />
    );
  }

  // =========================================================================
  // ROUTE 2: ISOLATED ADMIN CONTROL DASHBOARD ('/admin')
  // =========================================================================
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Admin Isolation Header */}
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow font-black text-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-white">Admin Control Dashboard</span>
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      /admin route
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Live Supabase Management & Moderation Room
                  </div>
                </div>
              </div>

              {/* Exit to User Marketplace */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo('user', 'marketplace')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Exit to User Marketplace (/)
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Workspace Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <AdminControlRoom
            listings={listings}
            rechargeRequests={rechargeRequests}
            profiles={profiles}
            settings={settings}
            shopRegistrations={shopRegistrations}
            vehicleRegistrations={vehicleRegistrations}
            deliveryOrders={deliveryOrders}
            onRefresh={fetchData}
            onViewListing={(item) => setSelectedListing(item)}
            onUpdateListingStatus={handleUpdateListingStatus}
            onApproveRecharge={handleApproveRecharge}
            onRejectRecharge={handleRejectRecharge}
            onToggleUserPro={handleToggleUserPro}
            onUpdateUserRole={handleUpdateUserRole}
            onUpdateDeliveryPartner={handleUpdateDeliveryPartner}
            onSaveSetting={handleSaveSetting}
            onApproveShopRegistration={handleApproveShopRegistration}
            onRejectShopRegistration={handleRejectShopRegistration}
            onApproveVehicleRegistration={handleApproveVehicleRegistration}
            onRejectVehicleRegistration={handleRejectVehicleRegistration}
            onVerifyOrderPayment={handleVerifyOrderPayment}
          />
        </main>

        {/* Detail Modal with Moderation */}
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onModerate={handleUpdateListingStatus}
          isAdmin={true}
        />
      </div>
    );
  }

  // =========================================================================
  // ROUTE 1: EXCLUSIVE USER PANEL ('/') - NO ADMIN CONTROLS VISIBLE
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Banner Alert */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">Notice:</span>
        <span className="truncate">{broadcastAlert}</span>
      </div>

      {/* User Header Navigation (Admin controls strictly excluded) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <div
              onClick={() => setUserActiveTab('marketplace')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md font-black text-xl tracking-tighter">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    Meri Local <span className="text-orange-600">Bazaar</span>
                  </span>
                  <span className="bg-slate-900 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                    LOCAL
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Direct WhatsApp Community Marketplace
                </div>
              </div>
            </div>

            {/* User Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setUserActiveTab('marketplace')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'marketplace'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Marketplace
              </button>

              <button
                onClick={() => handleRequireAuth('Submit Listing', () => setUserActiveTab('submit'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'submit'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                Submit Listing
              </button>

              {/* Shop & Fleet Registration */}
              <button
                onClick={() => handleRequireAuth('Shop & Vehicle Registration', () => setUserActiveTab('registrations'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'registrations'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4" />
                Shop & Vehicle Reg
              </button>

              {/* Delivery Partner Standalone Portal Link */}
              <button
                onClick={() => handleRequireAuth('Driver App Portal', () => navigateTo('delivery_dashboard'))}
                className="px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow hover:from-emerald-500 hover:to-teal-600 border border-emerald-500/40"
              >
                <Truck className="w-4 h-4 text-emerald-200" />
                Driver App Portal
              </button>

              <button
                onClick={() => handleRequireAuth('My Ads', () => setUserActiveTab('my_ads'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'my_ads'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                My Ads
              </button>

              <button
                onClick={() => handleRequireAuth('Transaction Logs', () => setUserActiveTab('transactions'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'transactions'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Transactions
              </button>

              <button
                onClick={() => handleRequireAuth('My Account', () => setUserActiveTab('account'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  userActiveTab === 'account'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                My Account
              </button>

              <button
                onClick={() => handleRequireAuth('PRO Plans', () => setUserActiveTab('pro_upgrade'))}
                className={`ml-1 px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs ${
                  userActiveTab === 'pro_upgrade'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-amber-700" />
                PRO Plans
              </button>
            </nav>

            {/* User Profile Badge & Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div
                    onClick={() => setUserActiveTab('account')}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition"
                  >
                    {currentUser.avatar_url ? (
                      <img
                        src={currentUser.avatar_url}
                        alt={currentUser.full_name || 'User'}
                        className="w-8 h-8 rounded-full object-cover border border-orange-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {currentUser.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="text-left text-xs">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        {currentUser.full_name?.split(' ')[0] || 'Member'}
                        {currentUser.is_pro && (
                          <span className="text-amber-500 font-black">⭐</span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        {currentUser.is_pro ? 'PRO' : 'Google Logged'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthTargetFeature('sign in');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition hover:border-slate-400"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Sign in with Google</span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile User Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-orange-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTargetFeature('sign in');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full mb-2 p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Continue with Google
              </button>
            )}

            <button
              onClick={() => {
                setUserActiveTab('marketplace');
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'marketplace' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace
            </button>

            <button
              onClick={() => {
                handleRequireAuth('Submit Listing', () => setUserActiveTab('submit'));
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'submit' ? 'bg-orange-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              Submit Listing
            </button>

            <button
              onClick={() => {
                handleRequireAuth('Shop & Vehicle Registration', () => setUserActiveTab('registrations'));
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'registrations' ? 'bg-orange-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              Shop & Vehicle Registration
            </button>

            <button
              onClick={() => {
                handleRequireAuth('Driver App Portal', () => navigateTo('delivery_dashboard'));
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl text-xs font-black text-left flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow"
            >
              <Truck className="w-4 h-4 text-emerald-200" />
              Driver App Portal (Standalone View)
            </button>

            <button
              onClick={() => {
                handleRequireAuth('My Ads', () => setUserActiveTab('my_ads'));
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'my_ads' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              My Ads Status
            </button>

            <button
              onClick={() => {
                handleRequireAuth('Transaction Logs', () => setUserActiveTab('transactions'));
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'transactions' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Transaction Logs
            </button>

            <button
              onClick={() => {
                handleRequireAuth('My Account', () => setUserActiveTab('account'));
                setMobileMenuOpen(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                userActiveTab === 'account' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              My Account
            </button>

            <button
              onClick={() => {
                handleRequireAuth('PRO Plans', () => setUserActiveTab('pro_upgrade'));
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl text-xs font-black text-left flex items-center gap-2 bg-amber-100 text-amber-900"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              PRO Plans
            </button>
          </div>
        )}
      </header>

      {/* Main User Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: USER BAZAAR MARKETPLACE (DEFAULT AT '/') */}
        {userActiveTab === 'marketplace' && (
          <UserMarketplace
            listings={listings}
            onViewListing={(item) => setSelectedListing(item)}
            onOpenSubmit={() => handleRequireAuth('Submit Listing', () => setUserActiveTab('submit'))}
            onOpenPro={() => handleRequireAuth('PRO Plans', () => setUserActiveTab('pro_upgrade'))}
            onOrderNow={(item) => setSelectedListingForCheckout(item)}
          />
        )}

        {/* AUTH GUARD FOR PROTECTED ROUTES */}
        {!currentUser && userActiveTab !== 'marketplace' && (
          <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white font-black text-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-orange-500/20">
              M
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Sign in to Continue
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Please sign in with your Google account (Gmail ID) to access{' '}
              <span className="font-bold text-slate-700">
                {userActiveTab === 'pro_upgrade'
                  ? 'PRO Membership Plans'
                  : userActiveTab === 'submit'
                  ? 'Submit Listing'
                  : userActiveTab === 'delivery_dashboard'
                  ? 'Driver App Portal'
                  : userActiveTab === 'registrations'
                  ? 'Shop & Vehicle Registration'
                  : userActiveTab === 'my_ads'
                  ? 'My Ads Management'
                  : 'this feature'}
              </span>
              .
            </p>

            <button
              onClick={() => {
                setAuthTargetFeature(userActiveTab.replace('_', ' '));
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl text-slate-800 text-sm font-bold flex items-center justify-center gap-3 transition shadow-xs hover:border-slate-400"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => setUserActiveTab('marketplace')}
              className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 transition block mx-auto"
            >
              ← Back to Marketplace
            </button>
          </div>
        )}

        {/* VIEW 2: SUBMIT LISTING */}
        {currentUser && userActiveTab === 'submit' && (
          <ListingSubmissionView
            onSuccess={handleListingSubmitted}
            onCancel={() => setUserActiveTab('marketplace')}
            userPhone={currentUser.phone}
            userName={currentUser.full_name}
            userId={currentUser.id}
            isProUser={currentUser.is_pro}
          />
        )}

        {/* VIEW 2.5: SHOP & VEHICLE REGISTRATION */}
        {currentUser && userActiveTab === 'registrations' && (
          <BusinessVehicleRegistrationView
            currentUser={currentUser}
            shopRegistrations={shopRegistrations}
            vehicleRegistrations={vehicleRegistrations}
            onSubmitShop={handleSubmitShop}
            onSubmitVehicle={handleSubmitVehicle}
          />
        )}

        {/* VIEW 2.7: DELIVERY PARTNER ONBOARDING */}
        {currentUser && userActiveTab === 'delivery_register' && (
          <DeliveryPartnerRegistration
            currentUser={currentUser}
            onSubmit={handleRegisterDeliveryPartner}
            onNavigateToDashboard={() => setUserActiveTab('delivery_dashboard')}
            onNavigateHome={() => setUserActiveTab('marketplace')}
          />
        )}

        {/* VIEW 2.8: ISOLATED DELIVERY ORDERS DASHBOARD */}
        {currentUser && userActiveTab === 'delivery_dashboard' && (
          <DeliveryPartnerDashboard
            currentUser={currentUser}
            orders={deliveryOrders}
            onAcceptOrder={handleAcceptDeliveryOrder}
            onUpdateOrderStatus={handleUpdateDeliveryOrderStatus}
            onCreateSampleOrder={handleCreateSampleDeliveryOrder}
            onNavigateToRegister={() => setUserActiveTab('delivery_register')}
            onNavigateHome={() => setUserActiveTab('marketplace')}
            onRefresh={fetchData}
            onUpdatePartnerProfile={handleRegisterDeliveryPartner}
          />
        )}

        {/* VIEW 3: MY ADS MANAGEMENT */}
        {currentUser && userActiveTab === 'my_ads' && (
          <MyAdsManagement
            myListings={listings}
            onOpenSubmitModal={() => setUserActiveTab('submit')}
            onViewListing={(item) => setSelectedListing(item)}
            onDeleteListing={handleDeleteListing}
            onToggleListingStatus={handleToggleListingStatus}
          />
        )}

        {/* VIEW 4: TRANSACTION LOGS */}
        {currentUser && userActiveTab === 'transactions' && (
          <TransactionLogs
            recharges={rechargeRequests}
            onNewRechargeClick={() => setUserActiveTab('pro_upgrade')}
          />
        )}

        {/* VIEW 5: MY ACCOUNT */}
        {currentUser && userActiveTab === 'account' && (
          <AccountSecurity
            currentUser={currentUser}
            onUpgradeClick={() => setUserActiveTab('pro_upgrade')}
            onSignOut={handleSignOut}
            onUpdateDeliveryPartner={handleUpdateDeliveryPartner}
          />
        )}

        {/* VIEW 6: PRO MEMBERSHIP PLANS */}
        {currentUser && userActiveTab === 'pro_upgrade' && (
          <ProUpgradeView
            upiId={upiId}
            qrCodeUrl={qrCodeUrl}
            userEmail={currentUser.email}
            userName={currentUser.full_name || 'Silgrak Marak'}
            userPhone={currentUser.phone || '9876543210'}
            onSubmitRecharge={handleSubmitRecharge}
            onSuccessReturn={() => setUserActiveTab('marketplace')}
          />
        )}
      </main>

      {/* Listing Detail Modal with Direct WhatsApp Protocol */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOrderNow={(item) => setSelectedListingForCheckout(item)}
        isAdmin={false}
      />

      {/* 100% Prepaid Online Advance Payment Checkout Modal */}
      {selectedListingForCheckout && (
        <CheckoutModal
          listing={selectedListingForCheckout}
          currentUser={currentUser}
          adminUpiId={upiId}
          adminQrUrl={qrCodeUrl}
          onClose={() => setSelectedListingForCheckout(null)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        featureName={authTargetFeature}
      />

      {/* User Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Meri Local Bazaar. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <span>Verified Local Sellers</span>
            <span>•</span>
            <span>WhatsApp Direct Inquiry</span>
            <span>•</span>
            <span>Secure Database</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
