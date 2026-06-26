'use client'

import { useState } from 'react'

export default function SettingsClient({ setting }: { setting: Record<string, string> }) {
  const [form, setForm] = useState(setting || {})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }))

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setMsg(res.ok ? 'Saved successfully' : 'Save failed')
    setTimeout(() => setMsg(''), 3000)
  }

  const field = (label: string, key: string, type: 'input' | 'textarea' = 'input') => (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{label}</label>
      <div className="col-sm-9">
        {type === 'textarea' ? (
          <textarea
            className="form-control"
            rows={4}
            value={form[key] || ''}
            onChange={(e) => set(key, e.target.value)}
          />
        ) : (
          <input
            className="form-control"
            value={form[key] || ''}
            onChange={(e) => set(key, e.target.value)}
          />
        )}
      </div>
    </div>
  )

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-3">Global Setting</h4>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="card p-4">
        <h6 className="mb-3 text-muted text-uppercase font-weight-bold">Meta</h6>
        {field('Meta Title (ID)', 'gsetMetaTitleId')}
        {field('Meta Title (EN)', 'gsetMetaTitleEn')}
        {field('Meta Description (ID)', 'gsetMetaDescriptionId', 'textarea')}
        {field('Meta Description (EN)', 'gsetMetaDescriptionEn', 'textarea')}

        <hr />
        <h6 className="mb-3 text-muted text-uppercase font-weight-bold">About</h6>
        {field('About (Bahasa)', 'gsetAboutId', 'textarea')}
        {field('About (English)', 'gsetAboutEn', 'textarea')}

        <hr />
        <h6 className="mb-3 text-muted text-uppercase font-weight-bold">Social Media</h6>
        {field('Facebook URL', 'gsetFb')}
        {field('Twitter URL', 'gsetTwitter')}
        {field('Instagram URL', 'gsetInstagram')}
        {field('YouTube URL', 'gsetYoutube')}

        <div className="text-right mt-3">
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
