/* ── ASSETS ───────────────────────────────────────────────── */
const TN_LOGO = `<img src="/static/tn-logo.webp" alt="Tamil Nadu Government" style="width:100%;height:100%;object-fit:contain" />`;
const CM_PHOTO = `/static/cm-photo.webp`;

/* ── CONSTANTS ────────────────────────────────────────────── */
const DISTRICTS = [
  'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri',
  'Dindigul','Erode','Kallakurichi','Kancheepuram','Kanniyakumari','Karur',
  'Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris',
  'Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga',
  'Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli',
  'Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore',
  'Villupuram','Virudhunagar'
];

const DEPARTMENTS = [
  'Agriculture','Education','Health & Family Welfare','Home (Police)',
  'Revenue','Social Welfare','Rural Development','Public Works Department',
  'Urban Local Bodies','Finance','Adi Dravidar Welfare','BC/MBC Welfare',
  'Energy','Transport','Water Resources','IT & Digital Services',
  'Environment & Forests','Food & Civil Supplies','Labour','Multi-department'
];

const CATEGORIES = [
  { id:'flagship',   label:'Flagship Initiative',  mono:'FI', desc:"A project you're leading that deserves attention or scaling",       color:'#1D4ED8', bg:'#EFF6FF', badge:'badge-blue'   },
  { id:'best',       label:'Best Practice',         mono:'BP', desc:"Something that's working well — ready to replicate statewide",     color:'#059669', bg:'#ECFDF5', badge:'badge-green'  },
  { id:'pilot',      label:'Pilot Proposal',        mono:'PP', desc:'An idea you want to test — needs sanction or funding to start',    color:'#7C3AED', bg:'#F5F3FF', badge:'badge-purple' },
  { id:'policy',     label:'Policy Request',        mono:'PR', desc:'A GO, rule, or law you want changed or newly introduced',          color:'#D97706', bg:'#FFFBEB', badge:'badge-amber'  },
  { id:'resource',   label:'Resource Request',      mono:'RR', desc:'Budget, manpower, infrastructure or technology needed',            color:'#EA580C', bg:'#FFF7ED', badge:'badge-orange' },
  { id:'coord',      label:'Coordination Issue',    mono:'CI', desc:"A problem stuck because departments aren't aligned",               color:'#0891B2', bg:'#ECFEFF', badge:'badge-teal'   },
  { id:'scheme',     label:'Scheme Feedback',       mono:'SF', desc:'How a welfare scheme is performing on the ground in your district', color:'#4F46E5', bg:'#EEF2FF', badge:'badge-indigo' },
  { id:'lastmile',   label:'Last-Mile Gap',         mono:'LG', desc:'Where a well-designed scheme breaks at point of delivery',         color:'#DC2626', bg:'#FEF2F2', badge:'badge-rose'   },
  { id:'laworder',   label:'Law & Order',           mono:'LO', desc:'Policing concerns, emerging trends or resource gaps (SP-specific)', color:'#1F2937', bg:'#F3F4F6', badge:'badge-dark'   },
  { id:'suggestion', label:'General Suggestion',   mono:'GS', desc:'Any idea or observation directly for the CM or government',        color:'#6B7280', bg:'#F3F4F6', badge:'badge-gray'   },
];

const STATUS_LABELS = {
  pending:  'Pending Review',
  agenda:   'Added to Agenda',
  referred: 'Referred to Department',
  noted:    'Noted'
};
const STATUS_BADGE = {
  pending:  'status-pending',
  agenda:   'status-agenda',
  referred: 'status-referred',
  noted:    'status-noted'
};

/* ── STATE ────────────────────────────────────────────────── */
const S = {
  view: 'login', loginTab: 'officer', officerRole: 'Collector', user: null,
  step: 1, formCat: '', formTitle: '', formDetails: '', formDept: '', formVis: 'open',
  filterCat: '', filterDist: '', filterStatus: '', filterVis: '',
  expandedId: null,
  submissions: [],      // cached from API
  allSubmissions: [],   // unfiltered (for admin stats)
  referModalId: null,
  referTarget: '',
  noteModalId: null,
  noteText: '',
  editModalId: null,
  loading: false,
};

/* ── UTILS ────────────────────────────────────────────────── */
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cat = id => CATEGORIES.find(c => c.id === id) || { label: '', mono: '', bg: '#eee', color: '#999', badge: 'badge-gray' };

function re() { render(); }
function set(k, v) { S[k] = v; re(); }
function go(view) { S.view = view; window.scrollTo(0, 0); re(); }

function mono(id, size) {
  const c = cat(id), s = size || 36;
  return `<div class="cat-mono" style="background:${c.color};width:${s}px;height:${s}px">${c.mono}</div>`;
}
function catBadge(id) {
  const c = cat(id);
  return `<span class="badge ${c.badge}">${esc(c.label)}</span>`;
}
function statusBadge(s) {
  return `<span class="badge ${STATUS_BADGE[s] || 'badge-gray'}">${STATUS_LABELS[s] || s}</span>`;
}
function visBadge(v) {
  return v === 'confidential'
    ? `<span class="badge conf-badge">Confidential</span>`
    : `<span class="badge open-badge">Open</span>`;
}

function showToast(msg, isError = false) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  requestAnimationFrame(() => {
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  });
}

function showLoader() {
  let el = document.getElementById('loader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loader';
    el.className = 'loader-overlay';
    el.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(el);
  }
  el.style.display = 'flex';
}
function hideLoader() {
  const el = document.getElementById('loader');
  if (el) el.style.display = 'none';
}

/* ── API ──────────────────────────────────────────────────── */
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  return res.json();
}

async function loadSubmissions() {
  const params = new URLSearchParams();
  if (S.filterCat)    params.set('category',   S.filterCat);
  if (S.filterDist)   params.set('district',   S.filterDist);
  if (S.filterStatus) params.set('status',     S.filterStatus);
  if (S.filterVis)    params.set('visibility', S.filterVis);
  const data = await api('GET', '/api/submissions?' + params);
  if (data.ok) {
    S.submissions = data.submissions;
    if (data.all) S.allSubmissions = data.all;
    else S.allSubmissions = data.submissions;
  }
}

/* ── NAV ──────────────────────────────────────────────────── */
function renderNav() {
  if (!S.user) return '';
  const isAdmin = S.user.type === 'admin';
  const links = isAdmin
    ? `<button class="nav-link ${S.view === 'admin'  ? 'active' : ''}" onclick="go('admin')">Dashboard</button>
       <button class="nav-link ${S.view === 'agenda' ? 'active' : ''}" onclick="go('agenda')">Agenda</button>`
    : `<button class="nav-link ${S.view === 'officer-home' ? 'active' : ''}" onclick="go('officer-home')">Home</button>
       <button class="nav-link ${S.view === 'form'         ? 'active' : ''}" onclick="startForm()">Submit Idea</button>
       <button class="nav-link ${S.view === 'agenda'       ? 'active' : ''}" onclick="go('agenda')">Agenda</button>`;
  const initials = isAdmin ? 'CS' : (S.user.role === 'Collector' ? 'CO' : 'SP');
  return `
  <nav class="nav">
    <div class="nav-inner">
      <div style="display:flex;align-items:center;gap:24px">
        <div class="nav-brand">
          <div class="nav-emblem">${TN_LOGO}</div>
          <div class="nav-cm-wrap" title="Thiru. C. Joseph Vijay, Chief Minister of Tamil Nadu">
            <img src="${CM_PHOTO}" alt="Thiru. C. Joseph Vijay" class="nav-cm-photo" />
          </div>
          <div>
            <div class="nav-title">DLC Portal 2026</div>
            <div class="nav-sub">District Leaders Conference</div>
          </div>
        </div>
        <div class="nav-links">${links}</div>
      </div>
      <div class="nav-right">
        <div class="nav-user-chip">
          <div class="nav-avatar">${initials}</div>
          <div>
            <div class="nav-uname">${esc(isAdmin ? 'Admin Access' : S.user.district)}</div>
            <div class="nav-udist">${esc(isAdmin ? 'Senior Official' : S.user.role)}</div>
          </div>
        </div>
        <button class="btn-logout" onclick="doLogout()">Sign out</button>
      </div>
    </div>
  </nav>`;
}

/* ── LOGIN ────────────────────────────────────────────────── */
function renderLogin() {
  const isOfficer = S.loginTab === 'officer';
  return `
  <div class="login-page">
    <div class="login-header">
      <div class="login-logo">${TN_LOGO}</div>
      <div>
        <div class="login-htext">Government of Tamil Nadu</div>
        <div class="login-hsub">Secretariat · Chennai</div>
      </div>
    </div>
    <div class="login-body">
      <div class="login-card">
        <div class="login-top">
          <div class="login-top-logo">${TN_LOGO}</div>
          <div class="login-top-text">
            <div class="login-conference">Annual Conference · 2026</div>
            <div class="login-title">District Leaders Conference</div>
            <div class="login-date">
              <span>June 29–30, 2026</span>
              <span>Secretariat, Chennai</span>
            </div>
          </div>
          <div class="login-cm-block">
            <img src="${CM_PHOTO}" alt="Chief Minister" class="cm-photo-login" />
            <div class="cm-name-full">Thiru. C. Joseph Vijay</div>
            <div class="cm-title-label">Chief Minister, Tamil Nadu</div>
          </div>
        </div>
        <div class="login-bottom">
          <div class="login-tabs">
            <button class="login-tab ${isOfficer ? 'active' : ''}"  onclick="set('loginTab','officer')">Officer Login</button>
            <button class="login-tab ${!isOfficer ? 'active' : ''}" onclick="set('loginTab','admin')">Senior Official</button>
          </div>
          ${isOfficer ? `
          <div class="login-fields">
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">District</label>
              <select class="form-control" id="l-dist">
                <option value="">Select your district</option>
                ${DISTRICTS.map(d => `<option>${esc(d)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Your Role</label>
              <div class="role-toggle">
                <button class="role-btn ${S.officerRole === 'Collector' ? 'active' : ''}" onclick="set('officerRole','Collector')">Collector</button>
                <button class="role-btn ${S.officerRole === 'SP' ? 'active' : ''}" onclick="set('officerRole','SP')">Superintendent of Police</button>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Access PIN</label>
              <input class="form-control" type="password" id="l-pin" placeholder="Enter your 4-digit PIN" maxlength="4"
                     onkeydown="if(event.key==='Enter') officerLogin()" />
              <div class="form-error" id="login-err"></div>
            </div>
          </div>
          <div class="login-actions">
            <button class="btn btn-primary btn-full btn-lg" onclick="officerLogin()" id="officer-btn">Access Officer Portal</button>
          </div>
          <div class="login-note">Demo PIN: <strong>1234</strong> &nbsp;·&nbsp; For access issues, contact the Secretariat IT Cell</div>
          ` : `
          <div class="login-fields">
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Username</label>
              <input class="form-control" type="text" id="a-user" placeholder="Enter username"
                     onkeydown="if(event.key==='Enter') adminLogin()" />
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Password</label>
              <input class="form-control" type="password" id="a-pass" placeholder="Enter password"
                     onkeydown="if(event.key==='Enter') adminLogin()" />
              <div class="form-error" id="admin-err"></div>
            </div>
          </div>
          <div class="login-actions">
            <button class="btn btn-primary btn-full btn-lg" onclick="adminLogin()" id="admin-btn">Access Dashboard</button>
          </div>
          <div class="login-note">Demo: username <strong>admin</strong> · password <strong>admin123</strong></div>
          `}
        </div>
      </div>
    </div>
  </div>`;
}

/* ── OFFICER HOME ─────────────────────────────────────────── */
function renderOfficerHome() {
  const mine = S.submissions;
  return `
  ${renderNav()}
  <div class="main">
    <div class="page-header">
      <div class="page-greeting">Welcome back</div>
      <div class="page-title">${esc(S.user.role)}, ${esc(S.user.district)}</div>
      <div class="page-sub">District Leaders Conference 2026 · June 29–30, Secretariat Chennai</div>
    </div>
    <div class="submit-cta">
      <div>
        <div class="cta-label">Share your perspective</div>
        <div class="cta-title">Submit an idea, request,<br>or initiative</div>
        <div class="cta-sub">Your field insights shape the agenda. It takes under 3 minutes.</div>
      </div>
      <button class="cta-btn" onclick="startForm()">+ New Submission</button>
    </div>
    <div class="section-title">Your submissions ${mine.length > 0 ? `<span style="font-size:13px;font-weight:400;color:var(--g-500)">(${mine.length})</span>` : ''}</div>
    ${mine.length === 0 ? `
    <div class="card">
      <div class="empty-state">
        <p style="margin-top:8px">No submissions yet. Share your first idea above —<br>the Chief Minister's team is listening.</p>
      </div>
    </div>` : `
    <div class="submissions-list">
      ${mine.map(s => {
        return `<div class="sub-card">
          ${mono(s.category, 40)}
          <div class="sub-content">
            <div class="sub-title">${esc(s.title)}</div>
            <div class="sub-meta">${catBadge(s.category)} <span class="dot"></span> <span>${esc(s.department)}</span> <span class="dot"></span> <span>${esc(s.created_at)}</span></div>
          </div>
          <div class="sub-status">${statusBadge(s.status)}</div>
        </div>`;
      }).join('')}
    </div>`}
  </div>`;
}

/* ── FORM ─────────────────────────────────────────────────── */
function startForm() {
  S.step = 1; S.formCat = ''; S.formTitle = ''; S.formDetails = ''; S.formDept = ''; S.formVis = 'open';
  go('form');
}

function renderForm() {
  const stepLabels = ['Choose Type', 'Your Submission', 'Details & Visibility', 'Review & Submit'];
  const circles = stepLabels.map((_, i) => {
    const n = i + 1, cls = n < S.step ? 'done' : n === S.step ? 'active' : '';
    return `<div class="progress-step">
      <div class="step-circle ${cls}">${n < S.step ? '✓' : n}</div>
      ${i < stepLabels.length - 1 ? `<div class="step-line ${n < S.step ? 'done' : ''}"></div>` : ''}
    </div>`;
  }).join('');

  let body = '';

  if (S.step === 1) {
    body = `
    <div class="form-step-title">What are you sharing?</div>
    <div class="form-step-sub">Choose the type that best fits your submission. You can only pick one.</div>
    <div class="cat-grid">
      ${CATEGORIES.map(c => `
      <div class="cat-card ${S.formCat === c.id ? 'selected' : ''}"
           style="${S.formCat === c.id ? `--sel-color:${c.color};--sel-bg:${c.bg};` : ''}"
           onclick="set('formCat','${c.id}')">
        <div class="cat-mono" style="background:${c.color}">${c.mono}</div>
        <div>
          <div class="cat-label">${esc(c.label)}</div>
          <div class="cat-desc">${esc(c.desc)}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="go('officer-home')">Back</button>
      <button class="btn btn-primary btn-lg" onclick="set('step',2)" ${!S.formCat ? 'disabled' : ''}>Continue</button>
    </div>`;

  } else if (S.step === 2) {
    const titlePct = S.formTitle.length / 100;
    const detPct   = S.formDetails.length / 600;
    const titleHintCls = !S.formTitle.length   ? 'empty' : titlePct < .4 ? 'started' : 'good';
    const detHintCls   = !S.formDetails.length ? 'empty' : detPct   < .4 ? 'started' : 'good';
    const titleHintMsg = !S.formTitle.length   ? 'Start typing your idea'        : titlePct < .4 ? 'Keep going — add more detail' : titlePct < .8 ? 'Great detail — almost perfect' : 'Perfect length';
    const detHintMsg   = !S.formDetails.length ? 'Start typing your idea'        : detPct   < .4 ? 'Keep going — add more detail' : detPct   < .8 ? 'Great detail — almost perfect' : 'Perfect length';
    const canContinue  = S.formTitle.trim() && S.formDetails.trim();
    body = `
    <div class="form-step-title">Your submission</div>
    <div class="form-step-sub">Give it a clear headline and describe it in your own words.</div>
    <div class="form-group">
      <label class="form-label">Headline</label>
      <input class="form-control" type="text" id="f-title"
             placeholder="E.g. Solar pumps for drought-prone villages in Dindigul"
             maxlength="100" value="${esc(S.formTitle)}"
             oninput="fld('formTitle',this.value,'tc','th',100)" />
      <div class="char-row">
        <span class="char-hint ${titleHintCls}" id="th">${titleHintMsg}</span>
        <span class="char-count" id="tc">${S.formTitle.length}/100</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-control" id="f-details"
                placeholder="What is the idea or issue? What problem does it solve? What do you need from the government?"
                maxlength="600" style="min-height:150px"
                oninput="fld('formDetails',this.value,'dc','dh',600)">${esc(S.formDetails)}</textarea>
      <div class="char-row">
        <span class="char-hint ${detHintCls}" id="dh">${detHintMsg}</span>
        <span class="char-count" id="dc">${S.formDetails.length}/600</span>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',1)">Back</button>
      <button id="s2-continue" class="btn btn-primary btn-lg" onclick="set('step',3)" ${!canContinue ? 'disabled' : ''}>Continue</button>
    </div>`;

  } else if (S.step === 3) {
    const globeSVG = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:${S.formVis === 'open' ? 'var(--p)' : 'var(--g-400)'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    const lockSVG  = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:${S.formVis === 'confidential' ? 'var(--amber)' : 'var(--g-400)'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`;
    body = `
    <div class="form-step-title">A few more details</div>
    <div class="form-step-sub">Tell us which department this is about, and who should see your submission.</div>
    <div class="form-group">
      <label class="form-label">Related Department</label>
      <select class="form-control" id="f-dept" onchange="S.formDept=this.value">
        <option value="">Select department</option>
        ${DEPARTMENTS.map(d => `<option ${S.formDept === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Visibility</label>
      <div class="vis-grid">
        <div class="vis-card ${S.formVis === 'open' ? 'selected-open' : ''}" onclick="set('formVis','open')">
          <div class="vis-icon" style="background:${S.formVis === 'open' ? 'var(--p-100)' : 'var(--g-100)'}">${globeSVG}</div>
          <div class="vis-label">Open</div>
          <div class="vis-desc">Visible to the CM, Chief Secretary, and all participating senior officials.</div>
        </div>
        <div class="vis-card ${S.formVis === 'confidential' ? 'selected-conf' : ''}" onclick="set('formVis','confidential')">
          <div class="vis-icon" style="background:${S.formVis === 'confidential' ? 'var(--amber-bg)' : 'var(--g-100)'}">${lockSVG}</div>
          <div class="vis-label">Confidential</div>
          <div class="vis-desc">Visible only to the CM and Chief Secretary. Not shown to other participants.</div>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',2)">Back</button>
      <button class="btn btn-primary btn-lg" onclick="set('step',4)" ${!S.formDept ? 'disabled' : ''}>Review</button>
    </div>`;

  } else {
    body = `
    <div class="form-step-title">Review your submission</div>
    <div class="form-step-sub">Everything look right? Hit submit when you're ready.</div>
    <div class="review-block">
      <div class="review-row"><div class="review-key">Type</div><div class="review-val">${catBadge(S.formCat)}</div></div>
      <div class="review-row"><div class="review-key">District</div><div class="review-val">${esc(S.user.district)}</div></div>
      <div class="review-row"><div class="review-key">Role</div><div class="review-val">${esc(S.user.role)}</div></div>
      <div class="review-row"><div class="review-key">Headline</div><div class="review-val" style="font-weight:600">${esc(S.formTitle)}</div></div>
      <div class="review-row"><div class="review-key">Description</div><div class="review-val">${esc(S.formDetails)}</div></div>
      <div class="review-row"><div class="review-key">Department</div><div class="review-val">${esc(S.formDept)}</div></div>
      <div class="review-row"><div class="review-key">Visibility</div><div class="review-val">${visBadge(S.formVis)}</div></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',3)">Back</button>
      <button class="btn btn-primary btn-lg" onclick="submitForm()">Submit to Secretariat</button>
    </div>`;
  }

  return `
  ${renderNav()}
  <div class="form-page">
    <div class="form-progress">
      <div class="progress-steps">${circles}</div>
      <div class="progress-label">Step <span>${S.step} of 4</span> — ${stepLabels[S.step - 1]}</div>
    </div>
    <div class="form-card">${body}</div>
  </div>`;
}

/* ── SUCCESS ──────────────────────────────────────────────── */
function renderSuccess() {
  return `
  ${renderNav()}
  <div class="main-narrow">
    <div class="success-page">
      <div class="success-icon">&#10003;</div>
      <div class="success-title">Submission Received</div>
      <div class="success-sub">Your idea has been shared with the Secretariat team. The Chief Minister's office will review all submissions before the conference on June 29.</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg" onclick="startForm()">Submit Another</button>
        <button class="btn btn-secondary btn-lg" onclick="navHome()">Back to Home</button>
      </div>
    </div>
  </div>`;
}

/* ── ADMIN DASHBOARD ──────────────────────────────────────── */
function renderAdmin() {
  const subs = S.submissions;
  const all  = S.allSubmissions;

  const uniqueDistricts = [...new Set(all.map(s => s.district))].length;

  const cards = subs.map(s => {
    const c = cat(s.category), isExp = S.expandedId === s.id;
    return `
    <div class="admin-sub-card ${isExp ? 'expanded' : ''}" id="sc-${s.id}" onclick="toggleExpand(${s.id})">
      <div class="sub-card-top">
        <div class="sub-card-icon" style="background:${c.bg}">${mono(s.category, 36)}</div>
        <div class="sub-card-body">
          <div class="sub-card-header">
            <div class="sub-card-title">${esc(s.title)}</div>
            ${statusBadge(s.status)}
          </div>
          <div class="sub-card-meta">
            <span>${catBadge(s.category)}</span>
            <span>·</span><span style="font-weight:600">${esc(s.district)}</span>
            <span>·</span><span>${esc(s.role)}</span>
            <span>·</span><span>${esc(s.department)}</span>
            <span>·</span>${visBadge(s.visibility)}
            <span>·</span><span>${esc(s.created_at)}</span>
          </div>
          ${!isExp ? `<div class="sub-card-preview">${esc((s.details || '').substring(0, 160))}…</div>` : ''}
        </div>
      </div>
      ${isExp ? `
      <div class="sub-card-full" onclick="event.stopPropagation()">
        <p>${esc(s.details)}</p>
        ${s.admin_note ? `<div class="action-note mt-8"><strong>Note:</strong> ${esc(s.admin_note)}</div>` : ''}
        ${s.refer_to   ? `<div class="action-note mt-4"><strong>Referred to:</strong> ${esc(s.refer_to)}</div>` : ''}
      </div>
      <div class="sub-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm ${s.status === 'agenda' ? 'btn-primary' : 'btn-secondary'}" onclick="setStatus(${s.id},'agenda')">
          ${s.status === 'agenda' ? 'On Agenda' : '+ Add to Agenda'}
        </button>
        <button class="btn btn-sm btn-secondary" onclick="openReferModal(${s.id})">Refer to Department</button>
        <button class="btn btn-sm ${s.status === 'noted' ? 'btn-secondary' : 'btn-ghost'}" onclick="setStatus(${s.id},'noted')">
          ${s.status === 'noted' ? 'Noted' : 'Mark as Noted'}
        </button>
        <button class="btn btn-sm btn-ghost" onclick="openNoteModal(${s.id},${JSON.stringify(esc(s.admin_note || ''))})">
          ${s.admin_note ? 'Edit Note' : '+ Add Note'}
        </button>
        <div style="flex:1"></div>
        <button class="btn btn-sm btn-ghost" onclick="openEditModal(${s.id})" style="color:var(--p)">Edit</button>
        <button class="btn btn-sm btn-ghost" onclick="deleteSubmission(${s.id})" style="color:var(--rose)">Delete</button>
      </div>` : ''}
    </div>`;
  }).join('');

  // Refer modal
  const referModal = S.referModalId !== null ? `
  <div class="modal-overlay" onclick="S.referModalId=null;re()">
    <div class="modal" onclick="event.stopPropagation()">
      <h3>Refer to Department</h3>
      <div class="form-group">
        <label class="form-label">Select Department / Secretary</label>
        <select class="form-control" id="m-refer" onchange="S.referTarget=this.value">
          <option value="">Choose…</option>
          ${DEPARTMENTS.map(d => `<option>${esc(d)}</option>`).join('')}
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="S.referModalId=null;re()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmRefer()">Confirm Referral</button>
      </div>
    </div>
  </div>` : '';

  // Edit modal
  const editSub = S.editModalId !== null ? S.allSubmissions.find(s => s.id === S.editModalId) : null;
  const editModal = editSub ? `
  <div class="modal-overlay" onclick="S.editModalId=null;re()">
    <div class="modal edit-modal" onclick="event.stopPropagation()">
      <h3>Edit Submission</h3>
      <div class="form-group">
        <label class="form-label">Headline</label>
        <input class="form-control" id="em-title" type="text" maxlength="100" value="${esc(editSub.title)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="em-details" style="min-height:120px">${esc(editSub.details)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-control" id="em-category">
          ${CATEGORIES.map(c => `<option value="${c.id}" ${editSub.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Department</label>
        <select class="form-control" id="em-dept">
          ${DEPARTMENTS.map(d => `<option ${editSub.department === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Visibility</label>
        <select class="form-control" id="em-vis">
          <option value="open"         ${editSub.visibility === 'open'          ? 'selected' : ''}>Open</option>
          <option value="confidential" ${editSub.visibility === 'confidential'  ? 'selected' : ''}>Confidential</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="S.editModalId=null;re()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmEdit()">Save Changes</button>
      </div>
    </div>
  </div>` : '';

  // Note modal
  const noteModal = S.noteModalId !== null ? `
  <div class="modal-overlay" onclick="S.noteModalId=null;re()">
    <div class="modal note-modal" onclick="event.stopPropagation()">
      <h3>Internal Note</h3>
      <textarea id="m-note" placeholder="Add an internal note for this submission…">${esc(S.noteText)}</textarea>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="S.noteModalId=null;re()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmNote()">Save Note</button>
      </div>
    </div>
  </div>` : '';

  const hasFilters = S.filterCat || S.filterDist || S.filterStatus || S.filterVis;

  return `
  ${renderNav()}
  <div class="main">
    <div class="page-header">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-greeting">Senior Official View</div>
          <div class="page-title">All Submissions</div>
          <div class="page-sub">District Leaders Conference 2026 · Ideas, requests and initiatives from the field</div>
        </div>
        <a href="/api/submissions/export" class="export-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export CSV
        </a>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Submissions</div>
        <div class="stat-value">${all.length}</div>
        <div class="stat-sub">From ${uniqueDistricts} districts</div>
      </div>
      <div class="stat-card stat-agenda">
        <div class="stat-label">Added to Agenda</div>
        <div class="stat-value">${all.filter(s => s.status === 'agenda').length}</div>
        <div class="stat-sub">For discussion in 2 days</div>
      </div>
      <div class="stat-card stat-referred">
        <div class="stat-label">Referred to Dept.</div>
        <div class="stat-value">${all.filter(s => s.status === 'referred').length}</div>
        <div class="stat-sub">Awaiting department action</div>
      </div>
      <div class="stat-card stat-noted">
        <div class="stat-label">Noted</div>
        <div class="stat-value">${all.filter(s => s.status === 'noted').length}</div>
        <div class="stat-sub">Acknowledged, no plenary</div>
      </div>
    </div>

    <div class="filter-bar">
      <label>Filter by</label>
      <select class="filter-select" onchange="applyFilter('filterCat',this.value)">
        <option value="">All Types</option>
        ${CATEGORIES.map(c => `<option value="${c.id}" ${S.filterCat === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="applyFilter('filterDist',this.value)">
        <option value="">All Districts</option>
        ${DISTRICTS.map(d => `<option value="${d}" ${S.filterDist === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="applyFilter('filterStatus',this.value)">
        <option value="">All Statuses</option>
        ${Object.entries(STATUS_LABELS).map(([k, v]) => `<option value="${k}" ${S.filterStatus === k ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="applyFilter('filterVis',this.value)">
        <option value="">All Visibility</option>
        <option value="open"         ${S.filterVis === 'open'          ? 'selected' : ''}>Open</option>
        <option value="confidential" ${S.filterVis === 'confidential'  ? 'selected' : ''}>Confidential</option>
      </select>
      <div class="filter-sep"></div>
      <div class="filter-count">${subs.length} of ${all.length} shown</div>
      ${hasFilters ? `<button class="btn btn-ghost btn-sm" onclick="clearFilters()">Clear filters</button>` : ''}
    </div>

    <div>${cards || '<div class="card"><div class="empty-state"><p>No submissions match your filters.</p></div></div>'}</div>
  </div>
  ${referModal}
  ${noteModal}
  ${editModal}`;
}

/* ── AGENDA ───────────────────────────────────────────────── */
function renderAgenda() {
  const days = [
    {
      day: 'Day 1', date: 'Monday, June 29, 2026', sessions: [
        { time: '09:00 AM', title: 'Inaugural Session',            sub: 'Address by the Chief Minister of Tamil Nadu' },
        { time: '10:30 AM', title: 'Session 1 — [To be updated]', sub: 'Welfare scheme implementation review' },
        { time: '12:30 PM', title: 'Lunch Break',                 sub: '' },
        { time: '02:00 PM', title: 'Session 2 — [To be updated]', sub: 'Law and order and public safety review' },
        { time: '04:00 PM', title: 'Session 3 — [To be updated]', sub: 'District administration performance' },
        { time: '05:30 PM', title: 'Close of Day 1',              sub: '' },
      ]
    },
    {
      day: 'Day 2', date: 'Tuesday, June 30, 2026', sessions: [
        { time: '09:30 AM', title: 'Session 4 — [To be updated]',      sub: 'Development project status and infrastructure' },
        { time: '11:00 AM', title: 'Session 5 — Best Practices Showcase', sub: 'Field innovations from across the state' },
        { time: '01:00 PM', title: 'Lunch Break',                      sub: '' },
        { time: '02:30 PM', title: 'Session 6 — [To be updated]',      sub: 'Inter-department coordination and governance' },
        { time: '04:00 PM', title: 'Valedictory Session',              sub: 'Directions and announcements by the Chief Minister' },
        { time: '05:00 PM', title: 'Conference Closes',                sub: '' },
      ]
    }
  ];
  return `
  ${renderNav()}
  <div class="main" style="max-width:760px">
    <div class="agenda-header">
      <div class="agenda-eyebrow">Government of Tamil Nadu</div>
      <div class="agenda-title">District Leaders Conference 2026</div>
      <div class="agenda-meta">
        <div class="agenda-meta-item">June 29–30, 2026</div>
        <div class="agenda-meta-dot"></div>
        <div class="agenda-meta-item">Secretariat, Chennai</div>
        <div class="agenda-meta-dot"></div>
        <div class="agenda-meta-item">Chaired by the Chief Minister</div>
      </div>
    </div>

    ${days.map(d => `
    <div class="agenda-day">
      <div class="agenda-day-header">
        <span class="agenda-day-badge">${d.day}</span>
        <span class="agenda-day-date">${d.date}</span>
      </div>
      <div class="agenda-day-body">
        ${d.sessions.map(s => `
        <div class="agenda-placeholder-row">
          <div class="agenda-time">${s.time}</div>
          <div class="agenda-session">
            <div class="agenda-session-title">${esc(s.title)}</div>
            ${s.sub ? `<div class="agenda-session-sub">${esc(s.sub)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>`).join('')}

    <div class="agenda-notice">
      <div class="agenda-notice-bar"></div>
      <div class="agenda-notice-text">
        <strong>Agenda is being finalised.</strong> Session topics and timings will be updated after the Secretariat reviews all officer submissions. Final agenda will be shared by June 26, 2026. For queries, contact the Conference Coordination Cell.
      </div>
    </div>
  </div>`;
}

/* ── CHARACTER COUNT (targeted DOM update, no re-render) ──── */
function fld(field, val, cid, hid, max) {
  S[field] = val;
  const pct = val.length / max;
  const cel = document.getElementById(cid);
  if (cel) cel.textContent = val.length + '/' + max;
  const hel = document.getElementById(hid);
  if (hel) {
    if (!val.length)       { hel.textContent = 'Start typing your idea';        hel.className = 'char-hint empty'; }
    else if (pct < .4)     { hel.textContent = 'Keep going — add more detail';  hel.className = 'char-hint started'; }
    else if (pct < .8)     { hel.textContent = 'Great detail — almost perfect'; hel.className = 'char-hint good'; }
    else                   { hel.textContent = 'Perfect length';                hel.className = 'char-hint good'; }
  }
  const btn = document.getElementById('s2-continue');
  if (btn) {
    const ok = S.formTitle.trim() && S.formDetails.trim();
    btn.disabled = !ok;
  }
}

/* ── ACTIONS ──────────────────────────────────────────────── */
async function officerLogin() {
  const dist = document.getElementById('l-dist')?.value;
  const pin  = document.getElementById('l-pin')?.value;
  const errEl = document.getElementById('login-err');

  if (!dist)              { showErr(errEl, 'Please select your district.');        return; }
  if (!pin || pin.length < 4) { showErr(errEl, 'Please enter your 4-digit PIN.'); return; }

  const btn = document.getElementById('officer-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

  const data = await api('POST', '/api/login/officer', { district: dist, role: S.officerRole, pin });

  if (data.ok) {
    S.user = data.user;
    showLoader();
    await loadSubmissions();
    hideLoader();
    go('officer-home');
  } else {
    showErr(errEl, data.error || 'Login failed.');
    if (btn) { btn.disabled = false; btn.textContent = 'Access Officer Portal'; }
  }
}

async function adminLogin() {
  const u    = document.getElementById('a-user')?.value;
  const p    = document.getElementById('a-pass')?.value;
  const errEl = document.getElementById('admin-err');

  if (!u || !p) { showErr(errEl, 'Username and password are required.'); return; }

  const btn = document.getElementById('admin-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }

  const data = await api('POST', '/api/login/admin', { username: u, password: p });

  if (data.ok) {
    S.user = data.user;
    showLoader();
    await loadSubmissions();
    hideLoader();
    go('admin');
  } else {
    showErr(errEl, data.error || 'Invalid credentials.');
    if (btn) { btn.disabled = false; btn.textContent = 'Access Dashboard'; }
  }
}

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 4000);
}

async function doLogout() {
  await api('POST', '/api/logout');
  S.user = null; S.submissions = []; S.allSubmissions = [];
  go('login');
}

async function navHome() {
  showLoader();
  await loadSubmissions();
  hideLoader();
  go(S.user.type === 'admin' ? 'admin' : 'officer-home');
}

async function submitForm() {
  showLoader();
  const data = await api('POST', '/api/submissions', {
    category:   S.formCat,
    title:      S.formTitle,
    details:    S.formDetails,
    department: S.formDept,
    visibility: S.formVis,
  });
  hideLoader();
  if (data.ok) {
    await loadSubmissions();
    go('success');
  } else {
    showToast(data.error || 'Submission failed. Please try again.', true);
  }
}

function toggleExpand(id) {
  S.expandedId = S.expandedId === id ? null : id;
  re();
}

async function setStatus(id, status) {
  const data = await api('PATCH', `/api/submissions/${id}/status`, { status });
  if (data.ok) {
    showLoader();
    await loadSubmissions();
    hideLoader();
    showToast('Status updated.');
  } else {
    showToast(data.error || 'Update failed.', true);
  }
}

function openReferModal(id) {
  S.referModalId = id;
  S.referTarget  = '';
  re();
}

async function confirmRefer() {
  const sel = document.getElementById('m-refer');
  const dept = sel ? sel.value : '';
  if (!dept) { showToast('Please select a department.', true); return; }

  const data = await api('PATCH', `/api/submissions/${S.referModalId}/refer`, { refer_to: dept });
  S.referModalId = null;
  if (data.ok) {
    showLoader();
    await loadSubmissions();
    hideLoader();
    showToast(`Referred to ${dept}.`);
  } else {
    showToast(data.error || 'Referral failed.', true);
    re();
  }
}

function openNoteModal(id, existingNote) {
  S.noteModalId = id;
  S.noteText    = existingNote || '';
  re();
  // Set textarea value after render
  requestAnimationFrame(() => {
    const ta = document.getElementById('m-note');
    if (ta) ta.value = S.noteText;
  });
}

async function confirmNote() {
  const ta = document.getElementById('m-note');
  const note = ta ? ta.value : '';
  const data = await api('PATCH', `/api/submissions/${S.noteModalId}/note`, { note });
  S.noteModalId = null;
  if (data.ok) {
    showLoader();
    await loadSubmissions();
    hideLoader();
    showToast('Note saved.');
  } else {
    showToast(data.error || 'Failed to save note.', true);
    re();
  }
}

function openEditModal(id) {
  S.editModalId = id;
  re();
}

async function confirmEdit() {
  const title   = document.getElementById('em-title')?.value.trim();
  const details = document.getElementById('em-details')?.value.trim();
  const category = document.getElementById('em-category')?.value;
  const dept    = document.getElementById('em-dept')?.value;
  const vis     = document.getElementById('em-vis')?.value;

  if (!title || !details) { showToast('Title and description are required.', true); return; }

  const data = await api('PUT', `/api/submissions/${S.editModalId}`, {
    title, details, department: dept, category, visibility: vis
  });
  S.editModalId = null;
  if (data.ok) {
    showLoader();
    await loadSubmissions();
    hideLoader();
    showToast('Submission updated.');
  } else {
    showToast(data.error || 'Update failed.', true);
    re();
  }
}

async function deleteSubmission(id) {
  if (!confirm('Delete this submission permanently? This cannot be undone.')) return;
  const data = await api('DELETE', `/api/submissions/${id}`);
  if (data.ok) {
    S.expandedId = null;
    showLoader();
    await loadSubmissions();
    hideLoader();
    showToast('Submission deleted.');
  } else {
    showToast(data.error || 'Delete failed.', true);
  }
}

async function applyFilter(key, val) {
  S[key] = val;
  showLoader();
  await loadSubmissions();
  hideLoader();
  re();
}

async function clearFilters() {
  S.filterCat = ''; S.filterDist = ''; S.filterStatus = ''; S.filterVis = '';
  showLoader();
  await loadSubmissions();
  hideLoader();
  re();
}

/* ── RENDER ───────────────────────────────────────────────── */
function render() {
  const root = document.getElementById('root');
  switch (S.view) {
    case 'login':        root.innerHTML = renderLogin();       break;
    case 'officer-home': root.innerHTML = renderOfficerHome(); break;
    case 'form':         root.innerHTML = renderForm();        break;
    case 'success':      root.innerHTML = renderSuccess();     break;
    case 'admin':        root.innerHTML = renderAdmin();       break;
    case 'agenda':       root.innerHTML = renderAgenda();      break;
    default:             root.innerHTML = renderLogin();
  }
}

/* ── INIT ─────────────────────────────────────────────────── */
async function init() {
  showLoader();
  const data = await api('GET', '/api/session');
  if (data.ok && data.user) {
    S.user = data.user;
    await loadSubmissions();
    hideLoader();
    go(S.user.type === 'admin' ? 'admin' : 'officer-home');
  } else {
    hideLoader();
    render();
  }
}

init();
