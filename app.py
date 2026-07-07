from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

model = tf.keras.models.load_model('static/model/likhai.keras')

@app.route("/process", methods=['POST'])
def getImgData():
    data = request.get_json()
    imgData_raw = np.array(data['imgData'].split(","), dtype='uint8').reshape(280,280)
    imgData_resized = np.array(Image.fromarray(imgData_raw).resize((28,28))).reshape(1,28,28)
    results = model.predict(imgData_resized)

    return jsonify(resArr = results.tolist())


@app.route('/', methods=['GET', 'POST'])
def predictor():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)
