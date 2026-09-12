import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClinic, getQueue, getCurrentPatient, getDoctors, getTodayAppointments, STATUS, formatDate, formatTime } from '../data/store';

export default function QueueDisplay() {
  const { clinicSlug } = useParams();
  const clinic = getClinic(clinicSlug);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [completed, setCompleted] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const refresh = () => {
      if (!clinic) return;
      setQueue(getQueue(clinic.id));
      setCurrent(getCurrentPatient(clinic.id));
      setCompleted(getTodayAppointments(clinic.id).filter(a => a.status === STATUS.COMPLETED).length);
    };
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [clinic]);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!clinic) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <h2 style={{ color: 'white' }}>Klinika nuk u gjet</h2>
    </div>
  );

  const upcoming = queue.filter(a => a.status !== 'in-progress').slice(0, 5);
  const doctors = getDoctors(clinic.id);
  const getDoctor = (id) => doctors.find(d => d.id === id);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      fontFamily: 'var(--font)',
      position: 'relative',
    }}>
      {/* TOP BAR */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px clamp(14px, 4vw, 40px)',
        gap: 12,
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="bi bi-hospital" style={{ color: 'white', fontSize: 17 }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>ClinicFlow</p>
            <h2 style={{ margin: 0, color: 'white', fontSize: 17, fontWeight: 700 }}>{clinic.name}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="cf-live-dot" />
            <span style={{ color: '#8fbfa3', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: 'white', fontSize: 'clamp(20px, 6vw, 28px)', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {formatTime(time, true)}
            </p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              {formatDate(time, 'sq', { year: false })}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 40px)', position: 'relative', zIndex: 1, width: '100%' }}>
        {/* NOW SERVING */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', textAlign: 'center', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <i className="bi bi-bell" />
            Tani Shërbehet — Now Serving
          </p>
        </div>

        {current ? (
          // Light panel on the dark screen: highest contrast for a number that
          // has to be readable from across the waiting room.
          <div style={{
            background: '#f2e8dc',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(32px, 6vw, 52px) clamp(24px, 8vw, 80px)',
            textAlign: 'center',
            marginBottom: 'clamp(28px, 5vw, 48px)',
            boxShadow: '0 18px 48px rgba(0, 0, 0, 0.35)',
            width: '100%',
            maxWidth: 620,
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 10 }}>
              Numri i Radhës
            </div>
            <div style={{ fontSize: 'clamp(68px, 20vw, 108px)', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--dark)', lineHeight: 1, marginBottom: 16 }}>
              #{current.queueNumber}
            </div>
            <div style={{ fontSize: 'clamp(19px, 5.2vw, 25px)', fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>
              {current.patientName}
            </div>
            <div style={{ fontSize: 'clamp(13px, 3.4vw, 14.5px)', color: 'var(--gray)' }}>
              {getDoctor(current.doctorId)?.name} • {current.time}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px dashed rgba(255,255,255,0.14)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(32px, 6vw, 52px) clamp(24px, 8vw, 80px)',
            textAlign: 'center',
            marginBottom: 'clamp(28px, 5vw, 48px)',
            width: '100%',
            maxWidth: 620,
          }}>
            <i className="bi bi-clock" style={{ fontSize: 34, color: 'rgba(255,255,255,0.3)' }} />
            <div style={{ fontSize: 21, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: 14 }}>
              Ende nuk ka pacientë aktiv
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
              No active patients yet
            </div>
          </div>
        )}

        {/* UPCOMING QUEUE */}
        {upcoming.length > 0 && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
              Radhë në Pritje — Upcoming
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
              {upcoming.map((a, i) => (
                <div key={a.id} style={{
                  background: i === 0 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,${i === 0 ? 0.18 : 0.09})`,
                  borderRadius: 'var(--radius)',
                  padding: '18px 26px',
                  textAlign: 'center',
                  minWidth: 120,
                }}>
                  <div style={{ fontSize: 38, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: i === 0 ? 'white' : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                    #{a.queueNumber}
                  </div>
                  <div style={{ fontSize: 12, color: i === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)', marginTop: 6, fontWeight: 500 }}>
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 'clamp(20px, 6vw, 32px)', marginTop: 'clamp(28px, 5vw, 48px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: 'bi-check2-circle', label: 'Përfunduar', value: completed },
            { icon: 'bi-hourglass-split', label: 'Në Radhë', value: upcoming.length },
            { icon: 'bi-person-badge', label: 'Mjekë Aktiv', value: getDoctors(clinic.id).length },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <i className={`bi ${s.icon}`} style={{ fontSize: 19, color: 'rgba(255,255,255,0.35)' }} />
              <div style={{ fontSize: 29, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.025em', marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        padding: '16px clamp(14px, 4vw, 40px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 12.5, margin: 0, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <i className="bi bi-geo-alt" /> {clinic.address}
          <span style={{ opacity: 0.4 }}>•</span>
          <i className="bi bi-telephone" /> {clinic.phone}
        </p>
        <Link to={`/book/${clinicSlug}`} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 'var(--radius-sm)', padding: '8px 16px',
          color: 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          transition: 'var(--transition)',
        }}>
          <i className="bi bi-calendar-plus" />
          Rezervo Takim
        </Link>
      </div>
    </div>
  );
}
