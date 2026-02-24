# GreenCampus+: Tech-Driven Sustainable Universities 🌍🚀

**GreenCampus+** is a smart ecosystem prototype designed to transform university campuses into sustainable laboratories through IoT simulation, data analytics, and community engagement. This project is developed for the **IEEE YESIST12** competition and the **Tech for Impact Challenge**.

## 📑 Project Overview
Universities consume massive amounts of energy and produce significant waste. GreenCampus+ monitors environmental indicators in real-time to improve decision-making and promote sustainable behaviors.

### 🎯 Sustainable Development Goals (SDGs)
Our project is strictly aligned with the following UN goals :

* **SDG 3**: Good Health and Well-Being.
* **SDG 11**: Sustainable Cities and Communities.
* **SDG 13**: Climate Action.
* **SDG 17**: Partnerships for the Goals (Transversal).

---

## 🏗️ System Architecture
The system follows a modular 3-tier architecture:
1.  **Simulation Layer**: Python-based engine emulating environmental sensors.
2.  **Logic Layer**: Flask API managing data processing and predictive analytics.
3.  **Presentation Layer**: React + TypeScript dashboard for real-time visualization.


---

## 👥 Team & Responsibilities

### 💻 Miguel (Frontend & UX)
* **Tech Stack**: React, TypeScript, Vite, Tailwind CSS.
* **Tasks**: Dashboard development, real-time chart integration, and gamification UI.

### 🐍 Trevour (Backend & Data)
* **Tech Stack**: Python, Flask, Firebase/Firestore.
* **Tasks**: REST API development, database management, and Sustainability Score logic.

### 🤖 Diego (IoT Simulation & AI)
* **Tech Stack**: Python, Scikit-learn, NumPy.
* **Tasks**: Multi-node environmental simulator and predictive analytics model.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.9+)

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Mikelon23/GreenCampus-](https://github.com/Mikelon23/GreenCampus-)

--------------------------------------

### 💡 Instrucciones para el equipo:

* **Miguel:** Trabajará principalmente en la carpeta `/frontend`. Creará sus componentes ahí.
* **Trevour:** Todo su código de Flask y lógica de base de datos va en `/backend`.
* **Diego:** Su simulador y modelos de IA viven en `/simulator`.

**Importante:** **NUNCA** trabajarán directamente en la rama `main`. Siempre deben crear una rama desde `develop` (ejemplo: `git checkout -b feat/dashboard-charts`) y hacer un Pull Request hacia `develop` cuando terminen su tarea.
