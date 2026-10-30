// Simple data store for the public barbershop website

const DB_KEY = 'barberpro_db';

export interface Barber {
  id: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[];
  workingHours: { day: string; start: string; end: string }[];
  daysOff: string[];
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredBarberId?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  type: 'online' | 'walkin';
  createdAt: string;
}

export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: { day: string; start: string; end: string }[];
  bufferTime: number;
}

interface Database {
  barbers: Barber[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  settings: ShopSettings;
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

function initializeDB(): Database {
  const db: Database = {
    barbers: [
      {
        id: 'b1',
        name: 'Tony Styles',
        phone: '555-0101',
        email: 'tony@shop.com',
        skills: ['Classic Cut', 'Fade', 'Beard Trim', 'Hot Shave'],
        workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '09:00', end: '18:00' })).concat([{ day: 'Sat', start: '10:00', end: '16:00' }]),
        daysOff: ['Sun'],
        active: true
      },
      {
        id: 'b2',
        name: 'James Fade',
        phone: '555-0102',
        email: 'james@shop.com',
        skills: ['Skin Fade', 'Hair Design', 'Beard Sculpt'],
        workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '10:00', end: '19:00' })).concat([{ day: 'Sat', start: '10:00', end: '17:00' }]),
        daysOff: ['Sun'],
        active: true
      },
      {
        id: 'b3',
        name: 'Carlos Razor',
        phone: '555-0103',
        skills: ['Straight Razor', 'Hot Towel Shave', 'Classic Cut'],
        workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '09:00', end: '17:00' })),
        daysOff: ['Sat','Sun'],
        active: true
      }
    ],
    services: [
      { id: 's1', name: 'Classic Haircut', description: 'Traditional scissor and clipper cut with styling', price: 30, duration: 30, category: 'Hair', active: true },
      { id: 's2', name: 'Fade & Taper', description: 'Modern fade with clean taper and finish', price: 40, duration: 45, category: 'Hair', active: true },
      { id: 's3', name: 'Beard Trim', description: 'Precision beard shaping and line-up', price: 20, duration: 20, category: 'Beard', active: true },
      { id: 's4', name: 'Hot Towel Shave', description: 'Straight razor shave with hot towel treatment', price: 35, duration: 40, category: 'Shave', active: true },
      { id: 's5', name: 'Hair & Beard Combo', description: 'Full haircut with beard trim and styling', price: 45, duration: 50, category: 'Combo', active: true },
      { id: 's6', name: 'Kids Cut', description: 'Haircut for children under 12', price: 20, duration: 25, category: 'Hair', active: true },
      { id: 's7', name: 'Hair Design', description: 'Custom hair art and pattern work', price: 55, duration: 60, category: 'Hair', active: true },
      { id: 's8', name: 'Head Shave', description: 'Complete head shave with hot towel', price: 30, duration: 35, category: 'Shave', active: true }
    ],
    customers: [],
    appointments: [],
    settings: {
      name: 'Iron & Blade',
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
        { day: 'Sun', start: '', end: '' }
      ],
      bufferTime: 10
    }
  };
  saveDB(db);
  return db;
}

export const BarberService = {
  getAll(): Barber[] {
    return getDB().barbers.filter(b => b.active);
  },
  getById(id: string): Barber | null {
    return getDB().barbers.find(b => b.id === id) || null;
  },
  getAvailableSlots(barberId: string, date: string, serviceDuration: number): string[] {
    const db = getDB();
    const barber = db.barbers.find(b => b.id === barberId);
    if (!barber) return [];
    
    const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
    const workDay = barber.workingHours.find(w => w.day === dayName);
    if (!workDay) return [];
    
    const appointments = db.appointments.filter(a => 
      a.barberId === barberId && a.date === date && a.status !== 'cancelled'
    );
    
    const slots: string[] = [];
    const [sH, sM] = workDay.start.split(':').map(Number);
    const [eH, eM] = workDay.end.split(':').map(Number);
    const startMin = sH * 60 + sM;
    const endMin = eH * 60 + eM;
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
        slots.push(`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`);
      }
    }
    
    return slots;
  }
};

export const ServiceService = {
  getAll(): Service[] {
    return getDB().services.filter(s => s.active);
  },
  getById(id: string): Service | null {
    return getDB().services.find(s => s.id === id) || null;
  }
};

export const CustomerService = {
  getAll(page = 1, limit = 20, search = ''): { data: Customer[]; total: number } {
    const db = getDB();
    let filtered = db.customers;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(s) || c.phone.includes(s)
      );
    }
    return {
      data: filtered.slice((page-1)*limit, page*limit),
      total: filtered.length
    };
  },
  create(data: Omit<Customer, 'id'>): Customer {
    const db = getDB();
    const customer: Customer = { ...data, id: generateId() };
    db.customers.push(customer);
    saveDB(db);
    return customer;
  }
};

export const AppointmentService = {
  create(data: {
    customerId: string;
    barberId: string;
    serviceIds: string[];
    date: string;
    startTime: string;
    type: 'online' | 'walkin';
  }): Appointment | null {
    const db = getDB();
    const services = db.services.filter(s => data.serviceIds.includes(s.id));
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const [sh, sm] = data.startTime.split(':').map(Number);
    const endMin = sh * 60 + sm + totalDuration;
    const endTime = `${String(Math.floor(endMin/60)).padStart(2,'0')}:${String(endMin%60).padStart(2,'0')}`;
    
    // Check for conflicts
    const conflict = db.appointments.some(a => 
      a.barberId === data.barberId && 
      a.date === data.date && 
      a.status !== 'cancelled' && 
      !(endTime <= a.startTime || data.startTime >= a.endTime)
    );
    
    if (conflict) return null;
    
    const appointment: Appointment = {
      id: generateId(),
      ...data,
      endTime,
      status: 'booked',
      createdAt: new Date().toISOString()
    };
    
    db.appointments.push(appointment);
    saveDB(db);
    return appointment;
  }
};

export const SettingsService = {
  get(): ShopSettings {
    return getDB().settings;
  }
};
