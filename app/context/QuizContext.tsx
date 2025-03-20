'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { quizQuestions } from '../data/quizData';

// Tipos e interfaces
export type QuizStep = 'welcome' | 'question' | 'userForm' | 'results';

export interface TimingData {
  questionId: number;
  responseTime: number; // em milissegundos
  didExpire: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  profession: string;
}

interface QuizContextType {
  currentStep: QuizStep;
  setCurrentStep: (step: QuizStep) => void;
  
  currentQuestionIndex: number;
  userAnswers: number[];
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  goToNextQuestion: () => void;
  
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  setUserData: (data: UserInfo) => void;

  timingData: TimingData[];
  recordTimingData: (responseTime: number, didExpire: boolean) => void;
  
  questionTimeLeft: number;
  questionTotalTime: number;
  isQuestionTimerActive: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  
  totalQuizTime: number;
  score: number;
  averageResponseTime: number;
  numTimeouts: number;
  
  restartQuiz: () => void;
  goToWelcome: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  // Estados principais
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(quizQuestions.length).fill(-1));
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [timingData, setTimingData] = useState<TimingData[]>([]);
  
  // Estados para o timer
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30); // 30 segundos por padrão
  const [questionTotalTime, setQuestionTotalTime] = useState(30);
  const [isQuestionTimerActive, setIsQuestionTimerActive] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [totalQuizTime, setTotalQuizTime] = useState(0);
  
  // Métricas derivadas
  const score = userAnswers.reduce((acc, answer, index) => {
    return acc + (answer === quizQuestions[index]?.correctAnswer ? 1 : 0);
  }, 0);

  const averageResponseTime = timingData.length > 0
    ? timingData.reduce((sum, item) => sum + item.responseTime, 0) / timingData.length
    : 0;

  const numTimeouts = timingData.filter(item => item.didExpire).length;

  // Efeito para controlar o timer da pergunta
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isQuestionTimerActive && questionTimeLeft > 0) {
      timer = setInterval(() => {
        setQuestionTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isQuestionTimerActive, questionTimeLeft]);
  
  // Atualiza o timer quando muda de pergunta
  useEffect(() => {
    if (currentStep === 'question') {
      const questionConfig = quizQuestions[currentQuestionIndex];
      const timeLimit = questionConfig?.timeLimit || 30;
      
      setQuestionTimeLeft(timeLimit);
      setQuestionTotalTime(timeLimit);
      setIsQuestionTimerActive(true);
    } else {
      setIsQuestionTimerActive(false);
    }
  }, [currentStep, currentQuestionIndex]);
  
  // Inicia o timer do quiz completo
  useEffect(() => {
    if (currentStep === 'welcome') {
      setQuizStartTime(null);
      setTotalQuizTime(0);
    } else if (currentStep === 'question' && currentQuestionIndex === 0) {
      setQuizStartTime(Date.now());
    } else if (currentStep === 'results' && quizStartTime) {
      setTotalQuizTime(Date.now() - quizStartTime);
    }
  }, [currentStep, currentQuestionIndex, quizStartTime]);
  
  // Funções para manipular o quiz
  const answerQuestion = (questionIndex: number, answerIndex: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentStep('userForm');
    }
  };
  
  const pauseTimer = () => {
    setIsQuestionTimerActive(false);
  };
  
  const resumeTimer = () => {
    setIsQuestionTimerActive(true);
  };
  
  const recordTimingData = (responseTime: number, didExpire: boolean) => {
    setTimingData(prev => [
      ...prev,
      {
        questionId: currentQuestionIndex,
        responseTime,
        didExpire
      }
    ]);
  };
  
  const setUserData = (data: UserInfo) => {
    setUserInfo(data);
    setCurrentStep('results');
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quizQuestions.length).fill(-1));
    setTimingData([]);
    setCurrentStep('question');
    setQuizStartTime(Date.now());
  };
  
  const goToWelcome = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(quizQuestions.length).fill(-1));
    setTimingData([]);
    setUserInfo(null);
    setCurrentStep('welcome');
  };
  
  const value = {
    currentStep,
    setCurrentStep,
    currentQuestionIndex,
    userAnswers,
    answerQuestion,
    goToNextQuestion,
    userInfo,
    setUserInfo,
    setUserData,
    timingData,
    recordTimingData,
    questionTimeLeft,
    questionTotalTime,
    isQuestionTimerActive,
    pauseTimer,
    resumeTimer,
    totalQuizTime,
    score,
    averageResponseTime,
    numTimeouts,
    restartQuiz,
    goToWelcome
  };
  
  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default QuizProvider; 