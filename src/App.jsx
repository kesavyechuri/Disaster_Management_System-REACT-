
import { useState } from 'react'
import './App.css'

function App() {
  const [role, setRole] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [reports, setReports] = useState(() => {
    return JSON.parse(localStorage.getItem('reports') || '[]')
  })

  const [form, setForm] = useState({
    type: 'Flood',
    location: '',
    description: '',
    image: ''
  })

  function login(e) {
    e.preventDefault()

    if (
      (username === 'user' && password === 'user123') ||
      (username === 'admin' && password === 'admin123')
    ) {
      setRole(username)
      setError('')
    } else {
      setError('Invalid username or password!')
    }
  }

  function logout() {
    setRole('')
    setUsername('')
    setPassword('')
  }

  function submitReport(e) {
    e.preventDefault()

    const newReport = {
      id: Date.now(),
      ...form,
      status: 'Submitted'
    }

    const updated = [...reports, newReport]

    setReports(updated)
    localStorage.setItem('reports', JSON.stringify(updated))

    setForm({
      type: 'Flood',
      location: '',
      description: '',
      image: ''
    })

    alert('Emergency report submitted successfully!')
  }

  function updateStatus(id, status) {
    const updated = reports.map(report =>
      report.id === id ? { ...report, status } : report
    )

    setReports(updated)
    localStorage.setItem('reports', JSON.stringify(updated))
  }

  function deleteReport(id) {
    const updated = reports.filter(report => report.id !== id)
    setReports(updated)
    localStorage.setItem('reports', JSON.stringify(updated))
  }

  if (!role) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>🚨</h1>
          <h2>Disaster Management System</h2>
          <p>Login to access the emergency response platform</p>

          <form onSubmit={login}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          {error && <p className="error">{error}</p>}

          
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>🚨Disaster Management System</h1>
        <div>
          <span>Welcome, {role.toUpperCase()}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav>
        <a href="#dashboard">Dashboard</a>
        <a href="#reports">Incident Reports</a>
        <a href="#resources">Resources</a>
        <a href="#alerts">Alerts</a>
        <a href="#contacts">Emergency Contacts</a>
      </nav>

      <main>
        <section id="dashboard">
          <h2>Emergency Dashboard</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Incidents</h3>
              <h2>{reports.length}</h2>
            </div>

            <div className="card">
              <h3>Under Review</h3>
              <h2>{reports.filter(r => r.status === 'Under Review').length}</h2>
            </div>

            <div className="card">
              <h3>In Progress</h3>
              <h2>{reports.filter(r => r.status === 'In Progress').length}</h2>
            </div>

            <div className="card">
              <h3>Resolved</h3>
              <h2>{reports.filter(r => r.status === 'Resolved').length}</h2>
            </div>
          </div>
        </section>

        {role === 'user' && (
          <section className="panel" id="report">
            <h2>🆘 Report an Emergency</h2>

            <form onSubmit={submitReport}>
              <label>Disaster Type</label>
              <select
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Fire</option>
                <option>Cyclone</option>
                <option>Landslide</option>
                <option>Other</option>
              </select>

              <label>Location</label>
              <input
                placeholder="Enter affected location"
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Describe the emergency..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                required
              />

              <label>Upload Disaster Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    setForm({...form, image: URL.createObjectURL(file)})
                  }
                }}
              />

              <button type="submit">Submit Emergency Report</button>
            </form>
          </section>
        )}

        <section className="panel" id="reports">
          <h2>📋 Incident Reports</h2>

          {reports.length === 0 ? (
            <p>No emergency reports available.</p>
          ) : (
            reports.map(report => (
              <div className="report" key={report.id}>
                <h3>{report.type}</h3>
                <p><b>Location:</b> {report.location}</p>
                <p><b>Description:</b> {report.description}</p>

                {report.image && (
                  <img src={report.image} alt="Disaster" width="180" />
                )}

                <p><b>Status:</b> {report.status}</p>

                {role === 'admin' && (
                  <>
                    <select
                      value={report.status}
                      onChange={e => updateStatus(report.id, e.target.value)}
                    >
                      <option>Submitted</option>
                      <option>Under Review</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>

                    <button onClick={() => deleteReport(report.id)}>
                      Delete Report
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </section>

        <section className="panel" id="resources">
          <h2>📦 Resource Allocation</h2>
          <div className="cards">
            <div className="card">🚑 Ambulances: 5 Available</div>
            <div className="card">🍱 Food Kits: 200 Available</div>
            <div className="card">💧 Water Bottles: 500 Available</div>
            <div className="card">🏕️ Rescue Teams: 8 Available</div>
          </div>
        </section>

        <section className="panel" id="alerts">
          <h2>⚠️ Emergency Alerts</h2>
          <p>Stay alert and follow official disaster safety instructions.</p>
          <p>Monitor affected areas and report emergencies immediately.</p>
        </section>

        <section className="panel" id="contacts">
          <h2>📞 Emergency Contacts</h2>
          <p>Emergency Helpline: 112</p>
          <p>Fire Services: 101</p>
          <p>Ambulance: 108</p>
          <p>Disaster Management: 1078</p>
        </section>
      </main>

      <footer>
        <p>RESQ Disaster Management System | Emergency Response Platform</p>
      </footer>
    </div>
  )
}

export default App
