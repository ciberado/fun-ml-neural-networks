export const es = {
  meta: {
    intlLocale: "es-ES",
    languageName: "Español"
  },
  common: {
    unknown: "?",
    none: "Ninguno"
  },
  navigation: {
    label: "Navegación principal",
    brand: "Lecciones de redes neuronales",
    links: {
      home: "Inicio",
      singleNeuron: "Lección 1",
      neuralNetwork: "Lección 2"
    }
  },
  home: {
    eyebrow: "Dos pequeñas lecciones",
    title: "Aprende cómo funcionan las redes neuronales",
    copy:
      "Empieza con una sola neurona artificial y construye hasta una pequeña red. Ajusta entradas, pesos y sesgo para ver cómo funciona cada pieza.",
    valueTitle: "Para qué sirve",
    valueCopy:
      "Las lecciones conectan las ideas de las neuronas con acciones visibles: cambia un peso, mira la suma ponderada, observa cómo la función de activación comprime el resultado, y compara lo que puede hacer una neurona sola frente a una pequeña red.",
    conceptsTitle: "Conceptos principales",
    concepts: [
      {
        kicker: "Neurona",
        title: "Una sola unidad de cálculo",
        copy: "Los pesos amplifican o atenúan las entradas. El sesgo desplaza el resultado. La función de activación decide la salida."
      },
      {
        kicker: "Pesos y sesgo",
        title: "Mandos ajustables",
        copy: "Cada conexión tiene un peso. Cada neurona tiene un sesgo. Cambiarlos cambia el cálculo."
      },
      {
        kicker: "Activación",
        title: "De la suma a la salida",
        copy: "La sigmoide comprime cualquier número entre 0 y 1. La función escalón da un sí o no rotundo. Ambas parten de la misma suma ponderada."
      }
    ],
    lessonsEyebrow: "Empieza donde quieras",
    lessonsTitle: "Lecciones",
    lessons: [
      {
        href: "./lesson-single-neuron.html",
        label: "Lección 1",
        title: "Mira dentro de una neurona",
        copy: "Suma ponderada, sesgo y funciones de activación explicadas."
      },
      {
        href: "./lesson-neural-network.html",
        label: "Lección 2",
        title: "Conecta neuronas en una red",
        copy: "Recorre una red neuronal reconociendo un dígito escrito a mano."
      }
    ]
  },
  hero: {
    eyebrow: "Lección interactiva",
    title: "Mira dentro de una neurona",
    copy:
      "Ajusta dos entradas junto con sus pesos y sesgo. Mira cómo responden la suma ponderada y la función de activación en tiempo real.",
    qrAlt: "Código QR para la demo en vivo",
    qrButtonLabel: "Abrir código QR",
    qrDialogLabel: "Ventana del código QR"
  },
  singleNeuron: {
    eyebrow: "Lección 1",
    title: "Mira dentro de una neurona",
    copy:
      "Una neurona artificial toma entradas, las multiplica por pesos, añade un sesgo y pasa el resultado por una función de activación.",
    inputsLabel: "Entradas",
    inputA: "Atributo A",
    inputB: "Atributo B",
    weightsLabel: "Pesos",
    weightA: "Peso A",
    weightB: "Peso B",
    biasLabel: "Sesgo",
    activationLabel: "Activación",
    activationSigmoid: "Sigmoide",
    activationStep: "Escalón",
    calculationLabel: "Cálculo",
    tabLabel: {
      text: "Texto",
      diagram: "Diagrama"
    },
    weightedSumFormula: (wA, a, wB, b, bias, z) =>
      `z = ${wA} × ${a} + ${wB} × ${b} + ${bias} = ${z}`,
    activationResult: (type, output) => `${type}(${output})`,
    outputLabel: "Salida",
    weightedSumLabel: "Suma ponderada (z)",
    activationOutputLabel: "Salida de activación",
    sigmoidDescription:
      "La sigmoide comprime cualquier número en un valor suave entre 0 y 1.",
    stepDescription:
      "El escalón da un 0 o 1 rotundo según si la suma ponderada supera el umbral.",
    whatIsNeuron: "¿Qué es esto?",
    neuronExplanation:
      "Una sola neurona artificial es la pieza más simple de las redes neuronales. Calcula una suma ponderada de sus entradas, añade un sesgo y aplica una función de activación para producir una salida."
  },
  help: {
    modalCloseLabel: "Cerrar",
    inputsTitle: "¿Qué son las entradas?",
    inputsBody:
      "Las entradas son como los números que le das a una máquina. Igual que le dices a un amigo 'tengo 2 manzanas', le das a la neurona dos números — Atributo A y Atributo B. La neurona usa estos números para empezar su trabajo.",
    weightsTitle: "¿Qué son los pesos?",
    weightsBody:
      "Los pesos son como perillas de volumen para cada entrada. Si una entrada es muy importante, su peso se sube alto. Si no es importante, el peso se baja o incluso se vuelve negativo. La neurona multiplica cada entrada por su peso antes de sumarlo todo.",
    biasTitle: "¿Qué es el sesgo?",
    biasBody:
      "El sesgo es como un pequeño empujón que ayuda a la neurona a tomar mejores decisiones. Incluso si todas las entradas son cero, el sesgo añade un pequeño empujón para que la neurona no se quede atascada. Piensa en ello como el 'estado de ánimo por defecto' de la neurona.",
    activationTitle: "¿Qué es una función de activación?",
    activationBody:
      "La función de activación es la 'decisionista'. Después de que la neurona suma todas las entradas ponderadas y el sesgo, necesita decidir qué salida dar. La sigmoide comprime el número en una respuesta suave entre 0 y 1 (como 'quizás 0.7 seguro'). El escalón solo dice 'sí' (1) o 'no' (0) según un umbral."
  },
  neuralNetwork: {
    eyebrow: "Lección 2",
    title: "Conecta neuronas en una red",
    copy:
      "Una red neuronal conecta varias neuronas en capas. La información fluye hacia adelante desde la entrada hasta la salida.",
    step0Placeholder: "¿Cómo ve una computadora esto?",
    step0Title: "El Dígito",
    step0Copy:
      "Aquí hay un '4' escrito a mano. Una computadora no ve formas — ve números. Cada cuadrado pequeño es un píxel: papel (blanco) o tinta (oscuro). Construyamos una red neuronal que aprenda a reconocer este dígito.",
    step1Title: "La Estructura de la Red",
    step1Copy:
      "Una red neuronal tiene capas de neuronas conectadas. La capa de entrada recibe los píxeles de la imagen. La capa de salida da la respuesta — qué dígito cree que ve.",
    step2Title: "Divide la Imagen",
    step2Copy:
      "Dividimos la imagen en 9 regiones, organizadas en una cuadrícula de 3×3. Cada región será examinada por separado.",
    step3Title: "De Píxeles a Vectores",
    step3Copy:
      "Cada región tiene 4×4 píxeles. Cada píxel es tinta (1) o papel (0). Cada región se convierte en un vector de 16 números — la entrada para una neurona.",
    step4Title: "Entrada a las Neuronas",
    step4Copy:
      "Cada vector alimenta una neurona de entrada. Cuanta más tinta haya en esa región, más fuerte será la señal. La capa de entrada se activa según lo que ve.",
    step5Title: "Aparecen las Capas Ocultas",
    step5Copy:
      "Las capas ocultas están entre la entrada y la salida. La Capa Oculta 1 detecta líneas simples — verticales, horizontales, diagonales. La Capa Oculta 2 detecta ángulos y cruces construidos a partir de esas líneas. ⚠️ Esto es una simplificación didáctica — en realidad, no sabemos exactamente cómo las redes neuronales representan patrones internamente; ellas aprenden sus propias características, a menudo poco intuitivas.",
    step6Title: "Propagación hacia Adelante (Primer Intento)",
    step6Copy:
      "La señal fluye a través de todas las capas. La red predice... ¡7! Eso es incorrecto — la imagen es un 4. La red no entrenada aún no sabe cómo es un '4'. Necesita aprender de su error.",
    step7Title: "Entrenamiento",
    step7Copy:
      "La red aprende ajustando sus conexiones desde la salida hasta la entrada. Observa la onda dorada fluir hacia atrás a través de las capas — cada pulso representa la corrección de los pesos. Presiona el botón para comenzar el entrenamiento.",
    step8Title: "La Predicción Correcta",
    step8Copy:
      "¡Después del entrenamiento, la red identifica correctamente el dígito 4! Las conexiones se han ajustado para que la neurona correcta se active con más fuerza.",
    prev: "◀ Anterior",
    next: "Siguiente ▶",
    stepCounter: (current, total) => `Paso ${current} de ${total}`,
    pretrain: "Entrenar el modelo",
    trainingComplete: "¡Entrenamiento completo!",
    inputLayer: "Entrada (9)",
    hiddenLayer1: "Oculta 1 — Líneas",
    hiddenLayer2: "Oculta 2 — Ángulos",
    outputLayer: "Salida (1–9)"
  },
  controls: {
    language: "Idioma"
  }
};
