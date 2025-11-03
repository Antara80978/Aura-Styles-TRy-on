import cv2
import mediapipe as mp
import os
import numpy as np

# ------------------ Settings ------------------
CLOTHES_FOLDER = "clothes_images"

# ------------------ Load Clothes ------------------
clothes_files = [f for f in os.listdir(CLOTHES_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
current_index = 0

def load_clothing(index):
    img_path = os.path.join(CLOTHES_FOLDER, clothes_files[index])
    cloth = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if cloth is None:
        print(f"⚠️ Could not load {img_path}")
        return None
    if cloth.shape[2] == 3:
        alpha = np.ones((cloth.shape[0], cloth.shape[1], 1), dtype=cloth.dtype) * 255
        cloth = np.concatenate((cloth, alpha), axis=2)
    return cloth

clothing_image = load_clothing(current_index)

# ------------------ Overlay Function ------------------
def overlay_transparent(background, overlay, x, y):
    h, w, _ = overlay.shape
    bh, bw, _ = background.shape
    if x < 0: x = 0
    if y < 0: y = 0
    if x + h > bh: h = bh - x
    if y + w > bw: w = bw - y
    if h <= 0 or w <= 0: return background
    overlay = overlay[:h, :w]
    alpha_overlay = overlay[:, :, 3] / 255.0
    alpha_background = 1.0 - alpha_overlay
    for c in range(3):
        background[x:x+h, y:y+w, c] = (
            alpha_overlay * overlay[:, :, c] +
            alpha_background * background[x:x+h, y:y+w, c]
        )
    return background

# ------------------ Mediapipe Init ------------------
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    # Pose Detection
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results_pose = pose.process(rgb)

    if results_pose.pose_landmarks:
        lm = results_pose.pose_landmarks.landmark
        left_shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_shoulder = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        left_hip = lm[mp_pose.PoseLandmark.LEFT_HIP.value]
        right_hip = lm[mp_pose.PoseLandmark.RIGHT_HIP.value]

        shoulder_x1, shoulder_y1 = int(left_shoulder.x * w), int(left_shoulder.y * h)
        shoulder_x2, shoulder_y2 = int(right_shoulder.x * w), int(right_shoulder.y * h)
        hip_y = int((left_hip.y + right_hip.y) / 2 * h)

        shoulder_width = abs(shoulder_x2 - shoulder_x1)
        torso_height = abs(hip_y - shoulder_y1)

        # Resize Clothing
        shirt_width = shoulder_width * 2.4
        shirt_height = torso_height * 2.0  # shoulders → waist
        scale_w = shirt_width / clothing_image.shape[1]
        scale_h = shirt_height / clothing_image.shape[0]
        scale = min(scale_w, scale_h)
        cloth_resized = cv2.resize(clothing_image, (0, 0), fx=scale, fy=scale)

        # Placement on body
        x_top = int(shoulder_y1 - cloth_resized.shape[0] * 0.2)
        y_left = int((shoulder_x1 + shoulder_x2) / 2 - cloth_resized.shape[1] / 2)

        frame = overlay_transparent(frame, cloth_resized, x_top, y_left)

    # ------------------ UI & Controls ------------------
    cv2.putText(frame, f"{clothes_files[current_index]} (←/→ to change, ESC to exit)",
                (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.imshow("AI Virtual Try-On", frame)
    key = cv2.waitKey(10)

    if key == 27:  # ESC
        break
    elif key in [81, ord('a')]:  # Left
        current_index = (current_index - 1) % len(clothes_files)
        clothing_image = load_clothing(current_index)
    elif key in [83, ord('d')]:  # Right
        current_index = (current_index + 1) % len(clothes_files)
        clothing_image = load_clothing(current_index)

cap.release()
cv2.destroyAllWindows()
