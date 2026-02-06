export type Service = {
  id: string;
  title: string;
  tier: 'classic' | 'reserve';
  description: string;
  price_label: string;
  base_price: number;
  price_per_bed: number;
  price_per_bath: number;
  price_per_living: number;
  price_per_sqm: number;
  base_duration: number;
  duration_per_bed: number;
  duration_per_bath: number;
  condition_multiplier_cap: number;
  has_concierge_benefits: boolean;
};

export type PropertyCondition = {
  id: string;
  label: string;
  value: number;
  description: string;
};

export type Addon = {
  id: string;
  title: string;
  price: number;    
  price_classic: number;
  icon_name: string;
  description: string;
};

export type Perk = {
  id: string;
  title: string;
  description: string;
  retail_value: number;
  min_order_value: number;
  partner: {
    name: string;
    location: string;
  };
};

export type Profile = {
  id: string;
  email: string;
  role: 'client' | 'contractor' | 'admin';
  full_name?: string;
  phone?: string;
  created_at: string;
};