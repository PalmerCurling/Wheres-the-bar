import os
from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def find_bar():
	return render_template('index.html')
@app.route('/test')
def json_bitchery():
	return render_template('derp.html')

#app.debug=True
if __name__ == '__main__':
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', port=port)
