'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { quizQuestions } from '../data/quizData';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import Timer from './Timer';
import { useScreenSize } from '../utils/useScreenSize';

const Question: React.FC = () => {
  const {
    currentQuestionIndex,
    userAnswers,
    answerQuestion,
    goToNextQuestion,
    recordTimingData,
    questionTimeLeft,
    questionTotalTime,
    isQuestionTimerActive,
    pauseTimer,
    resumeTimer
  } = useQuiz();

  const { isMobile, isTablet } = useScreenSize();
  const question = quizQuestions[currentQuestionIndex];
  const [isOptionHovered, setIsOptionHovered] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const selectedAnswer = userAnswers[currentQuestionIndex];
  const isAnswerSelected = selectedAnswer !== -1;
  const isAnswerCorrect = selectedAnswer === question.correctAnswer;

  useEffect(() => {
    // Registra o tempo de início da pergunta quando muda de questão
    setQuestionStartTime(Date.now());
    setShowFeedback(false);
    setTimerExpired(false);
  }, [currentQuestionIndex]);

  // Efeito para verificar se o timer da pergunta expirou
  useEffect(() => {
    if (questionTimeLeft === 0 && !showFeedback && !timerExpired && isQuestionTimerActive) {
      handleTimeUp();
    }
  }, [questionTimeLeft, showFeedback, timerExpired, isQuestionTimerActive]);

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    answerQuestion(currentQuestionIndex, index);
    // Pausa o timer quando uma resposta é selecionada
    pauseTimer();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === -1) return;
    
    // Registra o tempo de resposta
    const responseTime = Date.now() - questionStartTime;
    recordTimingData(responseTime, false);
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setTimerExpired(false);
    goToNextQuestion();
  };

  const getFeedback = (): string => {
    if (isAnswerCorrect) {
      return question.correctFeedback;
    } else {
      return question.incorrectFeedback;
    }
  };

  const handleTimeUp = () => {
    if (!isAnswerSelected && !showFeedback) {
      setTimerExpired(true);
      
      // Registra o tempo de resposta como expirado
      const responseTime = Date.now() - questionStartTime;
      recordTimingData(responseTime, true);
      
      // Se o tempo acabar e nenhuma resposta foi selecionada, considera como errada
      if (selectedAnswer === -1) {
        // Seleciona uma resposta incorreta aleatoriamente
        const incorrectOptions = question.options
          .map((_, index) => index)
          .filter(index => index !== question.correctAnswer);
        
        const randomIncorrectIndex = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        answerQuestion(currentQuestionIndex, randomIncorrectIndex);
        
        // Mostra o feedback de resposta errada
        setTimeout(() => {
          setShowFeedback(true);
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 md:p-6">
      {/* Elementos de fundo animados - bolhas de efeito */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(isMobile ? 3 : 6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 500),
              opacity: 0.05 + Math.random() * 0.1
            }}
            animate={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 500),
              opacity: 0.05 + Math.random() * 0.1
            }}
            transition={{ 
              duration: 15 + Math.random() * 30, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              position: 'absolute',
              width: (isMobile ? 50 : 100) + Math.random() * (isMobile ? 100 : 200),
              height: (isMobile ? 50 : 100) + Math.random() * (isMobile ? 100 : 200),
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
              filter: 'blur(30px)'
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-full md:max-w-[800px] bg-dark-100/80 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-lg border border-primary-900/20"
      >
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 md:mb-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-primary-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                Pergunta {currentQuestionIndex + 1} de 10
              </span>
              <span className="bg-dark-300/80 text-gray-100 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                {question.category}
              </span>
            </div>
            
            <Timer
              timeLeft={questionTimeLeft}
              totalTime={questionTotalTime}
              isActive={isQuestionTimerActive && !showFeedback}
              isSmall={isMobile}
            />
          </div>

          <motion.h2 
            className="text-lg md:text-2xl font-semibold text-white mb-3 md:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {question.question}
          </motion.h2>

          {question.imageUrl && (
            <motion.div 
              className="mb-4 md:mb-6 rounded-lg overflow-hidden border border-primary-900/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src={question.imageUrl} 
                alt="Imagem da questão" 
                className="w-full h-auto max-h-[200px] md:max-h-[300px] object-contain bg-dark-200 rounded-lg"
              />
            </motion.div>
          )}
        </div>

        {/* Opções de respostas */}
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {question.options.map((option, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => handleSelectAnswer(index)}
              onMouseEnter={() => setIsOptionHovered(index)}
              onMouseLeave={() => setIsOptionHovered(null)}
              className={`
                relative p-3 md:p-4 rounded-lg cursor-pointer
                ${selectedAnswer === index ? 'border-2 border-primary-500' : 'border border-primary-900/20'}
                ${showFeedback && index === question.correctAnswer ? 'bg-primary-900/20 dark:bg-primary-900/30' : ''}
                ${showFeedback && selectedAnswer === index && index !== question.correctAnswer ? 'bg-red-900/20 dark:bg-red-900/30' : ''}
                ${!showFeedback && (isOptionHovered === index || selectedAnswer === index) ? 'bg-dark-200 dark:bg-dark-300/60' : 'bg-dark-100/50 dark:bg-dark-200/40'}
                transition-all duration-200 hover:shadow-md hover:shadow-primary-900/20
              `}
              style={{
                opacity: showFeedback && index !== question.correctAnswer && selectedAnswer !== index ? 0.6 : 1
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                  ${selectedAnswer === index ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-200'}
                  ${showFeedback && index === question.correctAnswer ? 'bg-primary-500 text-white' : ''}
                  ${showFeedback && selectedAnswer === index && index !== question.correctAnswer ? 'bg-red-500 text-white' : ''}
                `}>
                  {showFeedback ? (
                    index === question.correctAnswer ? (
                      <FaCheck className="text-xs" />
                    ) : selectedAnswer === index ? (
                      <FaTimes className="text-xs" />
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                    )
                  ) : (
                    <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <div className="flex-1 text-sm md:text-base text-gray-100">{option}</div>
              </div>

              {showFeedback && (
                <AnimatePresence>
                  {index === question.correctAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 pt-2 border-t border-primary-700/30 text-primary-400 dark:text-primary-300 text-xs md:text-sm"
                    >
                      <strong>Correto!</strong>
                    </motion.div>
                  )}
                  {selectedAnswer === index && index !== question.correctAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 pt-2 border-t border-red-700/30 text-red-400 dark:text-red-300 text-xs md:text-sm"
                    >
                      <strong>Incorreto!</strong>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feedback da resposta */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-sm md:text-base ${
                isAnswerCorrect 
                  ? 'bg-primary-900/20 border border-primary-700/30 text-primary-200 dark:bg-primary-900/30 dark:border-primary-800/30 dark:text-primary-300' 
                  : 'bg-red-900/20 border border-red-700/30 text-red-200 dark:bg-red-900/30 dark:border-red-800/30 dark:text-red-300'
              }`}
            >
              <p className="mb-2 font-medium">
                {isAnswerCorrect ? 'Correto!' : 'Incorreto!'}
              </p>
              <p dangerouslySetInnerHTML={{ __html: getFeedback() }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão para próxima pergunta ou submeter resposta */}
        <div className="flex justify-center">
          {showFeedback ? (
            <motion.button
              onClick={handleNextQuestion}
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Próxima Pergunta <FaArrowRight />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === -1}
              whileHover={selectedAnswer !== -1 ? { scale: 1.05, boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' } : {}}
              whileTap={selectedAnswer !== -1 ? { scale: 0.95 } : {}}
              className={`
                px-4 py-2 md:px-6 md:py-3 font-semibold rounded-lg flex items-center gap-2 shadow-md
                ${selectedAnswer !== -1 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:shadow-lg cursor-pointer' 
                  : 'bg-dark-300 text-gray-400 cursor-not-allowed'}
                transition-all duration-200
              `}
            >
              Confirmar Resposta <FaCheck />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Question; 