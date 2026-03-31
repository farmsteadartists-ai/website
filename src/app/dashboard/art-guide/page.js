// art_guide_admin_page.js
// src/app/dashboard/art-guide/page.js
// Desc: Admin page to add/edit/delete Art Guide institutions
// ============================================================
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['nonprofit', 'gallery', 'school', 'studio', 'museum'];

const EMPTY_FORM = {
  name: '', slug: '', category: 'nonprofit', description: '',
  address: '', town: '', lat: '', lng: '',
  website: '', phone: '', featured: false, sort_order: 0,
};

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function ArtGuideAdminInner() {
  const router = useRouter();

  const [supabase, setSupabase]       = useState(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [editingId, setEditingId]     = useState(null);
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState('');
  const [showForm, setShowForm]       = useState(false);

  // ── init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      setSupabase(sb);

      const { data: { session } } = await sb.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: me } = await sb
        .from('artists').select('role').eq('email', session.user.email).single();

      if (!me || me.is_admin !== true) { router.push('/dashboard'); return; }
      setIsAdmin(true);
      loadInstitutions(sb);
    }
    init();
  }, []);

  async function loadInstitutions(sb) {
    const { data } = await sb
      .from('art_guide_institutions')
      .select('*')
      .order('sort_order');
    setInstitutions(data || []);
  }

  // ── form helpers ──────────────────────────────────────────────────────────

  function handleField(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'name' && !editingId) {
      setForm(p => ({ ...p, name: value, slug: slugify(value) }));
    }
  }

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setMsg('');
  }

  function startEdit(inst) {
    setForm({
      name: inst.name || '', slug: inst.slug || '',
      category: inst.category || 'nonprofit',
      description: inst.description || '',
      address: inst.address || '', town: inst.town || '',
      lat: inst.lat || '', lng: inst.lng || '',
      website: inst.website || '', phone: inst.phone || '',
      featured: inst.featured || false,
      sort_order: inst.sort_order || 0,
    });
    setEditingId(inst.id);
    setShowForm(true);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg('');
  }

  // ── save ──────────────────────────────────────────────────────────────────

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { setMsg('Name is required.'); return; }
    if (!supabase) return;
    setSaving(true); setMsg('');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      category: form.category,
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      town: form.town.trim() || null,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      website: form.website.trim() || null,
      phone: form.phone.trim() || null,
      featured: form.featured,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: true,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('art_guide_institutions').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('art_guide_institutions').insert(payload));
    }

    setSaving(false);
    if (error) {
      setMsg('Error: ' + error.message);
    } else {
      setMsg(editingId ? 'Updated ✓' : 'Added ✓');
      setTimeout(() => { setMsg(''); cancelForm(); }, 1500);
      loadInstitutions(supabase);
    }
  }

  // ── delete ────────────────────────────────────────────────────────────────

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.from('art_guide_institutions').delete().eq('id', id);
    loadInstitutions(supabase);
  }

  // ── styles ────────────────────────────────────────────────────────────────

  const inp = {
    width: '100%', padding: '9px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const lbl = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '3px' };
  const sec = { background: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' };
  const btnP = { background: '#8b1a1a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
  const btnS = { background: '#8b1a1a', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginRight: '6px' };
  const btnG = { background: 'transparent', color: '#666', border: '1px solid #ccc', padding: '5px 12px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' };

  if (!isAdmin) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Checking access…</p>
    </div>
  );

  return (
    <div style={{ background: '#f5f0eb', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{ background: '#8b1a1a', color: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '17px' }}>Art Guide Admin</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>Manage institutions &amp; partners</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/dashboard" style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', opacity: 0.85 }}>← Dashboard</a>
          <a href="/art-guide" target="_blank" style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', opacity: 0.85 }}>View Page →</a>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '32px auto', padding: '0 16px' }}>

        {/* Add button */}
        {!showForm && (
          <div style={{ marginBottom: '20px' }}>
            <button onClick={startAdd} style={btnP}>+ Add Institution</button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={sec}>
            <h2 style={{ margin: '0 0 20px', fontSize: '17px', color: '#2d2d2d' }}>
              {editingId ? 'Edit Institution' : 'Add Institution'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Name *</label>
                <input name="name" value={form.name} onChange={handleField} placeholder="e.g. Schoodic Arts for All" style={inp} />
              </div>
              <div>
                <label style={lbl}>Slug</label>
                <input name="slug" value={form.slug} onChange={handleField} placeholder="auto-generated" style={inp} />
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select name="category" value={form.category} onChange={handleField} style={inp}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Description</label>
                <textarea name="description" value={form.description} onChange={handleField} rows={3}
                  placeholder="Brief description of the organization…" style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div>
                <label style={lbl}>Address</label>
                <input name="address" value={form.address} onChange={handleField} placeholder="427 Main St" style={inp} />
              </div>
              <div>
                <label style={lbl}>Town</label>
                <input name="town" value={form.town} onChange={handleField} placeholder="Winter Harbor" style={inp} />
              </div>
              <div>
                <label style={lbl}>Latitude</label>
                <input name="lat" value={form.lat} onChange={handleField} placeholder="44.3956" style={inp} />
              </div>
              <div>
                <label style={lbl}>Longitude</label>
                <input name="lng" value={form.lng} onChange={handleField} placeholder="-68.0831" style={inp} />
              </div>
              <div>
                <label style={lbl}>Website</label>
                <input name="website" value={form.website} onChange={handleField} placeholder="https://…" style={inp} />
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleField} placeholder="207-000-0000" style={inp} />
              </div>
              <div>
                <label style={lbl}>Sort Order</label>
                <input name="sort_order" value={form.sort_order} onChange={handleField} type="number" style={inp} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleField}
                  id="featured" style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="featured" style={{ fontSize: '13px', fontWeight: '600', color: '#555', cursor: 'pointer' }}>
                  Featured Partner
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button onClick={handleSave} disabled={saving} style={btnP}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Institution'}
              </button>
              <button onClick={cancelForm} style={btnG}>Cancel</button>
              {msg && <span style={{ fontSize: '13px', color: msg.includes('rror') ? '#c00' : '#2a7a2a' }}>{msg}</span>}
            </div>
          </div>
        )}

        {/* Institution list */}
        <div style={sec}>
          <h2 style={{ margin: '0 0 16px', fontSize: '17px', color: '#2d2d2d' }}>
            {institutions.length} institution{institutions.length !== 1 ? 's' : ''} in the guide
          </h2>

          {institutions.map(inst => (
            <div key={inst.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0ebe4' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '15px', color: '#2d2d2d' }}>
                  {inst.name}
                  {inst.featured && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#8b1a1a', color: '#fff', padding: '2px 7px', borderRadius: '10px' }}>Featured</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                  {inst.category} · {inst.town} · {inst.website || 'no website'}
                </div>
              </div>
              <div>
                <button style={btnS} onClick={() => startEdit(inst)}>Edit</button>
                <button style={{ ...btnG, color: '#c00', borderColor: '#f5c0c0', fontSize: '12px' }}
                  onClick={() => handleDelete(inst.id, inst.name)}>Delete</button>
              </div>
            </div>
          ))}

          {institutions.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '14px' }}>No institutions yet. Add one above.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ArtGuideAdminPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#888' }}>Loading…</p></div>}>
      <ArtGuideAdminInner />
    </Suspense>
  );
}

// end of file
