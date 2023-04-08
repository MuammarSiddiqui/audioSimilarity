import librosa
import numpy as np
from scipy.spatial.distance import cosine
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics import euclidean_distances

app = Flask(__name__)
CORS(app)

@app.route('/compare-audio', methods=['POST'])
def compare_audio_files():
    file1 = request.files['file1']
    file2 = request.files['file2']

    # Load the audio files
    y1, sr1 = librosa.load(file1)
    y2, sr2 = librosa.load(file2)

    # Extract MFCCs from the audio files
    mfcc1 = librosa.feature.mfcc(y=y1, sr=sr1)
    mfcc2 = librosa.feature.mfcc(y=y2, sr=sr2)

    # Reshape the MFCC arrays to be 1-D and pad with zeros if necessary
    max_len = max(mfcc1.shape[1], mfcc2.shape[1])
    mfcc1 = np.pad(mfcc1, ((0, 0), (0, max_len - mfcc1.shape[1])), mode='constant', constant_values=0)
    mfcc2 = np.pad(mfcc2, ((0, 0), (0, max_len - mfcc2.shape[1])), mode='constant', constant_values=0)
    mfcc1 = np.reshape(mfcc1, (mfcc1.shape[0]*mfcc1.shape[1],))
    mfcc2 = np.reshape(mfcc2, (mfcc2.shape[0]*mfcc2.shape[1],))

    # Compute the cosine similarity between the MFCCs
    similarity = 1 - cosine(mfcc1, mfcc2)

    return jsonify({'similarity_score': similarity})

if __name__ == '__main__':
    app.run(debug=True)
