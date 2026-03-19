export const getOrgData = async () => {
    try {
        const response = await fetch('/api/org');
        if (!response.ok) throw new Error('Failed to fetch org data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching org data:', error);
        return null;
    }
};

export const updateOrgData = async (data) => {
    try {
        const response = await fetch('/api/org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error('Error updating org data:', error);
        return false;
    }
};
