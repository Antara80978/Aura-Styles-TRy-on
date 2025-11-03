from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import mediapipe as mp
import os
from threading import Lock

app = Flask(__name__)
CORS(app)  # allow React frontend access

# --- Clothes Folder ---
CLOTHES_FOLDER = os.path.join(os.path.dirname(__file__), "clothes_images")
if not os.path.exists(CLOTHES_FOLDER):
    raise FileNotFoundError("❌ 'clothes_images' folder not found!")

# Only use the 4 specified tops
clothes_files = ["top1_front.png", "top2_front.jpg", "top5_front.png", "top6_front.png"]
clothes_files = [f for f in clothes_files if os.path.exists(os.path.join(CLOTHES_FOLDER, f))]
if not clothes_files:
    raise FileNotFoundError("❌ None of the specified clothing images found!")

# --- Global variables ---
current_index = 0
clothing_image = None
clothing_lock = Lock()

# --- In-memory cart/wishlist ---
cart_items = []
wishlist_items = []

# --- Mediapipe ---
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# --- Load clothing ---
def load_clothing(index):
    global clothing_image
    path = os.path.join(CLOTHES_FOLDER, clothes_files[index])
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"⚠️ Could not read clothing image: {path}")
    clothing_image = img

with clothing_lock:
    load_clothing(current_index)

# --- Overlay function (shoulder to waist) ---
def overlay_clothes(frame, clothing_img, landmarks):
    if not landmarks:
        return frame

    h, w, _ = frame.shape
    left_shoulder = landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP]

    left_x, left_y = int(left_shoulder.x * w), int(left_shoulder.y * h)
    right_x, right_y = int(right_shoulder.x * w), int(right_shoulder.y * h)
    hip_y = int((left_hip.y + right_hip.y) / 2 * h)

    # --- Adjust shoulder coverage ---
    start_y = max(0, left_y - int((hip_y - left_y) * 0.1))  # 10% above shoulder
    clothing_height = int((hip_y - start_y) * 1.2)  # extend slightly below hip
    clothing_width = int(abs(right_x - left_x) * 2.2)

    center_x = (left_x + right_x) // 2
    x1 = max(0, min(center_x - clothing_width // 2, w - clothing_width))
    y1 = max(0, min(start_y, h - clothing_height))
    x2, y2 = x1 + clothing_width, y1 + clothing_height

    resized = cv2.resize(clothing_img, (clothing_width, clothing_height), interpolation=cv2.INTER_AREA)

    # Alpha channel handling
    if resized.shape[2] == 4:
        alpha = resized[:, :, 3] / 255.0
        for c in range(3):
            frame[y1:y2, x1:x2, c] = alpha * resized[:, :, c] + (1 - alpha) * frame[y1:y2, x1:x2, c]
    else:
        frame[y1:y2, x1:x2] = resized

    return frame

# --- Video Stream ---
def gen_frames():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Cannot open webcam")
        return

    while True:
        success, frame = cap.read()
        if not success:
            continue
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        with clothing_lock:
            current_clothing = clothing_image.copy() if clothing_image is not None else None

        if results.pose_landmarks and current_clothing is not None:
            frame = overlay_clothes(frame, current_clothing, results.pose_landmarks)

        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

# --- Routes ---
@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/clothes')
def get_clothes():
    return jsonify(clothes_files)

@app.route('/select/<int:index>', methods=["POST"])
def select_clothing(index):
    global clothing_image
    if 0 <= index < len(clothes_files):
        with clothing_lock:
            load_clothing(index)
        return jsonify({"status": "ok", "index": index, "file": clothes_files[index]})
    return jsonify({"status": "error", "message": "Invalid index"}), 400

# --- Cart & Wishlist endpoints ---
@app.route('/cart', methods=["POST"])
def add_to_cart():
    data = request.json
    if "item" in data:
        cart_items.append(data["item"])
        return jsonify({"status": "ok", "cart": cart_items})
    return jsonify({"status": "error", "message": "No item provided"}), 400

@app.route('/wishlist', methods=["POST"])
def add_to_wishlist():
    data = request.json
    if "item" in data:
        wishlist_items.append(data["item"])
        return jsonify({"status": "ok", "wishlist": wishlist_items})
    return jsonify({"status": "error", "message": "No item provided"}), 400

@app.route('/cart', methods=["GET"])
def get_cart():
    return jsonify(cart_items)

@app.route('/wishlist', methods=["GET"])
def get_wishlist():
    return jsonify(wishlist_items)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
