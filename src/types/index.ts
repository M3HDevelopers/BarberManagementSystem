// Types for the public barbershop website

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
