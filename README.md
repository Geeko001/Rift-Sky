🌌 Rift Sky
Rift Sky is a minimalist, high-contrast weather Progressive Web App (PWA) built for the Rift Ecosystem. It strips away the clutter of traditional weather apps to focus on high-impact environmental data, specifically tuned for the Indian climate.

✨ Features
🌪️ Signature "Rain Start" Timer
Leveraging granular 15-minute precipitation probability data from Open-Meteo, Rift Sky provides a real-time countdown. If rain is detected within the hour, a high-visibility alert triggers: "Rain starting in 12 mins. Secure the perimeter."

🌫️ Indian Standard AQI & UV
Focuses on the metrics that matter. Get prominent, color-coded cards for Air Quality (AQI) and UV Index, critical for daily planning in high-exposure regions.

🟣 Monsoon-Adaptive UI
Built with a "Liquid Glass" design system, the entire app interface dynamically reacts to the environment. When humidity crosses 85%, the background gradient shifts into a deep Retro Iris (#A056FF) pulse, signaling a high-monsoon state.

📱 Android-Native Experience (PWA)
Standalone Mode: Hides browser UI for a true app-like feel.

Offline Caching: View the last fetched weather data instantly, even without a connection.

Maskable Icons: Perfectly circular launcher icons that fit the Android Material You aesthetic.

🛠️ Tech Stack
Core: React 18 + Vite (Lightning fast build tool)

Language: TypeScript (Type-safe logic)

Styling: Tailwind CSS + Glassmorphism logic

Data: Open-Meteo API (Free, Zero-API Key, No Tracking)

PWA: vite-plugin-pwa (Service Workers & Manifest)

Android Build: Bubblewrap CLI (PWA to .aab)

🚀 Getting Started
Prerequisites
Node.js (v18+)

npm or yarn

Installation
Clone the Repo:

Bash

git clone https://github.com/your-username/rift-sky.git
cd rift-sky
Install Dependencies:

Bash

npm install
Run Development Server:

Bash

npm run dev
📦 Building for Android (.aab)
To convert this PWA into a Play Store-ready Android App Bundle:

Deploy the app to a HTTPS URL (e.g., Vercel).

Use Bubblewrap CLI:

Bash

npx @bubblewrap/cli init --manifest https://your-app-url.vercel.app/manifest.webmanifest
npx @bubblewrap/cli build
🛡️ License
Distributed under the MIT License. See LICENSE for more information.

🤝 Contact
Project Lead: Aashirwad Sharma

Ecosystem: Rift Eco
