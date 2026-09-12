import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate } from '../data/store';

const navAnchors = ['#features', '#pricing', '#demo', '#contact'];

const t = {
  sq: {
    nav: ['Veçoritë', 'Çmimet', 'Demo', 'Kontakt'],
    login: 'Hyrje',
    getStarted: 'Fillo Tani',
    badge: 'E bërë për Kosovën',
    h1a: 'Menaxho Klinikën',
    h1b: 'Tënde',
    h1c: 'Si Profesionist',
    sub: 'Sistemi i parë dixhital i menaxhimit të klinikave private në Kosovë. Rezervime online, radhë live, dhe analitikë të avancuara — gjithçka në një platformë.',
    findDoctor: 'Gjej Mjekun',
    bookDemo: 'Provoni Demo',
    seeQueue: 'Shiko Radhën Live',
    stat1: '2,000+', stat1l: 'Klinika në Kosovë',
    stat2: '98%', stat2l: 'Kënaqësi e klientëve',
    stat3: '40%', stat3l: 'Më pak no-show',
    featuresLabel: 'Veçoritë',
    featuresTitle: 'Gjithçka që nevojitet klinika juaj',
    featuresSub: 'Nga rezervimet online deri te analitika e avancuar — ClinicFlow e bën menaxhimin e klinikës tuaj të thjeshtë.',
    pricing: 'Çmimet',
    pricingTitle: 'Çmime transparente, pa surpriza',
    contactLabel: 'Kontakt',
    contactTitle: 'Na kontaktoni',
    contactSub: 'Jeni të interesuar për ClinicFlow? Dërgoni mesazh dhe do t\'ju kthejmë përgjigje brenda 24 orëve.',
    contactName: 'Emri juaj',
    contactEmail: 'Email adresa',
    contactPhone: 'Numri i telefonit',
    contactMsg: 'Mesazhi juaj',
    contactSend: 'Dërgo Mesazhin',
    contactSent: 'Mesazhi u dërgua. Do t\'ju kontaktojmë së shpejti.',
    contactInfo1Title: 'Email',
    contactInfo1Val: 'info@clinicflow.ks',
    contactInfo2Title: 'Telefon',
    contactInfo2Val: '+383 44 000 000',
    contactInfo3Title: 'Adresa',
    contactInfo3Val: 'Prishtinë, Kosovë',
    footer: '© 2026 ClinicFlow. Prishtinë, Kosovë.',
  },
  en: {
    nav: ['Features', 'Pricing', 'Demo', 'Contact'],
    login: 'Login',
    getStarted: 'Get Started',
    badge: 'Made for Kosovo',
    h1a: 'Manage Your',
    h1b: 'Clinic',
    h1c: 'Like a Pro',
    sub: 'The first digital clinic management system for private clinics in Kosovo. Online booking, live queue, and advanced analytics — all in one platform.',
    findDoctor: 'Find a Doctor',
    bookDemo: 'Try Demo',
    seeQueue: 'See Live Queue',
    stat1: '2,000+', stat1l: 'Clinics in Kosovo',
    stat2: '98%', stat2l: 'Client satisfaction',
    stat3: '40%', stat3l: 'Fewer no-shows',
    featuresLabel: 'Features',
    featuresTitle: 'Everything your clinic needs',
    featuresSub: 'From online booking to advanced analytics — ClinicFlow makes managing your clinic effortless.',
    pricing: 'Pricing',
    pricingTitle: 'Transparent pricing, no surprises',
    contactLabel: 'Contact',
    contactTitle: 'Get in touch',
    contactSub: 'Interested in ClinicFlow? Send us a message and we\'ll get back to you within 24 hours.',
    contactName: 'Your name',
    contactEmail: 'Email address',
    contactPhone: 'Phone number',
    contactMsg: 'Your message',
    contactSend: 'Send Message',
    contactSent: 'Message sent. We\'ll be in touch soon.',
    contactInfo1Title: 'Email',
    contactInfo1Val: 'info@clinicflow.ks',
    contactInfo2Title: 'Phone',
    contactInfo2Val: '+383 44 000 000',
    contactInfo3Title: 'Address',
    contactInfo3Val: 'Pristina, Kosovo',
    footer: '© 2026 ClinicFlow. Pristina, Kosovo.',
  },
};

const features = [
  { icon: 'bi-calendar-check', titleSq: 'Rezervime Online', titleEn: 'Online Booking', descSq: 'Pacientët rezervojnë online 24/7. Pa telefon, pa pritje. Klinika juaj pranon rezervime edhe kur jeni gjumë.', descEn: 'Patients book online 24/7. No phone calls, no waiting. Your clinic accepts bookings even while you sleep.' },
  { icon: 'bi-list-ol', titleSq: 'Radhë Live', titleEn: 'Live Queue', descSq: 'Ekrani i sallës së pritjes tregon radhën aktuale në kohë reale. Pacientët e dinë se kur u vjen radha.', descEn: 'The waiting room screen shows the current queue in real time. Patients know exactly when their turn comes.' },
  { icon: 'bi-graph-up', titleSq: 'Analitikë e Avancuar', titleEn: 'Advanced Analytics', descSq: 'Raporte ditore, javore dhe mujore. Shihni orët më të zëna, no-show-t, dhe të ardhurat nga çdo mjek.', descEn: 'Daily, weekly and monthly reports. See peak hours, no-shows, and revenue per doctor.' },
  { icon: 'bi-chat-dots', titleSq: 'WhatsApp Njoftimet', titleEn: 'WhatsApp Reminders', descSq: 'Pacientët marrin kujtesë automatike në WhatsApp para takimit. No-show-t ulen me 40%.', descEn: 'Patients get automatic WhatsApp reminders before their appointment. No-shows drop by 40%.' },
  { icon: 'bi-people', titleSq: 'Multi-Doktor', titleEn: 'Multi-Doctor', descSq: 'Menaxhoni oraret e të gjithë mjekëve nga një panel i vetëm. Konflikte zero orari.', descEn: 'Manage all doctors schedules from one dashboard. Zero scheduling conflicts.' },
  { icon: 'bi-wallet2', titleSq: 'Gjurmim Pagesash', titleEn: 'Payment Tracking', descSq: 'Regjistroni pagesat cash dhe kartë për çdo vizitë. Raporte financiare të sakta me një klikim.', descEn: 'Track cash and card payments per visit. Accurate financial reports with one click.' },
];

const plans = [
  {
    nameSq: 'Starter', nameEn: 'Starter',
    price: '€49',
    descSq: 'Dentistë ose terapistë solo', descEn: 'Solo dentists or therapists',
    featuresSq: ['1 kalendar', 'Rezervime bazë online', 'Kujtime me email', 'Radhë live', 'Suport email'],
    featuresEn: ['1 calendar', 'Basic online booking', 'Email reminders', 'Live queue', 'Email support'],
    featured: false,
  },
  {
    nameSq: 'Pro', nameEn: 'Pro',
    price: '€89',
    descSq: 'Klinika standarde (2–5 staf)', descEn: 'Standard clinics (2–5 staff)',
    featuresSq: ['5 kalendarë', 'Gjithçka në Starter', 'Kujtime SMS/WhatsApp', 'Analitikë e avancuar', 'Gjurmim pagesash', 'Suport prioritar'],
    featuresEn: ['5 calendars', 'Everything in Starter', 'SMS/WhatsApp reminders', 'Advanced analytics', 'Payment tracking', 'Priority support'],
    featured: true,
    badgeSq: 'Më Popullorja', badgeEn: 'Most Popular',
  },
  {
    nameSq: 'Elite', nameEn: 'Elite',
    price: '€149+',
    descSq: 'Poliklinika & Rrjete', descEn: 'Polyclinics & Networks',
    featuresSq: ['Staf i pakufizuar', 'Domen i personalizuar', 'Gjithçka në Pro', 'API akses', 'Menaxher llogarie dedikuar', 'Suport prioritar 24/7'],
    featuresEn: ['Unlimited staff', 'Custom domain', 'Everything in Pro', 'API access', 'Dedicated account manager', 'Priority support 24/7'],
    featured: false,
  },
];

export default function LandingPage() {
  const [lang, setLang] = useState('sq');
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const navigate = useNavigate();
  const T = t[lang];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setContactSent(false), 6000);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      {/* NAVBAR */}
      <nav className="cf-navbar" style={{ boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <Link to="/" className="cf-logo">
          <div className="cf-logo-icon"><i className="bi bi-hospital" /></div>
          <span className="cf-logo-text">Clinic<span>Flow</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ gap: 24, marginRight: 8 }} className="d-none d-md-flex">
            {T.nav.map((n, i) => (
              <a key={n} href={navAnchors[i]} style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray)', textDecoration: 'none', transition: 'var(--transition)' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray)'}>{n}</a>
            ))}
          </div>
          <Link to="/gjej" className="btn-primary-cf" aria-label={T.findDoctor} title={T.findDoctor}
            style={{ padding: '9px 16px', fontSize: 14, whiteSpace: 'nowrap' }}>
            <i className="bi bi-search-heart" /> <span className="d-none d-sm-inline">{T.findDoctor}</span>
          </Link>
          <div className="cf-lang-toggle">
            <button className={`cf-lang-btn ${lang === 'sq' ? 'active' : ''}`} onClick={() => setLang('sq')}>SQ</button>
            <button className={`cf-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
          <button className="btn-secondary-cf d-none d-md-flex" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => navigate('/admin/login')}>
            <i className="bi bi-person-circle" /> {T.login}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="cf-hero">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div className="cf-hero-grid">
            <div>
              <div className="cf-hero-badge animate-fade-up">
                <i className="bi bi-geo-alt-fill" style={{ color: 'var(--primary)', fontSize: 13 }} />
                {T.badge}
              </div>
              <h1 className="cf-hero-title animate-fade-up animate-delay-1">
                {T.h1a}<br />
                <span className="highlight">{T.h1b}</span><br />
                {T.h1c}
              </h1>
              <p className="cf-hero-sub animate-fade-up animate-delay-2">{T.sub}</p>
              <div className="cf-hero-actions animate-fade-up animate-delay-3">
                <button className="btn-primary-cf" onClick={() => navigate('/gjej')}>
                  <i className="bi bi-search-heart" /> {T.findDoctor}
                </button>
                <button className="btn-secondary-cf" onClick={() => navigate('/book/klinika-shendetit')}>
                  <i className="bi bi-calendar-plus" /> {T.bookDemo}
                </button>
                <button className="btn-secondary-cf" onClick={() => navigate('/queue/klinika-shendetit')}>
                  <i className="bi bi-display" /> {T.seeQueue}
                </button>
              </div>
              <div className="cf-hero-stats animate-fade-up animate-delay-4">
                {[
                  { num: T.stat1, label: T.stat1l },
                  { num: T.stat2, label: T.stat2l },
                  { num: T.stat3, label: T.stat3l },
                ].map((s, i) => (
                  <div key={i} className="cf-hero-stat">
                    <span className="cf-hero-stat-num">{s.num}</span>
                    <span className="cf-hero-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="d-none d-lg-flex" style={{ justifyContent: 'center' }}>
              <HeroVisual lang={lang} navigate={navigate} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="cf-section" id="features" style={{ background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="cf-section-label">{T.featuresLabel}</span>
            <h2 className="cf-section-title">{T.featuresTitle}</h2>
            <p className="cf-section-sub">{T.featuresSub}</p>
          </div>
          <div className="cf-feature-grid">
            {features.map((f, i) => (
              <div key={i} className="cf-feature-card">
                <div className="cf-feature-icon"><i className={`bi ${f.icon}`} /></div>
                <h3 className="cf-feature-title">{lang === 'sq' ? f.titleSq : f.titleEn}</h3>
                <p className="cf-feature-desc">{lang === 'sq' ? f.descSq : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="cf-section" id="demo" style={{ background: 'var(--dark)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <span className="cf-section-label" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.16)', color: 'var(--primary-soft)' }}>Demo Live</span>
          <h2 className="cf-section-title" style={{ color: 'white', marginTop: 16 }}>
            {lang === 'sq' ? 'Provo ClinicFlow tani' : 'Try ClinicFlow now'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 17, marginBottom: 36 }}>
            {lang === 'sq' ? 'Klinika demo: Klinika Shëndeti, Prishtinë' : 'Demo clinic: Klinika Shëndeti, Pristina'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary-cf" style={{ fontSize: 15, padding: '13px 26px' }} onClick={() => navigate('/gjej')}>
              <i className="bi bi-search-heart" />
              {lang === 'sq' ? 'Gjej Mjekun (Pacienti)' : 'Find a Doctor (Patient)'}
            </button>
            <button className="btn-secondary-cf on-dark" style={{ fontSize: 15, padding: '13px 26px' }} onClick={() => navigate('/book/klinika-shendetit')}>
              <i className="bi bi-calendar-plus" />
              {lang === 'sq' ? 'Rezervo Takim' : 'Book Appointment'}
            </button>
            <button className="btn-secondary-cf on-dark" style={{ fontSize: 15, padding: '13px 26px' }} onClick={() => navigate('/admin/login')}>
              <i className="bi bi-speedometer2" />
              {lang === 'sq' ? 'Panel Administrativ' : 'Admin Dashboard'}
            </button>
            <button className="btn-secondary-cf on-dark" style={{ fontSize: 15, padding: '13px 26px' }} onClick={() => navigate('/queue/klinika-shendetit')}>
              <i className="bi bi-display" />
              {lang === 'sq' ? 'Ekrani i Radhës' : 'Queue Screen'}
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 22, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <i className="bi bi-shield-lock" />
            Admin login: admin / admin123
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="cf-section" id="pricing">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="cf-section-label">{T.pricing}</span>
            <h2 className="cf-section-title">{T.pricingTitle}</h2>
          </div>
          <div className="cf-pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`cf-pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && (
                  <span className="cf-pricing-badge">
                    <i className="bi bi-star-fill" /> {lang === 'sq' ? plan.badgeSq : plan.badgeEn}
                  </span>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{lang === 'sq' ? plan.nameSq : plan.nameEn}</h3>
                <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20 }}>{lang === 'sq' ? plan.descSq : plan.descEn}</p>
                <div style={{ marginBottom: 24 }}>
                  <span className="cf-pricing-price">{plan.price}</span>
                  <span className="cf-pricing-period">{lang === 'sq' ? '/muaj' : '/mo'}</span>
                </div>
                <ul className="cf-pricing-features">
                  {(lang === 'sq' ? plan.featuresSq : plan.featuresEn).map((f, j) => (
                    <li key={j}><i className="bi bi-check-circle-fill" /> {f}</li>
                  ))}
                </ul>
                <button className={plan.featured ? 'btn-primary-cf' : 'btn-secondary-cf'} style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/admin/login')}>
                  {lang === 'sq' ? 'Fillo Tani' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="cf-section" id="contact" style={{ background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="cf-section-label">{T.contactLabel}</span>
            <h2 className="cf-section-title">{T.contactTitle}</h2>
            <p className="cf-section-sub">{T.contactSub}</p>
          </div>

          <div className="cf-contact-grid">
            {/* Info Panel */}
            <div className="cf-contact-info">
              <div className="cf-contact-info-card">
                <div className="cf-contact-brand">
                  <div className="cf-logo-icon" style={{ width: 56, height: 56, fontSize: 26 }}><i className="bi bi-hospital" /></div>
                  <div>
                    <div className="cf-logo-text" style={{ fontSize: 24, color: 'white' }}>Clinic<span>Flow</span></div>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>Kosovo's #1 Clinic Platform</p>
                  </div>
                </div>
                <div className="cf-contact-items">
                  <div className="cf-contact-item">
                    <div className="cf-contact-icon"><i className="bi bi-envelope-fill" /></div>
                    <div>
                      <p className="cf-contact-item-label">{T.contactInfo1Title}</p>
                      <a href="mailto:info@clinicflow.ks" className="cf-contact-item-val">{T.contactInfo1Val}</a>
                    </div>
                  </div>
                  <div className="cf-contact-item">
                    <div className="cf-contact-icon"><i className="bi bi-telephone-fill" /></div>
                    <div>
                      <p className="cf-contact-item-label">{T.contactInfo2Title}</p>
                      <a href="tel:+38344000000" className="cf-contact-item-val">{T.contactInfo2Val}</a>
                    </div>
                  </div>
                  <div className="cf-contact-item">
                    <div className="cf-contact-icon"><i className="bi bi-geo-alt-fill" /></div>
                    <div>
                      <p className="cf-contact-item-label">{T.contactInfo3Title}</p>
                      <p className="cf-contact-item-val">{T.contactInfo3Val}</p>
                    </div>
                  </div>
                </div>
                <div className="cf-contact-socials">
                  {['facebook', 'instagram', 'linkedin', 'twitter-x'].map(s => (
                    <button key={s} type="button" aria-label={s} className="cf-social-btn"><i className={`bi bi-${s}`} /></button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="cf-contact-form-wrap">
              {contactSent ? (
                <div className="cf-contact-success">
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 18 }}>
                    <i className="bi bi-check2" />
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 8 }}>{T.contactSent}</h3>
                </div>
              ) : (
                <form className="cf-contact-form" onSubmit={handleContactSubmit}>
                  <div className="cf-contact-row">
                    <div>
                      <label className="cf-label">{T.contactName}</label>
                      <input className="cf-input" type="text" placeholder={T.contactName} required
                        value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="cf-label">{T.contactEmail}</label>
                      <input className="cf-input" type="email" placeholder={T.contactEmail} required
                        value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="cf-label">{T.contactPhone}</label>
                    <input className="cf-input" type="tel" placeholder="+383 44 000 000"
                      value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="cf-label">{T.contactMsg}</label>
                    <textarea className="cf-input" rows={5} placeholder={T.contactMsg} required
                      style={{ resize: 'vertical', minHeight: 130 }}
                      value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary-cf" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16 }}>
                    <i className="bi bi-send-fill" /> {T.contactSend}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--dark-2)', padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Link to="/" className="cf-logo">
            <div className="cf-logo-icon"><i className="bi bi-hospital" /></div>
            <span className="cf-logo-text" style={{ color: 'white' }}>Clinic<span>Flow</span></span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{T.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual({ lang, navigate }) {
  const rows = [
    { name: 'Fjolla B.', time: '08:00', state: 'done' },
    { name: 'Agim S.', time: '08:30', state: 'done' },
    { name: 'Rina M.', time: '09:00', state: 'now' },
    { name: 'Dardan K.', time: '09:30', state: 'wait' },
    { name: 'Blerta H.', time: '10:00', state: 'wait' },
  ];
  const label = {
    done: lang === 'sq' ? 'Përfunduar' : 'Completed',
    now: lang === 'sq' ? 'Në progres' : 'In progress',
    wait: lang === 'sq' ? 'Në pritje' : 'Waiting',
  };
  const badgeClass = { done: 'completed', now: 'in-progress', wait: 'pending' };

  return (
    <div style={{ width: '100%', maxWidth: 430 }}>
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        padding: 24,
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
              {lang === 'sq' ? 'Sot' : 'Today'} — {formatDate(new Date(), lang, { month: 'short', year: false })}
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{lang === 'sq' ? 'Takimet e Sotme' : "Today's Appointments"}</h3>
          </div>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', padding: '6px 11px', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
            8 {lang === 'sq' ? 'sot' : 'today'}
          </div>
        </div>

        {rows.map((r, i) => (
          <div key={r.name} style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 0',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div className={`cf-num-tile ${r.state === 'now' ? 'active' : ''}`}
              style={{ width: 30, height: 30, fontSize: 13 }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5 }}>{r.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--gray)' }}>{r.time}</p>
            </div>
            <span className={`badge-cf ${badgeClass[r.state]}`}>{label[r.state]}</span>
          </div>
        ))}

        <button className="btn-primary-cf" style={{ width: '100%', marginTop: 18 }} onClick={() => navigate('/admin/login')}>
          <i className="bi bi-box-arrow-in-right" />
          {lang === 'sq' ? 'Hap Panelin' : 'Open Dashboard'}
        </button>
      </div>

      {/* Supporting stats — inline rather than floating overlays */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        {[
          { icon: 'bi-graph-down-arrow', value: '−40%', label: lang === 'sq' ? 'Më pak no-show' : 'Fewer no-shows' },
          { icon: 'bi-clock-history', value: '24/7', label: lang === 'sq' ? 'Rezervime online' : 'Online booking' },
        ].map(s => (
          <div key={s.value} style={{
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '13px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
              <i className={`bi ${s.icon}`} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--dark)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--gray)', fontWeight: 500 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
