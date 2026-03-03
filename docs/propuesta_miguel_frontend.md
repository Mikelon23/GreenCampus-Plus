# Propuesta integral para Miguel (Frontend & UX) — GreenCampus+

## 1) Objetivo del rol de Miguel
Desarrollar una **experiencia frontend profesional, responsiva y demostrable** para la fase de competencia (IEEE YESIST12), enfocada en:
- Visualización de datos ambientales en tiempo real.
- Interacción estudiantil mediante gamificación.
- Claridad narrativa de impacto SDG (3, 11, 13, 17).

## 2) Entregables obligatorios (alineados al proyecto)

### E1. Dashboard principal (MVP funcional)
- Vista general con KPIs críticos: temperatura, humedad, energía, calidad de aire, score global.
- Estado por zonas mínimas: Library, Cafeteria, Labs, Gardens, Parking.
- Semáforos de estado (normal, atención, crítico).

### E2. Gráficos en tiempo real
- Gráfico lineal de tendencias 24h (temperatura y consumo energético).
- Gráfico de área o barra para comparación entre zonas.
- Refresco cada 5–10 segundos (simulación de stream backend).

### E3. Gamificación (participación)
- Vista de leaderboard por usuarios/equipos.
- Sistema de puntos por eco-acciones reportadas.
- Componente de recompensas/badges con progreso.

### E4. UX y accesibilidad
- Diseño responsive para desktop/tablet/mobile.
- Contraste de color y feedback visual para estados críticos.
- Navegación clara por módulos (Dashboard, Reportes, Rewards).

### E5. Integración técnica
- Consumo de API Flask mediante servicios tipados en TypeScript.
- Contratos de datos definidos con interfaces/types.
- Manejo de estados de carga, error y datos vacíos.

## 3) Requerimientos funcionales para frontend
- **FR04 (Dashboard interactivo):** gauges o KPIs en tiempo real para Temp/Humidity/Energy.
- **FR06 (Reporting/Gamificación):** formulario de eco-reporte con asignación de puntos.
- Histórico visible de tendencias para soporte de análisis (24h y opcional 7d).
- Visualización de score global de sostenibilidad (0–100), consumiendo dato backend.

## 4) Requerimientos no funcionales (frontend)
- **NFR01:** reflejar datos nuevos en <= 2 segundos después de recibir respuesta API.
- **NFR02:** layout completamente responsive.
- Rendimiento: evitar renders innecesarios (memoización básica en componentes de chart).
- Mantenibilidad: componentes reutilizables + separación por features.

## 5) Arquitectura recomendada en `/frontend`

```text
frontend/src/
  app/
    router.tsx
    providers/
  features/
    dashboard/
      components/
      hooks/
      services/
      types/
    gamification/
      components/
      services/
      types/
    reports/
      components/
      services/
      types/
  shared/
    components/   (KpiCard, StatusBadge, EmptyState)
    lib/          (http client, formatters)
    styles/
```

## 6) Backlog priorizado (sprints cortos)

### Sprint 1 — Base visual y estructura (1–2 días)
1. Router + layout base con sidebar/topbar.
2. Biblioteca de componentes UI: `KpiCard`, `SectionCard`, `StatusChip`.
3. Dashboard con datos mock tipados.

### Sprint 2 — Datos reales y charts (2–3 días)
1. Cliente API y tipado de endpoints.
2. Integración de charts en tiempo real.
3. Manejo de estados loading/error/empty + pruebas manuales.

### Sprint 3 — Gamificación + reportes (2 días)
1. Leaderboard y rewards.
2. Formulario de eco-acciones con feedback inmediato.
3. Ajustes responsive y accesibilidad.

### Sprint 4 — Cierre de competencia (1–2 días)
1. Hardening UI/UX + coherencia visual.
2. Test de build y lint.
3. Deploy a Vercel/Netlify + demo script.

## 7) Definición de endpoints mínimos (contrato esperado)
- `GET /api/metrics/live` → métricas actuales por zona + score global.
- `GET /api/metrics/history?zone=...&range=24h` → series temporales.
- `GET /api/gamification/leaderboard` → ranking.
- `POST /api/reports/eco-action` → registro de acción + puntos.

## 8) Criterios de aceptación (DoD)
- Dashboard muestra 5 zonas y KPIs sin errores en desktop/móvil.
- Charts actualizan de forma periódica y visible.
- Leaderboard y rewards operativos con datos mock o reales.
- Build y lint pasan localmente.
- Deploy accesible por URL pública para jurados.

## 9) Riesgos y mitigación
- **Riesgo:** Backend incompleto o inestable.
  - **Mitigación:** usar adapter con mocks y fallback local.
- **Riesgo:** Inconsistencia de tipos API.
  - **Mitigación:** contrato TS central + validación básica de respuestas.
- **Riesgo:** Tiempo de competencia limitado.
  - **Mitigación:** priorizar MVP visual + integración mínima viable.

## 10) KPIs de éxito para Miguel
- Tiempo de actualización de panel (objetivo <=2s).
- Tasa de errores de render/API en demo (objetivo 0 bloqueantes).
- Cobertura de vistas clave: Dashboard, Gamificación, Reportes (100%).
- Cumplimiento de responsive en 3 breakpoints.

## 11) Flujo de trabajo Git recomendado
- Crear rama desde `develop`: `feat/miguel-dashboard-realtime-gamification`.
- Commits pequeños por módulo.
- PR hacia `develop` con checklist de pruebas y capturas.

## 12) Stack y librerías sugeridas
- React + TypeScript + Vite + Tailwind.
- Recharts para visualización.
- React Router para navegación.
- (Opcional) Zustand o Context API para estado global liviano.

---

Esta propuesta traduce los objetivos del proyecto en un plan ejecutable para que Miguel entregue un frontend competitivo, demostrable y listo para integración con backend/simulador.
