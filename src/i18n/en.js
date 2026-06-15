export const en = {
  meta: {
    intlLocale: "en-US",
    languageName: "English"
  },
  common: {
    unknown: "?",
    none: "None"
  },
  navigation: {
    label: "Main navigation",
    brand: "Neural Network Lessons",
    links: {
      home: "Home",
      singleNeuron: "Lesson 1",
      neuralNetwork: "Lesson 2"
    }
  },
  home: {
    eyebrow: "Two tiny lessons",
    title: "Learn how neural networks work",
    copy:
      "Start with a single artificial neuron and build up to a small network. Adjust inputs, weights, and bias to see how each piece works.",
    valueTitle: "What this helps with",
    valueCopy:
      "The lessons connect neuron ideas to visible actions: change a weight, see the weighted sum, watch the activation function squash the output, and compare what a single neuron can do against a small network.",
    conceptsTitle: "Main concepts",
    concepts: [
      {
        kicker: "Neuron",
        title: "A single computing unit",
        copy: "Weights amplify or dampen inputs. Bias shifts the result. The activation function decides the output."
      },
      {
        kicker: "Weights & Bias",
        title: "Adjustable knobs",
        copy: "Every connection has a weight. Every neuron has a bias. Changing them changes the computation."
      },
      {
        kicker: "Activation",
        title: "From sum to output",
        copy: "Sigmoid squashes any number into 0-1. A step function gives a hard yes or no. Both start from the same weighted sum."
      }
    ],
    lessonsEyebrow: "Start anywhere",
    lessonsTitle: "Lessons",
    lessons: [
      {
        href: "./lesson-single-neuron.html",
        label: "Lesson 1",
        title: "See inside one neuron",
        copy: "Weighted sum, bias, and activation functions explained."
      },
      {
        href: "./lesson-neural-network.html",
        label: "Lesson 2",
        title: "Connect neurons into a network",
        copy: "Step through a neural network recognizing a handwritten digit."
      }
    ]
  },
  hero: {
    eyebrow: "Interactive Lesson",
    title: "See inside one neuron",
    copy:
      "Adjust two inputs along with their weights and bias. Watch the weighted sum and activation function respond in real time.",
    qrAlt: "QR code for the live demo",
    qrButtonLabel: "Open QR code",
    qrDialogLabel: "QR code modal"
  },
  singleNeuron: {
    eyebrow: "Lesson 1",
    title: "See inside one neuron",
    copy:
      "An artificial neuron takes inputs, multiplies them by weights, adds a bias, and passes the result through an activation function.",
    inputsLabel: "Inputs",
    inputA: "Feature A",
    inputB: "Feature B",
    weightsLabel: "Weights",
    weightA: "Weight A",
    weightB: "Weight B",
    biasLabel: "Bias",
    activationLabel: "Activation",
    activationSigmoid: "Sigmoid",
    activationStep: "Step",
    calculationLabel: "Calculation",
    tabLabel: {
      text: "Text",
      diagram: "Diagram"
    },
    weightedSumFormula: (wA, a, wB, b, bias, z) =>
      `z = ${wA} × ${a} + ${wB} × ${b} + ${bias} = ${z}`,
    activationResult: (type, output) => `${type}(${output})`,
    outputLabel: "Output",
    weightedSumLabel: "Weighted sum (z)",
    activationOutputLabel: "Activation output",
    sigmoidDescription:
      "Sigmoid squashes any number into a smooth value between 0 and 1.",
    stepDescription:
      "Step gives a hard 0 or 1 depending on whether the weighted sum passes the threshold.",
    whatIsNeuron: "What is this?",
    neuronExplanation:
      "A single artificial neuron is the simplest building block of neural networks. It computes a weighted sum of its inputs, adds a bias, and applies an activation function to produce an output."
  },
  help: {
    modalCloseLabel: "Close",
    inputsTitle: "What are inputs?",
    inputsBody:
      "Inputs are like the numbers you give to a machine. Just like you tell a friend 'I have 2 apples', you give the neuron two numbers — Feature A and Feature B. The neuron uses these numbers to start its work.",
    weightsTitle: "What are weights?",
    weightsBody:
      "Weights are like volume knobs for each input. If an input is really important, its weight is turned up high. If it is not important, the weight is turned down low or even negative. The neuron multiplies each input by its weight before adding everything together.",
    biasTitle: "What is bias?",
    biasBody:
      "Bias is like a little nudge that helps the neuron make better decisions. Even if all inputs are zero, the bias adds a small push so the neuron is not stuck. Think of it like the 'default mood' of the neuron.",
    activationTitle: "What is an activation function?",
    activationBody:
      "The activation function is the decider. After the neuron adds up all the weighted inputs and bias, it needs to decide what to output. Sigmoid squashes the number into a smooth answer between 0 and 1 (like 'maybe 0.7 sure'). Step just says yes (1) or no (0) based on a threshold."
  },
  neuralNetwork: {
    eyebrow: "Lesson 2",
    title: "Connect neurons into a network",
    copy:
      "A neural network connects multiple neurons into layers. Information flows forward from input to output.",
    // Step-by-step content
    step0Title: "The Digit",
    step0Copy:
      "Here is a handwritten '4'. A computer doesn't see shapes — it sees numbers. Each tiny square is a pixel: paper (white) or ink (dark). Let's build a neural network that learns to recognize this digit.",
    step1Title: "The Network Structure",
    step1Copy:
      "A neural network has layers of connected neurons. The input layer receives the image pixels. The output layer gives the answer — which digit it thinks it sees.",
    step2Title: "Divide the Image",
    step2Copy:
      "We divide the image into 9 regions, arranged in a 3×3 grid. Each region will be examined separately.",
    step3Title: "From Pixels to Vectors",
    step3Copy:
      "Each region is made of 4×4 pixels. Every pixel is either ink (1) or paper (0). Each region becomes a vector of 16 numbers — the input for one neuron.",
    step4Title: "Input Flows to Neurons",
    step4Copy:
      "Each vector feeds into one input neuron. The more ink in that region, the stronger the signal. The input layer activates based on what it sees.",
    step5Title: "Hidden Layers Appear",
    step5Copy:
      "Hidden layers sit between input and output. Hidden Layer 1 detects simple lines — vertical, horizontal, diagonal. Hidden Layer 2 detects angles and crosses built from those lines. ⚠️ This is a teaching simplification — in reality, we don't fully know how neural networks internally represent patterns; they learn their own often-unintuitive features.",
    step6Title: "Forward Propagation (First Try)",
    step6Copy:
      "The signal flows through every layer. The network predicts... 7! That's wrong — the image is a 4. The untrained network doesn't know what a '4' looks like yet. It needs to learn from its mistake.",
    step7Title: "Training",
    step7Copy:
      "The network learns by adjusting its connections from output back to input. Watch the golden wave flow backward through the layers — each pulse represents the network correcting its weights. Press the button to start training.",
    step8Title: "The Correct Prediction",
    step8Copy:
      "After training, the network correctly identifies the digit 4! The connections have been adjusted so the right neuron fires strongest.",
    // Navigation UI
    prev: "◀ Previous",
    next: "Next ▶",
    stepCounter: (current, total) => `Step ${current} of ${total}`,
    pretrain: "Pretrain the model",
    trainingComplete: "Training complete!",
    // Layer labels
    inputLayer: "Input (9)",
    hiddenLayer1: "H1 — Lines",
    hiddenLayer2: "H2 — Angles + Crosses",
    outputLayer: "Output (1–9)"
  },
  controls: {
    language: "Language"
  }
};
