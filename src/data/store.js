// Centralized mock data store — simulates a PHP/MySQL backend
// In production, replace these with fetch() calls to your PHP API

const CLINICS = {
  'klinika-shendetit': {
    id: 1,
    slug: 'klinika-shendetit',
    name: 'Klinika Shëndeti',
    nameEn: 'Health Clinic',
    specialty: 'Mjekësi e Përgjithshme',
    specialtyEn: 'General Medicine',
    specialtyKeys: ['general'],
    city: 'Prishtinë',
    address: 'Rr. Nënë Tereza 24, Prishtinë 10000',
    phone: '+383 44 123 456',
    email: 'info@klinikashendetit.com',
    logo: 'bi-heart-pulse',
    color: '#6b7f6e',
    workingHours: 'E Hënë – E Shtunë: 08:00 – 18:00',
  },
  'dentisti-beqiri': {
    id: 2,
    slug: 'dentisti-beqiri',
    name: 'Dentisti Beqiri',
    nameEn: 'Beqiri Dental Clinic',
    specialty: 'Stomatologji',
    specialtyEn: 'Dentistry',
    specialtyKeys: ['dental'],
    city: 'Prishtinë',
    address: 'Rr. UCK 87, Prishtinë 10000',
    phone: '+383 44 987 654',
    email: 'kontakt@dentistibeqiri.com',
    logo: 'bi-emoji-smile',
    color: '#4f7068',
    workingHours: 'E Hënë – E Premte: 09:00 – 17:00',
  },
  'poliklinika-vita': {
    id: 3,
    slug: 'poliklinika-vita',
    name: 'Poliklinika Vita',
    nameEn: 'Vita Polyclinic',
    specialty: 'Pediatri',
    specialtyEn: 'Pediatrics',
    specialtyKeys: ['pediatrics', 'general'],
    city: 'Prishtinë',
    address: 'Rr. Bill Clinton 12, Prishtinë 10000',
    phone: '+383 44 555 111',
    email: 'info@poliklinikavita.demo',
    logo: 'bi-balloon',
    color: '#a5763f',
    workingHours: 'E Hënë – E Premte: 08:30 – 19:00',
  },
};

const DOCTORS = {
  1: [
    { id: 1, clinicId: 1, name: 'Dr. Arbëreshë Krasniqi', specialty: 'Mjekësi e Përgjithshme', avatar: 'AK', color: '#6b7f6e' },
    { id: 2, clinicId: 1, name: 'Dr. Mentor Gashi', specialty: 'Internistikë', avatar: 'MG', color: '#7c6b5d' },
  ],
  2: [
    { id: 3, clinicId: 2, name: 'Dr. Bekim Beqiri', specialty: 'Stomatologji', avatar: 'BB', color: '#4f7068' },
    { id: 4, clinicId: 2, name: 'Dr. Liridon Mustafa', specialty: 'Ortodonci', avatar: 'LM', color: '#a5763f' },
  ],
  3: [
    { id: 5, clinicId: 3, name: 'Dr. Teuta Krasniqi', specialty: 'Pediatri', avatar: 'TK', color: '#a5763f' },
    { id: 6, clinicId: 3, name: 'Dr. Rron Bytyqi', specialty: 'Alergologji Pediatrike', avatar: 'RB', color: '#8a5f6d' },
  ],
};

const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

// ============================================
// MARKETPLACE — specialties + clinic directory
// ============================================

// Specialty taxonomy. `icon` is a Bootstrap Icons class — we deliberately use
// generic icons instead of real business photos.
// Muted, earthy tones so eleven specialty icons read as one family rather than
// a rainbow. Each is used at ~10% alpha for the tile behind its glyph.
export const SPECIALTIES = [
  { key: 'general',      icon: 'bi-heart-pulse',        sq: 'Mjekësi e Përgjithshme',    en: 'General Medicine',  color: '#6b7f6e' },
  { key: 'dental',       icon: 'bi-emoji-smile',        sq: 'Stomatologji',              en: 'Dentistry',         color: '#4f7068' },
  { key: 'pediatrics',   icon: 'bi-balloon',            sq: 'Pediatri',                  en: 'Pediatrics',        color: '#a5763f' },
  { key: 'cardiology',   icon: 'bi-activity',           sq: 'Kardiologji',               en: 'Cardiology',        color: '#9e4f44' },
  { key: 'dermatology',  icon: 'bi-droplet-half',       sq: 'Dermatologji',              en: 'Dermatology',       color: '#b08a5c' },
  { key: 'gynecology',   icon: 'bi-gender-female',      sq: 'Gjinekologji',              en: 'Gynecology',        color: '#8a5f6d' },
  { key: 'ophthalmology',icon: 'bi-eye',                sq: 'Oftalmologji',              en: 'Ophthalmology',     color: '#5a7a82' },
  { key: 'orthopedics',  icon: 'bi-bandaid',            sq: 'Ortopedi',                  en: 'Orthopedics',       color: '#8a7a63' },
  { key: 'neurology',    icon: 'bi-lightning-charge',   sq: 'Neurologji',                en: 'Neurology',         color: '#7a6a8c' },
  { key: 'lab',          icon: 'bi-clipboard2-pulse',   sq: 'Laborator & Diagnostikë',   en: 'Lab & Diagnostics', color: '#7c6b5d' },
  { key: 'hospital',     icon: 'bi-hospital',           sq: 'Spital i Përgjithshëm',     en: 'General Hospital',  color: '#56483d' },
];

export const getSpecialty = (key) => SPECIALTIES.find(s => s.key === key) || SPECIALTIES[0];

/*
 * DIRECTORY CLINICS — static, offline-safe reference data.
 *
 * These are real, publicly-known healthcare institutions in Kosovo, listed here
 * as a hardcoded directory (nothing is fetched from Google Maps or any live API,
 * so the demo works offline). Addresses are area-level only and are NOT verified
 * — treat them as demo reference data, not as a source of truth.
 *
 * We have no relationship with any of these institutions. There is no booking
 * integration: the only action we offer is a pre-filled WhatsApp message that the
 * PATIENT sends themselves. Nothing here confirms an appointment.
 *
 * WhatsApp numbers are placeholders (+383 44 000 0xx — unassigned) except `d1`,
 * which points at a real number so the link is live during a demo.
 */
export const DIRECTORY_CLINICS = [
  { id: 'd1',  name: 'Qendra Klinike Universitare e Kosovës (QKUK)', specialtyKeys: ['hospital', 'general'], city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344817845' },
  { id: 'd2',  name: 'Klinika e Pediatrisë — QKUK',                  specialtyKeys: ['pediatrics'],          city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000002' },
  { id: 'd3',  name: 'Klinika e Kardiologjisë — QKUK',               specialtyKeys: ['cardiology'],          city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000003' },
  { id: 'd4',  name: 'Klinika e Obstetrikës dhe Gjinekologjisë — QKUK', specialtyKeys: ['gynecology'],       city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000004' },
  { id: 'd5',  name: 'Klinika e Dermatologjisë — QKUK',              specialtyKeys: ['dermatology'],         city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000005' },
  { id: 'd6',  name: 'Klinika e Syrit (Oftalmologji) — QKUK',        specialtyKeys: ['ophthalmology'],       city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000006' },
  { id: 'd7',  name: 'Klinika Ortopedike — QKUK',                    specialtyKeys: ['orthopedics'],         city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000007' },
  { id: 'd8',  name: 'Klinika e Neurologjisë — QKUK',                specialtyKeys: ['neurology'],           city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000008' },
  { id: 'd9',  name: 'Klinika Stomatologjike Universitare',          specialtyKeys: ['dental'],              city: 'Prishtinë', address: 'Lagjja e Spitalit, Prishtinë', whatsapp: '38344000009' },
  { id: 'd10', name: 'Spitali Amerikan i Kosovës',                   specialtyKeys: ['hospital', 'general', 'cardiology'], city: 'Prishtinë', address: 'Veternik, Prishtinë', whatsapp: '38344000010' },
  { id: 'd11', name: 'Spitali Rezonanca',                            specialtyKeys: ['hospital', 'general', 'lab'],        city: 'Prishtinë', address: 'Veternik, Prishtinë', whatsapp: '38344000011' },
  { id: 'd12', name: 'Instituti Kombëtar i Shëndetësisë Publike',    specialtyKeys: ['lab'],                 city: 'Prishtinë', address: 'Afër QKUK, Prishtinë', whatsapp: '38344000012' },
  { id: 'd13', name: 'Spitali Rajonal "Prim. Dr. Daut Mustafa"',     specialtyKeys: ['hospital', 'general'], city: 'Prizren',   address: 'Prizren',   whatsapp: '38344000013' },
  { id: 'd14', name: 'Spitali Rajonal "Isa Grezda"',                 specialtyKeys: ['hospital', 'general'], city: 'Gjakovë',   address: 'Gjakovë',   whatsapp: '38344000014' },
  { id: 'd15', name: 'Spitali Rajonal i Pejës',                      specialtyKeys: ['hospital', 'general'], city: 'Pejë',      address: 'Pejë',      whatsapp: '38344000015' },
];

export const getCities = () =>
  [...new Set([...Object.values(CLINICS), ...DIRECTORY_CLINICS].map(c => c.city))].sort();

/** Our own demo clinics — these book through the real ClinicFlow booking flow. */
export const getInstantClinics = (specialtyKey = null) =>
  Object.values(CLINICS).filter(c => !specialtyKey || c.specialtyKeys.includes(specialtyKey));

/** Directory-only listings — contact by WhatsApp, no booking integration. */
export const getDirectoryClinics = (specialtyKey = null, city = null) =>
  DIRECTORY_CLINICS.filter(c =>
    (!specialtyKey || c.specialtyKeys.includes(specialtyKey)) &&
    (!city || c.city === city)
  );

/**
 * Pre-filled WhatsApp text. Deliberately worded as a *request* from the patient —
 * it must never read as a booking we confirmed.
 */
export const buildWhatsAppMessage = (clinic, specialtyKey, lang = 'sq') => {
  const spec = getSpecialty(specialtyKey || clinic.specialtyKeys[0]);
  return lang === 'sq'
    ? `Përshëndetje! Ju gjeta përmes ClinicFlow. Dëshiroj të pyes për një termin te ${clinic.name} (${spec.sq}). A keni orar të lirë këtë javë? Faleminderit!`
    : `Hello! I found you through ClinicFlow. I would like to ask about an appointment at ${clinic.name} (${spec.en}). Do you have any free slots this week? Thank you!`;
};

export const buildWhatsAppLink = (clinic, specialtyKey, lang = 'sq') =>
  `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(buildWhatsAppMessage(clinic, specialtyKey, lang))}`;

// ============================================
// DATE / TIME FORMATTING
// ============================================
// Many Chromium builds ship without the `sq` locale in their ICU data, so
// toLocaleDateString('sq-AL') silently falls back to English — which reads as
// broken in an Albanian UI. These tables make Albanian dates deterministic.
const SQ_DAYS = ['E diel', 'E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë'];
const SQ_MONTHS = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor',
  'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'];
const SQ_MONTHS_SHORT = ['jan', 'shk', 'mar', 'pri', 'maj', 'qer',
  'kor', 'gsh', 'sht', 'tet', 'nën', 'dhj'];

export const formatDate = (date, lang = 'sq', { weekday = true, month = 'long', year = true } = {}) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  if (lang !== 'sq') {
    return d.toLocaleDateString('en-US', {
      ...(weekday ? { weekday: 'long' } : {}),
      day: 'numeric',
      month,
      ...(year ? { year: 'numeric' } : {}),
    });
  }
  const parts = [];
  if (weekday) parts.push(`${SQ_DAYS[d.getDay()]},`);
  parts.push(String(d.getDate()));
  parts.push(month === 'short' ? SQ_MONTHS_SHORT[d.getMonth()] : SQ_MONTHS[d.getMonth()]);
  if (year) parts.push(String(d.getFullYear()));
  return parts.join(' ');
};

/** 24-hour clock — the format used in Kosovo, and locale-independent. */
export const formatTime = (date, withSeconds = false) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${p(date.getHours())}:${p(date.getMinutes())}${withSeconds ? `:${p(date.getSeconds())}` : ''}`;
};

// Statuses
export const STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
};

const STATUS_LABELS = {
  [STATUS.PENDING]: { sq: 'Në pritje', en: 'Pending' },
  [STATUS.CONFIRMED]: { sq: 'Konfirmuar', en: 'Confirmed' },
  [STATUS.IN_PROGRESS]: { sq: 'Në progres', en: 'In Progress' },
  [STATUS.COMPLETED]: { sq: 'Përfunduar', en: 'Completed' },
  [STATUS.CANCELLED]: { sq: 'Anuluar', en: 'Cancelled' },
  [STATUS.NO_SHOW]: { sq: 'Nuk u paraqit', en: 'No Show' },
};

// Seed appointments
const seedAppointments = () => {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: 1, clinicId: 1, doctorId: 1, patientName: 'Fjolla Berisha', patientPhone: '+383 44 111 222', date: today, time: '08:00', status: STATUS.COMPLETED, queueNumber: 1, notes: 'Kontroll rutinë' },
    { id: 2, clinicId: 1, doctorId: 1, patientName: 'Agim Syla', patientPhone: '+383 44 333 444', date: today, time: '08:30', status: STATUS.COMPLETED, queueNumber: 2, notes: '' },
    { id: 3, clinicId: 1, doctorId: 2, patientName: 'Rina Morina', patientPhone: '+383 45 555 666', date: today, time: '09:00', status: STATUS.IN_PROGRESS, queueNumber: 3, notes: 'Tension i lartë' },
    { id: 4, clinicId: 1, doctorId: 1, patientName: 'Dardan Kelmendi', patientPhone: '+383 44 777 888', date: today, time: '09:30', status: STATUS.CONFIRMED, queueNumber: 4, notes: '' },
    { id: 5, clinicId: 1, doctorId: 1, patientName: 'Blerta Haliti', patientPhone: '+383 44 999 000', date: today, time: '10:00', status: STATUS.CONFIRMED, queueNumber: 5, notes: 'Alergjia sezonale' },
    { id: 6, clinicId: 1, doctorId: 2, patientName: 'Mentor Rexha', patientPhone: '+383 49 111 333', date: today, time: '10:30', status: STATUS.PENDING, queueNumber: 6, notes: '' },
    { id: 7, clinicId: 1, doctorId: 1, patientName: 'Valentina Osmani', patientPhone: '+383 44 444 555', date: today, time: '11:00', status: STATUS.PENDING, queueNumber: 7, notes: '' },
    { id: 8, clinicId: 1, doctorId: 2, patientName: 'Arbnor Jashari', patientPhone: '+383 45 666 777', date: today, time: '11:30', status: STATUS.PENDING, queueNumber: 8, notes: '' },
  ];
};

// ============================================
// DATA ACCESS FUNCTIONS (simulate PHP API)
// ============================================

const getStorage = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch { return defaultVal; }
};
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const initData = () => {
  if (!localStorage.getItem('cf_initialized')) {
    setStorage('cf_appointments', seedAppointments());
    localStorage.setItem('cf_initialized', '1');
  }
};

export const getClinic = (slug) => CLINICS[slug] || null;
export const getAllClinics = () => Object.values(CLINICS);
export const getDoctors = (clinicId) => DOCTORS[clinicId] || [];
export const getTimeSlots = () => TIME_SLOTS;
export const getStatusLabel = (status, lang = 'sq') => STATUS_LABELS[status]?.[lang] || status;

export const getAppointments = (clinicId, date = null) => {
  const all = getStorage('cf_appointments', seedAppointments());
  return all.filter(a => a.clinicId === clinicId && (!date || a.date === date));
};

export const getTodayAppointments = (clinicId) => {
  const today = new Date().toISOString().split('T')[0];
  return getAppointments(clinicId, today);
};

export const getQueue = (clinicId) => {
  const today = new Date().toISOString().split('T')[0];
  return getAppointments(clinicId, today)
    .filter(a => [STATUS.CONFIRMED, STATUS.IN_PROGRESS, STATUS.PENDING].includes(a.status))
    .sort((a, b) => a.queueNumber - b.queueNumber);
};

export const getCurrentPatient = (clinicId) => {
  const queue = getQueue(clinicId);
  return queue.find(a => a.status === STATUS.IN_PROGRESS) || null;
};

export const bookAppointment = (data) => {
  const all = getStorage('cf_appointments', seedAppointments());
  const maxId = Math.max(0, ...all.map(a => a.id));
  const maxQueue = Math.max(0, ...all.filter(a => a.clinicId === data.clinicId && a.date === data.date).map(a => a.queueNumber));
  const newAppt = {
    id: maxId + 1,
    queueNumber: maxQueue + 1,
    status: STATUS.CONFIRMED,
    ...data,
  };
  all.push(newAppt);
  setStorage('cf_appointments', all);
  return newAppt;
};

export const updateAppointmentStatus = (id, status) => {
  const all = getStorage('cf_appointments', seedAppointments());
  const idx = all.findIndex(a => a.id === id);
  if (idx > -1) {
    all[idx].status = status;
    setStorage('cf_appointments', all);
    return all[idx];
  }
  return null;
};

export const callNextPatient = (clinicId) => {
  const all = getStorage('cf_appointments', seedAppointments());
  // Complete current in-progress
  const current = all.find(a => a.clinicId === clinicId && a.status === STATUS.IN_PROGRESS);
  if (current) current.status = STATUS.COMPLETED;
  // Find the next waiting patient. Must match getQueue(), which also shows
  // pending — otherwise the queue lists patients that can never be called.
  const today = new Date().toISOString().split('T')[0];
  const next = all
    .filter(a => a.clinicId === clinicId && a.date === today &&
      [STATUS.CONFIRMED, STATUS.PENDING].includes(a.status))
    .sort((a, b) => a.queueNumber - b.queueNumber)[0];
  if (next) next.status = STATUS.IN_PROGRESS;
  setStorage('cf_appointments', all);
  return next || null;
};

export const isSlotTaken = (clinicId, doctorId, date, time) => {
  const all = getStorage('cf_appointments', seedAppointments());
  return all.some(a =>
    a.clinicId === clinicId &&
    a.doctorId === doctorId &&
    a.date === date &&
    a.time === time &&
    a.status !== STATUS.CANCELLED
  );
};

export const getAnalytics = (clinicId) => {
  const all = getStorage('cf_appointments', seedAppointments());
  const clinic = all.filter(a => a.clinicId === clinicId);
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = clinic.filter(a => a.date === today);
  return {
    totalToday: todayAppts.length,
    completed: todayAppts.filter(a => a.status === STATUS.COMPLETED).length,
    pending: todayAppts.filter(a => [STATUS.PENDING, STATUS.CONFIRMED].includes(a.status)).length,
    inProgress: todayAppts.filter(a => a.status === STATUS.IN_PROGRESS).length,
    noShow: todayAppts.filter(a => a.status === STATUS.NO_SHOW).length,
    totalAll: clinic.length,
    weeklyData: [
      { day: 'Hën', count: 12 }, { day: 'Mar', count: 18 },
      { day: 'Mër', count: 15 }, { day: 'Enj', count: 22 },
      { day: 'Pre', count: 19 }, { day: 'Sht', count: 8 },
    ],
    statusBreakdown: [
      { name: 'Përfunduar', value: todayAppts.filter(a => a.status === STATUS.COMPLETED).length, color: '#52705e' },
      { name: 'Konfirmuar', value: todayAppts.filter(a => a.status === STATUS.CONFIRMED).length, color: '#7a5c42' },
      { name: 'Në pritje',  value: todayAppts.filter(a => a.status === STATUS.PENDING).length,    color: '#b08a5c' },
      { name: 'Anuluar',    value: todayAppts.filter(a => a.status === STATUS.CANCELLED).length,  color: '#9e4f44' },
    ],
  };
};

// Auth
export const login = (username, password) => {
  if (username === 'admin' && password === 'admin123') {
    const session = { clinicId: 1, clinicSlug: 'klinika-shendetit', username };
    setStorage('cf_session', session);
    return session;
  }
  return null;
};
export const logout = () => localStorage.removeItem('cf_session');
export const getSession = () => getStorage('cf_session', null);
