export const getEvents = async () => {
    if (typeof window === 'undefined') return [];
    try {
      const res = await fetch('/api/event');
      if (!res.ok) throw new Error('Failed to fetch events');
      return await res.json();
    } catch(err) {
      return [{ 
        id: "1",
        name: "Didaar Exhibition", 
        venue: "Grand Expo Hall", 
        city: "Mumbai", 
        startDate: "2026-10-15", 
        endDate: "2026-10-18" 
      }];
    }
};

export const addEvent = async (data) => {
    if (typeof window === 'undefined') return false;
    try {
      const res = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch(err) {
      return false;
    }
};
  
export const updateEventDetails = async (data) => {
    if (typeof window === 'undefined') return false;
    try {
        const res = await fetch('/api/event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });
        return res.ok;
    } catch(err) {
        return false;
    }
};

export const deleteEvent = async (id) => {
    if (typeof window === 'undefined') return false;
    try {
        const res = await fetch(`/api/event?id=${id}`, {
        method: 'DELETE',
        });
        return res.ok;
    } catch(err) {
        return false;
    }
};
