import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  SPECIALTIES, getSpecialty, getCities,
  getInstantClinics, getDirectoryClinics, buildWhatsAppLink,
} from '../data/store';

const T = {
  sq: {
    back: 'Kryefaqja',
    title: 'Çfarë mjeku ju nevojitet?',
    sub: 'Zgjidhni specialitetin dhe shihni klinikat në Kosovë — disa i rezervoni menjëherë, te të tjerat dërgoni një mesazh.',
    search: 'Kërko klinikë, specialitet ose qytet…',
    specialties: 'Specialiteti',
    allSpecialties: 'Të gjitha',
    cities: 'Qyteti',
    allCities: 'Të gjitha qytetet',
    instantTitle: 'Rezervo menjëherë',
    instantNote: 'Klinika në platformën ClinicFlow. Zgjidhni orën dhe merrni numrin e radhës në çast — pa telefonata.',
    directoryTitle: 'Dërgo mesazh në WhatsApp',
    directoryNote: 'Klinika të tjera në Kosovë. Ne nuk rezervojmë për to — ju dërgoni vetë një mesazh me tekst të gatshëm dhe klinika ju përgjigjet.',
    disclaimer: 'Këto klinika nuk janë partnere të ClinicFlow. Dërgimi i mesazhit është vetëm një kërkesë — takimi konfirmohet vetëm nga vetë klinika.',
    demoBadge: 'Klinikë demo',
    instantBadge: 'Rezervim i menjëhershëm',
    directoryBadge: 'Vetëm kontakt',
    book: 'Rezervo Online',
    queue: 'Radha',
    whatsapp: 'Dërgo kërkesë në WhatsApp',
    waHelp: 'Hapet WhatsApp me mesazhin e shkruar. Ju e dërgoni — pa konfirmim nga ne.',
    emptyTitle: 'Asnjë klinikë nuk përputhet',
    emptySub: 'Provoni një specialitet tjetër ose hiqni filtrat.',
    reset: 'Pastro filtrat',
    resultsInstant: (n) => `${n} ${n === 1 ? 'klinikë' : 'klinika'} me rezervim online`,
    resultsDirectory: (n) => `${n} ${n === 1 ? 'klinikë' : 'klinika'} në drejtori`,
    footnote: 'Drejtoria është e dhënë statike, e përpiluar për demonstrim, dhe mund të mos jetë e përditësuar. Verifikoni adresën dhe kontaktin te vetë klinika para se të vizitoni. Ikonat janë ilustrime të përgjithshme sipas specialitetit, jo foto të klinikave.',
  },
  en: {
    back: 'Home',
    title: 'What kind of doctor do you need?',
    sub: 'Pick a specialty and see clinics across Kosovo — book some instantly, message the rest.',
    search: 'Search clinic, specialty or city…',
    specialties: 'Specialty',
    allSpecialties: 'All',
    cities: 'City',
    allCities: 'All cities',
    instantTitle: 'Book instantly',
    instantNote: 'Clinics on the ClinicFlow platform. Pick a time and get your queue number right away — no phone calls.',
    directoryTitle: 'Message on WhatsApp',
    directoryNote: 'Other clinics in Kosovo. We do not book for them — you send a ready-written message yourself and the clinic replies to you.',
    disclaimer: 'These clinics are not ClinicFlow partners. Sending the message is only a request — the appointment is confirmed by the clinic itself.',
    demoBadge: 'Demo clinic',
    instantBadge: 'Instant booking',
    directoryBadge: 'Contact only',
    book: 'Book Online',
    queue: 'Queue',
    whatsapp: 'Send request on WhatsApp',
    waHelp: 'Opens WhatsApp with the message written. You send it — nothing is confirmed by us.',
    emptyTitle: 'No clinics match',
    emptySub: 'Try another specialty or clear the filters.',
    reset: 'Clear filters',
    resultsInstant: (n) => `${n} clinic${n === 1 ? '' : 's'} with online booking`,
    resultsDirectory: (n) => `${n} clinic${n === 1 ? '' : 's'} in the directory`,
    footnote: 'The directory is static reference data compiled for this demo and may be out of date. Check the address and contact details with the clinic before visiting. Icons are generic specialty illustrations, not photos of the clinics.',
  },
};

/** Generic specialty icon tile — deliberately not a real business photo. */
function SpecialtyIcon({ specialtyKey, size = 46 }) {
  const spec = getSpecialty(specialtyKey);
  return (
    <div
      className="cf-mk-card-icon"
      style={{ width: size, height: size, background: `${spec.color}26`, color: spec.color }}
      aria-hidden="true"
    >
      <i className={`bi ${spec.icon}`} />
    </div>
  );
}

export default function Marketplace() {
  const [lang, setLang] = useState('sq');
  const [specialty, setSpecialty] = useState(null);
  const [city, setCity] = useState(null);
  const [query, setQuery] = useState('');

  const t = T[lang];
  const cities = getCities();

  const matchesQuery = useCallback((clinic) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const specNames = clinic.specialtyKeys
      .map(k => `${getSpecialty(k).sq} ${getSpecialty(k).en}`)
      .join(' ');
    return `${clinic.name} ${clinic.city} ${clinic.address} ${specNames}`.toLowerCase().includes(q);
  }, [query]);

  const instant = useMemo(
    () => getInstantClinics(specialty).filter(c => (!city || c.city === city) && matchesQuery(c)),
    [specialty, city, matchesQuery],
  );

  const directory = useMemo(
    () => getDirectoryClinics(specialty, city).filter(matchesQuery),
    [specialty, city, matchesQuery],
  );

  const hasFilters = Boolean(specialty || city || query.trim());
  const resetFilters = () => { setSpecialty(null); setCity(null); setQuery(''); };

  return (
    <div className="cf-mk-page">
      {/* HEADER */}
      <header className="cf-mk-header">
        <div className="cf-mk-header-bar">
          <Link to="/" className="cf-mk-back">
            <i className="bi bi-arrow-left" /> {t.back}
          </Link>
          <div className="cf-lang-toggle" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <button className={`cf-lang-btn ${lang === 'sq' ? 'active' : ''}`}
              style={{ color: lang === 'sq' ? 'var(--primary)' : 'rgba(255,255,255,0.75)' }}
              onClick={() => setLang('sq')}>SQ</button>
            <button className={`cf-lang-btn ${lang === 'en' ? 'active' : ''}`}
              style={{ color: lang === 'en' ? 'var(--primary)' : 'rgba(255,255,255,0.75)' }}
              onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <div className="cf-mk-intro">
          <h1 className="cf-mk-title">{t.title}</h1>
          <p className="cf-mk-sub">{t.sub}</p>
        </div>
      </header>

      <div className="cf-mk-body">
        {/* SEARCH */}
        <div className="cf-mk-search">
          <i className="bi bi-search" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </div>

        {/* SPECIALTY PICKER */}
        <p className="cf-mk-section-label">{t.specialties}</p>
        <div className="cf-mk-spec-grid">
          <button type="button"
            className={`cf-mk-spec ${specialty === null ? 'active' : ''}`}
            aria-pressed={specialty === null}
            onClick={() => setSpecialty(null)}>
            <div className="cf-mk-spec-icon" style={{ background: 'var(--surface)', color: 'var(--gray)' }}>
              <i className="bi bi-grid" />
            </div>
            <span className="cf-mk-spec-name">{t.allSpecialties}</span>
          </button>
          {SPECIALTIES.map(s => (
            <button key={s.key} type="button"
              className={`cf-mk-spec ${specialty === s.key ? 'active' : ''}`}
              aria-pressed={specialty === s.key}
              onClick={() => setSpecialty(specialty === s.key ? null : s.key)}>
              <div className="cf-mk-spec-icon" style={{ background: `${s.color}26`, color: s.color }}>
                <i className={`bi ${s.icon}`} />
              </div>
              <span className="cf-mk-spec-name">{lang === 'sq' ? s.sq : s.en}</span>
            </button>
          ))}
        </div>

        {/* CITY CHIPS */}
        <p className="cf-mk-section-label">{t.cities}</p>
        <div className="cf-mk-chips">
          <button type="button" className={`cf-mk-chip ${city === null ? 'active' : ''}`}
            onClick={() => setCity(null)}>{t.allCities}</button>
          {cities.map(c => (
            <button key={c} type="button" className={`cf-mk-chip ${city === c ? 'active' : ''}`}
              onClick={() => setCity(city === c ? null : c)}>{c}</button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {instant.length === 0 && directory.length === 0 && (
          <div className="cf-mk-empty" style={{ marginTop: 28 }}>
            <i className="bi bi-search" />
            <p style={{ fontWeight: 700, color: 'var(--dark)', margin: '12px 0 4px' }}>{t.emptyTitle}</p>
            <p style={{ fontSize: 14, marginBottom: 18 }}>{t.emptySub}</p>
            <button className="btn-secondary-cf" onClick={resetFilters}>{t.reset}</button>
          </div>
        )}

        {/* TIER 1 — INSTANT BOOKING */}
        {instant.length > 0 && (
          <>
            <div className="cf-mk-group">
              <div className="cf-mk-group-icon instant"><i className="bi bi-lightning-charge-fill" /></div>
              <div>
                <h2>{t.instantTitle}</h2>
                <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 600 }}>
                  {t.resultsInstant(instant.length)}
                </span>
              </div>
            </div>
            <p className="cf-mk-group-note">{t.instantNote}</p>

            <div className="cf-mk-list">
              {instant.map(clinic => (
                <article key={clinic.slug} className="cf-mk-card instant">
                  <div className="cf-mk-card-top">
                    <SpecialtyIcon specialtyKey={clinic.specialtyKeys[0]} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        <span className="cf-mk-badge instant">
                          <i className="bi bi-lightning-charge-fill" /> {t.instantBadge}
                        </span>
                        <span className="cf-mk-badge demo">{t.demoBadge}</span>
                      </div>
                      <h3 className="cf-mk-card-name">{clinic.name}</h3>
                      <p className="cf-mk-card-meta">
                        <i className="bi bi-geo-alt" /> {clinic.address}
                      </p>
                      <p className="cf-mk-card-meta" style={{ marginTop: 3 }}>
                        <i className="bi bi-clock" /> {clinic.workingHours}
                      </p>
                    </div>
                  </div>

                  <div className="cf-mk-tags">
                    {clinic.specialtyKeys.map(k => (
                      <span key={k} className="cf-mk-tag">
                        {lang === 'sq' ? getSpecialty(k).sq : getSpecialty(k).en}
                      </span>
                    ))}
                  </div>

                  <div className="cf-mk-actions">
                    <Link to={`/book/${clinic.slug}`} className="btn-primary-cf" style={{ padding: '13px 18px', fontSize: 14 }}>
                      <i className="bi bi-calendar-check" /> {t.book}
                    </Link>
                    <Link to={`/queue/${clinic.slug}`} className="btn-secondary-cf" style={{ padding: '12px 18px', fontSize: 14, flex: '0 1 auto' }}>
                      <i className="bi bi-display" /> {t.queue}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* TIER 2 — DIRECTORY / WHATSAPP */}
        {directory.length > 0 && (
          <>
            <div className="cf-mk-group">
              <div className="cf-mk-group-icon directory"><i className="bi bi-whatsapp" /></div>
              <div>
                <h2>{t.directoryTitle}</h2>
                <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 600 }}>
                  {t.resultsDirectory(directory.length)}
                </span>
              </div>
            </div>
            <p className="cf-mk-group-note">{t.directoryNote}</p>

            <div className="cf-mk-disclaimer">
              <i className="bi bi-exclamation-triangle-fill" />
              <span>{t.disclaimer}</span>
            </div>

            <div className="cf-mk-list">
              {directory.map(clinic => (
                <article key={clinic.id} className="cf-mk-card directory">
                  <div className="cf-mk-card-top">
                    <SpecialtyIcon specialtyKey={clinic.specialtyKeys[0]} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className="cf-mk-badge directory" style={{ marginBottom: 6 }}>
                        <i className="bi bi-chat-dots-fill" /> {t.directoryBadge}
                      </span>
                      <h3 className="cf-mk-card-name" style={{ marginTop: 6 }}>{clinic.name}</h3>
                      <p className="cf-mk-card-meta">
                        <i className="bi bi-geo-alt" /> {clinic.address}
                      </p>
                    </div>
                  </div>

                  <div className="cf-mk-tags">
                    {clinic.specialtyKeys.map(k => (
                      <span key={k} className="cf-mk-tag">
                        {lang === 'sq' ? getSpecialty(k).sq : getSpecialty(k).en}
                      </span>
                    ))}
                  </div>

                  <div className="cf-mk-actions">
                    <a className="cf-mk-btn-wa"
                      href={buildWhatsAppLink(clinic, specialty, lang)}
                      target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-whatsapp" /> {t.whatsapp}
                    </a>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--gray-light)', margin: '8px 2px 0', lineHeight: 1.5 }}>
                    {t.waHelp}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}

        {hasFilters && (instant.length > 0 || directory.length > 0) && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn-secondary-cf" onClick={resetFilters}>
              <i className="bi bi-x-circle" /> {t.reset}
            </button>
          </div>
        )}

        <p className="cf-mk-footnote">{t.footnote}</p>
      </div>
    </div>
  );
}
