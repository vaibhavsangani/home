export const getVendors = async () => {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('/api/vendor');
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const saveVendor = async (vendorData) => {
  if (typeof window === 'undefined') return null;
  const id = `VND-${Math.floor(10000 + Math.random() * 90000)}`;
  const newVendor = {
    id,
    ...vendorData,
    date: new Date().toLocaleDateString(),
    status: 'pending' // Vendors usually start pending
  };
  
  try {
    const res = await fetch('/api/vendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVendor)
    });
    
    if (!res.ok) {
      console.error('API Error Response:', await res.text());
      return null;
    }
    
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateVendor = async (id, updatedData) => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/vendor', {
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

export const deleteVendor = async (id) => {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/vendor', {
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
