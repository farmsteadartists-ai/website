// dashboard_page.js
// src/app/dashboard/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ── component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // auth
  const [user, setUser] = useState(null);
  const [artist, setArtist] = useState(null);

  // profile form
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const profilePhotoRef = useRef();

  // artworks
  const [artworks, setArtworks] = useState([]);
  const [editingArtwork, setEditingArtwork] = useState(null); // artwork object being edited

  // add artwork form
  const [newTitle, setNewTitle] = useState('');
  const [newMedium, setNewMedium] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [addingArtwork, setAddingArtwork] = useState(false);
  const [artworkMsg, setArtworkMsg] = useState('');
  const newPhotoRef = useRef();

  // ── init ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);

      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (artistData) {
        setArtist(artistData);
        setBio(artistData.bio || '');
        setWebsite(artistData.website || '');
        setProfilePhotoPreview(artistData.photo_url || null);
        loadArtworks(artistData.id);
      }
    }
    init();
  }, []);

  async function loadArtworks(artistId) {
    const { data } = await supabase
      .from('artworks')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });
    setArtworks(data || []);
  }

  // ── sign out ───────────────────────────────────────────────────────────────

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // ── profile photo pick ────────────────────────────────────────────────────

  function handleProfilePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoFile(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  }

  // ── save profile ───────────────────────────────────────────────────────────

  async function handleSaveProfile() {
    if (!artist) return;
    setProfileSaving(true);
    setProfileMsg('');

    let photo_url = artist.photo_url;

    if (profilePhotoFile) {
      const ext = profilePhotoFile.name.split('.').pop();
      const path = `artists/${artist.slug}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('artwork-images')
        .upload(path, profilePhotoFile, { upsert: true });
      if (uploadErr) {
        setProfileMsg('Photo upload failed: ' + uploadErr.message);
        setProfileSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(path);
      photo_url = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('artists')
      .update({ bio, website, photo_url })
      .eq('id', artist.id);

    setProfileSaving(false);
    if (error) {
      setProfileMsg('Save failed: ' + error.message);
    } else {
      setArtist(prev => ({ ...prev, bio, website, photo_url }));
      setProfileMsg('Profile saved ✓');
      setTimeout(() => setProfileMsg(''), 3000);
    }
  }

  // ── add artwork photo pick ─────────────────────────────────────────────────

  function handleNewPhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPhotoFile(file);
    setNewPhotoPreview(URL.createObjectURL(file));
  }

  // ── add artwork submit ─────────────────────────────────────────────────────

  async function handleAddArtwork(e) {
    e.preventDefault();
    if (!newTitle.trim()) { setArtworkMsg('Title is required.'); return; }
    setAddingArtwork(true);
    setArtworkMsg('');

    let photo_url = null;

    if (newPhotoFile) {
      const ext = newPhotoFile.name.split('.').pop();
      const filename = `${artist.slug}-${Date.now()}.${ext}`;
      const path = `artworks/${filename}`;
      const { error: uploadErr } = await supabase.storage
        .from('artwork-images')
        .upload(path, newPhotoFile, { upsert: true });
      if (uploadErr) {
        setArtworkMsg('Photo upload failed: ' + uploadErr.message);
        setAddingArtwork(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(path);
      photo_url = urlData.publicUrl;
    }

    const { error } = await supabase.from('artworks').insert({
      artist_id: artist.id,
      title: newTitle.trim(),
      medium: newMedium.trim() || null,
      size: newSize.trim() || null,
      price: newPrice ? parseFloat(newPrice) : null,
      photo_url,
    });

    setAddingArtwork(false);
    if (error) {
      setArtworkMsg('Error adding artwork: ' + error.message);
    } else {
      setNewTitle(''); setNewMedium(''); setNewSize(''); setNewPrice('');
      setNewPhotoFile(null); setNewPhotoPreview(null);
      if (newPhotoRef.current) newPhotoRef.current.value = '';
      setArtworkMsg('Artwork added ✓');
      setTimeout(() => setArtworkMsg(''), 3000);
      loadArtworks(artist.id);
    }
  }

  // ── inline edit artwork ────────────────────────────────────────────────────

  async function handleSaveArtwork(artwork) {
    const { error } = await supabase
      .from('artworks')
      .update({
        title: artwork.title,
        medium: artwork.medium,
        size: artwork.size,
        price: artwork.price,
      })
      .eq('id', artwork.id);
    if (!error) {
      setEditingArtwork(null);
      loadArtworks(artist.id);
    }
  }

  async function handleDeleteArtwork(id) {
    if (!confirm('Delete this artwork?')) return;
    await supabase.from('artworks').delete().eq('id', id);
    loadArtworks(artist.id);
  }

  // ── render ─────────────────────────────────────────────────────────────────

  if (!artist) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block', fontSize: '13px', fontWeight: '600',
    color: '#555', marginBottom: '4px',
  };

  const sectionStyle = {
    background: '#fff', borderRadius: '10px', padding: '24px',
    marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  };

  const btnPrimary = {
    background: '#8b1a1a', color: '#fff', border: 'none',
    padding: '11px 28px', borderRadius: '6px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer',
  };

  const btnSmall = {
    background: '#8b1a1a', color: '#fff', border: 'none',
    padding: '6px 14px', borderRadius: '5px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', marginRight: '8px',
  };

  const btnGhost = {
    background: 'transparent', color: '#666', border: '1px solid #ccc',
    padding: '6px 14px', borderRadius: '5px', fontSize: '13px',
    cursor: 'pointer',
  };

  return (
    <div style={{ background: '#f5f0eb', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* header bar */}
      <div style={{ background: '#8b1a1a', color: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '17px' }}>{artist.name}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>Artist Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', opacity: 0.85 }}>← Site</a>
          <button onClick={handleSignOut} style={{ ...btnGhost, color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '32px auto', padding: '0 16px' }}>

        {/* ── PROFILE SECTION ── */}
        <div style={sectionStyle}>
          <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#2d2d2d' }}>My Profile</h2>

          {/* headshot */}
          <div style={{ marginBottom: '18px', textAlign: 'center' }}>
            <div
              onClick={() => profilePhotoRef.current?.click()}
              style={{
                width: 100, height: 100, borderRadius: '50%', margin: '0 auto 8px',
                background: '#eee', overflow: 'hidden', cursor: 'pointer',
                border: '3px solid #8b1a1a', position: 'relative',
              }}
            >
              {profilePhotoPreview
                ? <img src={profilePhotoPreview} alt="headshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '30px', color: '#999' }}>👤</div>
              }
            </div>
            <div style={{ fontSize: '13px', color: '#8b1a1a', cursor: 'pointer' }} onClick={() => profilePhotoRef.current?.click()}>
              {profilePhotoPreview ? 'Change photo' : 'Add photo'}
            </div>
            <input ref={profilePhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhotoChange} />
          </div>

          {/* bio */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              placeholder="Tell visitors about your work and inspiration…"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* website */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Website (optional)</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleSaveProfile} disabled={profileSaving} style={btnPrimary}>
              {profileSaving ? 'Saving…' : 'Save Profile'}
            </button>
            {profileMsg && <span style={{ fontSize: '14px', color: profileMsg.includes('failed') ? '#c00' : '#2a7a2a' }}>{profileMsg}</span>}
          </div>
        </div>

        {/* ── ARTWORKS SECTION ── */}
        <div style={sectionStyle}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', color: '#2d2d2d' }}>My Artworks</h2>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#777' }}>
            {artworks.length} piece{artworks.length !== 1 ? 's' : ''} on file
          </p>

          {/* artwork list */}
          {artworks.map(aw => (
            <div key={aw.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', background: '#faf9f7', borderRadius: '8px', border: '1px solid #ebe7e0' }}>

              {/* thumbnail */}
              <div style={{ width: 56, height: 56, borderRadius: '6px', background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                {aw.photo_url
                  ? <img src={aw.photo_url} alt={aw.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🖼</div>
                }
              </div>

              {/* fields — view or edit */}
              <div style={{ flex: 1 }}>
                {editingArtwork?.id === aw.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input value={editingArtwork.title} onChange={e => setEditingArtwork(p => ({ ...p, title: e.target.value }))} style={{ ...inputStyle, padding: '6px 8px', fontSize: '14px' }} placeholder="Title" />
                    <input value={editingArtwork.medium || ''} onChange={e => setEditingArtwork(p => ({ ...p, medium: e.target.value }))} style={{ ...inputStyle, padding: '6px 8px', fontSize: '14px' }} placeholder="Medium" />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input value={editingArtwork.size || ''} onChange={e => setEditingArtwork(p => ({ ...p, size: e.target.value }))} style={{ ...inputStyle, padding: '6px 8px', fontSize: '14px' }} placeholder="Size" />
                      <input value={editingArtwork.price || ''} onChange={e => setEditingArtwork(p => ({ ...p, price: e.target.value }))} style={{ ...inputStyle, padding: '6px 8px', fontSize: '14px' }} placeholder="Price $" type="number" />
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <button style={btnSmall} onClick={() => handleSaveArtwork(editingArtwork)}>Save</button>
                      <button style={btnGhost} onClick={() => setEditingArtwork(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: '600', fontSize: '15px', color: '#2d2d2d' }}>{aw.title}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                      {[aw.medium, aw.size, aw.price ? `$${aw.price}` : null].filter(Boolean).join(' · ')}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <button style={btnSmall} onClick={() => setEditingArtwork({ ...aw })}>Edit</button>
                      <button style={{ ...btnGhost, color: '#c00', borderColor: '#f5c0c0' }} onClick={() => handleDeleteArtwork(aw.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* ── ADD ARTWORK FORM ── */}
          <div style={{ borderTop: '1px solid #e5e0d8', paddingTop: '20px', marginTop: artworks.length > 0 ? '8px' : 0 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#2d2d2d' }}>Add Artwork</h3>

            {/* photo upload */}
            <div
              onClick={() => newPhotoRef.current?.click()}
              style={{
                border: '2px dashed #ccc', borderRadius: '8px',
                height: newPhotoPreview ? 'auto' : 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginBottom: '14px', overflow: 'hidden',
                background: '#faf9f7',
              }}
            >
              {newPhotoPreview
                ? <img src={newPhotoPreview} alt="preview" style={{ maxHeight: 180, maxWidth: '100%', display: 'block' }} />
                : <div style={{ textAlign: 'center', color: '#999' }}>
                    <div style={{ fontSize: '28px', marginBottom: '4px' }}>📷</div>
                    <div style={{ fontSize: '13px' }}>Tap to add photo</div>
                  </div>
              }
            </div>
            <input ref={newPhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhotoChange} />

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Title *</label>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Sunset at Schoodic" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Medium</label>
              <input value={newMedium} onChange={e => setNewMedium(e.target.value)} placeholder="e.g. Watercolor, Oil on canvas" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Size</label>
                <input value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="e.g. 12x16" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Price ($)</label>
                <input value={newPrice} onChange={e => setNewPrice(e.target.value)} type="number" placeholder="0" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={handleAddArtwork} disabled={addingArtwork} style={btnPrimary}>
                {addingArtwork ? 'Adding…' : 'Add Artwork'}
              </button>
              {artworkMsg && <span style={{ fontSize: '14px', color: artworkMsg.includes('rror') || artworkMsg.includes('failed') ? '#c00' : '#2a7a2a' }}>{artworkMsg}</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// end of file
