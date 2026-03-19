'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRegistrations, initializeStorage, updateRegistration, deleteRegistration } from '@/utils/storage';
import { getEvents, addEvent, updateEventDetails, deleteEvent } from '@/utils/eventStorage';
import { getVendors, updateVendor, deleteVendor } from '@/utils/vendorStorage';
import { getOrgData, updateOrgData } from '@/utils/orgStorage';
import { getAdminData, updateAdminData } from '@/utils/adminStorage';

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orgData, setOrgData] = useState({
    companyName: 'Didaar Exhibition',
    visionStatement: '',
    coreTeam: {
      owner: { name: '', detail: '', photo: '' },
      manager: { name: '', detail: '', photo: '' },
      company: { name: '', detail: '', photo: '' }
    },
    additionalMembers: []
  });
  const [events, setEvents] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('registrations');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [adminCredentials, setAdminCredentials] = useState({ adminId: 'admin', adminPassword: 'admin123' });
  const [securityForm, setSecurityForm] = useState({ adminId: '', adminPassword: '' });
  const [error, setError] = useState('');

  // Reg Edit state
  const [editingReg, setEditingReg] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Event Edit state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ name: '', venue: '', city: '', startDate: '', endDate: '' });
  const [savingEvent, setSavingEvent] = useState(false);

  useEffect(() => {
    initializeStorage();
    const loadData = async () => {
      setRegistrations(await getRegistrations());
      setVendors(await getVendors());
      setOrgData(await getOrgData());
      setEvents(await getEvents());
      const adminData = await getAdminData();
      setAdminCredentials(adminData);
      setSecurityForm(adminData);
    };
    loadData();
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setMounted(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.id === adminCredentials.adminId && loginForm.password === adminCredentials.adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid Admin ID or Password');
    }
  };

  const handleGoogleLogin = () => {
    // Simulated Google Login
    alert('Direct Google Login is currently in demonstration mode. Integration with Google Cloud Console is required for production.');
    // Mock success for demo purposes if desired, or just leave as alert
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const handleEdit = (reg) => {
    setEditingReg(reg.id);
    setEditForm({ ...reg });
  };

  const handleSaveEdit = async () => {
    const isVendor = editForm.role === 'vendor' || editForm.id.startsWith('VND-');
    if (isVendor) {
      if (await updateVendor(editingReg, editForm)) {
        setVendors(await getVendors());
        setEditingReg(null);
        setEditForm(null);
      }
    } else {
      if (await updateRegistration(editingReg, editForm)) {
        setRegistrations(await getRegistrations());
        setEditingReg(null);
        setEditForm(null);
      }
    }
  };

  const handleDelete = async (id, isVendor = false) => {
    if (confirm(`Are you sure you want to delete this ${isVendor ? 'vendor' : 'registration'}?`)) {
      if (isVendor) {
        if (await deleteVendor(id)) setVendors(await getVendors());
      } else {
        if (await deleteRegistration(id)) setRegistrations(await getRegistrations());
      }
    }
  };

  const handleSaveEvent = async () => {
    setSavingEvent(true);
    if (editingEvent) {
      await updateEventDetails(eventForm);
    } else {
      await addEvent(eventForm);
    }
    setEvents(await getEvents());
    setIsEventModalOpen(false);
    setSavingEvent(false);
  };

  const handleUpdateCore = (role, field, value) => {
    setOrgData({
      ...orgData,
      coreTeam: {
        ...orgData.coreTeam,
        [role]: { ...orgData.coreTeam[role], [field]: value }
      }
    });
  };

  const handleCorePhotoUpload = (e, role) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateCore(role, 'photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = () => {
    const newMember = {
      id: 'm' + Date.now(),
      name: '',
      role: '',
      photo: ''
    };
    setOrgData({ ...orgData, additionalMembers: [...orgData.additionalMembers, newMember] });
  };

  const handleUpdateMember = (id, field, value) => {
    const updatedMembers = orgData.additionalMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setOrgData({ ...orgData, additionalMembers: updatedMembers });
  };

  const handleRemoveMember = (id) => {
    setOrgData({ ...orgData, additionalMembers: orgData.additionalMembers.filter(m => m.id !== id) });
  };

  const handleMemberPhotoUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateMember(id, 'photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveOrgData = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    if (await updateOrgData(orgData)) {
      alert('Team & Organization details updated successfully!');
    }
    setSavingEvent(false);
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    if (await updateAdminData(securityForm)) {
      setAdminCredentials(securityForm);
      alert('Admin credentials updated successfully! Please use your new ID/Password for next login.');
    } else {
      alert('Failed to update credentials.');
    }
    setSavingEvent(false);
  };

  const guestsOnly = registrations.filter(r => r.role !== 'vendor' && r.role !== 'stall' && r.type !== 'stall');
  const newCount = guestsOnly.filter(r => r.type === 'new').length;
  const invitedCount = guestsOnly.filter(r => r.type === 'invited').length;
  const stallCount = vendors.length;
  const totalRev = registrations.filter(r => r.ticketType === 'paid' && r.status === 'confirmed').length * 49;

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'User Type', 'Ticket Type', 'Status', 'Date'];
    const rows = registrations.map(r => [
      r.id, 
      `"${r.name || ''}"`, 
      `"${r.email || ''}"`, 
      `"${r.phone || ''}"`, 
      r.type, 
      r.ticketType, 
      r.status, 
      `"${r.date}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const url = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `didaar_attendees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVendorsCSV = () => {
    const headers = ['Vendor ID', 'Company Name', 'Representative', 'Email', 'Phone', 'GST Number', 'Category', 'Stall Size', 'Status', 'Date'];
    const rows = vendors.map(v => [
      v.id,
      `"${v.companyName || ''}"`,
      `"${v.name || ''}"`,
      `"${v.email || ''}"`,
      `"${v.phone || ''}"`,
      `"${v.gstNumber || 'N/A'}"`,
      `"${v.category || ''}"`,
      v.stallSize,
      v.status,
      `"${v.date}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const url = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `didaar_vendors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null; // Avoid hydration mismatch

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form animate-fade-in" onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="logo mb-8 text-center" style={{ color: 'var(--color-brand-green)', fontWeight: '900' }}>Didaar Exhibition</div>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#fff' }}>Admin Portal</h2>
          {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          <div className="form-group mt-4">
            <label>Admin ID</label>
            <input 
              type="text" 
              value={loginForm.id} 
              onChange={e => setLoginForm({...loginForm, id: e.target.value})} 
              className="input-field" 
              placeholder="Enter admin ID..." 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={loginForm.password} 
              onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
              className="input-field" 
              placeholder="Enter password..." 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" style={{ padding: '1rem', background: 'var(--color-brand-blue)' }}>Login to Dashboard</button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'rgba(255,255,255,0.1)' }}>
            <div style={{ flex: 1, height: '1px', background: 'currentColor' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.8rem', fontWeight: '800' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'currentColor' }}></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="btn btn-outline w-full" style={{ padding: '0.9rem', display: 'flex', gap: '0.75rem', fontSize: '0.9rem', borderColor: 'rgba(255,255,255,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.73-3.21 2.73c-2.13 0-3.86-1.73-3.86-3.86s1.73-3.86 3.86-3.86c.95 0 1.8.35 2.45.92l2.13-2.13C18.73 6.3 16.51 5.4 14.18 5.4c-4.26 0-7.72 3.46-7.72 7.72s3.46 7.72 7.72 7.72c4.05 0 7.3-3.03 7.68-6.91c.03-.27.05-.55.05-.83c0-.33-.02-.66-.06-1z"/></svg>
            Continue with Google
          </button>

          <Link href="/" style={{ display: 'block', textAlign: 'center', margin: '1.5rem 0', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
            ← Back to Main Site
          </Link>
        </form>
        <style>{`
          .admin-login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-bg-dark);
            padding: 1rem;
          }
          .admin-login-form {
            background: var(--color-bg-panel);
            padding: 2.5rem 3rem;
            border-radius: 16px;
            border: 1px solid var(--color-border);
            width: 100%;
            max-width: 420px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          }
          .form-group { margin-bottom: 1.25rem; }
          .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: var(--color-text-secondary); }
          .input-field { width: 100%; background: var(--color-bg-dark); border: 1px solid var(--color-border); color: var(--color-text-primary); padding: 0.75rem 1rem; border-radius: 8px; font-family: var(--font-body); transition: all 0.2s; }
          .input-field:focus { outline: none; border-color: var(--color-gold-main); box-shadow: 0 0 0 2px rgba(230, 184, 0, 0.2); }
          .login-hint { background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: center; color: var(--color-text-secondary); font-size: 0.85rem; border: 1px dashed var(--color-border); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <nav className="nav-sidebar">
        <div className="logo mb-8" style={{ color: 'var(--color-brand-green)', fontWeight: '900' }}>Didaar Exhibition</div>
        <ul className="nav-list">
          <li className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>Dashboard</li>
          <li className={`nav-item ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => setActiveTab('vendors')}>Stall Vendors</li>
          <li className={`nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team & Org</li>
          <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Manage Events</li>
          <li className={`nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security Access</li>
          <li className="nav-item" onClick={handleLogout}>Logout</li>
        </ul>
        <Link href="/" className="exit-link">← Return to Site</Link>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">
            {activeTab === 'registrations' ? 'Guest Overview' : 
             activeTab === 'vendors' ? 'Stall Vendor Applications' : 
             activeTab === 'team' ? 'Team & Organization' : 
             activeTab === 'settings' ? 'Manage Exhibitions' :
             'System Security'}
          </h1>
          <div className="admin-profile">Admin Online</div>
        </header>

        {activeTab === 'registrations' && (
          <>
            <section className="stats-grid animate-fade-in">
              <div className="stat-card">
                <h3 className="stat-label">Total Guests</h3>
                <p className="stat-value">{registrations.filter(r => r.role !== 'vendor').length}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-label">New Bookings</h3>
                <p className="stat-value">{newCount}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-label">Invited Guests</h3>
                <p className="stat-value">{invitedCount}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-label">Ticket Revenue</h3>
                <p className="stat-value" style={{ color: 'var(--color-brand-green)' }}>Rs {totalRev}</p>
              </div>
            </section>

            <section className="table-section animate-fade-in">
              <div className="table-header">
                <h2 className="table-title">Recent Registrations</h2>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={handleExportCSV}>
                  Export CSV
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>User Type</th>
                      <th>Ticket</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.filter(r => r.role !== 'vendor' && r.role !== 'stall' && r.type !== 'stall').length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-8 text-secondary">
                          No guest registrations found yet.
                        </td>
                      </tr>
                    ) : (
                      registrations.filter(r => r.role !== 'vendor' && r.role !== 'stall' && r.type !== 'stall').slice().reverse().map((reg) => (
                        <tr key={reg.id}>
                          <td className="font-semibold">{reg.name || 'Guest'}</td>
                          <td className="text-secondary">{reg.email}</td>
                          <td className="text-secondary">{reg.phone || '-'}</td>
                          <td>
                            <span className={`badge ${reg.type === 'invited' ? 'badge-invited' : 'badge-new'}`}>
                              {reg.type.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${reg.ticketType === 'paid' ? 'badge-paid' : 'badge-free'}`}>
                              {reg.ticketType.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`status-dot ${reg.status}`}></span>
                            {reg.status}
                          </td>
                          <td className="text-secondary">{reg.date}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="action-btn edit-btn" onClick={() => handleEdit(reg)}>Edit</button>
                            <button className="action-btn delete-btn" onClick={() => handleDelete(reg.id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'vendors' && (
          <section className="table-section animate-fade-in">
            <div className="table-header">
              <h2 className="table-title">Vendor & Stall Applications</h2>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--color-gold-main)', color: 'var(--color-gold-main)' }} onClick={handleExportVendorsCSV}>
                Export Vendors Excel
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Representative</th>
                    <th>GST Number</th>
                    <th>Contact Info</th>
                    <th>Category</th>
                    <th>Stall Size</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-secondary">
                        No stall vendors found yet.
                      </td>
                    </tr>
                  ) : (
                    vendors.slice().reverse().map((reg) => (
                      <tr key={reg.id} style={{ background: 'rgba(230,184,0,0.02)' }}>
                        <td><div className="font-semibold" style={{ color: 'var(--color-gold-main)' }}>{reg.companyName}</div></td>
                        <td>{reg.name}</td>
                        <td className="text-secondary" style={{ fontSize: '0.85rem' }}>{reg.gstNumber || 'N/A'}</td>
                        <td className="text-secondary">
                          <div style={{ fontSize: '0.85rem' }}>{reg.email}</div>
                          <div style={{ fontSize: '0.85rem' }}>{reg.phone || '-'}</div>
                        </td>
                        <td>
                          <span className="badge" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                            {(reg.category || 'N/A').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-paid">
                            {reg.stallSize.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-dot ${reg.status}`}></span>
                          {reg.status}
                        </td>
                        <td className="text-secondary" style={{ fontSize: '0.9rem' }}>{reg.date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="action-btn edit-btn" onClick={() => handleEdit(reg)}>Edit</button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(reg.id, true)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'team' && (
          <div className="admin-section animate-fade-in">
            <div className="admin-card" style={{ maxWidth: '1000px', margin: '0 auto', background: 'var(--color-bg-panel)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <div className="section-header" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gold-main)' }}>Team & Organization Profile</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Manage the primary representatives and additional team members.
                </p>
              </div>

              <form onSubmit={handleSaveOrgData}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Event Group/Company Name</label>
                    <input type="text" className="input-field" value={orgData.companyName} onChange={e => setOrgData({...orgData, companyName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Vision Statement</label>
                    <input type="text" className="input-field" value={orgData.visionStatement} onChange={e => setOrgData({...orgData, visionStatement: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                  {['owner', 'manager', 'company'].map(role => (
                    <div key={role} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)' }}>
                      <h4 style={{ color: 'var(--color-gold-main)', textTransform: 'capitalize', marginBottom: '1.5rem', textAlign: 'center' }}>{role} Option</h4>
                      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', overflow: 'hidden', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {orgData.coreTeam[role].photo ? <img src={orgData.coreTeam[role].photo} alt={role} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span>👤</span>}
                        </div>
                        <input type="file" id={`core-photo-${role}`} style={{display:'none'}} accept="image/*" onChange={e => handleCorePhotoUpload(e, role)} />
                        <label htmlFor={`core-photo-${role}`} className="action-btn edit-btn" style={{cursor:'pointer', fontSize:'0.7rem', padding:'0.3rem 0.7rem'}}>Update Photo</label>
                      </div>
                      <div className="form-group mb-4">
                        <label style={{fontSize:'0.8rem', color:'var(--color-text-secondary)'}}>Representative Name</label>
                        <input type="text" className="input-field" style={{fontSize:'0.9rem'}} value={orgData.coreTeam[role].name} onChange={e => handleUpdateCore(role, 'name', e.target.value)} placeholder={`${role} Name...`} />
                      </div>
                      <div className="form-group">
                        <label style={{fontSize:'0.8rem', color:'var(--color-text-secondary)'}}>Core Detail / Description</label>
                        <textarea className="input-field" rows="3" style={{fontSize:'0.85rem'}} value={orgData.coreTeam[role].detail} onChange={e => handleUpdateCore(role, 'detail', e.target.value)} placeholder={`Key details about the ${role}...`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                   <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', margin: 0 }}>Additional Team Members</h3>
                   <button type="button" className="action-btn edit-btn" onClick={handleAddMember}>+ Add Member to Access</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orgData.additionalMembers.map((member) => (
                    <div key={member.id} className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '12px', display: 'grid', gridTemplateColumns: '60px 1fr 1fr 100px', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {member.photo ? <img src={member.photo} alt="Team" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span>👤</span>}
                        </div>
                        <input type="file" id={`member-photo-${member.id}`} style={{display:'none'}} accept="image/*" onChange={e => handleMemberPhotoUpload(e, member.id)} />
                        <label htmlFor={`member-photo-${member.id}`} style={{position:'absolute', bottom:0, right:0, cursor:'pointer', background:'var(--color-gold-main)', color:'#000', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}>+</label>
                      </div>
                      <input type="text" className="input-field" value={member.name} onChange={e => handleUpdateMember(member.id, 'name', e.target.value)} placeholder="Full Name..." />
                      <input type="text" className="input-field" value={member.role} onChange={e => handleUpdateMember(member.id, 'role', e.target.value)} placeholder="Designation..." />
                      <button type="button" className="action-btn delete-btn" onClick={() => handleRemoveMember(member.id)}>Remove</button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem', textAlign: 'right' }}>
                  <button type="submit" className="action-btn edit-btn" disabled={savingEvent} style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>
                    {savingEvent ? 'Saving...' : 'Sync to Homepage'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <section className="settings-section animate-fade-in" style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Active Exhibitions</h2>
              <button 
                className="btn btn-primary" 
                onClick={() => { setEventForm({ name: '', venue: '', city: '', startDate: '', endDate: '' }); setEditingEvent(null); setIsEventModalOpen(true); }}
              >
                + Create New Event
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {events.map(ev => (
                <div key={ev.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', position: 'relative' }}>
                  <h3 style={{ color: 'var(--color-gold-main)', marginBottom: '0.25rem', fontSize: '1.3rem' }}>{ev.name}</h3>
                  <p className="text-secondary" style={{ marginBottom: '1.25rem', fontSize: '0.9rem' }}>{ev.venue}, {ev.city}</p>
                  
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📅</span> {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} - {new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem 0' }} onClick={() => { setEditingEvent(ev.id); setEventForm(ev); setIsEventModalOpen(true); }}>Edit Settings</button>
                    <button className="btn btn-outline" style={{ padding: '0.6rem 1rem', borderColor: '#ff4444', color: '#ff4444' }} onClick={async () => {
                      if (confirm(`Are you sure you want to completely delete "${ev.name}"? This action cannot be undone.`)) {
                        await deleteEvent(ev.id);
                        setEvents(await getEvents());
                      }
                    }}>Delete</button>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', border: '1px dashed var(--color-border)' }}>
                  <p className="text-secondary" style={{ fontSize: '1.1rem' }}>No events found in the database. Create your first exhibition above.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'security' && (
          <div className="admin-section animate-fade-in">
             <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-bg-panel)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                <div className="section-header" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-brand-blue)', letterSpacing: '-1px' }}>Admin Credentials</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', marginTop: '0.75rem', fontWeight: '600' }}>
                      Update your login ID and Password for the Didaar Exhibition Admin Portal.
                    </p>
                </div>

                <form onSubmit={handleUpdateSecurity}>
                   <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin User ID</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={securityForm.adminId} 
                        onChange={e => setSecurityForm({...securityForm, adminId: e.target.value})} 
                        placeholder="Set new Admin ID..."
                        required 
                      />
                   </div>

                   <div className="form-group" style={{ marginBottom: '3rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>New Admin Password</label>
                      <input 
                        type="password" 
                        className="input-field" 
                        value={securityForm.adminPassword} 
                        onChange={e => setSecurityForm({...securityForm, adminPassword: e.target.value})} 
                        placeholder="Set new Password..."
                        required 
                      />
                   </div>

                   <button type="submit" className="btn btn-primary w-full" disabled={savingEvent} style={{ padding: '1.1rem', background: 'var(--color-brand-blue)', fontWeight: '900', fontSize: '1.1rem' }}>
                      {savingEvent ? 'Updating...' : 'Save Security Settings'}
                   </button>
                   
                   <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>
                     🔒 Your credentials are saved locally in the system database.
                   </p>
                </form>
             </div>
          </div>
        )}
      </main>

      {/* Reg Edit Modal */}
      {editingReg && editForm && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Edit Registration Data</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-field" />
            </div>
            
            <div className="form-group">
              <label>Email / Contact</label>
              <input type="text" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="input-field" />
            </div>
            
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>User Type</label>
                <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="input-field">
                  <option value="new">New</option>
                  <option value="invited">Invited</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ticket Type</label>
                <select value={editForm.ticketType} onChange={e => setEditForm({...editForm, ticketType: e.target.value})} className="input-field">
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="input-field">
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }} onClick={() => {setEditingReg(null); setEditForm(null);}}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }} onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Add/Edit Modal */}
      {isEventModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--color-gold-main)' }}>
              {editingEvent ? 'Edit Exhibition Details' : 'Deploy New Exhibition'}
            </h3>
            
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group mb-0">
                <label>Event Name</label>
                <input type="text" className="input-field" value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} placeholder="e.g. Didaar Art Expo" required/>
              </div>
              <div className="form-group mb-0">
                <label>City</label>
                <input type="text" className="input-field" value={eventForm.city} onChange={e => setEventForm({...eventForm, city: e.target.value})} placeholder="e.g. Mumbai" required/>
              </div>
            </div>
            
            <div className="form-group mt-4">
              <label>Venue Name</label>
              <input type="text" className="input-field" value={eventForm.venue} onChange={e => setEventForm({...eventForm, venue: e.target.value})} placeholder="e.g. Grand Expo Hall" required/>
            </div>
            
            <div className="grid-2 mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group mb-0">
                <label>Start Date</label>
                <input type="date" className="input-field" value={eventForm.startDate} onChange={e => setEventForm({...eventForm, startDate: e.target.value})} required/>
              </div>
              <div className="form-group mb-0">
                <label>End Date</label>
                <input type="date" className="input-field" value={eventForm.endDate} onChange={e => setEventForm({...eventForm, endDate: e.target.value})} required/>
              </div>
            </div>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem' }} onClick={() => {setIsEventModalOpen(false);}}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }} onClick={handleSaveEvent} disabled={savingEvent}>
                {savingEvent ? 'Saving...' : (editingEvent ? 'Save Updates' : 'Publish Event')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Styles */}
      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #050505;
        }

        .nav-sidebar {
          width: 280px;
          background: rgba(255,255,255,0.01);
          border-right: 1px solid var(--color-border);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .logo {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        
        .mb-8 { margin-bottom: 2.5rem; }

        .nav-list {
          list-style: none;
          flex: 1;
        }

        .nav-item {
          padding: 0.85rem 1.2rem;
          color: rgba(255,255,255,0.5);
          border-radius: 12px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .nav-item.active {
          background: rgba(0, 122, 255, 0.1);
          color: var(--color-brand-blue);
          border-left: 3px solid var(--color-brand-blue);
          border-radius: 0 12px 12px 0;
          font-weight: 700;
        }

        .exit-link {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          text-decoration: none;
          padding: 1rem;
          border-top: 1px solid var(--color-border);
        }
        .exit-link:hover { color: #fff; }

        .admin-main {
          flex: 1;
          padding: 3rem 4rem;
          overflow-y: auto;
          background: radial-gradient(circle at top right, rgba(0, 122, 255, 0.03), transparent);
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
        }

        .admin-title {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .admin-profile {
          background: rgba(0, 234, 135, 0.1);
          color: var(--color-brand-green);
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          border: 1px solid rgba(0, 234, 135, 0.2);
          font-size: 0.85rem;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 2rem;
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1); }

        .stat-label {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .stat-value {
          font-size: 2.8rem;
          font-weight: 900;
          font-family: var(--font-heading);
          letter-spacing: -1px;
        }

        .table-section {
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .table-header {
          padding: 2rem 2.5rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-title {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th, .data-table td {
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid var(--color-border);
          white-space: nowrap;
        }

        .data-table th {
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
          background: rgba(255,255,255,0.02);
        }

        .font-semibold { font-weight: 600; }
        .text-secondary { color: rgba(255,255,255,0.4); }

        .badge {
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .badge-new { background: rgba(0,122,255,0.1); color: var(--color-brand-blue); border: 1px solid rgba(0,122,255,0.2); }
        .badge-invited { background: rgba(0,234,135,0.1); color: var(--color-brand-green); border: 1px solid rgba(0,234,135,0.2); }
        .badge-free { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); }
        .badge-paid { background: var(--color-brand-green); color: #000; }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.6rem;
        }
        .status-dot.confirmed { background: var(--color-brand-green); box-shadow: 0 0 10px var(--color-brand-green); }
        .status-dot.verified { background: var(--color-brand-blue); box-shadow: 0 0 10px var(--color-brand-blue); }
        .status-dot.pending { background: #ffcc00; box-shadow: 0 0 10px #ffcc00; }

        .action-btn {
          background: none;
          border: none;
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          cursor: pointer;
          border-radius: 8px;
          margin-left: 0.5rem;
          font-weight: 800;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .edit-btn { background: rgba(0, 234, 135, 0.1); color: var(--color-brand-green); }
        .edit-btn:hover { background: var(--color-brand-green); color: #000; }
        .delete-btn { background: rgba(255, 68, 68, 0.1); color: #ff4444; }
        .delete-btn:hover { background: #ff4444; color: #fff; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }
        .modal-content {
          background: #0f0f0f;
          padding: 3rem;
          border-radius: 24px;
          border: 1px solid var(--color-border);
          width: 100%;
          max-width: 600px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
        }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.6rem; font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }
        .input-field { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); color: #fff; padding: 0.85rem 1.2rem; border-radius: 12px; font-family: var(--font-body); transition: all 0.3s; color-scheme: dark; font-size: 1rem; }
        .input-field:focus { outline: none; border-color: var(--color-brand-blue); background: rgba(255,255,255,0.06); box-shadow: 0 0 20px rgba(0, 122, 255, 0.3); }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        .mt-4 { margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}
