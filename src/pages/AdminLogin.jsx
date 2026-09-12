import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../data/store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const session = login(form.username, form.password);
      if (session) {
        navigate('/admin/dashboard');
      } else {
        setError('Emri i përdoruesit ose fjalëkalimi i gabuar.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'var(--font)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <i className="bi bi-hospital" style={{ color: 'white', fontSize: 22 }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--dark)' }}>
              Clinic<span style={{ color: 'var(--primary)' }}>Flow</span>
            </h1>
          </Link>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 5 }}>Hyrje në Panel Administrativ</p>
        </div>

        {/* Card */}
        <div className="cf-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 5 }}>Mirë se vini</h2>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 26 }}>Hyni për të menaxhuar klinikën tuaj</p>

          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid #e8cdc7', borderLeft: '3px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '11px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 9, color: 'var(--danger)', fontSize: 13.5 }}>
              <i className="bi bi-exclamation-circle-fill" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="cf-label">Emri i Përdoruesit</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-person" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)', fontSize: 15 }} />
                <input id="username" className="cf-input" style={{ paddingLeft: 38 }}
                  placeholder="Shkruani emrin e përdoruesit"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  autoComplete="username" required />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label className="cf-label">Fjalëkalimi</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)', fontSize: 15 }} />
                <input id="password" className="cf-input" style={{ paddingLeft: 38, paddingRight: 44 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Shkruani fjalëkalimin"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password" required />
                <button type="button" aria-label={showPass ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: 'var(--gray-light)', cursor: 'pointer', fontSize: 15, padding: 0, lineHeight: 1 }}
                  onClick={() => setShowPass(!showPass)}>
                  <i className={`bi bi-eye${showPass ? '-slash' : ''}`} />
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn-primary-cf" style={{ width: '100%', fontSize: 15, padding: '13px' }} disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: 8 }} />Duke hyrë...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right" /> Hyr në Panel</>
              )}
            </button>
          </form>

          <div style={{ marginTop: 22, padding: '13px 14px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, color: 'var(--gray)', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-shield-lock" /> Demo kredencialet
            </p>
            <p style={{ fontSize: 13, color: 'var(--dark)', margin: '6px 0 0', fontFamily: 'monospace' }}>
              Përdorues: <strong>admin</strong> &nbsp;|&nbsp; Fjalëkalim: <strong>admin123</strong>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray)', fontSize: 13 }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            <i className="bi bi-arrow-left" /> Kthehu në faqen kryesore
          </Link>
        </p>
      </div>
    </div>
  );
}
