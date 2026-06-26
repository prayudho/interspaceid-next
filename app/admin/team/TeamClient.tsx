'use client'

import { useState } from 'react'

type TeamRow = {
  oteaId: number
  oteaName: string
  oteaPosition: string
  oteaHistoryId: string
  oteaHistoryEn: string
  oteaStatus: number
  oteaFoto: string
  oteaAvatar: string
}

const EMPTY: Omit<TeamRow, 'oteaId'> = {
  oteaName: '', oteaPosition: '', oteaHistoryId: '', oteaHistoryEn: '',
  oteaStatus: 0, oteaFoto: '', oteaAvatar: '',
}

export default function TeamClient({ rows }: { rows: TeamRow[] }) {
  const [data, setData] = useState(rows)
  const [editing, setEditing] = useState<TeamRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const openNew = () => { setEditing({ oteaId: 0, ...EMPTY }); setIsNew(true) }
  const openEdit = (row: TeamRow) => { setEditing({ ...row }); setIsNew(false) }
  const cancel = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const res = await fetch('/api/admin/team', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const result = await res.json()
    setSaving(false)
    if (res.ok) {
      if (isNew) setData((prev) => [...prev, result])
      else setData((prev) => prev.map((r) => (r.oteaId === editing.oteaId ? editing : r)))
      cancel()
      setMsg('Saved successfully')
    } else { setMsg('Save failed') }
    setTimeout(() => setMsg(''), 3000)
  }

  const del = async (id: number) => {
    if (!confirm('Delete this team member?')) return
    const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' })
    if (res.ok) setData((prev) => prev.filter((r) => r.oteaId !== id))
  }

  const f = (label: string, key: keyof TeamRow, type: 'input' | 'textarea' = 'input') => (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{label}</label>
      <div className="col-sm-9">
        {type === 'textarea' ? (
          <textarea
            className="form-control"
            rows={5}
            value={(editing as Record<string, unknown>)[key] as string || ''}
            onChange={(e) => setEditing((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
          />
        ) : (
          <input
            className="form-control"
            value={(editing as Record<string, unknown>)[key] as string || ''}
            onChange={(e) => setEditing((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
          />
        )}
      </div>
    </div>
  )

  if (editing) {
    return (
      <div className="container-fluid p-4">
        <h4 className="mb-3">{isNew ? 'New Team Member' : `Edit: ${editing.oteaName}`}</h4>
        {msg && <div className="alert alert-info py-2">{msg}</div>}
        <div className="card p-4">
          {f('Name', 'oteaName')}
          {f('Position', 'oteaPosition')}
          {f('History (ID)', 'oteaHistoryId', 'textarea')}
          {f('History (EN)', 'oteaHistoryEn', 'textarea')}
          {f('Photo filename', 'oteaFoto')}
          {f('Avatar filename', 'oteaAvatar')}
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">Status</label>
            <div className="col-sm-9">
              <select
                className="form-control"
                value={editing.oteaStatus}
                onChange={(e) => setEditing((prev) => prev ? { ...prev, oteaStatus: Number(e.target.value) } : prev)}
              >
                <option value={0}>Active</option>
                <option value={1}>Inactive</option>
              </select>
            </div>
          </div>
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
        <h4>Our Team</h4>
        <button className="btn btn-success" onClick={openNew}>+ Add Member</button>
      </div>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr><th>#</th><th>Name</th><th>Position</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.oteaId}>
                <td>{i + 1}</td>
                <td>{row.oteaName}</td>
                <td>{row.oteaPosition}</td>
                <td>
                  <span className={`badge badge-${row.oteaStatus === 0 ? 'success' : 'secondary'}`}>
                    {row.oteaStatus === 0 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary mr-1" onClick={() => openEdit(row)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(row.oteaId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
