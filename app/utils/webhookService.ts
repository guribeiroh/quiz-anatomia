import { QuizQuestion, UserInfo } from '../data/quizData';
import { TimingData } from '../context/QuizContext';

interface WebhookPayload {
  quiz: {
    title: string;
    metadata: {
      totalQuestions: number;
      version: string;
      categories: string[];
    };
    questions: QuizQuestion[];
    professionOptions: string[];
  };
  userInfo: UserInfo;
  quizResults: {
    userAnswers: number[];
    score: number;
    totalQuestions: number;
    percentCorrect: number;
    timing: {
      averageResponseTime: number;
      totalQuizTime: number;
      numTimeouts: number;
    };
    questionsAnalysis: {
      questionId: number;
      userAnswer: number;
      correctAnswer: number;
      isCorrect: boolean;
      responseTime: number;
      didExpire: boolean;
    }[];
    resultMessage: string;
  };
  webhook: {
    timestamp: string;
    source: string;
    version: string;
    eventType: string;
  };
}

export const getResultMessage = (percentCorrect: number): string => {
  if (percentCorrect >= 90) return "Excelente! Você é um especialista em anatomia!";
  if (percentCorrect >= 70) return "Muito bom! Você tem um conhecimento sólido de anatomia!";
  if (percentCorrect >= 50) return "Bom! Você tem uma compreensão básica de anatomia.";
  return "Continue estudando! A anatomia requer prática constante.";
};

export const prepareWebhookPayload = (
  questions: QuizQuestion[],
  professionOptions: string[],
  userInfo: UserInfo,
  userAnswers: number[],
  score: number,
  timingData: TimingData[],
  totalQuizTime: number
): WebhookPayload => {
  const totalQuestions = questions.length;
  const percentCorrect = Math.round((score / totalQuestions) * 100);
  
  // Calcular o tempo médio de resposta
  const averageResponseTime = timingData.length > 0
    ? timingData.reduce((sum, item) => sum + item.responseTime, 0) / timingData.length
    : 0;

  // Contar timeouts
  const numTimeouts = timingData.filter(item => item.didExpire).length;

  // Preparar a análise detalhada de cada questão
  const questionsAnalysis = questions.map((question, index) => {
    const userAnswer = userAnswers[index] !== undefined ? userAnswers[index] : -1;
    const timingInfo = timingData.find(t => t.questionId === index) || { 
      responseTime: 0, 
      didExpire: false 
    };
    
    return {
      questionId: question.id,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: userAnswer === question.correctAnswer,
      responseTime: timingInfo.responseTime,
      didExpire: timingInfo.didExpire,
    };
  });

  return {
    quiz: {
      title: "Quiz Anatomia Sem Medo",
      metadata: {
        totalQuestions,
        version: "1.0.0",
        categories: ["Anatomia", "Saúde", "Educação Médica"]
      },
      questions,
      professionOptions
    },
    userInfo,
    quizResults: {
      userAnswers,
      score,
      totalQuestions,
      percentCorrect,
      timing: {
        averageResponseTime,
        totalQuizTime,
        numTimeouts
      },
      questionsAnalysis,
      resultMessage: getResultMessage(percentCorrect)
    },
    webhook: {
      timestamp: new Date().toISOString(),
      source: "Quiz Anatomia Sem Medo",
      version: "1.0.0",
      eventType: "quiz_completed"
    }
  };
};

export const sendWebhookData = async (data: WebhookPayload, webhookUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Erro ao enviar dados para o webhook:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar dados para o webhook:', error);
    return false;
  }
};

// Função principal para preparar e enviar dados ao webhook
export const submitQuizResults = async (
  questions: QuizQuestion[],
  professionOptions: string[],
  userInfo: UserInfo,
  userAnswers: number[],
  score: number,
  timingData: TimingData[],
  totalQuizTime: number,
  webhookUrl: string
): Promise<boolean> => {
  // Preparar os dados
  const payload = prepareWebhookPayload(
    questions,
    professionOptions,
    userInfo,
    userAnswers,
    score,
    timingData,
    totalQuizTime
  );

  // Salvar uma cópia local para debug ou uso posterior
  if (process.env.NODE_ENV === 'development') {
    console.log('Payload do webhook:', payload);
  }

  // Enviar os dados para o webhook
  return await sendWebhookData(payload, webhookUrl);
}; 