export type UserRole = 'admin_kader' | 'kader' | 'ibu';
export type CommunityMemberRole = 'admin' | 'kader' | 'member';
export type StuntingStatus = 'normal' | 'risiko' | 'stunting' | 'severe_stunting';
export type RelationType = 'ibu' | 'ayah' | 'wali';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  theme_preference?: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  address?: string;
  schedule_json?: {
    day: string;
    time: string;
  };
  contact_phone?: string;
  banner_url?: string;
  invite_code: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  profile_id: string;
  role_in_community: CommunityMemberRole;
  joined_at: string;
}

export interface Child {
  id: string;
  community_id: string;
  child_code: string;
  name_alias: string;
  date_of_birth: string;
  sex: 'L' | 'P';
  mother_height_cm?: number;
  birth_weight_kg?: number;
  birth_length_cm?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  child_id: string;
  profile_id: string;
  relation_type: RelationType;
  verified: boolean;
  created_at: string;
}

export interface Visit {
  id: string;
  child_id: string;
  visit_date: string;
  age_months: number;
  height_cm: number;
  weight_kg: number;
  head_circumference_cm?: number;
  arm_circumference_cm?: number;
  notes?: string;
  symptoms_text?: string;
  exclusive_breastfeeding?: boolean;
  sick_frequency?: number;
  haz_score?: number;
  waz_score?: number;
  whz_score?: number;
  stunting_status?: StuntingStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Immunization {
  id: string;
  child_id: string;
  vaccine_type: string;
  date_administered: string;
  status: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  child_id: string;
  log_date: string;
  meals_per_day?: number;
  animal_protein_per_week?: number;
  veg_fruit_freq?: number;
  iron_sources?: string[];
  water_intake_ml?: number;
  snacks_freq?: number;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  content: string;
  media_url?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  community_id: string;
  title: string;
  content: string;
  pinned: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EducationContent {
  id: string;
  category: string;
  title: string;
  content_md: string;
  reading_time?: number;
  tags?: string[];
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  profile_id: string;
  content_id: string;
  completed_at: string;
}

export interface WHOGrowthTable {
  id: string;
  indicator: string;
  sex: 'L' | 'P';
  age_months?: number;
  height_cm?: number;
  z_minus3: number;
  z_minus2: number;
  z_minus1: number;
  z0: number;
  z_plus1: number;
  z_plus2: number;
  z_plus3: number;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  before_json?: any;
  after_json?: any;
  created_at: string;
}
