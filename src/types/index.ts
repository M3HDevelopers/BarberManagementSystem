export type UserRole = 'owner' | 'manager' | 'receptionist' | 'barber' | 'inventory';
export type AppointmentStatus = 'booked' | 'confirmed' | 'checked_in' | 'in_service' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'prepaid';
export type QueueStatus = 'waiting' | 'in_service' | 'completed' | 'cancelled';

export interface User { id: string; username: string; password: string; role: UserRole; name: string; barberId?: string; active: boolean; createdAt: string; }
export interface Customer { id: string; name: string; phone: string; email?: string; preferredBarberId?: string; notes?: string; loyaltyPoints: number; totalSpent: number; createdAt: string; }
export interface Barber { id: string; name: string; phone: string; email?: string; skills: string[]; commissionType: 'percentage' | 'fixed'; commissionValue: number; fixedSalary?: number; workingHours: { day: string; start: string; end: string }[]; daysOff: string[]; active: boolean; createdAt: string; }
export interface Service { id: string; name: string; description: string; price: number; duration: number; category: string; active: boolean; promoPrice?: number; createdAt: string; }
export interface Appointment { id: string; customerId: string; barberId: string; serviceIds: string[]; date: string; startTime: string; endTime: string; status: AppointmentStatus; type: 'online' | 'walkin'; statusHistory: { status: AppointmentStatus; timestamp: string }[]; createdAt: string; }
export interface InvoiceItem { type: 'service' | 'product'; itemId: string; name: string; quantity: number; unitPrice: number; total: number; }
export interface Payment { id: string; invoiceId: string; amount: number; method: PaymentMethod; timestamp: string; }
export interface Invoice { id: string; invoiceNumber: string; customerId: string; barberId: string; items: InvoiceItem[]; subtotal: number; discount: number; tax: number; total: number; paid: number; status: PaymentStatus; payments: Payment[]; createdAt: string; }
export interface Expense { id: string; category: string; description: string; amount: number; supplier?: string; date: string; recordedBy: string; createdAt: string; }
export interface Product { id: string; name: string; sku: string; category: string; type: 'retail' | 'consumable'; purchasePrice: number; sellingPrice: number; quantity: number; reorderLevel: number; supplier?: string; active: boolean; createdAt: string; }
export interface StockMovement { id: string; productId: string; type: 'purchase' | 'sale' | 'adjustment' | 'damage'; quantity: number; reason: string; timestamp: string; recordedBy: string; }
export interface QueueEntry { id: string; token: string; customerId: string; barberId?: string; serviceIds: string[]; status: QueueStatus; estimatedWait: number; joinedAt: string; startedAt?: string; }
export interface Notification { id: string; title: string; message: string; type: string; read: boolean; createdAt: string; }
export interface ShopSettings { name: string; address: string; phone: string; email: string; openingHours: { day: string; start: string; end: string }[]; bufferTime: number; taxEnabled: boolean; taxRate: number; currency: string; loyaltyPointsPerDollar: number; }
export interface CommissionRecord { id: string; barberId: string; invoiceId: string; amount: number; period: string; createdAt: string; }
