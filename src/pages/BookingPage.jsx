import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getClinic, getDoctors, getTimeSlots, bookAppointment, isSlotTaken, formatDate
} from '../data/store';

export default function BookingPage() {
  const { clinicSlug } = useParams();
  const navigate = useNavigate();
  const clinic = getClinic(clinicSlug);
  const doctors = clinic ? getDoctors(clinic.id) : [];
  const slots = getTimeSlots();

  const [lang, setLang] = useState('sq');
  const [step, setStep] = useState(1); // 1=info, 2=datetime, 3=confirm, 4=done
  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const T = {
    sq: {
      title: 'Rezervo Takim', sub: `Klinika: ${clinic?.name}`,
      step1: 'Të dhënat tuaja', step2: 'Data & Ora', step3: 'Konfirmim',
      name: 'Emri i plotë', phone: 'Numri i telefonit', doctor: 'Zgjidhni mjekun',
      date: 'Data e takimit', time: 'Ora', notes: 'Shënime (opsionale)',
      selectDoctor: '— Zgjidhni mjekun —', taken: 'E zënë',
      next: 'Vazhdo', back: 'Kthehu', confirm: 'Konfirmo Takimin',
      successTitle: 'Takimi u rezervua',
      queueNum: 'Numri juaj i radhës',
      bookAnother: 'Rezervo tjetër',
      errorName: 'Emri është i detyrueshëm',
      errorPhone: 'Numri i telefonit është i detyrueshëm',
      errorDoctor: 'Zgjidhni një mjek',
      errorTime: 'Zgjidhni një orë',
      required: '*',
      placeholderName: 'p.sh. Fjolla Berisha',
      placeholderPhone: 'p.sh. +383 44 123 456',
      placeholderNotes: 'Shkruani shënime shtesë...',
    },
    en: {
      title: 'Book Appointment', sub: `Clinic: ${clinic?.name}`,
      step1: 'Your Info', step2: 'Date & Time', step3: 'Confirm',
      name: 'Full name', phone: 'Phone number', doctor: 'Choose doctor',
      date: 'Appointment date', time: 'Time', notes: 'Notes (optional)',
      selectDoctor: '— Select a doctor —', taken: 'Taken',
      next: 'Continue', back: 'Back', confirm: 'Confirm Appointment',
      successTitle: 'Appointment booked',
      queueNum: 'Your queue number',
      bookAnother: 'Book another',
      errorName: 'Name is required',
      errorPhone: 'Phone number is required',
      errorDoctor: 'Please select a doctor',
      errorTime: 'Please select a time',
      required: '*',
      placeholderName: 'e.g. Fjolla Berisha',
      placeholderPhone: 'e.g. +383 44 123 456',
      placeholderNotes: 'Write additional notes...',
    },
  }[lang];

  if (!clinic) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center' }}>
        <i className="bi bi-hospital" style={{ fontSize: 40, color: 'var(--gray-light)' }} />
        <h2 style={{ margin: '14px 0 0' }}>Klinika nuk u gjet</h2>
        <Link to="/" className="btn-primary-cf" style={{ marginTop: 18 }}>
          <i className="bi bi-arrow-left" /> Kthehu
        </Link>
      </div>
    </div>
  );

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.patientName.trim()) e.patientName = T.errorName;
      if (!form.patientPhone.trim()) e.patientPhone = T.errorPhone;
      if (!form.doctorId) e.doctorId = T.errorDoctor;
    }
    if (step === 2) {
      if (!form.time) e.time = T.errorTime;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    const appt = bookAppointment({ ...form, clinicId: clinic.id, doctorId: Number(form.doctorId), date: form.date });
    setSubmitted(appt);
    setStep(4);
  };

  const selectedDoctor = doctors.find(d => d.id === Number(form.doctorId));

  const steps = [T.step1, T.step2, T.step3];

  return (
    <div className="cf-booking-page" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '0 0 52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px clamp(14px, 4vw, 32px)' }}>
          <Link to="/" className="cf-logo">
            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="bi bi-hospital" style={{ color: 'white', fontSize: 16 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>ClinicFlow</span>
          </Link>
          <div className="cf-lang-toggle on-dark">
            <button className={`cf-lang-btn ${lang === 'sq' ? 'active' : ''}`} onClick={() => setLang('sq')}>SQ</button>
            <button className={`cf-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'white', padding: '10px 20px 0' }}>
          <div style={{
            width: 46, height: 46, margin: '0 auto 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 21, color: 'var(--primary-soft)',
          }}>
            <i className={`bi ${clinic.logo}`} />
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(22px, 5.6vw, 28px)', marginBottom: 6 }}>{T.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 'clamp(13px, 3.4vw, 14.5px)' }}>{clinic.name} • {clinic.address}</p>
        </div>
      </div>

      {/* Steps Indicator */}
      {step < 4 && (
        <div className="cf-steps">
          <div className="cf-steps-inner">
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`cf-step ${step === i + 1 ? 'current' : step > i + 1 ? 'done' : ''}`}>
                  <span className="cf-step-num">{step > i + 1 ? '✓' : i + 1}</span>
                  <span className="cf-step-label">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`cf-step-line ${step > i + 1 ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Card */}
      <div style={{ maxWidth: 600, margin: '32px auto 60px', padding: '0 20px' }}>
        {step < 4 ? (
          <div className="cf-card cf-booking-card">
            {/* STEP 1: Info */}
            {step === 1 && (
              <div className="animate-fade-up">
                <h2 style={{ marginBottom: 28, fontSize: 22 }}>{T.step1}</h2>
                <div style={{ marginBottom: 20 }}>
                  <label className="cf-label">{T.name} <span style={{ color: 'var(--danger)' }}>{T.required}</span></label>
                  <input className={`cf-input ${errors.patientName ? 'border-danger' : ''}`} placeholder={T.placeholderName}
                    value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} />
                  {errors.patientName && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.patientName}</p>}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="cf-label">{T.phone} <span style={{ color: 'var(--danger)' }}>{T.required}</span></label>
                  <input className={`cf-input ${errors.patientPhone ? 'border-danger' : ''}`} placeholder={T.placeholderPhone} type="tel"
                    value={form.patientPhone} onChange={e => setForm({ ...form, patientPhone: e.target.value })} />
                  {errors.patientPhone && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.patientPhone}</p>}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="cf-label">{T.doctor} <span style={{ color: 'var(--danger)' }}>{T.required}</span></label>
                  <select className={`cf-select ${errors.doctorId ? 'border-danger' : ''}`}
                    value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                    <option value="">{T.selectDoctor}</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
                    ))}
                  </select>
                  {errors.doctorId && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.doctorId}</p>}
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="cf-label">{T.notes}</label>
                  <textarea className="cf-input" rows={3} placeholder={T.placeholderNotes}
                    value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button className="btn-primary-cf" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px' }} onClick={handleNext}>
                  {T.next} <i className="bi bi-arrow-right" />
                </button>
              </div>
            )}

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <div className="animate-fade-up">
                <h2 style={{ marginBottom: 28, fontSize: 22 }}>{T.step2}</h2>
                <div style={{ marginBottom: 24 }}>
                  <label className="cf-label">{T.date}</label>
                  <input type="date" className="cf-input" value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, date: e.target.value, time: '' })} />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <label className="cf-label">{T.time} <span style={{ color: 'var(--danger)' }}>{T.required}</span></label>
                  {errors.time && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 8 }}>{errors.time}</p>}
                  <div className="cf-time-grid">
                    {slots.map(slot => {
                      const taken = form.doctorId && isSlotTaken(clinic.id, Number(form.doctorId), form.date, slot);
                      return (
                        <button key={slot}
                          className={`cf-time-slot ${taken ? 'disabled' : ''} ${form.time === slot ? 'selected' : ''}`}
                          onClick={() => !taken && setForm({ ...form, time: slot })}
                          disabled={taken}>
                          {taken ? <><i className="bi bi-x" /> {slot}</> : slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-secondary-cf" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>
                    <i className="bi bi-arrow-left" /> {T.back}
                  </button>
                  <button className="btn-primary-cf" style={{ flex: 2, justifyContent: 'center' }} onClick={handleNext}>
                    {T.next} <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm */}
            {step === 3 && (
              <div className="animate-fade-up">
                <h2 style={{ marginBottom: 28, fontSize: 22 }}>{T.step3}</h2>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 18px', marginBottom: 26 }}>
                  {[
                    { icon: 'bi-person', label: T.name, value: form.patientName },
                    { icon: 'bi-telephone', label: T.phone, value: form.patientPhone },
                    { icon: 'bi-clipboard2-pulse', label: T.doctor, value: selectedDoctor?.name },
                    { icon: 'bi-calendar3', label: T.date, value: formatDate(form.date, lang) },
                    { icon: 'bi-clock', label: T.time, value: form.time },
                    ...(form.notes ? [{ icon: 'bi-card-text', label: T.notes, value: form.notes }] : []),
                  ].map((r, i, rows) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <i className={`bi ${r.icon}`} style={{ fontSize: 15, width: 18, color: 'var(--gray-light)', marginTop: 2, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 10.5, color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{r.label}</p>
                        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: 'var(--dark)' }}>{r.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-secondary-cf" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>
                    <i className="bi bi-arrow-left" /> {T.back}
                  </button>
                  <button className="btn-accent-cf" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit}>
                    <i className="bi bi-check-circle" /> {T.confirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STEP 4: Success */
          <div className="cf-card cf-booking-card animate-fade-up" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 20px' }}>
              <i className="bi bi-check2" />
            </div>
            <h2 style={{ fontSize: 25, marginBottom: 8 }}>{T.successTitle}</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 28, fontSize: 15 }}>
              {lang === 'sq' ? `Takimi u konfirmua. Do të njoftoheni në ${form.patientPhone}.` : `Appointment confirmed. You'll be notified at ${form.patientPhone}.`}
            </p>
            <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius)', padding: '26px 20px', marginBottom: 28, color: 'white' }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{T.queueNum}</p>
              <div className="cf-booking-queue-num">#{submitted?.queueNumber}</div>
              <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,0.62)' }}>{form.time} — {selectedDoctor?.name}</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-secondary-cf" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { setStep(1); setForm({ patientName: '', patientPhone: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', notes: '' }); setSubmitted(null); }}>
                {T.bookAnother}
              </button>
              <button className="btn-primary-cf" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(`/queue/${clinicSlug}`)}>
                <i className="bi bi-display" />
                {lang === 'sq' ? 'Shiko Radhën' : 'View Queue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
