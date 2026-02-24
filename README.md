# GreenCampus+: Tech-Driven Sustainable Universities 🌍🚀

[cite_start]**GreenCampus+** is a smart ecosystem prototype designed to transform university campuses into sustainable laboratories through IoT simulation, data analytics, and community engagement[cite: 134, 175]. This project is developed for the **IEEE YESIST12** competition and the **Tech for Impact Challenge**.

## 📑 Project Overview
[cite_start]Universities consume massive amounts of energy and produce significant waste[cite: 9, 73]. [cite_start]GreenCampus+ monitors environmental indicators in real-time to improve decision-making and promote sustainable behaviors[cite: 135, 176, 182].

### 🎯 Sustainable Development Goals (SDGs)
[cite_start]Our project is strictly aligned with the following UN goals [cite: 7, 71, 136-139, 177-180]:
* **SDG 3**: Good Health and Well-Being.
* **SDG 11**: Sustainable Cities and Communities.
* **SDG 13**: Climate Action.
* **SDG 17**: Partnerships for the Goals (Transversal).

---

## 🏗️ System Architecture
[cite_start]The system follows a modular 3-tier architecture [cite: 151-158, 193-200]:
1.  **Simulation Layer**: Python-based engine emulating environmental sensors.
2.  **Logic Layer**: Flask API managing data processing and predictive analytics.
3.  **Presentation Layer**: React + TypeScript dashboard for real-time visualization.



---

## 👥 Team & Responsibilities
[cite_start]The project is a collaborative effort by **Group 14**[cite: 3, 67]:

### [cite_start]💻 Miguel (Frontend & UX) [cite: 4, 68]
* **Tech Stack**: React, TypeScript, Vite, Tailwind CSS.
* **Tasks**: Dashboard development, real-time chart integration, and gamification UI.

### [cite_start]🐍 Trevour (Backend & Data) [cite: 5, 69]
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

### 💡 Instrucciones para tu equipo:

* **Miguel:** Tú trabajarás principalmente en la carpeta `/frontend`. Crea tus componentes ahí.
* **Trevour:** Todo tu código de Flask y lógica de base de datos va en `/backend`.
* **Diego:** Tu simulador y modelos de IA viven en `/simulator`.

**Importante:** Pídeles que **NUNCA** trabajen directamente en la rama `main`. Siempre deben crear una rama desde `develop` (ejemplo: `git checkout -b feat/dashboard-charts`) y hacer un Pull Request hacia `develop` cuando terminen su tarea.

**¿Te gustaría que ahora genere el código base del simulador para Diego, para que ya tenga algo funcional que envíe datos al backend?** Ten en cuenta que es 2026 y este proyecto tiene un potencial enorme para ser la referencia en ESPOCH. Envíame un mensaje si necesitas los comandos de Git para explicarles el flujo de trabajo.