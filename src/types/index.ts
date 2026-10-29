// ===== ENUMS & CONSTANTS =====
export type UserRole = 'owner' | 'manager' | 'receptionist' | 'barber' | 'inventory';
export type AppointmentStatus = 'booked' | 'confirmed' | 'checked_in' | 'in_service' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'prepaid';
export type QueueStatus = 'waiting' | 'in_service' | 'completed' | 'cancelled';

// ===== USER & AUTH =====
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  barberId?: string;
  active: boolean;
  createdAt: string;
}

// ===== CUSTOMER =====
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredBarberId?: string;
  notes?: string;
  loyaltyPoints: number;
  totalSpent: number;
  membershipId?: string;
  createdAt: string;
}

// ===== BARBER =====
export interface Barber {
  id: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[];
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  fixedSalary?: number;
  workingHours: { day: string; start: string; end: string }[];
  daysOff: string[];
  active: boolean;
  avatar?: string;
  createdAt: string;
}

// ===== SERVICE =====
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: string;
  active: boolean;
  barberPricing?: { barberId: string; price: number }[];
  comboServices?: string[];
  promoPrice?: number;
  promoEnd?: string;
  createdAt: string;
}

// ===== APPOINTMENT =====
export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: 'online' | 'walkin';
  token?: string;
  notes?: string;
  statusHistory: { status: AppointmentStatus; timestamp: string; note?: string }[];
  createdAt: string;
}

// ===== INVOICE & PAYMENT =====
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  barberId: string;
  appointmentId?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  status: PaymentStatus;
  payments: Payment[];
  createdAt: string;
}

export interface InvoiceItem {
  type: 'service' | 'product';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: string;
  note?: string;
}

// ===== EXPENSE =====
export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  supplier?: string;
  date: string;
  recordedBy: string;
  createdAt: string;
}

// ===== PRODUCT (INVENTORY) =====
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'retail' | 'consumable';
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  supplier?: string;
  active: boolean;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'damage' | 'return';
  quantity: number;
  reason: string;
  timestamp: string;
  recordedBy: string;
}

// ===== MEMBERSHIP =====
export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  services: { serviceId: string; visits: number }[];
  active: boolean;
}

export interface CustomerMembership {
  id: string;
  customerId: string;
  planId: string;
  startDate: string;
  endDate: string;
  remainingVisits: { serviceId: string; remaining: number }[];
  balance: number;
  active: boolean;
}

// ===== LOYALTY =====
export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  type: 'earn' | 'redeem' | 'adjust';
  points: number;
  reason: string;
  timestamp: string;
}

// ===== QUEUE =====
export interface QueueEntry {
  id: string;
  token: string;
  customerId: string;
  barberId?: string;
  serviceIds: string[];
  status: QueueStatus;
  estimatedWait: number;
  joinedAt: string;
  startedAt?: string;
  completedAt?: string;
}

// ===== NOTIFICATION =====
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'cancellation' | 'inventory' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
}

// ===== SETTINGS =====
export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: { day: string; start: string; end: string }[];
  holidays: string[];
  bufferTime: number;
  taxEnabled: boolean;
  taxRate: number;
  currency: string;
  loyaltyPointsPerDollar: number;
  loyaltyRedemptionRate: number;
}

// ===== AUDIT LOG =====
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

// ===== COMMISSION =====
export interface CommissionRecord {
  id: string;
  barberId: string;
  invoiceId: string;
  amount: number;
  period: string;
  calculated: boolean;
  paid: boolean;
  createdAt: string;
}

// ===== SALARY =====
export interface SalaryRecord {
  id: string;
  barberId: string;
  period: string;
  baseSalary: number;
  commissions: number;
  advances: number;
  total: number;
  paid: boolean;
  paidAt?: string;
  createdAt: string;
}
