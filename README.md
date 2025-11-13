

```markdown
##** 👗 Aura Styles – Virtual Try-On Web App**##

**Aura Styles** is an interactive **AI-powered virtual try-on web app** that allows users to **try on clothes in real time** using their webcam.  
The app uses **OpenCV + MediaPipe** for **body landmark detection** (shoulders and waist) and overlays selected clothing images dynamically on the user’s live video feed.

It’s built with **React (frontend)** and **Flask (backend)** — fully deployable on **Vercel** and **Render**.

---

## 💫 Project Description

Aura Styles enables users to experience how different tops or garments look on them virtually.  
Using the camera feed, the system detects shoulder and waist points and scales the selected clothing image (like a T-shirt, top, or jacket) to fit the upper body naturally.

This eliminates the need for physical trials and gives an interactive digital fitting-room experience.

---

## ⚙️ Features

✨ **Live Camera Try-On** – Real-time camera view with clothing overlay  
🧠 **Pose Detection** – Detects shoulders and waist using MediaPipe  
🎽 **Dynamic Fitting** – Clothes auto-scale and position perfectly on the user’s upper body  
🛍️ **Cart & Wishlist Integration** – Add items directly to wishlist or cart  
⚡ **Lightweight & Fast** – Optimized camera + OpenCV backend  
🎨 **Modern UI** – Built with Tailwind CSS and shadcn/ui components  
🌐 **Deployable** – Works seamlessly with Vercel (frontend) and Render (backend)

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **UI Components** | shadcn/ui, Lucide Icons |
| **Backend** | Flask (Python) |
| **Image Processing** | OpenCV + MediaPipe |
| **Notifications** | react-hot-toast |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📂 Folder Structure

```

Aura-Styles-Try-on/
│
├── clothes_images/           # Transparent clothing images (PNG)
├── results/                  # Output images / screenshots
├── src/
│   ├── components/
│   │   └── LiveTryOn.tsx     # Main frontend camera + overlay logic
│   └── App.tsx               # React entry point
│
├── server.py                 # Flask backend (OpenCV + MediaPipe)
├── package.json              # React dependencies
├── requirements.txt          # Python dependencies
└── README.md

````

---

## 🧠 How It Works

1. The **webcam** captures your live video.
2. The backend uses **MediaPipe Pose Detection** to find **shoulder and waist** coordinates.
3. The selected **clothing image** is scaled and positioned to match your body in real-time.
4. The processed frame is displayed on the browser with the virtual outfit.
5. Users can save favorite items to **Wishlist** or add them to **Cart**.

---

## 🛠️ Installation & Setup

Follow these steps carefully 👇

### 🔹 Step 1 – Clone the Repository
```bash
git clone https://github.com/Antara80978/Aura-Styles-TRy-on.git
cd Aura-Styles-TRy-on
````

---

### 🔹 Step 2 – Backend Setup (Flask)

Make sure Python is installed (≥3.9).
Create and activate a virtual environment (optional but recommended):

```bash
python -m venv venv
venv\Scripts\activate   # For Windows
# OR
source venv/bin/activate  # For macOS/Linux
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask backend:

```bash
python server.py
```

Backend will start at:

```
http://localhost:5000
```

---

### 🔹 Step 3 – Frontend Setup (React)

Now set up your React environment:

```bash
cd frontend   # (or your React folder)
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🎥 Usage Instructions

1. Start your **Flask backend** (Step 2).
2. Start your **React frontend** (Step 3).
3. Open the browser and allow camera access.
4. Choose a clothing image (e.g., `top1_front.png`).
5. You’ll instantly see the clothing fitted **from your shoulders to your waist**.
6. Add the item to **Cart** or **Wishlist** as desired.

---

## 🧾 Example Output

🧍 Live try-on display:
The top image fits naturally from **shoulder to waist**, scaling dynamically as you move.

```
👤 + 👕  ➜  Real-time overlay displayed on camera feed
```

Screenshot example (optional):

```
results/
 └── tryon_preview.png
```

---

## 🌍 Deployment Guide

### ✅ Frontend Deployment (Vercel)

1. Push your updated code to GitHub.
2. Go to [Vercel](https://vercel.com).
3. Click **“Add New Project” → “Import Git Repository”**.
4. Choose your frontend folder (where `package.json` is located).
5. Click **Deploy**.
6. Copy the live Vercel link (e.g. `https://aura-styles.vercel.app`).

---

### ✅ Backend Deployment (Render)

1. Go to [Render.com](https://render.com).

2. Click **“New Web Service”** → Connect your GitHub repo.

3. In the setup screen:

   * **Build Command:**

     ```
     pip install -r requirements.txt
     ```
   * **Start Command:**

     ```
     gunicorn server:app
     ```
   * **Environment:** Python 3.10 or higher

4. Deploy your backend and copy the Render link (e.g. `https://aura-backend.onrender.com`).

5. Update your frontend API URLs:

   ```ts
   const API_URL = "https://aura-backend.onrender.com";
   ```

   Replace `http://localhost:5000` with your live backend URL.

---

## 🧩 Example API Endpoints

| Endpoint           | Method | Description                           |
| ------------------ | ------ | ------------------------------------- |
| `/video_feed`      | GET    | Streams camera feed                   |
| `/upload_cloth`    | POST   | Applies the selected clothing overlay |
| `/add_to_cart`     | POST   | Adds item to cart                     |
| `/add_to_wishlist` | POST   | Adds item to wishlist                 |

---

## 💡 Troubleshooting

| Issue                   | Solution                                                                          |
| ----------------------- | --------------------------------------------------------------------------------- |
| Camera not loading      | Allow browser camera permissions                                                  |
| Clothes not aligning    | Keep your shoulders and waist visible in frame                                    |
| Flask CORS error        | Ensure `from flask_cors import CORS` and `CORS(app)` in `server.py`               |
| Render deployment fails | Recheck `gunicorn server:app` and `requirements.txt`                              |
| Very slow performance   | Close other heavy apps using the webcam or reduce frame resolution in `server.py` |

---

## 🧠 Future Enhancements

* 👖 Add pants / full-body clothing try-on
* 🎥 AR filters for accessories
* 🧾 User login & saved wardrobe
* 🪞 Mirror flip camera preview
* 🌈 Dynamic lighting adjustments

---

## 🧑‍💻 Developed By

**👩‍💻 Antara**
GitHub: [@Antara80978](https://github.com/Antara80978)

Built with ❤️ using:

* [React](https://reactjs.org/)
* [Flask](https://flask.palletsprojects.com/)
* [OpenCV](https://opencv.org/)
* [MediaPipe](https://developers.google.com/mediapipe)
* [Tailwind CSS](https://tailwindcss.com/)

---

## 📸 Output Preview

| Before                          | After                                 |
| ------------------------------- | ------------------------------------- |
| ![Before](./results/before.png) | ![After](./results/tryon_preview.png) |

---

### ⭐ If you like this project, give it a **star** on GitHub!

```
git clone https://github.com/Antara80978/Aura-Styles-TRy-on.git
