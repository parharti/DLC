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

const HOD_MAP = {
  'Agriculture':             'Director of Agriculture',
  'Education':               'Director of School Education',
  'Health & Family Welfare': 'Director of Public Health & Preventive Medicine',
  'Home (Police)':           'Director General of Police (DGP)',
  'Revenue':                 'Commissioner of Revenue Administration',
  'Social Welfare':          'Director of Social Welfare & Nutritious Meal Programme',
  'Rural Development':       'Commissioner of Rural Development & Panchayat Raj',
  'Public Works Department': 'Chief Engineer (General), PWD',
  'Urban Local Bodies':      'Commissioner of Municipal Administration',
  'Finance':                 'Commissioner of Finance',
  'Adi Dravidar Welfare':    'Director, Adi Dravidar & Tribal Welfare',
  'BC/MBC Welfare':          'Director, Backward Classes & Most Backward Classes',
  'Energy':                  'Chairman & MD, TANGEDCO',
  'Transport':               'Commissioner of Transport',
  'Water Resources':         'Chief Engineer, Water Resources Department',
  'IT & Digital Services':   'Commissioner of e-Governance',
  'Environment & Forests':   'Principal Chief Conservator of Forests',
  'Food & Civil Supplies':   'Commissioner, Civil Supplies & Consumer Protection',
  'Labour':                  'Commissioner of Labour',
  'Multi-department':        '(Multiple — as per departments involved)',
};

const TIMELINES = [
  'Immediate (within 30 days)',
  'Short-term (1–3 months)',
  'Medium-term (3–6 months)',
  'Long-term (6+ months)',
];

const REVENUE_IMPACTS = [
  'Positive — increases district revenue / savings',
  'Neutral — no significant revenue impact',
  'Negative — requires additional expenditure',
  'Not applicable',
];

const BUDGET_RANGES = [
  'No Budget Required',
  'Under ₹1 Lakh',
  '₹1 Lakh – ₹5 Lakhs',
  '₹5 Lakhs – ₹25 Lakhs',
  '₹25 Lakhs – ₹1 Crore',
  '₹1 Crore – ₹5 Crores',
  'Above ₹5 Crores',
];

const BENEFICIARY_RANGES = [
  'Under 1,000 persons',
  '1,000 – 10,000 persons',
  '10,000 – 1 Lakh persons',
  '1 Lakh – 10 Lakh persons',
  'Above 10 Lakh persons',
  'Entire District',
  'State-wide (if scaled)',
];

const EVIDENCE_TYPES = [
  'Field inspection report',
  'District survey / census data',
  'Pilot scheme results',
  'Citizen grievance data (CPGRAMS / portal)',
  'Revenue / expenditure records',
  'Scientific or technical study',
  'Best practice from another district / state',
  'Inter-departmental communication / minutes',
  'No formal evidence — field observation',
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

const CAT_QUESTIONS = {
  flagship: [
    { id:'stage',       label:'Current stage of the initiative',  opts:['Recently launched (0–6 months)','Operational (6–12 months)','Mature (1–3 years)','Sustained (3+ years)'] },
    { id:'results',     label:'Results demonstrated so far',       opts:['Measurable quantitative outcomes available','Qualitative outcomes / testimonials','Early indicators, full data pending','Yet to be measured'] },
    { id:'recognition', label:'Recognition received',              opts:['State / national award','Media coverage','Featured in a government review','None yet'] },
    { id:'scaling',     label:'Scaling readiness',                 opts:['Ready to replicate as-is','Needs minor adaptation','Needs significant resources first','District-specific — hard to scale'] },
    { id:'support',     label:'Primary support needed to scale',   opts:['Funding','Manpower','Policy / GO backing','Technology / platform','Inter-department coordination'] },
  ],
  best: [
    { id:'duration',    label:'How long has it been in practice?', opts:['Under 6 months','6–12 months','1–2 years','Over 2 years'] },
    { id:'outcomes',    label:'Outcome demonstrated',  multi:true,  opts:['Faster service delivery','Cost savings','Higher beneficiary coverage','Better compliance / transparency','Improved citizen satisfaction'] },
    { id:'replication', label:'Replication readiness',             opts:['Plug-and-play (no extra resources)','Needs an SOP / guideline drafted','Needs staff training','Needs budget allocation'] },
    { id:'dependency',  label:'Dependency on local conditions',    opts:['Fully generic — works anywhere','Needs minor local adaptation','Depends on local infrastructure','Depends on specific staff capacity'] },
    { id:'evidence',    label:'Evidence of success',               opts:['Hard data / dashboards','Audit / inspection findings','Citizen feedback','Already adopted by a peer district'] },
  ],
  pilot: [
    { id:'sanction',    label:'Type of sanction needed',           opts:['Administrative sanction only','Financial sanction (funding)','Policy / GO approval','Both financial + policy','Technical / department clearance'] },
    { id:'duration',    label:'Proposed pilot duration',           opts:['Under 3 months','3–6 months','6–12 months','Over 12 months'] },
    { id:'coverage',    label:'Proposed pilot coverage',           opts:['Single block / taluk','Multiple blocks','One full district','A specific target group only'] },
    { id:'metrics',     label:'Are success metrics defined?',      opts:['Yes — quantitative targets set','Yes — qualitative goals','Partially defined','Need help defining'] },
    { id:'risk',        label:'Risk level if the pilot fails',     opts:['Low — minimal cost / reversible','Moderate','High — significant cost / disruption'] },
  ],
  policy: [
    { id:'action',      label:'Type of policy action',             opts:['New GO / rule / law','Amend an existing GO / rule','Repeal / withdraw existing provision','Clarification / interpretation'] },
    { id:'approval',    label:'Approval level required',           opts:['District-level order','Department / Secretariat','State Cabinet','Central / inter-state'] },
    { id:'provision',   label:'Existing provision affected',       opts:['A specific GO (name it in description)','State Act / rule','Central Act / scheme guideline','None — entirely new area'] },
    { id:'driver',      label:'Driver for the request',            opts:['Legal / compliance gap','Operational bottleneck','Citizen grievance pattern','Revenue / financial reason','Technological change'] },
    { id:'reach',       label:'Expected reach',                    opts:['District-specific','Applicable statewide','Likely precedent for other states'] },
  ],
  resource: [
    { id:'type',        label:'Type of resource',                  opts:['Budget / funds','Manpower / staffing','Infrastructure (building, vehicles)','Technology (software / hardware)','Equipment / materials'] },
    { id:'nature',      label:'Nature of requirement',             opts:['One-time','Recurring / annual','Phased over time'] },
    { id:'criticality', label:'Criticality',                       opts:['Critical — work stalled without it','High — major impact on delivery','Moderate — improves efficiency','Enhancement / nice-to-have'] },
    { id:'shortfall',   label:'Current shortfall',                 opts:['No provision at all','Partial — needs augmentation','Sanctioned but not released','Available but inadequate / outdated'] },
    { id:'funding',     label:'Preferred funding source',          opts:['State budget','Central scheme convergence','District / local funds','CSR / external','Open to any'] },
  ],
  coord: [
    { id:'depts',       label:'Departments involved',              opts:['Two departments','Three or more departments','District + State level','District + Central agency'] },
    { id:'bottleneck',  label:'Nature of the bottleneck',          opts:['Overlapping jurisdiction','Unclear ownership / responsibility','Conflicting guidelines','Data / information not shared','Funds or approval held up'] },
    { id:'duration',    label:'How long has it been stuck?',       opts:['Under 1 month','1–3 months','3–6 months','Over 6 months'] },
    { id:'level',       label:'Level needed to resolve',           opts:['District Collector level','Department Secretary level','Chief Secretary level','CM / Cabinet level'] },
    { id:'impact',      label:'Citizen impact',                    opts:['Directly affecting service delivery','Delaying a project','Generating grievances','Internal / administrative only'] },
  ],
  scheme: [
    { id:'scheme_cat',  label:'Scheme category',                   opts:['Central scheme','State scheme','Centrally sponsored (shared)','District-specific scheme'] },
    { id:'performance', label:'Overall performance on the ground', opts:['Performing very well','Satisfactory with gaps','Underperforming','Failing / stalled'] },
    { id:'issue',       label:'Main issue area',                   opts:['Eligibility / targeting','Awareness among beneficiaries','Fund flow / disbursement delay','Documentation / verification burden','Staff / capacity shortage','No major issue — positive feedback'] },
    { id:'satisfaction',label:'Beneficiary satisfaction',          opts:['High','Moderate','Low','Mixed across groups'] },
    { id:'action',      label:'Suggested action',                  opts:['Continue as-is','Minor process fix','Major redesign','Additional resources','Better convergence with other schemes'] },
  ],
  lastmile: [
    { id:'scheme',      label:'Scheme / service affected',         opts:['Direct Benefit Transfer (DBT)','Ration / PDS','Pension / welfare payment','Health service','Education / scholarship','Certificate / document issuance','Other'] },
    { id:'breakdown',   label:'Where the breakdown occurs',        opts:['Identification / enrollment','Verification / approval','Fund transfer / disbursement','Physical delivery (final point)','Grievance redressal'] },
    { id:'rootcause',   label:'Root cause type',                   opts:['Technology / portal failure','Connectivity / infrastructure','Staff vacancy / overload','Documentation mismatch','Beneficiary awareness','Process design flaw'] },
    { id:'proportion',  label:'Proportion of beneficiaries affected', opts:['Few / isolated cases','A specific group or area','Significant minority','Majority of beneficiaries'] },
    { id:'fix',         label:'Fix feasibility',                   opts:['Quick fix at district level','Needs a portal / tech change','Needs a policy change','Needs additional resources'] },
  ],
  laworder: [
    { id:'concern',     label:'Type of concern',                   opts:['Emerging crime trend','Public order / communal','Cyber / financial crime','Narcotics / illicit trade','Traffic / road safety','Manpower gap','Infrastructure / technology gap'] },
    { id:'trend',       label:'Trend direction',                   opts:['Newly emerging','Rising','Stable but persistent','Localized hotspot'] },
    { id:'spread',      label:'Geographic spread',                 opts:['Single police-station limit','District-wide','Bordering / inter-district','Inter-state'] },
    { id:'gap',         label:'Resource gap (if any)',             opts:['Manpower','Vehicles / mobility','Surveillance / tech (CCTV etc.)','Forensic / investigation tools','Training / specialized skills','None — policy or coordination issue'] },
    { id:'urgency',     label:'Urgency',                           opts:['Immediate / active threat','Preventive — act before it escalates','Medium-term capacity building'] },
  ],
  suggestion: [
    { id:'theme',       label:'Theme / area',                      opts:['Governance / administration','Citizen services / e-governance','Welfare / social development','Economy / employment','Infrastructure','Environment / sustainability','Other'] },
    { id:'type',        label:'Type of suggestion',                opts:['Process improvement','New idea / scheme concept','Cost saving','Citizen convenience','Technology adoption'] },
    { id:'scope',       label:'Scope',                             opts:['District-specific','Applicable statewide','For a specific department','Cross-cutting'] },
    { id:'maturity',    label:'Maturity of the idea',              opts:['Just an observation','Rough concept','Worked-out proposal','Already tested informally'] },
  ],
};

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
  step: 1, formCat: '', formTitle: '', formDetails: '', formDocsLink: '',
  formDept: '', formHod: '', formCrossDepts: [],
  formBudget: '', formBeneficiaries: '', formTimeline: '', formRevenueImpact: '', formEvidence: '',
  formVis: 'open', formCatAnswers: {},
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
function go(view) {
  S.view = view;
  window.scrollTo(0, 0);
  history.pushState({ view }, '', '/');
  re();
}

/* Browser back/forward button handler */
window.addEventListener('popstate', async (e) => {
  const view = e.state?.view || 'login';
  if (!S.user || view === 'login') {
    if (S.user) {
      await api('POST', '/api/logout');
      S.user = null; S.submissions = []; S.allSubmissions = [];
    }
    S.view = 'login';
    history.replaceState({ view: 'login' }, '', '/');
  } else {
    S.view = view;
  }
  re();
});

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
  <div class="govt-topbar">
    <div class="govt-topbar-inner">
      <div class="govt-topbar-flag"><div class="f-saffron"></div><div class="f-white"></div><div class="f-green"></div></div>
      <span class="govt-topbar-bold">Government of Tamil Nadu</span>
      <span class="govt-topbar-sep">|</span>
      <span>Official District Collectors Conference Portal</span>
      <span class="govt-topbar-right">DCC 2026</span>
    </div>
  </div>
  <nav class="nav">
    <div class="nav-inner">
      <div style="display:flex;align-items:center;gap:24px">
        <div class="nav-brand">
          <div class="nav-emblem">${TN_LOGO}</div>
          <div class="nav-cm-wrap" title="Thiru. C. Joseph Vijay, Chief Minister of Tamil Nadu">
            <img src="${CM_PHOTO}" alt="Thiru. C. Joseph Vijay" class="nav-cm-photo" />
          </div>
          <div>
            <div class="nav-title">DCC Portal 2026</div>
            <div class="nav-sub">District Collectors Conference</div>
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
    <div class="govt-topbar">
      <div class="govt-topbar-inner">
        <div class="govt-topbar-flag"><div class="f-saffron"></div><div class="f-white"></div><div class="f-green"></div></div>
        <span class="govt-topbar-bold">Government of Tamil Nadu</span>
        <span class="govt-topbar-sep">|</span>
        <span>Official District Collectors Conference Portal</span>
        <span class="govt-topbar-right">DCC 2026</span>
      </div>
    </div>
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
            <div class="login-title">District Collectors Conference</div>
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
      <div class="page-sub">District Collectors Conference 2026 · June 29–30, Secretariat Chennai</div>
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
  S.step = 1; S.formCat = ''; S.formTitle = ''; S.formDetails = ''; S.formDocsLink = '';
  S.formDept = ''; S.formHod = ''; S.formCrossDepts = [];
  S.formBudget = ''; S.formBeneficiaries = ''; S.formTimeline = '';
  S.formRevenueImpact = ''; S.formEvidence = ''; S.formVis = 'open'; S.formCatAnswers = {};
  go('form');
}

function renderForm() {
  const stepLabels = ['Choose Type', 'Headline', 'Specific Details', 'Department & Scale', 'Review & Submit'];
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
    const titlePct     = S.formTitle.length / 100;
    const titleHintCls = !S.formTitle.length ? 'empty' : titlePct < .4 ? 'started' : 'good';
    const titleHintMsg = !S.formTitle.length ? 'Start with a clear, specific title'
                        : titlePct < .4 ? 'Keep going — add more context'
                        : titlePct < .8 ? 'Good — almost there'
                        : 'Perfect length';
    body = `
    <div class="form-step-title">Submission Headline</div>
    <div class="form-step-sub">Give your submission a clear, specific headline — one sentence that captures what it is.</div>
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">Headline <span class="req">*</span></label>
      <input class="form-control" type="text" id="f-title"
             placeholder="E.g. Solar pumps for drought-prone villages in Dindigul"
             maxlength="100" value="${esc(S.formTitle)}"
             oninput="fld('formTitle',this.value,'tc','th',100)" />
      <div class="char-row">
        <span class="char-hint ${titleHintCls}" id="th">${titleHintMsg}</span>
        <span class="char-count" id="tc">${S.formTitle.length}/100</span>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',1)">Back</button>
      <button id="s2-continue" class="btn btn-primary btn-lg" onclick="set('step',3)" ${!S.formTitle.trim() ? 'disabled' : ''}>Continue</button>
    </div>`;

  } else if (S.step === 3) {
    const qs = CAT_QUESTIONS[S.formCat] || [];
    const catInfo = cat(S.formCat);
    body = `
    <div class="form-step-title">About Your ${esc(catInfo.label)}</div>
    <div class="form-step-sub">A few quick questions to help the Secretariat understand context and readiness.</div>
    ${qs.map(q => {
      if (q.multi) {
        const vals = Array.isArray(S.formCatAnswers[q.id]) ? S.formCatAnswers[q.id] : [];
        return `
        <div class="form-group">
          <label class="form-label">${esc(q.label)} <span class="form-hint-inline">(select all that apply)</span></label>
          <div class="cross-dept-grid" style="max-height:none">
            ${q.opts.map(o => `
            <label class="cross-dept-item">
              <input type="checkbox" value="${esc(o)}" ${vals.includes(o) ? 'checked' : ''}
                     onchange="toggleCatMulti('${esc(q.id)}','${esc(o)}',this.checked)" />
              <span>${esc(o)}</span>
            </label>`).join('')}
          </div>
        </div>`;
      }
      return `
      <div class="form-group">
        <label class="form-label">${esc(q.label)}</label>
        <select class="form-control" onchange="S.formCatAnswers['${q.id}']=this.value">
          <option value="">Select an option</option>
          ${q.opts.map(o => `<option ${S.formCatAnswers[q.id] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}
        </select>
      </div>`;
    }).join('')}
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',2)">Back</button>
      <button class="btn btn-primary btn-lg" onclick="set('step',4)">Continue</button>
    </div>`;

  } else if (S.step === 4) {
    const globeSVG = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:${S.formVis === 'open' ? 'var(--p)' : 'var(--g-400)'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    const lockSVG  = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:${S.formVis === 'confidential' ? 'var(--amber)' : 'var(--g-400)'}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`;

    const crossDeptOptions = DEPARTMENTS.filter(d => d !== S.formDept).map(d => `
      <label class="cross-dept-item">
        <input type="checkbox" value="${esc(d)}"
               ${S.formCrossDepts.includes(d) ? 'checked' : ''}
               onchange="toggleCrossDept('${esc(d)}',this.checked)" />
        <span>${esc(d)}</span>
      </label>`).join('');

    body = `
    <div class="form-step-title">Department & Structured Details</div>
    <div class="form-step-sub">Select the department and fill in the structured fields. Add a brief description and any document link at the end.</div>

    <div class="form-section-head">Department</div>
    <div class="form-group">
      <label class="form-label">Primary Department <span class="req">*</span></label>
      <select class="form-control" id="f-dept" onchange="deptChanged(this.value)">
        <option value="">Select department</option>
        ${DEPARTMENTS.map(d => `<option ${S.formDept === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
      </select>
    </div>
    ${S.formDept ? `
    <div class="form-group hod-block">
      <label class="form-label">Head of Department (HOD)</label>
      <input class="form-control" type="text" readonly value="${esc(S.formHod)}" style="background:var(--g-50);color:var(--g-600)" />
      <div class="form-hint">Auto-filled based on primary department</div>
    </div>
    <div class="form-group">
      <label class="form-label">Additional / Cross Departments <span class="form-hint-inline">(optional)</span></label>
      <div class="cross-dept-grid">${crossDeptOptions}</div>
      <div class="form-hint">Select if this submission involves more than one department</div>
    </div>` : ''}

    <div class="form-section-head" style="margin-top:8px">Financials &amp; Scale</div>
    <div class="form-row-2">
      <div class="form-group">
        <label class="form-label">Budget Requested <span class="form-hint-inline">(optional)</span></label>
        <select class="form-control" id="f-budget" onchange="S.formBudget=this.value">
          <option value="">Select budget range</option>
          ${BUDGET_RANGES.map(b => `<option ${S.formBudget === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Expected Beneficiaries <span class="form-hint-inline">(optional)</span></label>
        <select class="form-control" id="f-bene" onchange="S.formBeneficiaries=this.value">
          <option value="">Select beneficiary range</option>
          ${BENEFICIARY_RANGES.map(b => `<option ${S.formBeneficiaries === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="form-section-head">Impact & Timeline</div>
    <div class="form-row-2">
      <div class="form-group">
        <label class="form-label">Timeline / Urgency <span class="form-hint-inline">(optional)</span></label>
        <select class="form-control" id="f-timeline" onchange="S.formTimeline=this.value">
          <option value="">Select timeline</option>
          ${TIMELINES.map(t => `<option ${S.formTimeline === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">District Revenue Impact <span class="form-hint-inline">(optional)</span></label>
        <select class="form-control" id="f-revenue" onchange="S.formRevenueImpact=this.value">
          <option value="">Select impact</option>
          ${REVENUE_IMPACTS.map(r => `<option ${S.formRevenueImpact === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Supporting Evidence Type <span class="form-hint-inline">(optional)</span></label>
      <select class="form-control" id="f-evidence" onchange="S.formEvidence=this.value">
        <option value="">Select evidence type</option>
        ${EVIDENCE_TYPES.map(e => `<option ${S.formEvidence === e ? 'selected' : ''}>${esc(e)}</option>`).join('')}
      </select>
      <div class="form-hint">Select the primary type of evidence backing this submission</div>
    </div>

    <div class="form-section-head">Description &amp; Documents</div>
    <div class="form-group">
      <label class="form-label">Brief Description <span class="form-hint-inline">(optional)</span></label>
      <textarea class="form-control" id="f-details"
                placeholder="What is the problem? What do you need? Keep it concise — 2 to 3 sentences."
                maxlength="400" style="min-height:100px"
                oninput="fld('formDetails',this.value,'dc','dh',400)">${esc(S.formDetails)}</textarea>
      <div class="char-row">
        <span class="char-hint ${!S.formDetails.length ? 'empty' : S.formDetails.length < 80 ? 'started' : 'good'}" id="dh">${!S.formDetails.length ? 'Optional — add context if helpful' : S.formDetails.length < 80 ? 'Add a bit more detail' : 'Good'}</span>
        <span class="char-count" id="dc">${S.formDetails.length}/400</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Supporting Document Link <span class="form-hint-inline">(optional)</span></label>
      <input class="form-control" type="url" id="f-docs"
             placeholder="https://drive.google.com/... or any shared link"
             value="${esc(S.formDocsLink)}"
             oninput="S.formDocsLink=this.value" />
      <div class="form-hint">Google Drive, OneDrive, or SharePoint link to supporting files</div>
    </div>

    <div class="form-section-head">Visibility</div>
    <div class="form-group" style="margin-bottom:0">
      <div class="vis-grid">
        <div class="vis-card ${S.formVis === 'open' ? 'selected-open' : ''}" onclick="set('formVis','open')">
          <div class="vis-icon" style="background:${S.formVis === 'open' ? 'var(--p-100)' : 'var(--g-100)'}">${globeSVG}</div>
          <div class="vis-label">Open</div>
          <div class="vis-desc">Visible to the CM, Chief Secretary, and all senior officials.</div>
        </div>
        <div class="vis-card ${S.formVis === 'confidential' ? 'selected-conf' : ''}" onclick="set('formVis','confidential')">
          <div class="vis-icon" style="background:${S.formVis === 'confidential' ? 'var(--amber-bg)' : 'var(--g-100)'}">${lockSVG}</div>
          <div class="vis-label">Confidential</div>
          <div class="vis-desc">Visible only to the CM and Chief Secretary.</div>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',3)">Back</button>
      <button class="btn btn-primary btn-lg" onclick="set('step',5)" ${!S.formDept ? 'disabled' : ''}>Review</button>
    </div>`;

  } else {
    const crossList = S.formCrossDepts.length ? S.formCrossDepts.join(', ') : '—';
    body = `
    <div class="form-step-title">Review your submission</div>
    <div class="form-step-sub">Everything look right? Hit submit when you're ready.</div>
    <div class="review-block">
      <div class="review-section-label">Submission</div>
      <div class="review-row"><div class="review-key">Type</div><div class="review-val">${catBadge(S.formCat)}</div></div>
      <div class="review-row"><div class="review-key">District</div><div class="review-val">${esc(S.user.district)}</div></div>
      <div class="review-row"><div class="review-key">Role</div><div class="review-val">${esc(S.user.role)}</div></div>
      <div class="review-row"><div class="review-key">Headline</div><div class="review-val" style="font-weight:600">${esc(S.formTitle)}</div></div>
      <div class="review-section-label" style="margin-top:12px">Department</div>
      <div class="review-row"><div class="review-key">Primary Dept.</div><div class="review-val">${esc(S.formDept)}</div></div>
      <div class="review-row"><div class="review-key">HOD</div><div class="review-val">${esc(S.formHod || '—')}</div></div>
      <div class="review-row"><div class="review-key">Cross Depts.</div><div class="review-val">${esc(crossList)}</div></div>
      <div class="review-section-label" style="margin-top:12px">Details</div>
      <div class="review-row"><div class="review-key">Budget Req.</div><div class="review-val">${esc(S.formBudget || '—')}</div></div>
      <div class="review-row"><div class="review-key">Beneficiaries</div><div class="review-val">${esc(S.formBeneficiaries || '—')}</div></div>
      <div class="review-row"><div class="review-key">Timeline</div><div class="review-val">${esc(S.formTimeline || '—')}</div></div>
      <div class="review-row"><div class="review-key">Revenue Impact</div><div class="review-val">${esc(S.formRevenueImpact || '—')}</div></div>
      ${S.formEvidence   ? `<div class="review-row"><div class="review-key">Evidence Type</div><div class="review-val">${esc(S.formEvidence)}</div></div>` : ''}
      ${S.formDetails    ? `<div class="review-row"><div class="review-key">Description</div><div class="review-val">${esc(S.formDetails)}</div></div>` : ''}
      ${S.formDocsLink   ? `<div class="review-row"><div class="review-key">Doc Link</div><div class="review-val"><a href="${esc(S.formDocsLink)}" target="_blank" style="color:var(--p);word-break:break-all">${esc(S.formDocsLink)}</a></div></div>` : ''}
      <div class="review-row"><div class="review-key">Visibility</div><div class="review-val">${visBadge(S.formVis)}</div></div>
      ${(() => {
        const qs = CAT_QUESTIONS[S.formCat] || [];
        const answered = qs.filter(q => {
          const v = S.formCatAnswers[q.id];
          return Array.isArray(v) ? v.length > 0 : v;
        });
        if (!answered.length) return '';
        return `<div class="review-section-label" style="margin-top:12px">Specific Details</div>` +
          answered.map(q => {
            const v = S.formCatAnswers[q.id];
            const display = Array.isArray(v) ? v.join(', ') : v;
            return `<div class="review-row"><div class="review-key" style="font-size:11px">${esc(q.label)}</div><div class="review-val">${esc(display)}</div></div>`;
          }).join('');
      })()}
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="set('step',4)">Back</button>
      <button class="btn btn-primary btn-lg" onclick="submitForm()">Submit to Secretariat</button>
    </div>`;
  }

  return `
  ${renderNav()}
  <div class="form-page">
    <div class="form-progress">
      <div class="progress-steps">${circles}</div>
      <div class="progress-label">Step <span>${S.step} of ${stepLabels.length}</span> — ${stepLabels[S.step - 1]}</div>
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
    <div class="admin-sub-card ${isExp ? 'expanded' : ''}" id="sc-${s.id}" onclick="toggleExpand('${s.id}')">
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
        ${s.evidence   ? `<div class="sub-detail-block"><strong>Evidence Type:</strong> ${esc(s.evidence)}</div>` : ''}
        ${s.docs_link  ? `<div class="sub-detail-block"><strong>Document:</strong> <a href="${esc(s.docs_link)}" target="_blank" style="color:var(--p);word-break:break-all">${esc(s.docs_link)}</a></div>` : ''}
        ${(() => {
          try {
            const cd = s.cat_data ? JSON.parse(s.cat_data) : null;
            if (!cd || !Object.keys(cd).length) return '';
            const qs = CAT_QUESTIONS[s.category] || [];
            const rows = qs.filter(q => {
              const v = cd[q.id]; return Array.isArray(v) ? v.length : v;
            }).map(q => {
              const v = cd[q.id];
              return `<div class="sub-detail-item"><div class="sub-detail-label">${esc(q.label)}</div><div class="sub-detail-val">${esc(Array.isArray(v) ? v.join(', ') : v)}</div></div>`;
            }).join('');
            return rows ? `<div style="margin-top:8px;font-size:10px;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Specific Details</div><div class="sub-detail-grid">${rows}</div>` : '';
          } catch(e) { return ''; }
        })()}
        <div class="sub-detail-grid">
          ${s.hod              ? `<div class="sub-detail-item"><div class="sub-detail-label">HOD</div><div class="sub-detail-val">${esc(s.hod)}</div></div>` : ''}
          ${s.cross_depts      ? `<div class="sub-detail-item"><div class="sub-detail-label">Cross Depts.</div><div class="sub-detail-val">${esc(s.cross_depts)}</div></div>` : ''}
          ${s.budget_requested ? `<div class="sub-detail-item"><div class="sub-detail-label">Budget Req.</div><div class="sub-detail-val">${esc(s.budget_requested)}</div></div>` : ''}
          ${s.beneficiaries    ? `<div class="sub-detail-item"><div class="sub-detail-label">Beneficiaries</div><div class="sub-detail-val">${esc(s.beneficiaries)}</div></div>` : ''}
          ${s.timeline         ? `<div class="sub-detail-item"><div class="sub-detail-label">Timeline</div><div class="sub-detail-val">${esc(s.timeline)}</div></div>` : ''}
          ${s.revenue_impact   ? `<div class="sub-detail-item"><div class="sub-detail-label">Revenue Impact</div><div class="sub-detail-val">${esc(s.revenue_impact)}</div></div>` : ''}
        </div>
        ${s.admin_note ? `<div class="action-note mt-8"><strong>Note:</strong> ${esc(s.admin_note)}</div>` : ''}
        ${s.refer_to   ? `<div class="action-note mt-4"><strong>Referred to:</strong> ${esc(s.refer_to)}</div>` : ''}
      </div>
      <div class="sub-card-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm ${s.status === 'agenda' ? 'btn-primary' : 'btn-secondary'}" onclick="setStatus('${s.id}','agenda')">
          ${s.status === 'agenda' ? 'On Agenda' : '+ Add to Agenda'}
        </button>
        <button class="btn btn-sm btn-secondary" onclick="openReferModal('${s.id}')">Refer to Department</button>
        <button class="btn btn-sm ${s.status === 'noted' ? 'btn-secondary' : 'btn-ghost'}" onclick="setStatus('${s.id}','noted')">
          ${s.status === 'noted' ? 'Noted' : 'Mark as Noted'}
        </button>
        <button class="btn btn-sm btn-ghost" onclick="openNoteModal('${s.id}',${JSON.stringify(esc(s.admin_note || ''))})">
          ${s.admin_note ? 'Edit Note' : '+ Add Note'}
        </button>
        <div style="flex:1"></div>
        <button class="btn btn-sm btn-ghost" onclick="openEditModal('${s.id}')" style="color:var(--p)">Edit</button>
        <button class="btn btn-sm btn-ghost" onclick="deleteSubmission('${s.id}')" style="color:var(--rose)">Delete</button>
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
          <div class="page-sub">District Collectors Conference 2026 · Ideas, requests and initiatives from the field</div>
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
      <div class="agenda-title">District Collectors Conference 2026</div>
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

/* ── DEPARTMENT HELPERS ───────────────────────────────────── */
function deptChanged(val) {
  S.formDept = val;
  S.formHod  = HOD_MAP[val] || '';
  S.formCrossDepts = S.formCrossDepts.filter(d => d !== val);
  re();
}
function toggleCatMulti(qid, val, checked) {
  const arr = Array.isArray(S.formCatAnswers[qid]) ? S.formCatAnswers[qid] : [];
  if (checked) { if (!arr.includes(val)) arr.push(val); }
  else { const i = arr.indexOf(val); if (i >= 0) arr.splice(i, 1); }
  S.formCatAnswers[qid] = arr;
}
function toggleCrossDept(dept, checked) {
  if (checked) {
    if (!S.formCrossDepts.includes(dept)) S.formCrossDepts.push(dept);
  } else {
    S.formCrossDepts = S.formCrossDepts.filter(d => d !== dept);
  }
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
    const ok = S.formTitle.trim();
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
    category:         S.formCat,
    title:            S.formTitle,
    details:          S.formDetails,
    department:       S.formDept,
    hod:              S.formHod,
    cross_depts:      S.formCrossDepts.join(', '),
    budget_requested: S.formBudget,
    beneficiaries:    S.formBeneficiaries,
    timeline:         S.formTimeline,
    revenue_impact:   S.formRevenueImpact,
    evidence:         S.formEvidence,
    docs_link:        S.formDocsLink,
    visibility:       S.formVis,
    cat_data:         JSON.stringify(S.formCatAnswers),
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
  /* Seed login as the base history entry so back always reaches it */
  history.replaceState({ view: 'login' }, '', '/');

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


