'use client'

import { useState } from 'react'

type ServiceRow = {
  oserId: number
  oserTitle: string
  oserSubTitleId: string
  oserSubTitleEn: string
  oserDescriptionId: string
  oserDescriptionEn: string
  oserUrl: string
  oserImage: string
}

const EMPTY: Omit<ServiceRow, 'oserId'> = {
  oserTitle: '', oserSubTitleId: '', oserSubTitleEn: '',
  oserDescriptionId: '', oserDescriptionEn: '', oserUrl: '', oserImage: '',
}

export default function ServicesClient({ rows }: { rows: ServiceRow[] }) {
  const [data, setData] = useState(rows)
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const openNew = () => { setEditing({ oserId: 0, ...EMPTY }); setIsNew(true) }
  const openEdit = (row: ServiceRow) => { setEditing({ ...row }); setIsNew(false) }
  const cancel = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const result = await res.json()
    setSaving(false)
    if (res.ok) {
      if (isNew) setData((prev) => [...prev, result])
      else setData((prev) => prev.map((r) => (r.oserId === editing.oserId ? editing : r)))
      cancel()
      setMsg('Saved successfully')
    } else {
      setMsg('Save failed')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const del = async (id: number) => {
    if (!confirm('Delete this service?')) return
    const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
    if (res.ok) setData((prev) => prev.filter((r) => r.oserId !== id))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVal = (key: keyof ServiceRow) => String((editing as any)[key] ?? '')
  const setVal = (key: keyof ServiceRow, val: string) =>
    setEditing((prev) => prev ? { ...prev, [key]: val } : prev)

  const f = (label: string, key: keyof ServiceRow, type: 'input' | 'textarea' = 'input') => (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{label}</label>
      <div className="col-sm-9">
        {type === 'textarea' ? (
          <textarea
            className="form-control"
            rows={5}
            value={getVal(key)}
            onChange={(e) => setVal(key, e.target.value)}
          />
        ) : (
          <input
            className="form-control"
            value={getVal(key)}
            onChange={(e) => setVal(key, e.target.value)}
          />
        )}
      </div>
    </div>
  )

  if (editing) {
    return (
      <div className="container-fluid p-4">
        <h4 className="mb-3">{isNew ? 'New Service' : `Edit: ${editing.oserTitle}`}</h4>
        {msg && <div className="alert alert-info py-2">{msg}</div>}
        <div className="card p-4">
          {f('Title', 'oserTitle')}
          {f('Sub Title (ID)', 'oserSubTitleId')}
          {f('Sub Title (EN)', 'oserSubTitleEn')}
          {f('Description (ID)', 'oserDescriptionId', 'textarea')}
          {f('Description (EN)', 'oserDescriptionEn', 'textarea')}
          {f('URL', 'oserUrl')}
          {f('Image filename', 'oserImage')}
          <div className="text-right mt-3">
            <button className="btn btn-secondary mr-2" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Our Service</h4>
        <button className="btn btn-success" onClick={openNew}>+ Add Service</button>
      </div>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr><th>#</th><th>Title</th><th>URL</th><th>Image</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.oserId}>
                <td>{i + 1}</td>
                <td>{row.oserTitle}</td>
                <td><a href={row.oserUrl} target="_blank" rel="noreferrer">{row.oserUrl}</a></td>
                <td>{row.oserImage}</td>
                <td>
                  <button className="btn btn-sm btn-primary mr-1" onClick={() => openEdit(row)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(row.oserId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
