import os
from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ebrix-sugarcane-secret-key-2026'

@app.route('/')
def index():
    """Dashboard Utama E-Brix Sugarcane Quality Monitoring"""
    return render_template('index.html', active_page='dashboard')

@app.route('/calculator')
def calculator():
    """Halaman Kalkulator Kadar Gula °Brix & Rendemen Tebu"""
    return render_template('calculator.html', active_page='calculator')

@app.route('/monitoring')
def monitoring():
    """Halaman Monitoring Lahan & Visualisasi Analitik"""
    return render_template('monitoring.html', active_page='monitoring')

@app.route('/varieties')
def varieties():
    """Halaman Katalog Varietas Tebu & Panduan Budidaya"""
    return render_template('varieties.html', active_page='varieties')

@app.route('/logs')
def logs():
    """Halaman Riwayat Data Sampel Pengujian Nira Tebu"""
    return render_template('logs.html', active_page='logs')

if __name__ == '__main__':
    # Default local dev port 5050
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)
