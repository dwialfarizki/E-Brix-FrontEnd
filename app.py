import os
import random
import time
from flask import Flask, render_template, request, jsonify, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'ebrix-sugarcane-secret-key-2026'

# Dummy Database State in Memory for demonstration
PETUGAS_DB = [
    {"id": 1, "nama": "Ahmad Subagyo", "email": "ahmad@ebrix.id", "role": "Petugas Lapangan", "status": "Aktif", "wilayah": "Petak A1 - Kendal"},
    {"id": 2, "nama": "Budi Santoso", "email": "budi@ebrix.id", "role": "Petugas Lapangan", "status": "Aktif", "wilayah": "Petak B2 - Sragen"},
    {"id": 3, "nama": "Citra Dewi", "email": "citra@ebrix.id", "role": "Agronomis", "status": "Aktif", "wilayah": "Petak C1 - Malang"},
    {"id": 4, "nama": "Dedi Kurniawan", "email": "dedi@gmail.com", "role": "Petugas Lapangan", "status": "Pending", "wilayah": "Petak D3 - Pati"},
    {"id": 5, "nama": "Eka Saputra", "email": "eka@gmail.com", "role": "Petugas Lapangan", "status": "Pending", "wilayah": "Petak A2 - Kendal"},
    {"id": 6, "nama": "Fajar Utama", "email": "fajar@ebrix.id", "role": "Petugas Lapangan", "status": "Arsip", "wilayah": "Petak B1 - Sragen"}
]

EXISTING_POLYGONS = [
    {
        "id": "POL-101",
        "name": "Lahan A-101 (Kendal Utara)",
        "coordinates": [[-6.912, 110.198], [-6.912, 110.205], [-6.918, 110.205], [-6.918, 110.198]]
    },
    {
        "id": "POL-102",
        "name": "Lahan B-202 (Sragen Timur)",
        "coordinates": [[-7.425, 111.018], [-7.425, 111.028], [-7.432, 111.028], [-7.432, 111.018]]
    }
]

# ---------------------------------------------------------
# Web Page Routes (Jinja2 Templates)
# ---------------------------------------------------------

@app.route('/login')
def login():
    """Halaman Login Pengguna & Admin / Operator"""
    return render_template('login.html')

@app.route('/forgot-password')
def forgot_password():
    """Halaman Lupa Password & Verifikasi OTP"""
    return render_template('forgot_password.html')

@app.route('/logout')
def logout():
    """Proses Logout Pengguna"""
    session.clear()
    return redirect(url_for('login'))

@app.route('/switch-role/<role_name>')
def switch_role(role_name):
    """Instant Role Switcher antara Admin dan Operator"""
    if role_name in ['Admin', 'Operator']:
        session['user_role'] = role_name
    return redirect(url_for('index'))

@app.route('/')
def index():
    """Dashboard Utama / Beranda Admin & Operator"""
    user_role = session.get('user_role', 'Admin')
    return render_template('index.html', active_page='dashboard', role=user_role)

@app.route('/kelola-wilayah')
def kelola_wilayah():
    """Menu 1: Kelola Wilayah (GIS & Boundary Polygon Management)"""
    user_role = session.get('user_role', 'Admin')
    return render_template('kelola_wilayah.html', active_page='wilayah', role=user_role)

@app.route('/kelola-petugas')
def kelola_petugas():
    """Menu 2: Kelola Petugas (User Management & Approval/Soft Delete)"""
    user_role = session.get('user_role', 'Admin')
    return render_template('kelola_petugas.html', active_page='petugas', role=user_role)

@app.route('/peta-kematangan')
def peta_kematangan():
    """Menu 3: Peta Kematangan Brix (GEE Heatmap & Interactive Sampling Points)"""
    user_role = session.get('user_role', 'Admin')
    return render_template('peta_kematangan.html', active_page='peta', role=user_role)

@app.route('/analisis-data')
def analisis_data():
    """Menu 4: Analisis Data (Numerical Analytics, Line/Bar Chart & Audit Logs)"""
    user_role = session.get('user_role', 'Admin')
    return render_template('analisis_data.html', active_page='analisis', role=user_role)

# Backward compatibility routes
@app.route('/calculator')
def calculator():
    user_role = session.get('user_role', 'Admin')
    return render_template('calculator.html', active_page='calculator', role=user_role)

@app.route('/monitoring')
def monitoring():
    user_role = session.get('user_role', 'Admin')
    return render_template('peta_kematangan.html', active_page='peta', role=user_role)

@app.route('/varieties')
def varieties():
    user_role = session.get('user_role', 'Admin')
    return render_template('varieties.html', active_page='varieties', role=user_role)

@app.route('/logs')
def logs():
    user_role = session.get('user_role', 'Admin')
    return render_template('analisis_data.html', active_page='analisis', role=user_role)

# ---------------------------------------------------------
# REST API Endpoints (JSON Operations)
# ---------------------------------------------------------

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    username = data.get('username', '')
    password = data.get('password', '')
    role = data.get('role', 'Admin')

    # Allow both Admin and Operator roles
    session['user_role'] = role
    session['username'] = username if username else role.lower()

    return jsonify({
        "status": "success",
        "message": f"Login berhasil! Selamat datang {role}.",
        "role": role,
        "redirect": url_for('index')
    })

@app.route('/api/auth/send-otp', methods=['POST'])
def api_send_otp():
    data = request.get_json() or {}
    email = data.get('email', '')
    if not email:
        return jsonify({"status": "error", "message": "Email wajib diisi!"}), 400
    
    # Store simulated OTP in session
    session['otp_code'] = '123456'
    session['otp_time'] = time.time()
    return jsonify({"status": "success", "message": f"Kode OTP telah dikirim ke email {email}"})

@app.route('/api/auth/verify-otp', methods=['POST'])
def api_verify_otp():
    data = request.get_json() or {}
    otp = data.get('otp', '')
    
    # Validation logic from flowchart
    if otp != '123456':
        return jsonify({"status": "error", "message": "Kode OTP Salah atau telah Kadaluarsa! Silakan coba lagi."}), 400
    
    return jsonify({"status": "success", "message": "Kode OTP Valid!"})

@app.route('/api/auth/reset-password', methods=['POST'])
def api_reset_password():
    data = request.get_json() or {}
    new_password = data.get('password', '')
    if len(new_password) < 6:
        return jsonify({"status": "error", "message": "Password minimal 6 karakter!"}), 400
    return jsonify({"status": "success", "message": "Password berhasil diperbarui. Silakan login kembali."})

@app.route('/api/petugas/list', methods=['GET'])
def api_get_petugas():
    return jsonify({"status": "success", "data": PETUGAS_DB})

@app.route('/api/petugas/<int:petugas_id>/approve', methods=['POST'])
def api_approve_petugas(petugas_id):
    for p in PETUGAS_DB:
        if p['id'] == petugas_id:
            p['status'] = 'Aktif'
            return jsonify({"status": "success", "message": f"Akun {p['nama']} telah disetujui dan berstatus Aktif."})
    return jsonify({"status": "error", "message": "Petugas tidak ditemukan"}), 404

@app.route('/api/petugas/<int:petugas_id>/delete', methods=['POST'])
def api_delete_petugas(petugas_id):
    for p in PETUGAS_DB:
        if p['id'] == petugas_id:
            p['status'] = 'Arsip'  # Soft Delete
            return jsonify({"status": "success", "message": f"Akun {p['nama']} berhasil di-soft delete dan dipindahkan ke Tab Arsip."})
    return jsonify({"status": "error", "message": "Petugas tidak ditemukan"}), 404

@app.route('/api/wilayah/save', methods=['POST'])
def api_save_wilayah():
    data = request.get_json() or {}
    nama_lahan = data.get('nama', 'Lahan Barcode Baru')
    geojson = data.get('geojson', {})
    
    return jsonify({
        "status": "success",
        "message": f"Geometri {nama_lahan} telah ditransformasikan ke Standar GeoJSON dan disimpan ke Database!",
        "geojson": geojson
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)

