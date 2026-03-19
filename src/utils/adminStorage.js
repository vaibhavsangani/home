export const getAdminData = async () => {
  try {
    const res = await fetch('/api/admin');
    if (!res.ok) throw new Error('Failed to fetch admin data');
    return await res.json();
  } catch (error) {
    console.error('Error fetching admin data:', error);
    // Fallback default
    return { adminId: 'admin', adminPassword: 'admin123' };
  }
};

export const updateAdminData = async (data) => {
  try {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating admin data:', error);
    return false;
  }
};
