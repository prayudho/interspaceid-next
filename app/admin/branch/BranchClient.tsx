'use client'

import { useState } from 'react'

type BranchRow = {
  mbraId: number
  mbraCode: string
  mbraName: string
  mbraAddress: string
  mbraPhone: string
  mbraPhone2: string
  mbraCountry: string
  mbraMail: string
}

const EMPTY: Omit<BranchRow, 'mbraId'> = {
  mbraCode: '', mbraName: '', mbraAddress: '', mbraPhone: '',
  mbraPhone2: '', mbraCountry: '', mbraMail: '',
}

export default function BranchClient({ rows }: { rows: BranchRow[] }) {
  const [data, setData] = useState(rows)
  const [editing, setEditing] = useState<BranchRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const openNew = () => { setEditing({ mbraId: 0, ...EMPTY }); setIsNew(true) }
  const openEdit = (row: BranchRow) => { setEditing({ ...row }); setIsNew(false) }
  const cancel = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const res = await fetch('/api/admin/branch', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const result = await res.json()
    setSaving(false)
    if (res.ok) {
      if (isNew) setData((prev) => [...prev, result])
      else setData((prev) => prev.map((r) => (r.mbraId === editing.mbraId ? editing : r)))
      cancel()
      setMsg('Saved successfully')
    } else { setMsg('Save failed') }
    setTimeout(() => setMsg(''), 3000)
  }

  const del = async (id: number) => {
    if (!confirm('Delete this branch?')) return
    const res = await fetch(`/api/admin/branch?id=${id}`, { method: 'DELETE' })
    if (res.ok) setData((prev) => prev.filter((r) => r.mbraId !== id))
  }

  const f = (label: string, key: keyof BranchRow, type: 'input' | 'textarea' = 'input') => (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label">{label}</label>
      <div className="col-sm-9">
        {type === 'textarea' ? (
          <textarea
            className="form-control"
            rows={3}
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
        <h4 className="mb-3">{isNew ? 'New Branch' : `Edit: ${editing.mbraName}`}</h4>
        {msg && <div className="alert alert-info py-2">{msg}</div>}
        <div className="card p-4">
          {f('Code (e.g. ina)', 'mbraCode')}
          {f('Name', 'mbraName')}
          {f('Address', 'mbraAddress', 'textarea')}
          {f('Phone', 'mbraPhone')}
          {f('Phone 2', 'mbraPhone2')}
          {f('Country', 'mbraCountry')}
          {f('Email', 'mbraMail')}
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
        <h4>Branch</h4>
        <button className="btn btn-success" onClick={openNew}>+ Add Branch</button>
      </div>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr><th>#</th><th>Code</th><th>Name</th><th>Phone</th><th>Country</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.mbraId}>
                <td>{i + 1}</td>
                <td><code>{row.mbraCode}</code></td>
                <td>{row.mbraName}</td>
                <td>{row.mbraPhone}</td>
                <td>{row.mbraCountry}</td>
                <td>
                  <button className="btn btn-sm btn-primary mr-1" onClick={() => openEdit(row)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(row.mbraId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
