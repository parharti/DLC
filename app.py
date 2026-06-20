from flask import Flask, request, jsonify, session, render_template, Response
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
import hashlib, os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'DCC-portal-2026-tn-secretariat-secret')

@app.after_request
def add_charset(response):
    ct = response.content_type
    if 'javascript' in ct and 'charset' not in ct:
        response.content_type = ct + '; charset=utf-8'
    return response

@app.route('/favicon.ico')
def favicon():
    return '', 204

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://elections:admin123@cluster0.shqc6nw.mongodb.net/?appName=Cluster0')
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client.DCC_portal

DISTRICTS = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanniyakumari', 'Karur',
    'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
    'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
    'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
    'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
    'Villupuram', 'Virudhunagar'
]

SAMPLE_SUBMISSIONS = [
    {
        'district': 'Coimbatore', 'role': 'Collector', 'category': 'flagship',
        'title': 'Smart Street Light Management System',
        'details': 'IoT-based system reduces energy by 40% and maintenance response from 72 hrs to 4 hrs across 50 wards. Requesting scale-up GO for remaining 30 wards.',
        'department': 'Urban Local Bodies',
        'hod': 'Commissioner of Municipal Administration',
        'cross_depts': 'Energy, IT & Digital Services',
        'budget_requested': '₹25 Lakhs – ₹1 Crore',
        'beneficiaries': '10,000 – 1 Lakh persons',
        'timeline': 'Short-term (1–3 months)',
        'revenue_impact': 'Positive — increases district revenue / savings',
        'evidence': 'Field inspection report',
        'docs_link': '',
        'visibility': 'open', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 17',
    },
    {
        'district': 'Madurai', 'role': 'SP', 'category': 'laworder',
        'title': 'Women Safety Night Patrol Enhancement',
        'details': '23% rise in late-night harassment. Need 3 patrol vehicles with women constables for 8 high-risk zones. Seek policy for SP redeployment flexibility.',
        'department': 'Home (Police)',
        'hod': 'Director General of Police (DGP)',
        'cross_depts': '',
        'budget_requested': '₹1 Crore – ₹5 Crores',
        'beneficiaries': '1,000 – 10,000 persons',
        'timeline': 'Immediate (within 30 days)',
        'revenue_impact': 'Neutral — no significant revenue impact',
        'evidence': 'Citizen grievance data (CPGRAMS / portal)',
        'docs_link': '',
        'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'Discussed with DGP. To be raised in Day 1 afternoon session.', 'created_at': 'Jun 17',
    },
    {
        'district': 'Salem', 'role': 'Collector', 'category': 'resource',
        'title': 'Data Entry Operators for PM-KISAN Aadhaar Verification',
        'details': '1,84,000 pending verifications; only 12 DEOs. Requesting 40 additional DEOs on deputation for 3 months and 24-hr portal window.',
        'department': 'Agriculture',
        'hod': 'Director of Agriculture',
        'cross_depts': 'IT & Digital Services',
        'budget_requested': '₹5 Lakhs – ₹25 Lakhs',
        'beneficiaries': '1 Lakh – 10 Lakh persons',
        'timeline': 'Immediate (within 30 days)',
        'revenue_impact': 'Negative — requires additional expenditure',
        'evidence': 'Revenue / expenditure records',
        'docs_link': '',
        'visibility': 'open', 'status': 'referred',
        'refer_to': 'Agriculture Secretary', 'admin_note': '', 'created_at': 'Jun 16',
    },
    {
        'district': 'Tirunelveli', 'role': 'Collector', 'category': 'best',
        'title': 'Doorstep Welfare Services for Senior Citizens',
        'details': '6,200 senior citizens served at home via mobile units in 4 months. Zero office visits. Requesting formal GO and statewide replication.',
        'department': 'Social Welfare',
        'hod': 'Director of Social Welfare & Nutritious Meal Programme',
        'cross_depts': 'Health & Family Welfare, Revenue',
        'budget_requested': 'Under ₹1 Lakh',
        'beneficiaries': '1,000 – 10,000 persons',
        'timeline': 'Short-term (1–3 months)',
        'revenue_impact': 'Positive — increases district revenue / savings',
        'evidence': 'Best practice from another district / state',
        'docs_link': '',
        'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'CM has expressed strong interest. Include in Day 2 best practices showcase.', 'created_at': 'Jun 15',
    },
    {
        'district': 'Vellore', 'role': 'Collector', 'category': 'policy',
        'title': 'CMCHIS Enrollment Window — Amendment for Migrant Families',
        'details': '22,000 migrant families excluded from CMCHIS due to 3-month window. Requesting year-round enrollment with 6-month grace period for documented migrants.',
        'department': 'Health & Family Welfare',
        'hod': 'Director of Public Health & Preventive Medicine',
        'cross_depts': 'Labour, Social Welfare',
        'budget_requested': 'No Budget Required',
        'beneficiaries': '10,000 – 1 Lakh persons',
        'timeline': 'Medium-term (3–6 months)',
        'revenue_impact': 'Neutral — no significant revenue impact',
        'evidence': 'District survey / census data',
        'docs_link': '',
        'visibility': 'open', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 18',
    },
    {
        'district': 'Chennai', 'role': 'Collector', 'category': 'coord',
        'title': 'Revenue-Health Department Income Certificate Delay',
        'details': 'Average 28-day turnaround causing 4,200 rejections/month. Proposing real-time digital integration between Revenue and Health portals.',
        'department': 'Revenue',
        'hod': 'Commissioner of Revenue Administration',
        'cross_depts': 'Health & Family Welfare, IT & Digital Services',
        'budget_requested': '₹5 Lakhs – ₹25 Lakhs',
        'beneficiaries': 'Above 10 Lakh persons',
        'timeline': 'Medium-term (3–6 months)',
        'revenue_impact': 'Positive — increases district revenue / savings',
        'evidence': 'Inter-departmental communication / minutes',
        'docs_link': '',
        'visibility': 'open', 'status': 'noted',
        'refer_to': '', 'admin_note': 'NIC to evaluate feasibility. CS to follow up with IT Secretary.', 'created_at': 'Jun 16',
    },
    {
        'district': 'Thanjavur', 'role': 'Collector', 'category': 'lastmile',
        'title': 'PM-KISAN Aadhaar Linkage Blocking 12,000 Farmers',
        'details': '12,374 farmers excluded due to 2020-21 survey data errors. Current correction takes 45-60 days. Requesting fast-track correction camp mechanism.',
        'department': 'Agriculture',
        'hod': 'Director of Agriculture',
        'cross_depts': 'Revenue, IT & Digital Services',
        'budget_requested': 'Under ₹1 Lakh',
        'beneficiaries': '10,000 – 1 Lakh persons',
        'timeline': 'Immediate (within 30 days)',
        'revenue_impact': 'Neutral — no significant revenue impact',
        'evidence': 'Revenue / expenditure records',
        'docs_link': '',
        'visibility': 'confidential', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 18',
    },
    {
        'district': 'Coimbatore', 'role': 'SP', 'category': 'pilot',
        'title': 'Predictive Crime Analytics Pilot',
        'details': '6-month pilot using historical FIR data + geo-clustering to pre-position patrol units. IIT Madurai partnership. Need data-sharing approval + ₹12L hardware budget.',
        'department': 'Home (Police)',
        'hod': 'Director General of Police (DGP)',
        'cross_depts': 'IT & Digital Services',
        'budget_requested': 'Under ₹1 Lakh',
        'beneficiaries': 'Entire District',
        'timeline': 'Short-term (1–3 months)',
        'revenue_impact': 'Neutral — no significant revenue impact',
        'evidence': 'Scientific or technical study',
        'docs_link': '',
        'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'DGP to review. Potential state rollout if pilot succeeds.', 'created_at': 'Jun 17',
    },
]


def sha(s):
    return hashlib.sha256(str(s).encode()).hexdigest()


def serialize(doc):
    if doc is None:
        return None
    d = dict(doc)
    d['id'] = str(d.pop('_id'))
    return d


def get_oid(sub_id):
    try:
        return ObjectId(sub_id)
    except Exception:
        return None


def init_db():
    if db.admin_users.count_documents({'username': 'admin'}) == 0:
        db.admin_users.insert_one({'username': 'admin', 'password_hash': sha('admin123')})

    for district in DISTRICTS:
        for role in ['Collector', 'SP']:
            db.officers.update_one(
                {'district': district, 'role': role},
                {'$setOnInsert': {'pin_hash': sha('1234')}},
                upsert=True
            )

    if db.submissions.count_documents({}) == 0:
        db.submissions.insert_many(SAMPLE_SUBMISSIONS)


# ── ROUTES ────────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/session')
def get_session():
    if 'user' in session:
        return jsonify({'ok': True, 'user': session['user']})
    return jsonify({'ok': False})


@app.route('/api/login/officer', methods=['POST'])
def officer_login():
    data = request.get_json() or {}
    district = data.get('district', '').strip()
    role = data.get('role', '').strip()
    pin = data.get('pin', '').strip()

    if not district or not role or not pin:
        return jsonify({'ok': False, 'error': 'All fields are required.'}), 400

    officer = db.officers.find_one({'district': district, 'role': role})
    if not officer:
        return jsonify({'ok': False, 'error': 'Officer record not found.'}), 404
    if officer['pin_hash'] != sha(pin):
        return jsonify({'ok': False, 'error': 'Incorrect PIN. Please try again.'}), 401

    session['user'] = {'type': 'officer', 'district': district, 'role': role}
    return jsonify({'ok': True, 'user': session['user']})


@app.route('/api/login/admin', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'ok': False, 'error': 'Username and password are required.'}), 400

    admin = db.admin_users.find_one({'username': username})
    if not admin or admin['password_hash'] != sha(password):
        return jsonify({'ok': False, 'error': 'Invalid credentials.'}), 401

    session['user'] = {'type': 'admin', 'name': 'Chief Secretary Office'}
    return jsonify({'ok': True, 'user': session['user']})


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'ok': True})


@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    if 'user' not in session:
        return jsonify({'ok': False, 'error': 'Not authenticated.'}), 401

    user = session['user']

    if user['type'] == 'officer':
        docs = db.submissions.find(
            {'district': user['district'], 'role': user['role']}
        ).sort('_id', DESCENDING)
        return jsonify({'ok': True, 'submissions': [serialize(d) for d in docs]})

    # Admin: return all + filtered
    cat    = request.args.get('category', '')
    dist   = request.args.get('district', '')
    status = request.args.get('status', '')
    vis    = request.args.get('visibility', '')

    all_subs = [serialize(d) for d in db.submissions.find().sort('_id', DESCENDING)]

    filtered = all_subs
    if cat:    filtered = [s for s in filtered if s.get('category')   == cat]
    if dist:   filtered = [s for s in filtered if s.get('district')   == dist]
    if status: filtered = [s for s in filtered if s.get('status')     == status]
    if vis:    filtered = [s for s in filtered if s.get('visibility') == vis]

    return jsonify({'ok': True, 'submissions': filtered, 'all': all_subs})


@app.route('/api/submissions', methods=['POST'])
def create_submission():
    if 'user' not in session or session['user']['type'] != 'officer':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    user = session['user']
    data = request.get_json() or {}

    for field in ('category', 'title', 'department', 'visibility'):
        if not data.get(field, '').strip():
            return jsonify({'ok': False, 'error': f'Field "{field}" is required.'}), 400

    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    now = datetime.now()

    doc = {
        'district':        user['district'],
        'role':            user['role'],
        'category':        data['category'],
        'title':           data['title'].strip(),
        'details':         data.get('details', '').strip(),
        'department':      data['department'],
        'hod':             data.get('hod', ''),
        'cross_depts':     data.get('cross_depts', ''),
        'budget_requested':data.get('budget_requested', ''),
        'beneficiaries':   data.get('beneficiaries', ''),
        'timeline':        data.get('timeline', ''),
        'revenue_impact':  data.get('revenue_impact', ''),
        'evidence':        data.get('evidence', ''),
        'docs_link':       data.get('docs_link', ''),
        'visibility':      data['visibility'],
        'cat_data':        data.get('cat_data', ''),
        'status':          'pending',
        'refer_to':        '',
        'admin_note':      '',
        'created_at':      f"{months[now.month-1]} {now.day}",
    }
    result = db.submissions.insert_one(doc)
    return jsonify({'ok': True, 'id': str(result.inserted_id)})


@app.route('/api/submissions/export')
def export_submissions():
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    all_subs = [serialize(d) for d in db.submissions.find().sort('_id', DESCENDING)]

    FIELDS  = ['id','district','role','category','title','department','hod','cross_depts',
               'budget_requested','beneficiaries','timeline','revenue_impact','evidence',
               'docs_link','details','cat_data','visibility','status','refer_to','admin_note','created_at']
    HEADERS = ['ID','District','Role','Category','Title','Department','HOD','Cross Departments',
               'Budget Requested','Beneficiaries','Timeline','Revenue Impact','Evidence Type',
               'Document Link','Description','Category Details','Visibility','Status','Referred To','Admin Note','Date']

    def esc_csv(v):
        v = str(v or '')
        if ',' in v or '"' in v or '\n' in v:
            v = '"' + v.replace('"', '""') + '"'
        return v

    lines = [','.join(HEADERS)]
    for s in all_subs:
        lines.append(','.join(esc_csv(s.get(f, '')) for f in FIELDS))

    return Response(
        '\n'.join(lines),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=DCC-submissions.csv'}
    )


@app.route('/api/submissions/<sub_id>/status', methods=['PATCH'])
def update_status(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data   = request.get_json() or {}
    status = data.get('status', '')
    if status not in ('pending', 'agenda', 'referred', 'noted'):
        return jsonify({'ok': False, 'error': 'Invalid status.'}), 400

    oid = get_oid(sub_id)
    if not oid:
        return jsonify({'ok': False, 'error': 'Invalid submission ID.'}), 400

    db.submissions.update_one({'_id': oid}, {'$set': {'status': status}})
    return jsonify({'ok': True})


@app.route('/api/submissions/<sub_id>/refer', methods=['PATCH'])
def refer_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data     = request.get_json() or {}
    refer_to = data.get('refer_to', '').strip()
    if not refer_to:
        return jsonify({'ok': False, 'error': 'Please select a department.'}), 400

    oid = get_oid(sub_id)
    if not oid:
        return jsonify({'ok': False, 'error': 'Invalid submission ID.'}), 400

    db.submissions.update_one({'_id': oid}, {'$set': {'status': 'referred', 'refer_to': refer_to}})
    return jsonify({'ok': True})


@app.route('/api/submissions/<sub_id>/note', methods=['PATCH'])
def update_note(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}
    note = data.get('note', '')

    oid = get_oid(sub_id)
    if not oid:
        return jsonify({'ok': False, 'error': 'Invalid submission ID.'}), 400

    db.submissions.update_one({'_id': oid}, {'$set': {'admin_note': note}})
    return jsonify({'ok': True})


@app.route('/api/submissions/<sub_id>', methods=['DELETE'])
def delete_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    oid = get_oid(sub_id)
    if not oid:
        return jsonify({'ok': False, 'error': 'Invalid submission ID.'}), 400

    db.submissions.delete_one({'_id': oid})
    return jsonify({'ok': True})


@app.route('/api/submissions/<sub_id>', methods=['PUT'])
def edit_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}
    for field in ('title', 'department', 'category', 'visibility'):
        if not data.get(field, '').strip():
            return jsonify({'ok': False, 'error': f'Field "{field}" is required.'}), 400

    oid = get_oid(sub_id)
    if not oid:
        return jsonify({'ok': False, 'error': 'Invalid submission ID.'}), 400

    db.submissions.update_one({'_id': oid}, {'$set': {
        'title':            data['title'].strip(),
        'details':          data.get('details', '').strip(),
        'department':       data['department'],
        'hod':              data.get('hod', ''),
        'cross_depts':      data.get('cross_depts', ''),
        'budget_requested': data.get('budget_requested', ''),
        'beneficiaries':    data.get('beneficiaries', ''),
        'timeline':         data.get('timeline', ''),
        'revenue_impact':   data.get('revenue_impact', ''),
        'evidence':         data.get('evidence', ''),
        'docs_link':        data.get('docs_link', ''),
        'category':         data['category'],
        'visibility':       data['visibility'],
    }})
    return jsonify({'ok': True})


if __name__ == '__main__':
    init_db()
    print('\n  DCC Portal 2026 — Tamil Nadu')
    print(f'  MongoDB: {MONGO_URI}')
    print('  Running at http://127.0.0.1:5000\n')
    print('  Officer — any district, PIN: 1234')
    print('  Admin   — admin / admin123\n')
    app.run(debug=True, port=5000)
