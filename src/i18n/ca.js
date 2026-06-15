export const ca = {
  meta: {
    intlLocale: "ca-ES",
    languageName: "Català"
  },
  common: {
    unknown: "?",
    none: "Cap"
  },
  navigation: {
    label: "Navegació principal",
    brand: "Lliçons de xarxes neuronals",
    links: {
      home: "Inici",
      singleNeuron: "Lliçó 1",
      neuralNetwork: "Lliçó 2"
    }
  },
  home: {
    eyebrow: "Dues petites lliçons",
    title: "Aprèn com funcionen les xarxes neuronals",
    copy:
      "Comença amb una sola neurona artificial i construeix fins a una petita xarxa. Ajusta entrades, pesos i biaix per veure com funciona cada peça.",
    valueTitle: "Per a què serveix",
    valueCopy:
      "Les lliçons connecten les idees de les neurones amb accions visibles: canvia un pes, mira la suma ponderada, observa com la funció d'activació comprimeix el resultat, i compara què pot fer una neurona sola davant una petita xarxa.",
    conceptsTitle: "Conceptes principals",
    concepts: [
      {
        kicker: "Neurona",
        title: "Una sola unitat de càlcul",
        copy: "Els pesos amplifiquen o atenuen les entrades. El biaix desplaça el resultat. La funció d'activació decideix la sortida."
      },
      {
        kicker: "Pesos i biaix",
        title: "Controls ajustables",
        copy: "Cada connexió té un pes. Cada neurona té un biaix. Canviar-los canvia el càlcul."
      },
      {
        kicker: "Activació",
        title: "De la suma a la sortida",
        copy: "La sigmoide comprimeix qualsevol nombre entre 0 i 1. La funció esglaó dóna un sí o no rotund. Ambdues parteixen de la mateixa suma ponderada."
      }
    ],
    lessonsEyebrow: "Comença on vulguis",
    lessonsTitle: "Lliçons",
    lessons: [
      {
        href: "./lesson-single-neuron.html",
        label: "Lliçó 1",
        title: "Mira dins d'una neurona",
        copy: "Suma ponderada, biaix i funcions d'activació explicades."
      },
      {
        href: "./lesson-neural-network.html",
        label: "Lliçó 2",
        title: "Connecta neurones en una xarxa",
        copy: "Recorre una xarxa neuronal reconeixent un dígit escrit a mà."
      }
    ]
  },
  hero: {
    eyebrow: "Lliçó interactiva",
    title: "Mira dins d'una neurona",
    copy:
      "Ajusta dues entrades juntament amb els seus pesos i biaix. Mira com responen la suma ponderada i la funció d'activació en temps real.",
    qrAlt: "Codi QR per a la demo en viu",
    qrButtonLabel: "Obrir codi QR",
    qrDialogLabel: "Finestra del codi QR"
  },
  singleNeuron: {
    eyebrow: "Lliçó 1",
    title: "Mira dins d'una neurona",
    copy:
      "Una neurona artificial pren entrades, les multiplica per pesos, afegeix un biaix i passa el resultat per una funció d'activació.",
    inputsLabel: "Entrades",
    inputA: "Atribut A",
    inputB: "Atribut B",
    weightsLabel: "Pesos",
    weightA: "Pes A",
    weightB: "Pes B",
    biasLabel: "Biaix",
    activationLabel: "Activació",
    activationSigmoid: "Sigmoide",
    activationStep: "Esglaó",
    calculationLabel: "Càlcul",
    tabLabel: {
      text: "Text",
      diagram: "Diagrama"
    },
    weightedSumFormula: (wA, a, wB, b, bias, z) =>
      `z = ${wA} × ${a} + ${wB} × ${b} + ${bias} = ${z}`,
    activationResult: (type, output) => `${type}(${output})`,
    outputLabel: "Sortida",
    weightedSumLabel: "Suma ponderada (z)",
    activationOutputLabel: "Sortida d'activació",
    sigmoidDescription:
      "La sigmoide comprimeix qualsevol nombre en un valor suau entre 0 i 1.",
    stepDescription:
      "L'esglaó dóna un 0 o 1 rotund segons si la suma ponderada supera el llindar.",
    whatIsNeuron: "Què és això?",
    neuronExplanation:
      "Una sola neurona artificial és la peça més simple de les xarxes neuronals. Calcula una suma ponderada de les seves entrades, afegeix un biaix i aplica una funció d'activació per produir una sortida."
  },
  help: {
    modalCloseLabel: "Tancar",
    inputsTitle: "Què són les entrades?",
    inputsBody:
      "Les entrades són com els números que dones a una màquina. Igual que dius a un amic 'tinc 2 pomes', dones a la neurona dos números — Atribut A i Atribut B. La neurona utilitza aquests números per començar la seva feina.",
    weightsTitle: "Què són els pesos?",
    weightsBody:
      "Els pesos són com botons de volum per a cada entrada. Si una entrada és molt important, el seu pes es puja amunt. Si no és important, el pes es baixa o fins i tot es fa negatiu. La neurona multiplica cada entrada pel seu pes abans de sumar-ho tot.",
    biasTitle: "Què és el biaix?",
    biasBody:
      "El biaix és com una petita empenta que ajuda la neurona a prendre millors decisions. Fins i tot si totes les entrades són zero, el biaix afegeix una petita empenta perquè la neurona no es quedi encallada. Pensa-hi com l'«estat d'ànim per defecte» de la neurona.",
    activationTitle: "Què és una funció d'activació?",
    activationBody:
      "La funció d'activació és la 'decissionista'. Després que la neurona suma totes les entrades ponderades i el biaix, necessita decidir quina sortida donar. La sigmoide comprimeix el número en una resposta suau entre 0 i 1 (com 'potser 0,7 segur'). L'esglaó només diu 'sí' (1) o 'no' (0) segons un llindar."
  },
  neuralNetwork: {
    eyebrow: "Lliçó 2",
    title: "Connecta neurones en una xarxa",
    copy:
      "Una xarxa neuronal connecta diverses neurones en capes. La informació flueix cap endavant des de l'entrada fins a la sortida.",
    step0Placeholder: "Com veu un ordinador això?",
    step0Title: "El Dígit",
    step0Copy:
      "Aquí hi ha un '4' escrit a mà. Un ordinador no ve formes — ve números. Cada quadrat petit és un píxel: paper (blanc) o tinta (fosc). Construïm una xarxa neuronal que aprengui a reconèixer aquest dígit.",
    step1Title: "L'Estructura de la Xarxa",
    step1Copy:
      "Una xarxa neuronal té capes de neurones connectades. La capa d'entrada rep els píxels de la imatge. La capa de sortida dóna la resposta — quin dígit creu que veu.",
    step2Title: "Divideix la Imatge",
    step2Copy:
      "Dividim la imatge en 9 regions, organitzades en una graella de 3×3. Cada regió serà examinada per separat.",
    step3Title: "De Píxels a Vectors",
    step3Copy:
      "Cada regió té 4×4 píxels. Cada píxel és tinta (1) o paper (0). Cada regió es converteix en un vector de 16 números — l'entrada per a una neurona.",
    step4Title: "Entrada a les Neurones",
    step4Copy:
      "Cada vector alimenta una neurona d'entrada. Com més tinta hi hagi en aquella regió, més forta serà la senyal. La capa d'entrada s'activa segons el que veu.",
    step5Title: "Apareixen les Capes Ocultes",
    step5Copy:
      "Les capes ocultes estan entre l'entrada i la sortida. La Capa Oculta 1 detecta línies simples — verticals, horitzontals, diagonals. La Capa Oculta 2 detecta angles i creus construïts a partir d'aquestes línies. ⚠️ Això és una simplificació didàctica — en realitat, no sabem exactament com les xarxes neuronals representen els patrons internament; elles aprenen les seves pròpies característiques, sovint poc intuïtives.",
    step6Title: "Propagació cap Endavant (Primer Intent)",
    step6Copy:
      "La senyal flueix a través de totes les capes. La xarxa prediu... 7! Això és incorrecte — la imatge és un 4. La xarxa no entrenada encara no sap com és un '4'. Ha d'aprendre del seu error.",
    step7Title: "Entrenament",
    step7Copy:
      "La xarxa aprèn ajustant les seves connexions des de la sortida fins a l'entrada. Observa l'ona daurada fluir cap enrere a través de les capes — cada pols representa la correcció dels pesos. Prem el botó per començar l'entrenament.",
    step8Title: "La Predicció Correcta",
    step8Copy:
      "Després de l'entrenament, la xarxa identifica correctament el dígit 4! Les connexions s'han ajustat perquè la neurona correcta s'activi amb més força.",
    prev: "◀ Anterior",
    next: "Següent ▶",
    stepCounter: (current, total) => `Pas ${current} de ${total}`,
    pretrain: "Entrenar el model",
    trainingComplete: "Entrenament completat!",
    inputLayer: "Entrada (9)",
    hiddenLayer1: "Oculta 1 — Línies",
    hiddenLayer2: "Oculta 2 — Angles",
    outputLayer: "Sortida (1–9)"
  },
  controls: {
    language: "Idioma"
  }
};
