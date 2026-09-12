import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getSession, logout, getClinic, getDoctors,
  getTodayAppointments, getQueue, getCurrentPatient,
  callNextPatient, updateAppointmentStatus, getAnalytics,
  STATUS, getStatusLabel, formatDate
} from '../data/store';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend,
} from 'recharts';

// `short*` labels are for the mobile tab bar, where the full ones ellipsize.
const NAV = [
  { id: 'overview', icon: 'bi-speedometer2', labelSq: 'Pasqyra', labelEn: 'Overview', shortSq: 'Pasqyra', shortEn: 'Home' },
  { id: 'appointments', icon: 'bi-calendar3', labelSq: 'Takimet', labelEn: 'Appointments', shortSq: 'Takime', shortEn: 'Appts' },
  { id: 'queue', icon: 'bi-people', labelSq: 'Radha Live', labelEn: 'Live Queue', shortSq: 'Radha', shortEn: 'Queue' },
  { id: 'analytics', icon: 'bi-bar-chart-line', labelSq: 'Analitikë', labelEn: 'Analytics', shortSq: 'Statistikë', shortEn: 'Stats' },
  { id: 'settings', icon: 'bi-gear', labelSq: 'Cilësimet', labelEn: 'Settings', shortSq: 'Cilësime', shortEn: 'Settings' },
];

// `onClose` must be a stable callback: the dashboard re-renders every 3s, and an
// inline arrow would restart this timer each time so the toast never dismissed.
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div className={`cf-toast ${type}`}>
      <i className={`bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}`} />
      {message}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session] = useState(() => getSession());
  const [clinic] = useState(() => session ? getClinic(session.clinicSlug) : null);
  const [doctors] = useState(() => clinic ? getDoctors(clinic.id) : []);

  const [lang, setLang] = useState('sq');
  const [section, setSection] = useState('overview');
  // Seeded from the store up front, so the effect below only has to keep them
  // in sync — no synchronous setState on mount.
  const [appointments, setAppointments] = useState(() => clinic ? getTodayAppointments(clinic.id) : []);
  const [queue, setQueue] = useState(() => clinic ? getQueue(clinic.id) : []);
  const [current, setCurrent] = useState(() => clinic ? getCurrentPatient(clinic.id) : null);
  const [analytics, setAnalytics] = useState(() => clinic ? getAnalytics(clinic.id) : null);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const closeToast = useCallback(() => setToast(null), []);

  const refresh = useCallback(() => {
    if (!clinic) return;
    setAppointments(getTodayAppointments(clinic.id));
    setQueue(getQueue(clinic.id));
    setCurrent(getCurrentPatient(clinic.id));
    setAnalytics(getAnalytics(clinic.id));
  }, [clinic]);

  useEffect(() => {
    if (!session || !clinic) {
      logout();
      navigate('/admin/login');
      return;
    }
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [session, clinic, navigate, refresh]);

  if (!session || !clinic) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Duke ngarkuar...</span>
      </div>
    </div>
  );

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleCallNext = () => {
    const hadCurrent = Boolean(current);
    const next = callNextPatient(clinic.id);
    refresh();
    if (next) showToast(`${lang === 'sq' ? 'Thirrur' : 'Called'}: ${next.patientName} (#${next.queueNumber})`, 'info');
    else if (hadCurrent) showToast(lang === 'sq' ? 'U përfundua. Radha është bosh.' : 'Completed. Queue is empty.', 'success');
    else showToast(lang === 'sq' ? 'Radha është bosh' : 'Queue is empty', 'error');
  };

  const handleStatusChange = (id, status) => {
    updateAppointmentStatus(id, status);
    refresh();
    showToast(`Statusi u ndryshua: ${getStatusLabel(status, lang)}`, 'success');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const getDoctor = (id) => doctors.find(d => d.id === id);
  const T = {
    sq: {
      clinic: 'Klinika', today: 'Sot', appointments: 'Takime', queue: 'Radhë', callNext: 'Thirr Tjetrin',
      noQueue: 'Radha është bosh', search: 'Kërko pacientin...', all: 'Të gjitha',
      name: 'Emri', phone: 'Telefoni', doctor: 'Mjeku', time: 'Ora', status: 'Statusi', actions: 'Veprimet',
      notes: 'Shënime', noAppts: 'Asnjë takim sot',
      analytics: 'Analitikë', settings: 'Cilësimet', overview: 'Pasqyra',
    },
    en: {
      clinic: 'Clinic', today: 'Today', appointments: 'Appointments', queue: 'Queue', callNext: 'Call Next',
      noQueue: 'Queue is empty', search: 'Search patient...', all: 'All',
      name: 'Name', phone: 'Phone', doctor: 'Doctor', time: 'Time', status: 'Status', actions: 'Actions',
      notes: 'Notes', noAppts: 'No appointments today',
      analytics: 'Analytics', settings: 'Settings', overview: 'Overview',
    },
  }[lang];

  // Colour travels on the datum as `fill`, so a slice can never be drawn in
  // another status's colour the way separate <Cell> children could.
  const statusSlices = (analytics?.statusBreakdown || [])
    .filter(s => s.value > 0)
    .map(s => ({ ...s, fill: s.color }));

  const filteredAppts = appointments.filter(a => {
    const matchSearch = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.patientPhone.includes(search);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="cf-dashboard" style={{ fontFamily: 'var(--font)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* SIDEBAR */}
      <aside className="cf-sidebar">
        <div className="cf-sidebar-logo">
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="bi bi-hospital" style={{ color: 'white', fontSize: 15 }} />
          </div>
          <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Clinic<span style={{ color: 'var(--primary-soft)' }}>Flow</span>
          </span>
        </div>

        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', padding: '11px 13px' }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{T.clinic}</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'white' }}>{clinic.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{clinic.specialty}</p>
          </div>
        </div>

        <nav className="cf-sidebar-nav">
          <div className="cf-nav-section">Menu</div>
          {NAV.map(item => (
            <button key={item.id} className={`cf-nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}>
              <i className={`bi ${item.icon}`} />
              {lang === 'sq' ? item.labelSq : item.labelEn}
              {item.id === 'queue' && queue.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.16)', color: 'white', borderRadius: 'var(--radius-xs)', minWidth: 20, height: 18, padding: '0 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700 }}>
                  {queue.length}
                </span>
              )}
            </button>
          ))}

          <div className="cf-nav-section" style={{ marginTop: 16 }}>Lidhje të Shpejta</div>
          <a href={`/book/${clinic.slug}`} target="_blank" rel="noreferrer" className="cf-nav-item">
            <i className="bi bi-box-arrow-up-right" /> Portali i Pacientit
          </a>
          <a href={`/queue/${clinic.slug}`} target="_blank" rel="noreferrer" className="cf-nav-item">
            <i className="bi bi-display" /> Ekrani i Radhës
          </a>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div className="cf-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{session.username[0].toUpperCase()}</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'white' }}>{session.username}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Administrator</p>
            </div>
          </div>
          <button className="cf-nav-item" onClick={handleLogout} style={{ color: '#d79a90' }}>
            <i className="bi bi-box-arrow-left" /> Dil
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="cf-main">
        {/* TOPBAR */}
        <div className="cf-topbar">
          <div>
            <h1 className="cf-topbar-title">
              {NAV.find(n => n.id === section)?.[lang === 'sq' ? 'labelSq' : 'labelEn']}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--gray)' }}>
              {formatDate(new Date(), lang)}
            </p>
          </div>
          <div className="cf-topbar-right">
            <div className="cf-lang-toggle">
              <button className={`cf-lang-btn ${lang === 'sq' ? 'active' : ''}`} onClick={() => setLang('sq')}>SQ</button>
              <button className={`cf-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
              <span className="cf-live-dot" /> LIVE
            </div>
            <div className="cf-avatar">{session.username[0].toUpperCase()}</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="cf-content">

          {/* ======================== OVERVIEW ======================== */}
          {section === 'overview' && analytics && (
            <div className="animate-fade-up">
              <div className="cf-stat-grid">
                {[
                  { icon: 'bi-calendar-check', label: lang === 'sq' ? 'Takime Sot' : 'Appointments Today', value: analytics.totalToday, color: 'blue', delta: '+12%', up: true },
                  { icon: 'bi-check-circle', label: lang === 'sq' ? 'Përfunduar' : 'Completed', value: analytics.completed, color: 'green', delta: `${analytics.totalToday ? Math.round(analytics.completed / analytics.totalToday * 100) : 0}%`, up: true },
                  { icon: 'bi-clock', label: lang === 'sq' ? 'Në Radhë' : 'In Queue', value: analytics.pending, color: 'purple' },
                  { icon: 'bi-x-circle', label: lang === 'sq' ? 'Nuk u Paraqit' : 'No Shows', value: analytics.noShow, color: 'orange', delta: '-8%', up: true },
                ].map((s, i) => (
                  <div key={i} className="cf-stat-card">
                    <div className={`cf-stat-icon ${s.color}`}><i className={`bi ${s.icon}`} /></div>
                    <div>
                      <div className="cf-stat-num">{s.value}</div>
                      <div className="cf-stat-label">{s.label}</div>
                      {s.delta && <div className={`cf-stat-delta ${s.up ? 'up' : 'down'}`}><i className="bi bi-arrow-up-short" />{s.delta} vs javën e kaluar</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="cf-grid-2">
                <div className="cf-table-card" style={{ padding: 24 }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 20 }}>
                    <i className="bi bi-bar-chart-line" /> {lang === 'sq' ? 'Takimet — Kjo Javë' : 'Appointments — This Week'}
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.weeklyData} barSize={28}>
                      <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--gray)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }} />
                      <Bar dataKey="count" fill="#7a5c42" radius={[3, 3, 0, 0]} isAnimationActive={false} name={lang === 'sq' ? 'Takime' : 'Appointments'} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="cf-table-card" style={{ padding: 24 }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 20 }}>
                    <i className="bi bi-pie-chart" /> {lang === 'sq' ? 'Gjendja e Takimeve' : 'Appointment Status'}
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      {/* Cells must map the SAME filtered array the Pie renders,
                          otherwise slice colours shift when a status hits zero. */}
                      {/* isAnimationActive={false}: with recharts 3.8 + React 19 the
                          animated Pie intermittently never settles and draws no
                          sector paths at all. Static also renders instantly on stage. */}
                      <Pie data={statusSlices} cx="50%" cy="45%" innerRadius={44} outerRadius={68} dataKey="value" isAnimationActive={false} />
                      <Legend formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Queue */}
              <div className="cf-table-card">
                <div className="cf-table-header">
                  <h3 className="cf-table-title"><i className="bi bi-people" /> {lang === 'sq' ? 'Radhë Aktuale' : 'Current Queue'}</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-primary-cf" style={{ padding: '10px 20px', fontSize: 14 }} onClick={handleCallNext}>
                      <i className="bi bi-megaphone" /> {T.callNext}
                    </button>
                    <button className="btn-secondary-cf" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => setSection('queue')}>
                      {lang === 'sq' ? 'Shiko të gjitha' : 'See all'} <i className="bi bi-arrow-right" />
                    </button>
                  </div>
                </div>
                {queue.length === 0 ? (
                  <div style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--gray)' }}>
                    <i className="bi bi-check2-circle" style={{ fontSize: 28, color: 'var(--gray-light)' }} />
                    <p style={{ fontWeight: 600, marginTop: 10 }}>{T.noQueue}</p>
                  </div>
                ) : (
                  <div className="cf-table-wrap">
                  <table className="cf-table">
                    <thead><tr>
                      <th>#</th><th>{T.name}</th><th>{T.doctor}</th><th>{T.time}</th><th>{T.status}</th>
                    </tr></thead>
                    <tbody>
                      {queue.slice(0, 5).map(a => (
                        <tr key={a.id}>
                          <td><span style={{ fontWeight: 800, fontSize: 20, fontFamily: 'var(--font-display)', color: a.status === 'in-progress' ? 'var(--secondary)' : 'var(--gray)' }}>#{a.queueNumber}</span></td>
                          <td><div style={{ fontWeight: 600 }}>{a.patientName}</div><div style={{ fontSize: 12, color: 'var(--gray)' }}>{a.patientPhone}</div></td>
                          <td style={{ fontSize: 14 }}>{getDoctor(a.doctorId)?.name}</td>
                          <td style={{ fontWeight: 600 }}>{a.time}</td>
                          <td><span className={`badge-cf ${a.status}`}>{getStatusLabel(a.status, lang)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================== APPOINTMENTS ======================== */}
          {section === 'appointments' && (
            <div className="animate-fade-up">
              <div className="cf-table-card">
                <div className="cf-table-header">
                  <h3 className="cf-table-title"><i className="bi bi-calendar3" /> {lang === 'sq' ? `Takimet e Sotme (${appointments.length})` : `Today's Appointments (${appointments.length})`}</h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)', fontSize: 14 }} />
                      <input className="cf-input" style={{ paddingLeft: 36, padding: '9px 14px 9px 36px', width: 220, fontSize: 14 }}
                        placeholder={T.search} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="cf-select" style={{ width: 160, padding: '9px 14px', fontSize: 14 }}
                      value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="all">{T.all}</option>
                      {Object.values(STATUS).map(s => (
                        <option key={s} value={s}>{getStatusLabel(s, lang)}</option>
                      ))}
                    </select>
                    <Link to={`/book/${clinic.slug}`} target="_blank" className="btn-primary-cf" style={{ padding: '10px 18px', fontSize: 14 }}>
                      <i className="bi bi-plus-circle" /> {lang === 'sq' ? 'Rezervo' : 'Book'}
                    </Link>
                  </div>
                </div>
                {filteredAppts.length === 0 ? (
                  <div style={{ padding: '56px 24px', textAlign: 'center', color: 'var(--gray)' }}>
                    <i className="bi bi-calendar-x" style={{ fontSize: 28, color: 'var(--gray-light)' }} />
                    <p style={{ fontWeight: 600, marginTop: 10 }}>{T.noAppts}</p>
                  </div>
                ) : (
                  <div className="cf-table-wrap">
                    <table className="cf-table">
                      <thead><tr>
                        <th>#</th><th>{T.name}</th><th>{T.phone}</th><th>{T.doctor}</th>
                        <th>{T.time}</th><th>{T.status}</th><th>{T.actions}</th>
                      </tr></thead>
                      <tbody>
                        {filteredAppts.map(a => (
                          <tr key={a.id} style={{ background: a.status === STATUS.IN_PROGRESS ? 'var(--primary-light)' : undefined }}>
                            <td><span style={{ fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>#{a.queueNumber}</span></td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="cf-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{a.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.patientName}</div>
                                  {a.notes && <div style={{ fontSize: 12, color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 5 }}><i className="bi bi-card-text" /> {a.notes}</div>}
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: 14 }}>{a.patientPhone}</td>
                            <td style={{ fontSize: 14 }}>{getDoctor(a.doctorId)?.name}</td>
                            <td><span style={{ fontWeight: 600, fontSize: 14 }}>{a.time}</span></td>
                            <td><span className={`badge-cf ${a.status}`}>{getStatusLabel(a.status, lang)}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {a.status === STATUS.CONFIRMED && (
                                  <button title="Shëno si Aktiv" className="cf-icon-btn plum"
                                    onClick={() => handleStatusChange(a.id, STATUS.IN_PROGRESS)}>
                                    <i className="bi bi-play-circle" />
                                  </button>
                                )}
                                {a.status === STATUS.IN_PROGRESS && (
                                  <button title="Përfundo" className="cf-icon-btn accent"
                                    onClick={() => handleStatusChange(a.id, STATUS.COMPLETED)}>
                                    <i className="bi bi-check2-circle" />
                                  </button>
                                )}
                                {[STATUS.PENDING, STATUS.CONFIRMED].includes(a.status) && (
                                  <button title="Anulo" className="cf-icon-btn danger"
                                    onClick={() => handleStatusChange(a.id, STATUS.CANCELLED)}>
                                    <i className="bi bi-x-circle" />
                                  </button>
                                )}
                                {a.status === STATUS.CONFIRMED && (
                                  <button title="Nuk u paraqit" className="cf-icon-btn warning"
                                    onClick={() => handleStatusChange(a.id, STATUS.NO_SHOW)}>
                                    <i className="bi bi-person-x" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================== QUEUE ======================== */}
          {section === 'queue' && (
            <div className="animate-fade-up">
              <div className="cf-grid-2">
                {/* Now Serving */}
                <div className="cf-table-card" style={{ padding: 32, textAlign: 'center' }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 22, justifyContent: 'center' }}>
                    <i className="bi bi-person-check" /> {lang === 'sq' ? 'Tani Shërbehet' : 'Now Serving'}
                  </h3>
                  {current ? (
                    <div>
                      <div className="cf-num-tile active" style={{ width: 68, height: 68, fontSize: 26, margin: '0 auto 16px' }}>
                        #{current.queueNumber}
                      </div>
                      <h2 style={{ fontSize: 20, marginBottom: 4 }}>{current.patientName}</h2>
                      <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 3 }}>{getDoctor(current.doctorId)?.name}</p>
                      <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <i className="bi bi-clock" /> {current.time}
                      </p>
                      <button className="btn-accent-cf" style={{ width: '100%' }}
                        onClick={handleCallNext}>
                        <i className="bi bi-check2-circle" /> {lang === 'sq' ? 'Përfundo & Thirr Tjetrin' : 'Complete & Call Next'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--gray)', padding: '20px 0' }}>
                      <i className="bi bi-person-dash" style={{ fontSize: 28, color: 'var(--gray-light)' }} />
                      <p style={{ marginTop: 10 }}>{lang === 'sq' ? 'Asnjë pacient aktiv' : 'No active patient'}</p>
                    </div>
                  )}
                </div>

                {/* Call Next */}
                <div className="cf-table-card" style={{ padding: 32, textAlign: 'center' }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 22, justifyContent: 'center' }}>
                    <i className="bi bi-skip-forward" /> {lang === 'sq' ? 'Kontroll Radhë' : 'Queue Control'}
                  </h3>
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--dark)', lineHeight: 1.1 }}>{queue.length}</div>
                    <p style={{ color: 'var(--gray)', fontSize: 14 }}>{lang === 'sq' ? 'pacientë në radhë' : 'patients in queue'}</p>
                  </div>
                  <button className="btn-primary-cf" style={{ width: '100%', fontSize: 15, padding: '13px' }} onClick={handleCallNext}>
                    <i className="bi bi-megaphone" /> {T.callNext}
                  </button>
                  <Link to={`/queue/${clinic.slug}`} target="_blank" className="btn-secondary-cf" style={{ width: '100%', marginTop: 10 }}>
                    <i className="bi bi-display" /> {lang === 'sq' ? 'Hap Ekranin e Pritjes' : 'Open Waiting Screen'}
                  </Link>
                </div>
              </div>

              {/* Queue List */}
              <div className="cf-table-card">
                <div className="cf-table-header">
                  <h3 className="cf-table-title"><i className="bi bi-list-ol" /> {lang === 'sq' ? 'Lista e Radhës' : 'Queue List'}</h3>
                </div>
                {queue.length === 0 ? (
                  <div style={{ padding: '44px 24px', textAlign: 'center', color: 'var(--gray)' }}>
                    <i className="bi bi-check2-circle" style={{ fontSize: 28, color: 'var(--gray-light)' }} />
                    <p style={{ fontWeight: 600, marginTop: 10 }}>{T.noQueue}</p>
                  </div>
                ) : (
                  <div className="cf-table-wrap">
                  <table className="cf-table">
                    <thead><tr>
                      <th>#</th><th>{T.name}</th><th>{T.doctor}</th><th>{T.time}</th><th>{T.status}</th><th>{T.actions}</th>
                    </tr></thead>
                    <tbody>
                      {queue.map((a, idx) => (
                        <tr key={a.id} style={{ background: a.status === STATUS.IN_PROGRESS ? 'var(--primary-light)' : undefined }}>
                          <td>
                            <div className={`cf-num-tile ${a.status === STATUS.IN_PROGRESS ? 'active' : idx === 0 ? 'next' : ''}`}
                              style={{ width: 32, height: 32, fontSize: 14 }}>
                              {a.queueNumber}
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                          <td style={{ fontSize: 14 }}>{getDoctor(a.doctorId)?.name}</td>
                          <td style={{ fontWeight: 600 }}>{a.time}</td>
                          <td><span className={`badge-cf ${a.status}`}>{getStatusLabel(a.status, lang)}</span></td>
                          <td>
                            {a.status === STATUS.IN_PROGRESS && (
                              <button className="btn-accent-cf" style={{ padding: '6px 14px', fontSize: 12 }}
                                onClick={() => { handleStatusChange(a.id, STATUS.COMPLETED); refresh(); }}>
                                <i className="bi bi-check2" /> {lang === 'sq' ? 'Përfundo' : 'Complete'}
                              </button>
                            )}
                            {a.status === STATUS.CONFIRMED && (
                              <button className="cf-icon-btn warning" style={{ padding: '5px 12px', fontSize: 12 }}
                                onClick={() => handleStatusChange(a.id, STATUS.NO_SHOW)}>
                                <i className="bi bi-person-x" /> No Show
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================== ANALYTICS ======================== */}
          {section === 'analytics' && analytics && (
            <div className="animate-fade-up">
              <div className="cf-stat-grid" style={{ marginBottom: 24 }}>
                {[
                  { label: lang === 'sq' ? 'Totali i Takimeve' : 'Total Appointments', value: analytics.totalAll, icon: 'bi-calendar', color: 'blue' },
                  { label: lang === 'sq' ? 'Sot Përfunduar' : 'Completed Today', value: analytics.completed, icon: 'bi-check-circle', color: 'green' },
                  { label: lang === 'sq' ? 'Shkalla e No-Show' : 'No-Show Rate', value: `${analytics.totalToday ? Math.round(analytics.noShow / analytics.totalToday * 100) : 0}%`, icon: 'bi-person-x', color: 'orange' },
                  { label: lang === 'sq' ? 'Mjekë Aktiv' : 'Active Doctors', value: doctors.length, icon: 'bi-people', color: 'purple' },
                ].map((s, i) => (
                  <div key={i} className="cf-stat-card">
                    <div className={`cf-stat-icon ${s.color}`}><i className={`bi ${s.icon}`} /></div>
                    <div><div className="cf-stat-num">{s.value}</div><div className="cf-stat-label">{s.label}</div></div>
                  </div>
                ))}
              </div>

              <div className="cf-grid-2 wide-first">
                <div className="cf-table-card" style={{ padding: 28 }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 24 }}>
                    <i className="bi bi-bar-chart-line" /> {lang === 'sq' ? 'Takimet Javore' : 'Weekly Appointments'}
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analytics.weeklyData} barSize={36}>
                      <XAxis dataKey="day" tick={{ fontSize: 13, fill: 'var(--gray)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 13, fill: 'var(--gray)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid var(--border)', fontSize: 14 }} />
                      <Bar dataKey="count" fill="#7a5c42" radius={[3, 3, 0, 0]} isAnimationActive={false} name={lang === 'sq' ? 'Takime' : 'Appointments'} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="cf-table-card" style={{ padding: 28 }}>
                  <h3 className="cf-table-title" style={{ marginBottom: 24 }}>
                    <i className="bi bi-pie-chart" /> {lang === 'sq' ? 'Gjendja e Takimeve' : 'Status Breakdown'}
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={statusSlices} cx="50%" cy="45%" innerRadius={56} outerRadius={90} dataKey="value" isAnimationActive={false} />
                      <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                      <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid var(--border)', fontSize: 14 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ======================== SETTINGS ======================== */}
          {section === 'settings' && (
            <div className="animate-fade-up" style={{ maxWidth: 640 }}>
              <div className="cf-card" style={{ marginBottom: 18 }}>
                <h3 className="cf-table-title" style={{ marginBottom: 22 }}>
                  <i className="bi bi-hospital" /> {lang === 'sq' ? 'Informata e Klinikës' : 'Clinic Information'}
                </h3>
                {[
                  { label: lang === 'sq' ? 'Emri i Klinikës' : 'Clinic Name', value: clinic.name },
                  { label: lang === 'sq' ? 'Specialiteti' : 'Specialty', value: clinic.specialty },
                  { label: lang === 'sq' ? 'Adresa' : 'Address', value: clinic.address },
                  { label: lang === 'sq' ? 'Telefoni' : 'Phone', value: clinic.phone },
                  { label: lang === 'sq' ? 'Email' : 'Email', value: clinic.email },
                  { label: lang === 'sq' ? 'Orari i Punës' : 'Working Hours', value: clinic.workingHours },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <label className="cf-label">{f.label}</label>
                    <input className="cf-input" defaultValue={f.value} />
                  </div>
                ))}
                <button className="btn-primary-cf" onClick={() => showToast(lang === 'sq' ? 'Ndryshimet u ruajtën' : 'Changes saved')}>
                  <i className="bi bi-check2" /> {lang === 'sq' ? 'Ruaj Ndryshimet' : 'Save Changes'}
                </button>
              </div>

              <div className="cf-card">
                <h3 className="cf-table-title" style={{ marginBottom: 22 }}>
                  <i className="bi bi-link-45deg" /> {lang === 'sq' ? 'Lidhje të Shpejta' : 'Quick Links'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link to={`/book/${clinic.slug}`} target="_blank" className="btn-secondary-cf">
                    <i className="bi bi-box-arrow-up-right" /> {lang === 'sq' ? 'Portali i Pacientit' : 'Patient Portal'} — /book/{clinic.slug}
                  </Link>
                  <Link to={`/queue/${clinic.slug}`} target="_blank" className="btn-secondary-cf">
                    <i className="bi bi-display" /> {lang === 'sq' ? 'Ekrani i Radhës (TV)' : 'Queue Screen (TV)'} — /queue/{clinic.slug}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE NAV — the sidebar is hidden under 768px, so this is the only
          way to switch sections or log out on a phone. */}
      <nav className="cf-mobile-nav">
        <div className="cf-mobile-nav-inner">
          {NAV.map(item => (
            <button key={item.id}
              className={`cf-mobile-nav-btn ${section === item.id ? 'active' : ''}`}
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => { setSection(item.id); window.scrollTo({ top: 0 }); }}>
              <i className={`bi ${item.icon}`} />
              <span>{lang === 'sq' ? item.shortSq : item.shortEn}</span>
              {item.id === 'queue' && queue.length > 0 && (
                <span className="cf-mobile-nav-badge">{queue.length}</span>
              )}
            </button>
          ))}
          <button className="cf-mobile-nav-btn" style={{ color: '#d79a90' }} onClick={handleLogout}>
            <i className="bi bi-box-arrow-left" />
            <span>{lang === 'sq' ? 'Dil' : 'Log out'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
