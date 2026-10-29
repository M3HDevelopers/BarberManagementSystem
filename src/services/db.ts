import { User, Customer, Barber, Service, Appointment, Invoice, InvoiceItem, Payment, PaymentMethod, Expense, Product, StockMovement, MembershipPlan, CustomerMembership, LoyaltyTransaction, QueueEntry, Notification, ShopSettings, AuditLog, CommissionRecord, SalaryRecord, AppointmentStatus } from '../types';

const DB_KEY = 'barberpro_db';

interface Database {
  users: User[];
  customers: Customer[];
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  invoices: Invoice[];
  expenses: Expense[];
  products: Product[];
  stockMovements: StockMovement[];
  membershipPlans: MembershipPlan[];
  customerMemberships: CustomerMembership[];
  loyaltyTransactions: LoyaltyTransaction[];
  queue: QueueEntry[];
  notifications: Notification[];
  settings: ShopSettings;
  auditLogs: AuditLog[];
  commissions: CommissionRecord[];
  salaries: SalaryRecord[];
}

function getDB(): Database {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return initializeDB();
  return JSON.parse(data);
}

function saveDB(db: Database): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function generateInvoiceNumber(): string {
  const db = getDB();
  const count = db.invoices.length + 1;
  return `INV-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
}

function generateToken(): string {
  const db = getDB();
  const count = db.queue.filter(q => q.status === 'waiting' || q.status === 'in_service').length + 1;
  return `T-${String(count).padStart(3, '0')}`;
}

function initializeDB(): Database {
  const db: Database = {
    users: [
      { id: 'u1', username: 'admin', password: 'admin123', role: 'owner', name: 'John Owner', active: true, createdAt: new Date().toISOString() },
      { id: 'u2', username: 'manager', password: 'manager123', role: 'manager', name: 'Sarah Manager', active: true, createdAt: new Date().toISOString() },
      { id: 'u3', username: 'reception', password: 'reception123', role: 'receptionist', name: 'Mike Reception', active: true, createdAt: new Date().toISOString() },
      { id: 'u4', username: 'barber1', password: 'barber123', role: 'barber', name: 'Tony Styles', barberId: 'b1', active: true, createdAt: new Date().toISOString() },
      { id: 'u5', username: 'barber2', password: 'barber123', role: 'barber', name: 'James Fade', barberId: 'b2', active: true, createdAt: new Date().toISOString() },
    ],
    barbers: [
      { id: 'b1', name: 'Tony Styles', phone: '555-0101', email: 'tony@barberpro.com', skills: ['Haircut', 'Beard Trim', 'Hot Towel Shave'], commissionType: 'percentage', commissionValue: 40, fixedSalary: 0, workingHours: [{ day: 'Mon', start: '09:00', end: '18:00' }, { day: 'Tue', start: '09:00', end: '18:00' }, { day: 'Wed', start: '09:00', end: '18:00' }, { day: 'Thu', start: '09:00', end: '18:00' }, { day: 'Fri', start: '09:00', end: '18:00' }, { day: 'Sat', start: '10:00', end: '16:00' }], daysOff: ['Sun'], active: true, createdAt: new Date().toISOString() },
      { id: 'b2', name: 'James Fade', phone: '555-0102', email: 'james@barberpro.com', skills: ['Haircut', 'Fade', 'Hair Design', 'Beard Trim'], commissionType: 'percentage', commissionValue: 35, fixedSalary: 0, workingHours: [{ day: 'Mon', start: '10:00', end: '19:00' }, { day: 'Tue', start: '10:00', end: '19:00' }, { day: 'Wed', start: '10:00', end: '19:00' }, { day: 'Thu', start: '10:00', end: '19:00' }, { day: 'Fri', start: '10:00', end: '19:00' }, { day: 'Sat', start: '10:00', end: '17:00' }], daysOff: ['Sun'], active: true, createdAt: new Date().toISOString() },
      { id: 'b3', name: 'Carlos Razor', phone: '555-0103', email: 'carlos@barberpro.com', skills: ['Haircut', 'Hot Towel Shave', 'Hair Design', 'Kids Cut'], commissionType: 'fixed', commissionValue: 15, fixedSalary: 2000, workingHours: [{ day: 'Mon', start: '09:00', end: '17:00' }, { day: 'Tue', start: '09:00', end: '17:00' }, { day: 'Wed', start: '09:00', end: '17:00' }, { day: 'Thu', start: '09:00', end: '17:00' }, { day: 'Fri', start: '09:00', end: '17:00' }], daysOff: ['Sat', 'Sun'], active: true, createdAt: new Date().toISOString() },
    ],
    services: [
      { id: 's1', name: 'Classic Haircut', description: 'Traditional haircut with scissor and clipper work', price: 30, duration: 30, category: 'Hair', active: true, createdAt: new Date().toISOString() },
      { id: 's2', name: 'Fade & Taper', description: 'Modern fade with clean taper and styling', price: 40, duration: 45, category: 'Hair', active: true, createdAt: new Date().toISOString() },
      { id: 's3', name: 'Beard Trim', description: 'Precision beard shaping and trim', price: 20, duration: 20, category: 'Beard', active: true, createdAt: new Date().toISOString() },
      { id: 's4', name: 'Hot Towel Shave', description: 'Luxurious hot towel straight razor shave', price: 35, duration: 40, category: 'Shave', active: true, createdAt: new Date().toISOString() },
      { id: 's5', name: 'Hair & Beard Combo', description: 'Full haircut with beard trim and styling', price: 45, duration: 50, category: 'Combo', active: true, comboServices: ['s1', 's3'], createdAt: new Date().toISOString() },
      { id: 's6', name: 'Kids Haircut', description: 'Haircut for children under 12', price: 20, duration: 25, category: 'Hair', active: true, createdAt: new Date().toISOString() },
      { id: 's7', name: 'Hair Design', description: 'Custom hair art and design work', price: 55, duration: 60, category: 'Hair', active: true, createdAt: new Date().toISOString() },
      { id: 's8', name: 'Head Shave', description: 'Complete head shave with hot towel treatment', price: 30, duration: 35, category: 'Shave', active: true, createdAt: new Date().toISOString() },
    ],
    customers: [
      { id: 'c1', name: 'David Wilson', phone: '555-1001', email: 'david@email.com', preferredBarberId: 'b1', notes: 'Prefers fade on sides', loyaltyPoints: 150, totalSpent: 450, createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString() },
      { id: 'c2', name: 'Robert Chen', phone: '555-1002', email: 'robert@email.com', preferredBarberId: 'b2', loyaltyPoints: 80, totalSpent: 280, createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString() },
      { id: 'c3', name: 'Michael Brown', phone: '555-1003', loyaltyPoints: 200, totalSpent: 620, createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString() },
      { id: 'c4', name: 'Alex Thompson', phone: '555-1004', email: 'alex@email.com', preferredBarberId: 'b1', loyaltyPoints: 50, totalSpent: 180, createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
      { id: 'c5', name: 'Kevin Martinez', phone: '555-1005', loyaltyPoints: 320, totalSpent: 890, createdAt: new Date(Date.now() - 90*24*60*60*1000).toISOString() },
    ],
    appointments: [],
    invoices: [],
    expenses: [
      { id: 'e1', category: 'Rent', description: 'Monthly shop rent', amount: 3000, date: new Date().toISOString().split('T')[0], recordedBy: 'u1', createdAt: new Date().toISOString() },
      { id: 'e2', category: 'Utilities', description: 'Electricity bill', amount: 350, date: new Date().toISOString().split('T')[0], recordedBy: 'u1', createdAt: new Date().toISOString() },
      { id: 'e3', category: 'Supplies', description: 'Hair products restock', amount: 200, supplier: 'BeautySupply Co', date: new Date().toISOString().split('T')[0], recordedBy: 'u1', createdAt: new Date().toISOString() },
    ],
    products: [
      { id: 'p1', name: 'Pomade - Matte Finish', sku: 'POM-001', category: 'Styling', type: 'retail', purchasePrice: 8, sellingPrice: 18, quantity: 25, reorderLevel: 10, supplier: 'BeautySupply Co', active: true, createdAt: new Date().toISOString() },
      { id: 'p2', name: 'Beard Oil', sku: 'BRD-001', category: 'Beard Care', type: 'retail', purchasePrice: 6, sellingPrice: 15, quantity: 15, reorderLevel: 8, supplier: 'BeautySupply Co', active: true, createdAt: new Date().toISOString() },
      { id: 'p3', name: 'Shaving Cream', sku: 'SHV-001', category: 'Shave', type: 'consumable', purchasePrice: 4, sellingPrice: 0, quantity: 8, reorderLevel: 5, supplier: 'BeautySupply Co', active: true, createdAt: new Date().toISOString() },
      { id: 'p4', name: 'Hair Gel', sku: 'GEL-001', category: 'Styling', type: 'retail', purchasePrice: 5, sellingPrice: 12, quantity: 3, reorderLevel: 10, supplier: 'BeautySupply Co', active: true, createdAt: new Date().toISOString() },
      { id: 'p5', name: 'Aftershave Balm', sku: 'AFT-001', category: 'Shave', type: 'retail', purchasePrice: 7, sellingPrice: 16, quantity: 20, reorderLevel: 8, supplier: 'BeautySupply Co', active: true, createdAt: new Date().toISOString() },
    ],
    stockMovements: [],
    membershipPlans: [
      { id: 'mp1', name: 'Gold Monthly', price: 80, durationMonths: 1, services: [{ serviceId: 's1', visits: 2 }, { serviceId: 's3', visits: 1 }], active: true },
      { id: 'mp2', name: 'Platinum Monthly', price: 120, durationMonths: 1, services: [{ serviceId: 's2', visits: 3 }, { serviceId: 's3', visits: 2 }, { serviceId: 's4', visits: 1 }], active: true },
    ],
    customerMemberships: [],
    loyaltyTransactions: [],
    queue: [],
    notifications: [
      { id: 'n1', title: 'Welcome', message: 'BarberPro system initialized. Use admin/admin123 to login.', type: 'system', read: false, createdAt: new Date().toISOString() },
    ],
    settings: {
      name: 'BarberPro',
      address: '123 Main Street, Downtown',
      phone: '555-0100',
      email: 'info@barberpro.com',
      openingHours: [
        { day: 'Mon', start: '09:00', end: '19:00' },
        { day: 'Tue', start: '09:00', end: '19:00' },
        { day: 'Wed', start: '09:00', end: '19:00' },
        { day: 'Thu', start: '09:00', end: '19:00' },
        { day: 'Fri', start: '09:00', end: '19:00' },
        { day: 'Sat', start: '10:00', end: '17:00' },
        { day: 'Sun', start: '', end: '' },
      ],
      holidays: [],
      bufferTime: 10,
      taxEnabled: false,
      taxRate: 0,
      currency: '$',
      loyaltyPointsPerDollar: 1,
      loyaltyRedemptionRate: 100,
    },
    auditLogs: [],
    commissions: [],
    salaries: [],
  };
  saveDB(db);
  return db;
}

// ===== AUTH SERVICE =====
export const AuthService = {
  login(username: string, password: string): User | null {
    const db = getDB();
    const user = db.users.find(u => u.username === username && u.password === password && u.active);
    return user || null;
  },
  getCurrentUser(id: string): User | null {
    const db = getDB();
    return db.users.find(u => u.id === id) || null;
  },
  changePassword(userId: string, oldPass: string, newPass: string): boolean {
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user || user.password !== oldPass) return false;
    user.password = newPass;
    saveDB(db);
    return true;
  }
};

// ===== CUSTOMER SERVICE =====
export const CustomerService = {
  getAll(page = 1, limit = 20, search = ''): { data: Customer[]; total: number } {
    const db = getDB();
    let filtered = db.customers;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || c.phone.includes(s) || (c.email && c.email.toLowerCase().includes(s)));
    }
    return { data: filtered.slice((page-1)*limit, page*limit), total: filtered.length };
  },
  getById(id: string): Customer | null {
    return getDB().customers.find(c => c.id === id) || null;
  },
  create(data: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'createdAt'>): Customer {
    const db = getDB();
    const customer: Customer = { ...data, id: generateId(), loyaltyPoints: 0, totalSpent: 0, createdAt: new Date().toISOString() };
    db.customers.push(customer);
    saveDB(db);
    return customer;
  },
  update(id: string, data: Partial<Customer>): Customer | null {
    const db = getDB();
    const idx = db.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    db.customers[idx] = { ...db.customers[idx], ...data };
    saveDB(db);
    return db.customers[idx];
  },
  getHistory(customerId: string): Invoice[] {
    return getDB().invoices.filter(i => i.customerId === customerId);
  }
};

// ===== BARBER SERVICE =====
export const BarberService = {
  getAll(): Barber[] {
    return getDB().barbers.filter(b => b.active);
  },
  getAllIncludingInactive(): Barber[] {
    return getDB().barbers;
  },
  getById(id: string): Barber | null {
    return getDB().barbers.find(b => b.id === id) || null;
  },
  create(data: Omit<Barber, 'id' | 'createdAt'>): Barber {
    const db = getDB();
    const barber: Barber = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    db.barbers.push(barber);
    saveDB(db);
    return barber;
  },
  update(id: string, data: Partial<Barber>): Barber | null {
    const db = getDB();
    const idx = db.barbers.findIndex(b => b.id === id);
    if (idx === -1) return null;
    db.barbers[idx] = { ...db.barbers[idx], ...data };
    saveDB(db);
    return db.barbers[idx];
  },
  getAvailableSlots(barberId: string, date: string, serviceDuration: number): string[] {
    const db = getDB();
    const barber = db.barbers.find(b => b.id === barberId);
    if (!barber) return [];
    const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
    const workDay = barber.workingHours.find(w => w.day === dayName);
    if (!workDay) return [];
    const appointments = db.appointments.filter(a => a.barberId === barberId && a.date === date && a.status !== 'cancelled');
    const slots: string[] = [];
    const [startH, startM] = workDay.start.split(':').map(Number);
    const [endH, endM] = workDay.end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const buffer = db.settings.bufferTime;
    for (let t = startMin; t + serviceDuration <= endMin; t += 15) {
      const slotEnd = t + serviceDuration;
      const conflict = appointments.some(a => {
        const [aH, aM] = a.startTime.split(':').map(Number);
        const [aEH, aEM] = a.endTime.split(':').map(Number);
        const aStart = aH * 60 + aM;
        const aEnd = aEH * 60 + aEM;
        return !(slotEnd + buffer <= aStart || t >= aEnd + buffer);
      });
      if (!conflict) {
        const h = Math.floor(t / 60);
        const m = t % 60;
        slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
      }
    }
    return slots;
  }
};

// ===== SERVICE SERVICE =====
export const ServiceService = {
  getAll(): Service[] {
    return getDB().services.filter(s => s.active);
  },
  getAllIncludingInactive(): Service[] {
    return getDB().services;
  },
  getById(id: string): Service | null {
    return getDB().services.find(s => s.id === id) || null;
  },
  create(data: Omit<Service, 'id' | 'createdAt'>): Service {
    const db = getDB();
    const service: Service = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    db.services.push(service);
    saveDB(db);
    return service;
  },
  update(id: string, data: Partial<Service>): Service | null {
    const db = getDB();
    const idx = db.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.services[idx] = { ...db.services[idx], ...data };
    saveDB(db);
    return db.services[idx];
  }
};

// ===== APPOINTMENT SERVICE =====
export const AppointmentService = {
  getAll(filters?: { date?: string; barberId?: string; status?: AppointmentStatus }): Appointment[] {
    const db = getDB();
    let result = db.appointments;
    if (filters?.date) result = result.filter(a => a.date === filters.date);
    if (filters?.barberId) result = result.filter(a => a.barberId === filters.barberId);
    if (filters?.status) result = result.filter(a => a.status === filters.status);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getById(id: string): Appointment | null {
    return getDB().appointments.find(a => a.id === id) || null;
  },
  create(data: { customerId: string; barberId: string; serviceIds: string[]; date: string; startTime: string; type: 'online' | 'walkin'; notes?: string }): Appointment | null {
    const db = getDB();
    const services = db.services.filter(s => data.serviceIds.includes(s.id));
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const [sh, sm] = data.startTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = startMin + totalDuration;
    const endTime = `${String(Math.floor(endMin/60)).padStart(2,'0')}:${String(endMin%60).padStart(2,'0')}`;
    
    // Check for conflicts
    const conflict = db.appointments.some(a => 
      a.barberId === data.barberId && a.date === data.date && a.status !== 'cancelled' &&
      !(endTime <= a.startTime || data.startTime >= a.endTime)
    );
    if (conflict) return null;

    const appointment: Appointment = {
      id: generateId(),
      ...data,
      endTime,
      status: 'booked',
      statusHistory: [{ status: 'booked', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    db.appointments.push(appointment);
    db.notifications.push({ id: generateId(), title: 'New Booking', message: `Appointment booked for ${data.date} at ${data.startTime}`, type: 'booking', read: false, createdAt: new Date().toISOString() });
    saveDB(db);
    return appointment;
  },
  updateStatus(id: string, status: AppointmentStatus, note?: string): Appointment | null {
    const db = getDB();
    const idx = db.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    db.appointments[idx].status = status;
    db.appointments[idx].statusHistory.push({ status, timestamp: new Date().toISOString(), note });
    saveDB(db);
    return db.appointments[idx];
  },
  cancel(id: string): Appointment | null {
    return this.updateStatus(id, 'cancelled', 'Cancelled');
  }
};

// ===== INVOICE SERVICE =====
export const InvoiceService = {
  getAll(filters?: { dateFrom?: string; dateTo?: string; status?: string }): Invoice[] {
    const db = getDB();
    let result = db.invoices;
    if (filters?.dateFrom) result = result.filter(i => i.createdAt >= filters.dateFrom!);
    if (filters?.dateTo) result = result.filter(i => i.createdAt <= filters.dateTo! + 'T23:59:59');
    if (filters?.status) result = result.filter(i => i.status === filters.status);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getById(id: string): Invoice | null {
    return getDB().invoices.find(i => i.id === id) || null;
  },
  create(data: { customerId: string; barberId: string; items: InvoiceItem[]; discount?: number; appointmentId?: string; }): Invoice {
    const db = getDB();
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const discount = data.discount || 0;
    const tax = db.settings.taxEnabled ? (subtotal - discount) * db.settings.taxRate / 100 : 0;
    const total = subtotal - discount + tax;
    const invoice: Invoice = {
      id: generateId(),
      invoiceNumber: generateInvoiceNumber(),
      customerId: data.customerId,
      barberId: data.barberId,
      appointmentId: data.appointmentId,
      items: data.items,
      subtotal, discount, tax, total,
      paid: 0,
      status: 'unpaid',
      payments: [],
      createdAt: new Date().toISOString()
    };
    db.invoices.push(invoice);
    saveDB(db);
    return invoice;
  },
  addPayment(invoiceId: string, amount: number, method: PaymentMethod, note?: string): Invoice | null {
    const db = getDB();
    const idx = db.invoices.findIndex(i => i.id === invoiceId);
    if (idx === -1) return null;
    const invoice = db.invoices[idx];
    const payment: Payment = { id: generateId(), invoiceId, amount, method, timestamp: new Date().toISOString(), note };
    invoice.payments.push(payment);
    invoice.paid += amount;
    if (invoice.paid >= invoice.total) invoice.status = 'paid';
    else if (invoice.paid > 0) invoice.status = 'partial';
    
    // Update customer total spent
    const custIdx = db.customers.findIndex(c => c.id === invoice.customerId);
    if (custIdx !== -1) db.customers[custIdx].totalSpent += amount;
    
    // Add loyalty points
    const points = Math.floor(amount * db.settings.loyaltyPointsPerDollar);
    if (points > 0 && custIdx !== -1) {
      db.customers[custIdx].loyaltyPoints += points;
      db.loyaltyTransactions.push({ id: generateId(), customerId: invoice.customerId, type: 'earn', points, reason: `Purchase ${invoice.invoiceNumber}`, timestamp: new Date().toISOString() });
    }
    
    // Calculate commission
    const barber = db.barbers.find(b => b.id === invoice.barberId);
    if (barber && invoice.status === 'paid') {
      const serviceTotal = invoice.items.filter(i => i.type === 'service').reduce((s, i) => s + i.total, 0);
      let commission = 0;
      if (barber.commissionType === 'percentage') commission = serviceTotal * barber.commissionValue / 100;
      else commission = barber.commissionValue * invoice.items.filter(i => i.type === 'service').length;
      if (commission > 0) {
        db.commissions.push({ id: generateId(), barberId: barber.id, invoiceId: invoice.id, amount: commission, period: new Date().toISOString().slice(0,7), calculated: true, paid: false, createdAt: new Date().toISOString() });
      }
    }
    
    saveDB(db);
    return db.invoices[idx];
  },
  refund(invoiceId: string): Invoice | null {
    const db = getDB();
    const idx = db.invoices.findIndex(i => i.id === invoiceId);
    if (idx === -1) return null;
    db.invoices[idx].status = 'refunded';
    saveDB(db);
    return db.invoices[idx];
  }
};

// ===== EXPENSE SERVICE =====
export const ExpenseService = {
  getAll(filters?: { dateFrom?: string; dateTo?: string; category?: string }): Expense[] {
    const db = getDB();
    let result = db.expenses;
    if (filters?.dateFrom) result = result.filter(e => e.date >= filters.dateFrom!);
    if (filters?.dateTo) result = result.filter(e => e.date <= filters.dateTo!);
    if (filters?.category) result = result.filter(e => e.category === filters.category);
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  create(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const db = getDB();
    const expense: Expense = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    db.expenses.push(expense);
    saveDB(db);
    return expense;
  },
  delete(id: string): boolean {
    const db = getDB();
    const idx = db.expenses.findIndex(e => e.id === id);
    if (idx === -1) return false;
    db.expenses.splice(idx, 1);
    saveDB(db);
    return true;
  }
};

// ===== PRODUCT SERVICE =====
export const ProductService = {
  getAll(): Product[] {
    return getDB().products;
  },
  getById(id: string): Product | null {
    return getDB().products.find(p => p.id === id) || null;
  },
  create(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const db = getDB();
    const product: Product = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    db.products.push(product);
    saveDB(db);
    return product;
  },
  update(id: string, data: Partial<Product>): Product | null {
    const db = getDB();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...data };
    saveDB(db);
    return db.products[idx];
  },
  getLowStock(): Product[] {
    return getDB().products.filter(p => p.quantity <= p.reorderLevel && p.active);
  },
  adjustStock(productId: string, quantity: number, type: StockMovement['type'], reason: string, userId: string): boolean {
    const db = getDB();
    const idx = db.products.findIndex(p => p.id === productId);
    if (idx === -1) return false;
    db.products[idx].quantity += quantity;
    if (db.products[idx].quantity < 0) db.products[idx].quantity = 0;
    db.stockMovements.push({ id: generateId(), productId, type, quantity, reason, timestamp: new Date().toISOString(), recordedBy: userId });
    saveDB(db);
    return true;
  },
  getStockMovements(productId?: string): StockMovement[] {
    const db = getDB();
    if (productId) return db.stockMovements.filter(m => m.productId === productId);
    return db.stockMovements;
  }
};

// ===== QUEUE SERVICE =====
export const QueueService = {
  getAll(): QueueEntry[] {
    return getDB().queue.filter(q => q.status === 'waiting' || q.status === 'in_service');
  },
  join(customerId: string, serviceIds: string[], barberId?: string): QueueEntry {
    const db = getDB();
    const services = db.services.filter(s => serviceIds.includes(s.id));
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const waitingCount = db.queue.filter(q => q.status === 'waiting').length;
    const entry: QueueEntry = {
      id: generateId(), token: generateToken(), customerId, barberId, serviceIds,
      status: 'waiting', estimatedWait: waitingCount * 30 + totalDuration,
      joinedAt: new Date().toISOString()
    };
    db.queue.push(entry);
    saveDB(db);
    return entry;
  },
  callNext(barberId?: string): QueueEntry | null {
    const db = getDB();
    const next = db.queue.find(q => q.status === 'waiting' && (!barberId || !q.barberId || q.barberId === barberId));
    if (!next) return null;
    next.status = 'in_service';
    next.startedAt = new Date().toISOString();
    if (barberId) next.barberId = barberId;
    saveDB(db);
    return next;
  },
  complete(id: string): boolean {
    const db = getDB();
    const entry = db.queue.find(q => q.id === id);
    if (!entry) return false;
    entry.status = 'completed';
    entry.completedAt = new Date().toISOString();
    saveDB(db);
    return true;
  },
  cancel(id: string): boolean {
    const db = getDB();
    const entry = db.queue.find(q => q.id === id);
    if (!entry) return false;
    entry.status = 'cancelled';
    saveDB(db);
    return true;
  }
};

// ===== REPORTS SERVICE =====
export const ReportService = {
  getDashboardStats() {
    const db = getDB();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    const todayInvoices = db.invoices.filter(i => i.createdAt.startsWith(today));
    const monthInvoices = db.invoices.filter(i => i.createdAt.startsWith(thisMonth));
    const todayRevenue = todayInvoices.reduce((s, i) => s + i.paid, 0);
    const monthRevenue = monthInvoices.reduce((s, i) => s + i.paid, 0);
    const todayAppointments = db.appointments.filter(a => a.date === today);
    const monthExpenses = db.expenses.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
    const lowStock = db.products.filter(p => p.quantity <= p.reorderLevel);
    
    return {
      todayRevenue, monthRevenue,
      todayAppointments: todayAppointments.length,
      monthAppointments: monthInvoices.length,
      totalCustomers: db.customers.length,
      monthExpenses,
      netProfit: monthRevenue - monthExpenses,
      lowStockCount: lowStock.length,
      pendingPayments: db.invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').reduce((s, i) => s + (i.total - i.paid), 0)
    };
  },
  getRevenueByDay(days: number = 30) {
    const db = getDB();
    const result: { date: string; revenue: number; expenses: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const revenue = db.invoices.filter(inv => inv.createdAt.startsWith(dateStr)).reduce((s, inv) => s + inv.paid, 0);
      const expenses = db.expenses.filter(e => e.date === dateStr).reduce((s, e) => s + e.amount, 0);
      result.push({ date: dateStr, revenue, expenses });
    }
    return result;
  },
  getTopServices() {
    const db = getDB();
    const serviceCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    db.invoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.type === 'service') {
          if (!serviceCounts[item.itemId]) serviceCounts[item.itemId] = { name: item.name, count: 0, revenue: 0 };
          serviceCounts[item.itemId].count += item.quantity;
          serviceCounts[item.itemId].revenue += item.total;
        }
      });
    });
    return Object.values(serviceCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  },
  getBarberPerformance() {
    const db = getDB();
    return db.barbers.filter(b => b.active).map(barber => {
      const invoices = db.invoices.filter(i => i.barberId === barber.id);
      const revenue = invoices.reduce((s, i) => s + i.paid, 0);
      const appointments = db.appointments.filter(a => a.barberId === barber.id);
      const completed = appointments.filter(a => a.status === 'completed').length;
      const commissions = db.commissions.filter(c => c.barberId === barber.id).reduce((s, c) => s + c.amount, 0);
      return { ...barber, revenue, totalAppointments: appointments.length, completedAppointments: completed, commissions };
    });
  },
  getFinancialReport(dateFrom: string, dateTo: string) {
    const db = getDB();
    const invoices = db.invoices.filter(i => i.createdAt >= dateFrom && i.createdAt <= dateTo + 'T23:59:59');
    const expenses = db.expenses.filter(e => e.date >= dateFrom && e.date <= dateTo);
    const commissions = db.commissions.filter(c => c.createdAt >= dateFrom && c.createdAt <= dateTo + 'T23:59:59');
    const revenue = invoices.reduce((s, i) => s + i.paid, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalCommissions = commissions.reduce((s, c) => s + c.amount, 0);
    const discounts = invoices.reduce((s, i) => s + i.discount, 0);
    const refunds = invoices.filter(i => i.status === 'refunded').reduce((s, i) => s + i.paid, 0);
    return { revenue, totalExpenses, totalCommissions, discounts, refunds, netProfit: revenue - totalExpenses - totalCommissions };
  }
};

// ===== SETTINGS SERVICE =====
export const SettingsService = {
  get(): ShopSettings {
    return getDB().settings;
  },
  update(data: Partial<ShopSettings>): ShopSettings {
    const db = getDB();
    db.settings = { ...db.settings, ...data };
    saveDB(db);
    return db.settings;
  }
};

// ===== NOTIFICATION SERVICE =====
export const NotificationService = {
  getAll(): Notification[] {
    return getDB().notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  markRead(id: string): void {
    const db = getDB();
    const n = db.notifications.find(n => n.id === id);
    if (n) { n.read = true; saveDB(db); }
  },
  markAllRead(): void {
    const db = getDB();
    db.notifications.forEach(n => n.read = true);
    saveDB(db);
  },
  getUnreadCount(): number {
    return getDB().notifications.filter(n => !n.read).length;
  }
};

export { getDB, saveDB };
