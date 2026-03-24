export const STORAGE_KEY = 'didaar_registrations';
import { getVendors } from './vendorStorage';

// The backend handles initialization, so this is just a stub to avoid breaking imports
export const initializeStorage = () => {};

export const getRegistrations = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('/api/registrations');
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const saveRegistration = async (registrationData) => {
  if (typeof window === 'undefined') return null;
  const id = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
  const newRegistration = {
    id,
    ...registrationData,
    date: new Date().toLocaleDateString(),
    status: registrationData.ticketType === 'paid' ? 'confirmed' : 'verified'
  };
  
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRegistration)
    });
    
    const result = await res.json();
    if (!res.ok) {
      console.error('API Error Response:', result);
      return { error: result.error || 'Failed to create registration' };
    }
    
    return result;
  } catch (err) {
    console.error(err);
    return { error: 'Network error or database connection failed.' };
  }
};

export const updateRegistrationStatus = async (id, newStatus) => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/registrations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updatedData: { status: newStatus } })
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getRegistrationById = async (id) => {
  const registrations = await getRegistrations();
  let found = registrations.find(r => r.id === id);
  if (!found) {
    const vendors = await getVendors();
    found = vendors.find(v => v.id === id);
  }
  return found || null;
};

export const updateRegistration = async (id, updatedData) => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/registrations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updatedData })
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteRegistration = async (id) => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/registrations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};
