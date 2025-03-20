export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  correctFeedback: string;
  incorrectFeedback: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  category?: string;
  timeLimit?: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o maior osso do corpo humano?",
    options: ["Fêmur", "Tíbia", "Úmero", "Rádio"],
    correctAnswer: 0,
    correctFeedback: "Parabéns! O fêmur é realmente o maior e mais forte osso do corpo humano, localizado na coxa.",
    incorrectFeedback: "Não foi dessa vez! O fêmur é o maior osso do corpo humano. Ele é um osso longo localizado na coxa.",
    difficulty: 'easy',
    category: "Sistema Esquelético"
  },
  {
    id: 2,
    question: "Qual órgão é responsável por filtrar o sangue e remover resíduos?",
    options: ["Fígado", "Rins", "Pulmões", "Coração"],
    correctAnswer: 1,
    correctFeedback: "Excelente! Os rins são fundamentais para filtrar o sangue, remover resíduos e controlar o equilíbrio hídrico do corpo.",
    incorrectFeedback: "Quase lá! São os rins que filtram o sangue e removem resíduos, formando a urina para eliminar toxinas do corpo.",
    difficulty: 'easy',
    category: "Sistema Urinário"
  },
  {
    id: 3,
    question: "Quantas vértebras compõem a coluna vertebral humana?",
    options: ["20", "24", "33", "26"],
    correctAnswer: 2,
    correctFeedback: "Perfeito! A coluna vertebral humana é composta por 33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais (fundidas) e 4 coccígeas (fundidas).",
    incorrectFeedback: "Está perto! A coluna vertebral humana tem 33 vértebras no total, incluindo as vértebras fundidas do sacro e cóccix.",
    difficulty: 'medium',
    category: "Sistema Esquelético"
  },
  {
    id: 4,
    question: "Qual é o músculo mais forte do corpo humano em relação ao seu tamanho?",
    options: ["Quadríceps", "Bíceps", "Masseter (músculo da mandíbula)", "Glúteo máximo"],
    correctAnswer: 2,
    correctFeedback: "Correto! O masseter, músculo responsável pela mastigação, é considerado o mais forte proporcionalmente ao seu tamanho.",
    incorrectFeedback: "Interessante escolha, mas o masseter (músculo da mandíbula) é considerado o mais forte em relação ao seu tamanho, capaz de exercer uma força impressionante durante a mastigação.",
    difficulty: 'medium',
    category: "Sistema Muscular"
  },
  {
    id: 5,
    question: "Qual destes é um osso do ouvido médio?",
    options: ["Etmóide", "Estribo", "Escafóide", "Esfenoide"],
    correctAnswer: 1,
    correctFeedback: "Muito bem! O estribo é o menor osso do corpo humano e um dos três ossículos do ouvido médio, junto com o martelo e a bigorna.",
    incorrectFeedback: "Não foi dessa vez! O estribo é um dos três ossículos do ouvido médio (junto com o martelo e a bigorna) e é o menor osso do corpo humano.",
    difficulty: 'medium',
    category: "Sistema Sensorial"
  },
  {
    id: 6,
    question: "Qual parte do encéfalo controla o equilíbrio e a coordenação motora?",
    options: ["Cerebelo", "Tálamo", "Hipotálamo", "Amígdala"],
    correctAnswer: 0,
    correctFeedback: "Excelente! O cerebelo é responsável pelo equilíbrio, postura e coordenação dos movimentos voluntários.",
    incorrectFeedback: "Não acertou! O cerebelo é a região do encéfalo responsável pelo equilíbrio, coordenação motora e postura corporal.",
    difficulty: 'medium',
    category: "Sistema Nervoso"
  },
  {
    id: 7,
    question: "Qual é o nome da camada mais profunda da pele?",
    options: ["Epiderme", "Derme", "Hipoderme", "Endoderme"],
    correctAnswer: 2,
    correctFeedback: "Perfeito! A hipoderme (ou tecido subcutâneo) é a camada mais profunda, composta principalmente por tecido adiposo.",
    incorrectFeedback: "Resposta incorreta. A hipoderme, também chamada de tecido subcutâneo, é a camada mais profunda da pele, rica em tecido adiposo.",
    difficulty: 'hard',
    category: "Sistema Tegumentar"
  },
  {
    id: 8,
    question: "Qual estrutura conecta os músculos aos ossos?",
    options: ["Ligamentos", "Tendões", "Cartilagens", "Fáscias"],
    correctAnswer: 1,
    correctFeedback: "Correto! Os tendões são estruturas fibrosas de tecido conjuntivo que conectam os músculos aos ossos.",
    incorrectFeedback: "Não foi dessa vez! Os tendões são as estruturas que conectam os músculos aos ossos, enquanto os ligamentos conectam ossos entre si.",
    difficulty: 'medium',
    category: "Sistema Locomotor"
  },
  {
    id: 9,
    question: "Qual é o maior órgão do corpo humano?",
    options: ["Fígado", "Cérebro", "Intestino grosso", "Pele"],
    correctAnswer: 3,
    correctFeedback: "Muito bem! A pele é o maior órgão do corpo humano em área e um dos mais importantes para proteção contra agentes externos.",
    incorrectFeedback: "Resposta incorreta. A pele é o maior órgão do corpo humano, cobrindo uma área de aproximadamente 2 metros quadrados em um adulto médio.",
    difficulty: 'easy',
    category: "Sistema Tegumentar"
  },
  {
    id: 10,
    question: "Qual artéria transporta sangue oxigenado do coração para o corpo?",
    options: ["Artéria pulmonar", "Artéria coronária", "Artéria aorta", "Artéria carótida"],
    correctAnswer: 2,
    correctFeedback: "Perfeito! A aorta é a maior artéria do corpo e responsável por transportar sangue oxigenado do ventrículo esquerdo para todo o corpo.",
    incorrectFeedback: "Não acertou! A artéria aorta é a principal e maior artéria do corpo, saindo do ventrículo esquerdo e transportando sangue oxigenado para a circulação sistêmica.",
    difficulty: 'hard',
    category: "Sistema Cardiovascular"
  }
];

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  profession: string;
}

export const professionOptions = [
  "Estudante de Medicina",
  "Estudante Área da Saúde",
  "Profissional da Saúde",
  "Médico(a)"
];