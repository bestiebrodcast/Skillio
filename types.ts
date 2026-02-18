
export type Category = 
  | 'Learning & Tutoring' 
  | 'Kids & Child Services' 
  | 'Home Help & Cleaning' 
  | 'Creative & Handmade' 
  | 'Digital & Tech Help' 
  | 'School & Study Support' 
  | 'Community & Errands' 
  | 'Special Programs & Clubs';

export type AdminRole = 'Super Owner' | 'Junior Owner' | 'Manager' | 'Staff';
export type BookStatus = 'Requested' | 'Approved' | 'Purchased' | 'Borrowed' | 'Returned';
export type ProviderStatus = 'applied' | 'under_review' | 'approved' | 'rejected' | 'suspended' | 'changes_required';

export type BookingStatus = 
  | 'Requested' 
  | 'Accepted' 
  | 'Declined' 
  | 'Confirmed' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export type PaymentStatus = 
  | 'Pending' 
  | 'Paid to Escrow' 
  | 'Released to Tasker' 
  | 'Refunded';

export type PublishState = 'draft' | 'submitted' | 'approved' | 'rejected';
export type TaskerSubmissionStatus = 'draft' | 'submitted' | 'approved';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  durationMinutes: number;
  category: Category;
  imageUrl: string;
  isActive: boolean;
  maxJobsPerDay?: number;
  allowedProviderIds?: string[];
  blockedDates?: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  providerId?: string;
  providerName?: string;
  message: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'Online' | 'In-Person';
  createdAt: string;
  totalPrice: number; // Total amount paid by customer via M-Pesa
  platformFee: number; // 10% kept by app
  taskerAmount: number; // 90% sent to tasker
  location?: string;
  addOns?: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  customerName: string;
  customerEmail: string;
  status: BookStatus;
  borrowDuration: number;
  requestDate: string;
  imageUrl: string;
  dueDate?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  serviceId?: string;
}

export interface Review {
  id: string;
  serviceId: string;
  serviceTitle: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  isFeatured: boolean;
}

export interface ProviderApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  skills: string[];
  specificServices?: string[];
  experience: string;
  availability: string;
  requestedPricing: Record<string, string>;
  status: ProviderStatus;
  appliedDate: string;
  submissionTimestamp?: string;
  blockedDates?: string[];
  adminFeedback?: string;
}

export interface TaskerService {
  id: string;
  title: string;
  description: string;
  category: Category;
  isActive: boolean;
  isBookable: boolean;
  service_publish_state: PublishState;
  tags: string[];
  priority: number;
  price: number;
  priceType: 'per_hour' | 'per_task';
  minDuration: number;
  pricingNotes?: string;
  hasDiscount: boolean;
}

export interface DayAvailability {
  isClosed: boolean;
  start: string;
  end: string;
}

export interface TaskerProfileSettings {
  displayName: string;
  headline: string;
  photoUrl: string;
  publicBio: string;
  serviceArea: string;
  languages: string[];
  isAgeEligible: boolean;
  isPubliclyVisible: boolean;
  customRates: Record<string, string>;
  pendingApproval: boolean;
  weeklySchedule: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  yearsExperience?: number;
  specialStrengths: string[];
  certifications?: string;
  experienceHighlights: string[];
  workingStyle: string;
  introMessage: string;
  offeredServices: TaskerService[];
  availabilityGrid: Record<string, DayAvailability>;
  blockedDates: string[];
  blockedDateReasons?: Record<string, string>;
  isUnavailableMode: boolean;
  acceptingNewBookings: boolean;
  preferredJobTypes: Category[];
  isDeactivated: boolean;
  tasker_submission_status: TaskerSubmissionStatus;
  acceptedGuidelines: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: 'Student' | 'Parent' | 'Customer';
  providerStatus?: ProviderStatus; 
  joinedDate: string;
  status: 'Active' | 'Suspended';
  bio?: string;
  taskerCredentials?: {
    username: string;
    password: string;
  };
  taskerProfileSettings?: TaskerProfileSettings;
  preferences: {
    preferredTime: string;
    newsletter: boolean;
    serviceReminders: boolean;
    autoApproveCleaners: boolean;
  };
  notes: {
    gateCode: string;
    petInfo: string;
    generalInstructions: string;
  };
}

export type View = 
  | 'Home' 
  | 'ServiceDetail' 
  | 'Contact' 
  | 'Admin' 
  | 'TutoringHub' 
  | 'IntakeQuiz' 
  | 'BookBoutique' 
  | 'CleaningHub' 
  | 'Settings' 
  | 'Profile' 
  | 'SupportCenter' 
  | 'PrivacySafetyCenter' 
  | 'AboutUs'
  | 'ApplyProvider'
  | 'ProviderHub'
  | 'TaskerProfile'
  | 'CategoryDiscovery'
  | 'PublicTaskerProfile'
  | 'TaskerActivation';

export interface QuizResult {
  childName: string;
  childAge: string;
  grade: string;
  subjects: string[];
  strengths: string;
  struggles: string;
  testScore: number;
  safetyNotes: string;
  parentName: string;
}

export interface SessionNote {
  id: string;
  date: string;
  starsEarned: number;
  summary: string;
}

export interface StudentProgress {
  totalStars: number;
  badges: string[];
  history: SessionNote[];
}
