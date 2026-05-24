from flask import Flask, render_template, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = 'buuro'

@app.route('/set-language/<lang>')
def set_language(lang):
    session['lang'] = lang
    return redirect(request.referrer or url_for('home'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/requests')
def requests_page():
    return render_template('requests.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/wallet')
def wallet():
    return render_template('wallet.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')
if __name__ == '__main__':
    app.run(debug=True)
