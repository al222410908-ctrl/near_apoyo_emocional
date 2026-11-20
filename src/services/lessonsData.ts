export interface LessonQuizOption {
  id: string;
  text: string;
  isHealthy: boolean;
  feedback: string;
}

export interface InteractiveLesson {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  xpReward: number;
  emoji: string;
  palette: {
    bg: string;
    border: string;
    lip: string;
    lightBg: string;
    lightBorder: string;
    text: string;
    ring: string;
    gradient: string;
  };
  storyStep: {
    mascotQuote: string;
    conceptTitle: string;
    conceptBody: string;
    myth: string;
    reality: string;
  };
  quizStep: {
    scenario: string;
    question: string;
    options: LessonQuizOption[];
  };
  practiceStep: {
    prompt: string;
    instruction: string;
    actionChips: { id: string; label: string; emoji: string; positive: boolean }[];
  };
}

export const WELLNESS_LESSONS: InteractiveLesson[] = [
  {
    id: "u1",
    unitNumber: 1,
    title: "Domando el Estrés de Exámenes",
    subtitle: "Separa tu valor personal de una calificación",
    category: "Calma Académica",
    duration: "2 min",
    xpReward: 25,
    emoji: "🎯",
    palette: {
      bg: "bg-[#284B3C]",
      border: "border-[#1C1917]",
      lip: "border-b-[#1C1917]",
      lightBg: "bg-[#F4EFE6] dark:bg-[#262421]",
      lightBorder: "border-[#284B3C]/40",
      text: "text-[#284B3C] dark:text-emerald-300",
      ring: "ring-[#284B3C]/25",
      gradient: "from-[#284B3C] to-[#3B6E58]",
    },
    storyStep: {
      mascotQuote: "¡Hola! Antes de un parcial, tu cerebro puede confundir un examen difícil con un peligro real. ¡Vamos a desactivarlo!",
      conceptTitle: "El Efecto Túnel Académico",
      conceptBody:
        "Cuando sentimos presión escolar, la amígdala activa la alerta y bloquea tu memoria de trabajo. Respirar lento 3 veces le devuelve el control a tu corteza prefrontal.",
      myth: "“Si no saco 10 o me bloqueo en una pregunta, significa que no sirvo para la carrera.”",
      reality: "“Un examen evalúa un tema en un día específico, nunca quién eres ni tu futuro profesional.”",
    },
    quizStep: {
      scenario: "Faltan 20 minutos para entrar a tu examen de Cálculo o Programación y sientes el estómago cerrado.",
      question: "¿Cuál de estas acciones ayuda a tu cerebro a recuperar claridad de inmediato?",
      options: [
        {
          id: "a",
          text: "Leer todos los apuntes a máxima velocidad mientras me digo que voy a reprobar.",
          isHealthy: false,
          feedback: "Releer con pánico satura tu memoria a corto plazo. Necesitas bajar revoluciones primero.",
        },
        {
          id: "b",
          text: "Cerrar los apuntes 5 minutos, exhalar largo por la boca y elegir empezar por la pregunta más sencilla.",
          isHealthy: true,
          feedback: "¡Exacto! Exhalar largo activa tu sistema nervioso parasimpático y destraba tu memoria.",
        },
        {
          id: "c",
          text: "Compararme con mis compañeros que dicen que estudiaron toda la madrugada.",
          isHealthy: false,
          feedback: "Compararte en el pasillo solo contagia la ansiedad grupal. Tu proceso es único.",
        },
      ],
    },
    practiceStep: {
      prompt: "Arma tu Escudo Pre-Examen",
      instruction: "Toca los 3 pensamientos ancla que SÍ te dan calma y enfoque hoy:",
      actionChips: [
        { id: "c1", label: "Un paso a la vez", emoji: "🐾", positive: true },
        { id: "c2", label: "Soy más que una nota", emoji: "🌟", positive: true },
        { id: "c3", label: "Tengo que ser perfecto", emoji: "⚡", positive: false },
        { id: "c4", label: "Puedo respirar y continuar", emoji: "🌬️", positive: true },
      ],
    },
  },
  {
    id: "u2",
    unitNumber: 2,
    title: "Rompiendo el Bloqueo Mental",
    subtitle: "Vence la parálisis cuando tienes 5 entregas juntas",
    category: "Enfoque sin Culpa",
    duration: "2 min",
    xpReward: 30,
    emoji: "⚡",
    palette: {
      bg: "bg-[#B85A3A]",
      border: "border-[#1C1917]",
      lip: "border-b-[#1C1917]",
      lightBg: "bg-[#F4EFE6] dark:bg-[#262421]",
      lightBorder: "border-[#B85A3A]/40",
      text: "text-[#B85A3A] dark:text-amber-300",
      ring: "ring-[#B85A3A]/25",
      gradient: "from-[#B85A3A] to-[#914A36]",
    },
    storyStep: {
      mascotQuote: "¿Te ha pasado que tienes tanta tarea que terminas viendo el celular por horas con culpa? No es flojera, es sobrecarga.",
      conceptTitle: "Parálisis por Sobrecarga",
      conceptBody:
        "Cuando ves un proyecto entero como una montaña gigante, tu cerebro huye para protegerte del agotamiento. La clave no es forzarte más, sino achicar el primer paso a ridículamente pequeño.",
      myth: "“No avanzo porque soy indisciplinado o flojo.”",
      reality: "“La procrastinación es una respuesta emocional al miedo a que no quede perfecto.”",
    },
    quizStep: {
      scenario: "Tienes que entregar un reporte técnico de 15 páginas y llevas 2 horas frente a la pantalla en blanco.",
      question: "¿Cuál es la técnica del 'Micro-Paso de 2 Minutos' para romper el hielo?",
      options: [
        {
          id: "a",
          text: "Prometerme que no me levantaré de la silla hasta terminar las 15 páginas.",
          isHealthy: false,
          feedback: "Las metas extremas aumentan la presión y hacen que tu mente quiera escapar.",
        },
        {
          id: "b",
          text: "Abrir el archivo, poner solo el título y escribir 3 renglones feos sin editar durante 2 minutos.",
          isHealthy: true,
          feedback: "¡Brillante! Darte permiso de hacer un primer borrador imperfecto apaga el bloqueo al instante.",
        },
        {
          id: "c",
          text: "Castigarme sin descansar porque perdí la tarde.",
          isHealthy: false,
          feedback: "La culpa drena la poca energía mental que tienes disponible.",
        },
      ],
    },
    practiceStep: {
      prompt: "Desactiva la Parálisis",
      instruction: "Selecciona las 3 micro-acciones amables que destraban tu día:",
      actionChips: [
        { id: "c1", label: "Solo abrir el documento", emoji: "📂", positive: true },
        { id: "c2", label: "Hacer un borrador imperfecto", emoji: "✏️", positive: true },
        { id: "c3", label: "Exigirme terminar todo ya", emoji: "🔥", positive: false },
        { id: "c4", label: "Pausar 5 min y tomar agua", emoji: "💧", positive: true },
      ],
    },
  },
  {
    id: "u3",
    unitNumber: 3,
    title: "El Arte de Poner Límites",
    subtitle: "Decir 'hoy necesito descansar' sin sentir culpa",
    category: "Autocuidado",
    duration: "2 min",
    xpReward: 30,
    emoji: "🛡️",
    palette: {
      bg: "bg-[#C88A2B]",
      border: "border-[#1C1917]",
      lip: "border-b-[#1C1917]",
      lightBg: "bg-[#F4EFE6] dark:bg-[#262421]",
      lightBorder: "border-[#C88A2B]/40",
      text: "text-[#9A6519] dark:text-amber-300",
      ring: "ring-[#C88A2B]/25",
      gradient: "from-[#C88A2B] to-[#A66E1E]",
    },
    storyStep: {
      mascotQuote: "Cargar con el trabajo de todos o decir que sí cuando estás agotado te apaga poco a poco. Tus límites cuidan tu paz.",
      conceptTitle: "Batería Social y Emocional",
      conceptBody:
        "En la universidad es fácil caer en el síndrome de 'poder con todo'. Poner un límite a tiempo evita que llegues al agotamiento emocional (burnout).",
      myth: "“Si pongo un límite en mi equipo o descanso hoy, soy egoísta.”",
      reality: "“Poner límites claros permite que sigas ayudando y estudiando sin romperte por dentro.”",
    },
    quizStep: {
      scenario: "Son las 10:30 PM, estás agotado y un compañero te pide que rehagas su parte del proyecto para mañana.",
      question: "¿Cómo suena un límite asertivo y empático?",
      options: [
        {
          id: "a",
          text: "Decirle que sí aunque me quede sin dormir y sienta coraje toda la noche.",
          isHealthy: false,
          feedback: "Tragarte el malestar acumula resentimiento y daña tu descanso.",
        },
        {
          id: "b",
          text: "“Hoy ya cerré mi día porque necesito descansar. Mañana a las 8 AM revisamos juntos cómo ajustarlo.”",
          isHealthy: true,
          feedback: "¡Excelente! Es claro, respetuoso, protege tu sueño y ofrece una alternativa realista.",
        },
        {
          id: "c",
          text: "Ignorar el mensaje y quedarme despierto preocupado por qué va a pensar.",
          isHealthy: false,
          feedback: "Expresar tu límite con calma te da mucha más paz que el silencio ansioso.",
        },
      ],
    },
    practiceStep: {
      prompt: "Construye tus Límites Sanos",
      instruction: "Elige los 3 permisos que mereces darte esta semana:",
      actionChips: [
        { id: "c1", label: "Dormir mis horas completas", emoji: "🛌", positive: true },
        { id: "c2", label: "Pedir que el equipo reparta parejo", emoji: "🤝", positive: true },
        { id: "c3", label: "Resolverle la vida a todos", emoji: "🏋️", positive: false },
        { id: "c4", label: "Desconectarme por la noche", emoji: "🌙", positive: true },
      ],
    },
  },
  {
    id: "u4",
    unitNumber: 4,
    title: "Apagar el Ruido Nocturno",
    subtitle: "Cuando tu mente repasa pendientes a medianoche",
    category: "Descanso Profundo",
    duration: "3 min",
    xpReward: 35,
    emoji: "🌙",
    palette: {
      bg: "bg-[#45617D]",
      border: "border-[#1C1917]",
      lip: "border-b-[#1C1917]",
      lightBg: "bg-[#F4EFE6] dark:bg-[#262421]",
      lightBorder: "border-[#45617D]/40",
      text: "text-[#45617D] dark:text-sky-300",
      ring: "ring-[#45617D]/25",
      gradient: "from-[#45617D] to-[#2F465E]",
    },
    storyStep: {
      mascotQuote: "Cuando apagas la luz, tu cerebro cree que por fin tiene silencio para mostrarte todas tus preocupaciones pendientes.",
      conceptTitle: "Descarga Cognitiva Nocturna",
      conceptBody:
        "Dar vueltas a un problema a las 11:30 PM nunca lo resuelve porque tu cerebro está fatigado. Vaciar esos pendientes en papel o en tu bitácora le dice a tu mente: 'Ya está guardado, podemos dormir'.",
      myth: "“Si sigo pensando en el problema una hora más en la cama, encontraré la solución.”",
      reality: "“Lo que de noche parece una catástrofe sin salida, con 7 horas de sueño se ve manejable.”",
    },
    quizStep: {
      scenario: "Apagaste la luz hace 40 minutos pero tu mente sigue repitiendo todo lo que tienes que hacer mañana en la UTVT.",
      question: "¿Cuál es el ritual preventivo más efectivo en ese momento?",
      options: [
        {
          id: "a",
          text: "Abrir redes sociales con el brillo al máximo hasta que me canse la vista.",
          isHealthy: false,
          feedback: "La luz azul y el scroll infinito mantienen a tu cerebro en estado de alerta.",
        },
        {
          id: "b",
          text: "Anotar los 3 pendientes en mi bitácora para mañana y poner 3 minutos de sonido de lluvia o respiración 4-7-8.",
          isHealthy: true,
          feedback: "¡Perfecto! Externalizar la lista libera a tu memoria de la obligación de recordarla toda la noche.",
        },
        {
          id: "c",
          text: "Mirar el reloj cada 10 minutos contando cuántas horas me quedan de sueño.",
          isHealthy: false,
          feedback: "Ver la hora genera 'ansiedad de rendimiento del sueño'.",
        },
      ],
    },
    practiceStep: {
      prompt: "Ritual de Cierre Nocturno",
      instruction: "Toca los 3 hábitos que preparan tu refugio para descansar:",
      actionChips: [
        { id: "c1", label: "Vaciar pendientes en mi Bitácora", emoji: "📓", positive: true },
        { id: "c2", label: "Poner sonidos de lluvia suave", emoji: "🌧️", positive: true },
        { id: "c3", label: "Ver el reloj cada 5 minutos", emoji: "⏰", positive: false },
        { id: "c4", label: "Agradecer un logro pequeño de hoy", emoji: "✨", positive: true },
      ],
    },
  },
  {
    id: "u5",
    unitNumber: 5,
    title: "Autocompasión en Días Difíciles",
    subtitle: "Háblate como hablarías a tu mejor amigo",
    category: "Resiliencia",
    duration: "3 min",
    xpReward: 40,
    emoji: "💖",
    palette: {
      bg: "bg-[#914A36]",
      border: "border-[#1C1917]",
      lip: "border-b-[#1C1917]",
      lightBg: "bg-[#F4EFE6] dark:bg-[#262421]",
      lightBorder: "border-[#914A36]/40",
      text: "text-[#914A36] dark:text-amber-300",
      ring: "ring-[#914A36]/25",
      gradient: "from-[#914A36] to-[#B85A3A]",
    },
    storyStep: {
      mascotQuote: "Somos expertos en consolar a un amigo cuando algo le sale mal, pero con nosotros mismos solemos ser el juez más duro.",
      conceptTitle: "El Crítico Interno vs. El Aliado",
      conceptBody:
        "La ciencia demuestra que tratarte con amabilidad cuando cometes un error reduce el cortisol y aumenta tu motivación real para intentarlo de nuevo mucho más que el autocastigo.",
      myth: "“Si no soy duro conmigo mismo, me volveré conformista.”",
      reality: "“La autocrítica destruye tu confianza; la autocompasión te da piso firme para crecer.”",
    },
    quizStep: {
      scenario: "Una exposición o entrega no salió como esperabas y sientes mucha frustración contigo mismo.",
      question: "¿Qué te diría tu versión más sabia y compasiva?",
      options: [
        {
          id: "a",
          text: "“Siempre arruino todo, nunca voy a destacar.”",
          isHealthy: false,
          feedback: "Las palabras 'siempre' y 'nunca' son distorsiones que te encadenan al error.",
        },
        {
          id: "b",
          text: "“Se vale sentir frustración hoy. Di lo mejor que pude con lo que sabía y esto me enseña qué ajustar la próxima vez.”",
          isHealthy: true,
          feedback: "¡Eso es resiliencia real! Validas tu emoción sin lastimar tu autoestima.",
        },
        {
          id: "c",
          text: "“No tengo derecho a sentirme mal, debería aguantarme.”",
          isHealthy: false,
          feedback: "Reprimir lo que sientes solo hace que la emoción dure más tiempo.",
        },
      ],
    },
    practiceStep: {
      prompt: "Abraza tu Proceso",
      instruction: "Elige las 3 frases que alimentan tu fortaleza interior:",
      actionChips: [
        { id: "c1", label: "Estoy aprendiendo a mi ritmo", emoji: "🌱", positive: true },
        { id: "c2", label: "Un tropiezo no borra mi camino", emoji: "🛡️", positive: true },
        { id: "c3", label: "No tengo permitido fallar", emoji: "🚫", positive: false },
        { id: "c4", label: "Merezco paciencia hoy", emoji: "🫶", positive: true },
      ],
    },
  },
];
