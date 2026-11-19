# Near Apoyo Emocional 🌿
> **Plataforma Web y Móvil de Acompañamiento Emocional y Contención Preventiva para Estudiantes**  
> **Universidad Tecnológica del Valle de Toluca (UTVT)**  
> *Dirección de Carrera de Tecnologías de la Información y Comunicación*

---

## 📖 Descripción del Proyecto

**Near** es una plataforma orientada a servicios (SaaS) y mobile-first diseñada como un primer canal de escucha, contención y orientación preventiva disponible 24/7. Su objetivo es ayudar a los estudiantes universitarios a gestionar el estrés por tareas, evaluaciones y presión académica cotidiana, cerrando la brecha de atención y derribando el estigma asociado a pedir ayuda.

> [!IMPORTANT]
> **Enfoque Ético y Responsable:**  
> Near **NO emite diagnósticos clínicos** (sin etiquetas de trastornos patológicos), **NO prescribe medicamentos** y **NO sustituye a los psicólogos o psiquiatras**. Cuenta con un **Protocolo de Detección de Riesgos** que, ante expresiones de ideación autolesiva o crisis, interrumpe de inmediato el flujo ordinario y despliega el contacto telefónico directo hacia la **Línea de la Vida (800 911 2000)** y el **911**.

---

## 👥 Equipo de Desarrollo (UTVT - Grupo D-72)

| Nombre | Rol en el Proyecto |
| :--- | :--- |
| **Alan Alcántara Valencia** | Líder Técnico, Frontend & Arquitectura de Software |
| **Yuliana Lizeth Betancourt Medina** | Dirección de Proyecto & Scrum Master |
| **Sebastián Uriel Méndez Flores** | Product Owner, Requisitos & Prototipos Figma |
| **Dylan Santiago Alonso Carrillo** | Seguridad, Privacidad & Cumplimiento LFPDPPP |
| **Miguel Ángel López Sarabia** | Pruebas, Calidad QA & Validación |

---

## ✨ Características y Módulos Implementados

1. **Pantalla Principal (Dashboard de Bienestar):**
   - Saludo contextual y dinámico con el nombre del estudiante.
   - **Racha de Calma:** Visualización semanal (L M M J V S D) inspirada en Duolingo pero sin castigos por días perdidos.
   - **Registro Anímico Rápido:** Chips de humor (Calmado, Esperanzado, Cansado, Ansioso, Abrumado) que persisten en la sesión.
   - **Frase Reflexiva Diaria:** Micro-dosis de introspección con opción de guardado.
   - Accesos directos a Pausas de Calma rápida y botón de **SOS permanente**.

2. **Asistente Conversacional Inteligente (Chat con Near):**
   - Interfaz de mensajería fluida con soporte para texto y síntesis de voz (Text-to-Speech / Speech-to-Text).
   - Estilos de acompañamiento personalizables: *Cálido y empático*, *Directo y reflexivo*, o *Escucha silenciosa*.
   - **Intercepción de Crisis en Tiempo Real:** Detección de palabras de alerta con despliegue de `SafetyCard`.
   - Botón de **Borrado de Conversación** para garantizar la privacidad física en el dispositivo.

3. **Modo de Voz Inmersivo:**
   - Orbe reactivo y animado que respira visualmente al escuchar y hablar.
   - Transcripciones en subtítulos en tiempo real sobre la Web Speech API nativa.

4. **Pausas Conscientes y Herramientas de Autorregulación:**
   - **Respiración Guiada 4-7-8:** Animación sincronizada con tiempos de Inhalación (4s), Retención (7s) y Exhalación (8s).
   - **Sonidos de Calma:** Síntesis sonora mediante Web Audio API (Lluvia suave, Olas marinas, Fogata, Bosque nocturno).

5. **Bitácora Emocional & Analítica:**
   - Gráfica interactiva de evolución anímica y detonantes más frecuentes (Tareas, Exámenes, Descanso, Familia).
   - Historial cronológico de registros.

6. **Privacidad y Derechos ARCO:**
   - Aviso de Privacidad Integral conforme a la LFPDPPP.
   - Opción para descargar expediente completo en formato `JSON` y borrado total de datos.
   - Gestión de contacto de emergencia de confianza.

7. **Capa de Conexión a Backend (`apiService`):**
   - Cliente modular en `src/services/api.ts` listo para comunicarse con microservicios en **FastAPI** y base de datos en **MongoDB Atlas**.
   - Modo de respaldo local (*offline fallback*) completamente transparente.

---

## 🛠️ Stack Tecnológico

* **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vite.dev/)
* **Routing & Estado:** [TanStack Router](https://tanstack.com/router) & [TanStack Start](https://tanstack.com/start)
* **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Componentes UI:** [Radix UI](https://www.radix-ui.com/) + [Lucide Icons](https://lucide.dev/)
* **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
* **Visualización de Datos:** [Recharts](https://recharts.org/)
* **Testing:** [Vitest](https://vitest.dev/) + React Testing Library

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Prerrequisitos
- [Node.js](https://nodejs.org/) v20+ o v24+
- `npm` v10+

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/near-apoyo-emocional.git
cd near-apoyo-emocional

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:3000` (o el puerto indicado por Vite).

---

## 🧪 Pruebas Unitarias

El proyecto incluye pruebas automatizadas para el protocolo de seguridad en crisis, lógica de rachas y generación de respuestas:

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Modo interactivo
npm run test:watch
```

---

## 📱 Conversión a Aplicación Móvil (Android / iOS)

Para empaquetar este frontend en una aplicación nativa móvil utilizando **Capacitor**:

```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar Capacitor
npx cap init "Near" "edu.utvt.near"

# 3. Construir la versión de producción web
npm run build

# 4. Agregar plataforma Android
npx cap add android

# 5. Sincronizar y abrir en Android Studio
npx cap sync
npx cap open android
```

---

## 📂 Esquema del Directorio

```text
near-apoyo-emocional/
├── src/
│   ├── components/
│   │   ├── near/          # Componentes nucleares de Near (AppScreen, Streak, Mood, SOS, etc.)
│   │   └── ui/            # Primitivas de diseño (Botones, Dialogs, Sheets, Tabs, etc.)
│   ├── context/           # NearContext.tsx (Gestión de estado global y persistencia)
│   ├── hooks/             # Custom hooks (Audio ambiente, Speech Recognition & Synthesis)
│   ├── lib/               # Utilidades y helpers de clases Tailwind
│   ├── routes/            # Vistas y pantallas basadas en TanStack Router
│   │   ├── __root.tsx     # Contenedor responsive mobile-first
│   │   ├── index.tsx      # Welcome / Splash
│   │   ├── login.tsx      # Iniciar sesión
│   │   ├── registro.tsx   # Registro de usuario
│   │   ├── onboarding.tsx # Wizard de configuración inicial
│   │   ├── inicio.tsx     # Dashboard principal
│   │   ├── chat.tsx       # Chatbot con IA y seguridad
│   │   ├── voz.tsx        # Modo de voz interactivo
│   │   ├── calma.tsx      # Menú de relajación
│   │   ├── respiracion.tsx# Respiración guiada 4-7-8
│   │   ├── sonidos.tsx    # Paisajes sonoros
│   │   ├── bitacora.tsx   # Gráficos y seguimiento de estado de ánimo
│   │   └── perfil.tsx     # Perfil, preferencias y derechos ARCO
│   ├── services/          # api.ts, safety.ts, companion.ts, streak.ts, mockData.ts
│   ├── types/             # Definiciones TypeScript de entidades y contratos
│   └── test/              # Pruebas automatizadas con Vitest
├── archive/               # Resguardos de paquetes originales (.zip)
├── public/                # Favicon y assets estáticos
├── .env.example           # Variables de entorno modelo
├── .gitignore             # Reglas de exclusión para Git
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de compilación TypeScript
└── vite.config.ts         # Configuración del bundler Vite
```

---

## 🔒 Privacidad y Cumplimiento Normativo

El tratamiento de datos dentro de Near se rige bajo la **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)**. La información de salud emocional se almacena de forma disociada con identificadores seudónimos (`codigo_anonimo`), garantizando el secreto profesional, el derecho al olvido y la no discriminación del estudiante.
