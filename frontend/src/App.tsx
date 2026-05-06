import { type FormEvent, useEffect, useState } from 'react'
import './App.css'

type Story = {
  id?: number
  department: string
  title: string
  body: string
}

const departments = ['ICT', 'Business', 'Engineering']
const blank = { department: departments[0], title: '', body: '' }

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [form, setForm] = useState<Story>(blank)
  const [active, setActive] = useState(departments[0])
  const [editing, setEditing] = useState<number | undefined>()
  const [error, setError] = useState('')

  const visible = stories.filter((story) => story.department === active)

  async function loadStories() {
    const response = await fetch('/api/stories')
    if (!response.ok) throw new Error('Could not load stories')
    setStories(await response.json())
  }

  useEffect(() => {
    let alive = true
    fetch('/api/stories')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load stories')
        return response.json() as Promise<Story[]>
      })
      .then((data) => {
        if (alive) setStories(data)
      })
      .catch((err: Error) => {
        if (alive) setError(err.message)
      })
    return () => {
      alive = false
    }
  }, [])

  async function saveStory(event: FormEvent) {
    event.preventDefault()
    setError('')
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/stories/${editing}` : '/api/stories'
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!response.ok) {
      setError('Could not save story')
      return
    }
    setForm(blank)
    setEditing(undefined)
    setActive(form.department)
    loadStories().catch((err) => setError(err.message))
  }

  async function removeStory(id: number) {
    const response = await fetch(`/api/stories/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      setError('Could not delete story')
      return
    }
    loadStories().catch((err) => setError(err.message))
  }

  function editStory(story: Story) {
    setForm(story)
    setEditing(story.id)
    setActive(story.department)
  }

  return (
    <main>
      <header>
        <p>Horsens campus scandal sheet</p>
        <h1>VIA Tabloid</h1>
      </header>

      <nav aria-label="Departments">
        {departments.map((department) => (
          <button
            className={department === active ? 'active' : ''}
            key={department}
            onClick={() => setActive(department)}
          >
            {department}
          </button>
        ))}
      </nav>

      <section className="layout">
        <form onSubmit={saveStory}>
          <h2>{editing ? 'Update Story' : 'Add Story'}</h2>
          <label>
            Department
            <select
              value={form.department}
              onChange={(event) =>
                setForm({ ...form, department: event.target.value })
              }
            >
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            Headline
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
            />
          </label>
          <label>
            Story
            <textarea
              required
              rows={5}
              value={form.body}
              onChange={(event) =>
                setForm({ ...form, body: event.target.value })
              }
            />
          </label>
          <button type="submit">{editing ? 'Save' : 'Publish'}</button>
          {editing && (
            <button
              type="button"
              className="plain"
              onClick={() => {
                setForm(blank)
                setEditing(undefined)
              }}
            >
              Cancel
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </form>

        <section className="stories">
          <h2>{active}</h2>
          {visible.map((story) => (
            <article key={story.id}>
              <strong>{story.title}</strong>
              <p>{story.body}</p>
              <div>
                <button onClick={() => editStory(story)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => story.id && removeStory(story.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {visible.length === 0 && <p>No stories yet.</p>}
        </section>
      </section>
    </main>
  )
}

export default App
