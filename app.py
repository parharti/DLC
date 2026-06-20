from flask import Flask, request, jsonify, session, render_template
import sqlite3
import hashlib
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'dlc-portal-2026-tn-secretariat-secret'

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dlc.db')

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
        'details': 'We have implemented an IoT-based smart street light management system across 50 municipal wards in Coimbatore. The system has reduced energy consumption by 40% and average maintenance response time from 72 hours to under 4 hours. We are requesting assistance in scaling this to the remaining 30 wards and a formal GO enabling other ULBs across Tamil Nadu to adopt this model.',
        'department': 'Urban Local Bodies', 'visibility': 'open', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 17'
    },
    {
        'district': 'Madurai', 'role': 'SP', 'category': 'laworder',
        'title': 'Women Safety Night Patrol Enhancement',
        'details': 'Madurai district has recorded a 23% increase in late-night harassment incidents over the past six months. We request 3 additional patrol vehicles with women constables for dedicated night duty across 8 high-risk zones identified through crime-pattern mapping. We also seek a policy directive enabling SPs to redeploy constables from non-critical duties during peak hours without administrative delays.',
        'department': 'Home (Police)', 'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'Discussed with DGP. To be raised in Day 1 afternoon session.', 'created_at': 'Jun 17'
    },
    {
        'district': 'Salem', 'role': 'Collector', 'category': 'resource',
        'title': 'Data Entry Operators for PM-KISAN Aadhaar Verification',
        'details': 'Salem district has 1,84,000 pending PM-KISAN beneficiary verifications due to Aadhaar seeding errors. Our current 12 data entry operators cannot clear the backlog within the deadline. We request 40 additional DEOs on deputation for 3 months and a portal access window extension to 24 hours.',
        'department': 'Agriculture', 'visibility': 'open', 'status': 'referred',
        'refer_to': 'Agriculture Secretary', 'admin_note': '', 'created_at': 'Jun 16'
    },
    {
        'district': 'Tirunelveli', 'role': 'Collector', 'category': 'best',
        'title': 'Doorstep Welfare Services for Senior Citizens',
        'details': 'We have deployed mobile service units that visit elderly and differently-abled beneficiaries at home to complete scheme enrollment, certificate issuance, and pension renewal. 6,200 senior citizens have been served in 4 months without a single government office visit. The model requires 2 vehicles per taluk with trained volunteers. We request this to be formalised through a GO and replicated statewide.',
        'department': 'Social Welfare', 'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'CM has expressed strong interest. Include in Day 2 best practices showcase.', 'created_at': 'Jun 15'
    },
    {
        'district': 'Vellore', 'role': 'Collector', 'category': 'policy',
        'title': 'CMCHIS Enrollment Window — Amendment for Migrant Families',
        'details': 'The current CMCHIS enrollment window of 3 months is insufficient for migrant worker families who return to Vellore seasonally. By the time they return, the window has closed. We request an amendment allowing year-round enrollment with a 6-month grace period for documented migrant families. An estimated 22,000 families in Vellore are currently excluded.',
        'department': 'Health & Family Welfare', 'visibility': 'open', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 18'
    },
    {
        'district': 'Chennai', 'role': 'Collector', 'category': 'coord',
        'title': 'Revenue-Health Department Income Certificate Delay',
        'details': 'CMCHIS and several other health schemes require income certificates issued by Revenue department. The average turnaround time is 28 days. Health Department issues, on average, 4,200 rejections per month due to expired certificates. We propose a digital integration between Revenue and Health department portals for real-time certificate validation, eliminating the need for physical certificates.',
        'department': 'Revenue', 'visibility': 'open', 'status': 'noted',
        'refer_to': '', 'admin_note': 'NIC to evaluate feasibility. CS to follow up with IT Secretary.', 'created_at': 'Jun 16'
    },
    {
        'district': 'Thanjavur', 'role': 'Collector', 'category': 'lastmile',
        'title': 'PM-KISAN Aadhaar Linkage Blocking 12,000 Farmers',
        'details': 'In Thanjavur, 12,374 farmers are unable to receive PM-KISAN transfers due to incorrect Aadhaar linkages caused by data entry errors from 2020-21 survey. These farmers have valid land records and are eligible but are excluded from the system. Current correction process requires physical visits to Block Agriculture Office and takes 45-60 days. We request a fast-track correction camp mechanism.',
        'department': 'Agriculture', 'visibility': 'confidential', 'status': 'pending',
        'refer_to': '', 'admin_note': '', 'created_at': 'Jun 18'
    },
    {
        'district': 'Coimbatore', 'role': 'SP', 'category': 'pilot',
        'title': 'Predictive Crime Analytics Pilot',
        'details': 'We propose a 6-month pilot of a data analytics dashboard for crime prevention in Coimbatore district. Using historical FIR data, time-of-day patterns, and geographic clustering, we can predict high-risk zones 48 hours in advance and pre-position patrol units. We have partnered with IIT Madurai for the analytics engine. We need approval to share anonymized crime data with the academic partner and Rs. 12L for hardware.',
        'department': 'Home (Police)', 'visibility': 'open', 'status': 'agenda',
        'refer_to': '', 'admin_note': 'DGP to review. Potential state rollout if pilot succeeds.', 'created_at': 'Jun 17'
    },
]


def hash_secret(s):
    return hashlib.sha256(s.encode()).hexdigest()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS officers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT NOT NULL,
        role TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        UNIQUE(district, role)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT NOT NULL,
        role TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        details TEXT NOT NULL,
        department TEXT NOT NULL,
        visibility TEXT NOT NULL DEFAULT 'open',
        status TEXT NOT NULL DEFAULT 'pending',
        refer_to TEXT DEFAULT '',
        admin_note TEXT DEFAULT '',
        created_at TEXT NOT NULL
    )''')

    # Seed admin user (demo: admin / admin123)
    c.execute('INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
              ('admin', hash_secret('admin123')))

    # Seed officer PINs — default PIN is 1234 for all districts/roles
    for district in DISTRICTS:
        for role in ['Collector', 'SP']:
            c.execute('INSERT OR IGNORE INTO officers (district, role, pin_hash) VALUES (?, ?, ?)',
                      (district, role, hash_secret('1234')))

    # Seed sample submissions only if table is empty
    count = c.execute('SELECT COUNT(*) FROM submissions').fetchone()[0]
    if count == 0:
        for sub in SAMPLE_SUBMISSIONS:
            c.execute(
                '''INSERT INTO submissions
                   (district, role, category, title, details, department, visibility, status, refer_to, admin_note, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sub['district'], sub['role'], sub['category'], sub['title'], sub['details'],
                 sub['department'], sub['visibility'], sub['status'], sub['refer_to'],
                 sub['admin_note'], sub['created_at'])
            )

    conn.commit()
    conn.close()


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

    conn = get_db()
    officer = conn.execute(
        'SELECT * FROM officers WHERE district=? AND role=?', (district, role)
    ).fetchone()
    conn.close()

    if not officer:
        return jsonify({'ok': False, 'error': 'Officer record not found.'}), 404

    if officer['pin_hash'] != hash_secret(pin):
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

    conn = get_db()
    admin = conn.execute(
        'SELECT * FROM admin_users WHERE username=?', (username,)
    ).fetchone()
    conn.close()

    if not admin or admin['password_hash'] != hash_secret(password):
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
    conn = get_db()

    if user['type'] == 'officer':
        rows = conn.execute(
            'SELECT * FROM submissions WHERE district=? AND role=? ORDER BY id DESC',
            (user['district'], user['role'])
        ).fetchall()
        conn.close()
        return jsonify({'ok': True, 'submissions': [dict(r) for r in rows]})

    # Admin: fetch all, plus filtered subset
    cat = request.args.get('category', '')
    dist = request.args.get('district', '')
    status = request.args.get('status', '')
    vis = request.args.get('visibility', '')

    # Always return all for stats, apply filters separately
    all_rows = conn.execute('SELECT * FROM submissions ORDER BY id DESC').fetchall()
    all_subs = [dict(r) for r in all_rows]

    # Apply filters
    filtered = all_subs
    if cat:
        filtered = [s for s in filtered if s['category'] == cat]
    if dist:
        filtered = [s for s in filtered if s['district'] == dist]
    if status:
        filtered = [s for s in filtered if s['status'] == status]
    if vis:
        filtered = [s for s in filtered if s['visibility'] == vis]

    conn.close()
    return jsonify({'ok': True, 'submissions': filtered, 'all': all_subs})


@app.route('/api/submissions', methods=['POST'])
def create_submission():
    if 'user' not in session or session['user']['type'] != 'officer':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    user = session['user']
    data = request.get_json() or {}

    for field in ('category', 'title', 'details', 'department', 'visibility'):
        if not data.get(field, '').strip():
            return jsonify({'ok': False, 'error': f'Field "{field}" is required.'}), 400

    now = datetime.now()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    date_str = f"{months[now.month - 1]} {now.day}"

    conn = get_db()
    cursor = conn.execute(
        '''INSERT INTO submissions
           (district, role, category, title, details, department, visibility, status, refer_to, admin_note, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', '', '', ?)''',
        (user['district'], user['role'],
         data['category'], data['title'].strip(), data['details'].strip(),
         data['department'], data['visibility'], date_str)
    )
    sub_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'ok': True, 'id': sub_id})


@app.route('/api/submissions/<int:sub_id>/status', methods=['PATCH'])
def update_status(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}
    status = data.get('status', '')

    if status not in ('pending', 'agenda', 'referred', 'noted'):
        return jsonify({'ok': False, 'error': 'Invalid status.'}), 400

    conn = get_db()
    conn.execute('UPDATE submissions SET status=? WHERE id=?', (status, sub_id))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/submissions/<int:sub_id>/refer', methods=['PATCH'])
def refer_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}
    refer_to = data.get('refer_to', '').strip()

    if not refer_to:
        return jsonify({'ok': False, 'error': 'Please select a department.'}), 400

    conn = get_db()
    conn.execute(
        'UPDATE submissions SET status="referred", refer_to=? WHERE id=?',
        (refer_to, sub_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/submissions/<int:sub_id>/note', methods=['PATCH'])
def update_note(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}
    note = data.get('note', '')

    conn = get_db()
    conn.execute('UPDATE submissions SET admin_note=? WHERE id=?', (note, sub_id))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/submissions/<int:sub_id>', methods=['DELETE'])
def delete_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    conn = get_db()
    conn.execute('DELETE FROM submissions WHERE id=?', (sub_id,))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/submissions/<int:sub_id>', methods=['PUT'])
def edit_submission(sub_id):
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    data = request.get_json() or {}

    for field in ('title', 'details', 'department', 'category', 'visibility'):
        if not data.get(field, '').strip():
            return jsonify({'ok': False, 'error': f'Field "{field}" is required.'}), 400

    conn = get_db()
    conn.execute(
        '''UPDATE submissions SET title=?, details=?, department=?, category=?, visibility=? WHERE id=?''',
        (data['title'].strip(), data['details'].strip(), data['department'],
         data['category'], data['visibility'], sub_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/submissions/export')
def export_submissions():
    if 'user' not in session or session['user']['type'] != 'admin':
        return jsonify({'ok': False, 'error': 'Not authorized.'}), 403

    conn = get_db()
    rows = conn.execute('SELECT * FROM submissions ORDER BY id DESC').fetchall()
    conn.close()

    lines = ['ID,District,Role,Category,Title,Department,Visibility,Status,Referred To,Admin Note,Date']
    for r in rows:
        def esc_csv(v):
            v = str(v or '')
            if ',' in v or '"' in v or '\n' in v:
                v = '"' + v.replace('"', '""') + '"'
            return v
        lines.append(','.join(esc_csv(r[f]) for f in
                               ['id', 'district', 'role', 'category', 'title', 'department',
                                'visibility', 'status', 'refer_to', 'admin_note', 'created_at']))

    from flask import Response
    return Response(
        '\n'.join(lines),
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=dlc-submissions.csv'}
    )


if __name__ == '__main__':
    init_db()
    print('\n  DLC Portal 2026 — Tamil Nadu')
    print('  Running at http://127.0.0.1:5000\n')
    print('  Demo credentials:')
    print('  Officer  — select any district, role Collector, PIN: 1234')
    print('  Admin    — username: admin  password: admin123\n')
    app.run(debug=True, port=5000)
