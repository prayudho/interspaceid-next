'use client'

import { useState } from 'react'

type LangRow = {
  langId: number
  langVariable: string
  langWordsId: string
  langWordsEn: string
}

export default function LanguageClient({ rows }: { rows: LangRow[] }) {
  const [data, setData] = useState(rows)
  const [editing, setEditing] = useState<LangRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const res = await fetch('/api/admin/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setSaving(false)
    if (res.ok) {
      setData((prev) => prev.map((r) => (r.langId === editing.langId ? editing : r)))
      setEditing(null)
      setMsg('Saved successfully')
      setTimeout(() => setMsg(''), 3000)
    } else {
      setMsg('Save failed')
    }
  }

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-3">Word Library</h4>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Variable</th>
              <th>Bahasa Indonesia</th>
              <th>English</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.langId}>
                <td>{i + 1}</td>
                <td><code>{row.langVariable}</code></td>
                <td>
                  {editing?.langId === row.langId ? (
                    <input
                      className="form-control form-control-sm"
                      value={editing.langWordsId}
                      onChange={(e) => setEditing({ ...editing, langWordsId: e.target.value })}
                    />
                  ) : (
                    row.langWordsId
                  )}
                </td>
                <td>
                  {editing?.langId === row.langId ? (
                    <input
                      className="form-control form-control-sm"
                      value={editing.langWordsEn}
                      onChange={(e) => setEditing({ ...editing, langWordsEn: e.target.value })}
                    />
                  ) : (
                    row.langWordsEn
                  )}
                </td>
                <td>
                  {editing?.langId === row.langId ? (
                    <>
                      <button className="btn btn-sm btn-success mr-1" onClick={save} disabled={saving}>
                        {saving ? '…' : 'Save'}
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => setEditing(row)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
