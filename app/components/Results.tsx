'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { quizQuestions, professionOptions } from '../data/quizData';
import { FaHome, FaRedo, FaCheck, FaTimes, FaShare, FaTrophy, FaRegClock, FaRegLightbulb, FaChevronDown, FaChevronUp, FaDownload, FaBookOpen } from 'react-icons/fa';
import { useScreenSize } from '../utils/useScreenSize';
import Confetti from 'react-confetti';
import { submitQuizResults } from '../utils/webhookService';

const Results: React.FC = () => {
  const { 
    userAnswers, 
    restartQuiz, 
    goToWelcome, 
    score,
    averageResponseTime,
    numTimeouts,
    userInfo,
    timingData,
    totalQuizTime
  } = useQuiz();
  
  const { isMobile, isTablet } = useScreenSize();
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);
  const [webhookSent, setWebhookSent] = useState(false);
  
  // Força a renderização após a montagem para o Confetti funcionar corretamente
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    
    // Oculta o confetti após 5 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Enviar dados para o webhook quando a tela de resultados for carregada
  useEffect(() => {
    const sendData = async () => {
      if (userInfo && !webhookSent) {
        // URL do webhook - substitua pela URL real do seu webhook
        const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://exemplo.com/webhook';
        
        try {
          const success = await submitQuizResults(
            quizQuestions,
            professionOptions,
            userInfo,
            userAnswers,
            score,
            timingData,
            totalQuizTime,
            webhookUrl
          );
          
          if (success) {
            console.log('Dados enviados com sucesso para o webhook');
            setWebhookSent(true);
          }
        } catch (error) {
          console.error('Erro ao enviar dados para o webhook:', error);
        }
      }
    };
    
    sendData();
  }, [userInfo, userAnswers, score, timingData, totalQuizTime, webhookSent]);
  
  // Calcula métricas
  const totalQuestions = quizQuestions.length;
  const correctAnswers = score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentCorrect = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Resultados baseados na pontuação
  const getResultMessage = () => {
    if (percentCorrect >= 90) return "Excelente! Você é um especialista em anatomia!";
    if (percentCorrect >= 70) return "Muito bom! Você tem um conhecimento sólido de anatomia!";
    if (percentCorrect >= 50) return "Bom! Você tem uma compreensão básica de anatomia.";
    return "Continue estudando! A anatomia requer prática constante.";
  };
  
  // Tempo médio formatado
  const formattedAverageTime = () => {
    if (averageResponseTime === 0) return "N/A";
    const seconds = Math.floor(averageResponseTime / 1000);
    const milliseconds = Math.floor((averageResponseTime % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };
  
  // Avaliação do tempo de resposta
  const getTimeEvaluation = () => {
    if (averageResponseTime === 0) return "N/A";
    const avgTime = averageResponseTime / 1000;
    if (avgTime < 8) return "Muito rápido!";
    if (avgTime < 15) return "Bom tempo!";
    if (avgTime < 25) return "Tempo moderado";
    return "Um pouco lento";
  };
  
  // Toggle para expandir/colapsar questões
  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter(q => q !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };
  
  // Função para compartilhar resultado
  const shareResults = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Meu resultado no Quiz Anatomia Sem Medo',
          text: `Acertei ${correctAnswers} de ${totalQuestions} questões (${percentCorrect}%)! ${getResultMessage()}`,
          url: window.location.href,
        });
      } else {
        // Fallback para navegadores que não suportam a Web Share API
        navigator.clipboard.writeText(
          `Acertei ${correctAnswers} de ${totalQuestions} questões (${percentCorrect}%) no Quiz Anatomia Sem Medo! ${getResultMessage()} ${window.location.href}`
        );
        alert('Resultado copiado para a área de transferência! Cole em suas redes sociais para compartilhar.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient elements */}
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
              width: (isMobile ? 80 : 150) + Math.random() * (isMobile ? 120 : 250),
              height: (isMobile ? 80 : 150) + Math.random() * (isMobile ? 120 : 250),
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
              filter: 'blur(35px)'
            }}
          />
        ))}
      </div>

      {/* Confetti animation para altas pontuações */}
      {isMounted && showConfetti && percentCorrect >= 70 && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 300}
          recycle={false}
          numberOfPieces={isMobile ? 100 : 200}
          gravity={0.15}
          colors={['#10b981', '#059669', '#047857', '#d1fae5', '#a7f3d0']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-full md:max-w-3xl bg-dark-100/80 backdrop-blur-lg rounded-xl shadow-lg border border-primary-900/20"
      >
        {/* Header with trophy */}
        <div className="border-b border-primary-900/20 p-4 md:p-6 bg-gradient-to-r from-primary-900/30 to-dark-200/50 rounded-t-xl">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 rounded-full shadow-md shadow-primary-900/20">
              <FaTrophy className="text-white text-3xl md:text-4xl" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Resultados do Quiz</h1>
              <p className="text-primary-200 text-sm md:text-base">{getResultMessage()}</p>
            </div>
          </motion.div>
        </div>

        {/* Score and stats */}
        <div className="p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6"
          >
            {/* Score card */}
            <div className="bg-gradient-to-br from-primary-900/40 to-dark-200/60 rounded-lg p-4 shadow-md border border-primary-900/30">
              <div className="text-primary-400 text-xs uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <FaCheck className="text-primary-400" /> Pontuação
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{percentCorrect}%</span>
                <span className="text-gray-300 text-sm">({correctAnswers}/{totalQuestions})</span>
              </div>
              <div className="mt-2 h-2 bg-dark-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  style={{ width: `${percentCorrect}%` }}
                />
              </div>
            </div>

            {/* Time card */}
            <div className="bg-gradient-to-br from-primary-900/40 to-dark-200/60 rounded-lg p-4 shadow-md border border-primary-900/30">
              <div className="text-primary-400 text-xs uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <FaRegClock className="text-primary-400" /> Tempo Médio
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-white">{formattedAverageTime()}</span>
                <span className="text-gray-300 text-sm">por questão</span>
              </div>
              <div className="mt-2 text-xs text-gray-300">{getTimeEvaluation()}</div>
            </div>

            {/* Timeout card */}
            <div className="bg-gradient-to-br from-primary-900/40 to-dark-200/60 rounded-lg p-4 shadow-md border border-primary-900/30">
              <div className="text-primary-400 text-xs uppercase font-semibold tracking-wider mb-1 flex items-center gap-1">
                <FaRegLightbulb className="text-primary-400" /> Análise
              </div>
              <div className="text-sm text-gray-100">
                {numTimeouts > 0 ? (
                  <span>Tempo esgotado em <span className="text-red-400 font-semibold">{numTimeouts}</span> questões</span>
                ) : (
                  <span>Respondeu <span className="text-primary-400 font-semibold">todas</span> as questões a tempo!</span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-300">
                {wrongAnswers > 0 ? 
                  `${wrongAnswers} questões incorretas` : 
                  "Todas as questões corretas! Parabéns!"
                }
              </div>
            </div>
          </motion.div>

          {/* Study Guide Card - Adicionar antes da revisão de questões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6 bg-gradient-to-r from-primary-900/40 to-dark-200/50 rounded-lg border border-primary-700/30 overflow-hidden shadow-lg"
          >
            <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="md:flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-primary-600/80 p-2 rounded-lg mt-1">
                    <FaBookOpen className="text-white text-xl md:text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      Guia Completo de Estudos em Anatomia
                    </h3>
                    <p className="text-primary-200 text-sm mb-2">
                      Material exclusivo para aprofundar seus conhecimentos
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 ml-2 pl-2 border-l-2 border-primary-600/30 mb-4">
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-200 text-sm">Resumos detalhados de todos os sistemas do corpo humano</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-200 text-sm">Imagens em alta resolução com legendas explicativas</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-200 text-sm">Técnicas de memorização e esquemas visuais</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-auto text-center">
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary-900/30 transition-all duration-200 w-full md:w-auto"
                  onClick={() => window.open('https://www.anatomiasemmedo.com.br/guia-estudos-pdf', '_blank')}
                >
                  <FaDownload /> Baixar Guia Grátis
                </button>
                <p className="text-gray-300 text-xs mt-2">
                  Formato PDF - Acesso imediato
                </p>
              </div>
            </div>
          </motion.div>

          {/* Question Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-3 border-b border-primary-900/20 pb-2">
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Revisão das Questões
              </h2>
              <span className="text-xs text-primary-300 flex items-center gap-1">
                <FaChevronDown size={10} /> Clique para expandir
              </span>
            </div>
            <div className="space-y-3">
              {quizQuestions.map((question, index) => {
                const isExpanded = expandedQuestions.includes(index);
                const isCorrect = userAnswers[index] === question.correctAnswer;
                
                return (
                  <motion.div 
                    key={index}
                    className="bg-dark-200/60 rounded-lg overflow-hidden shadow-md border border-primary-900/10"
                    initial={false}
                    animate={{ height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Question header - always visible */}
                    <div 
                      className={`p-3 flex justify-between items-center cursor-pointer hover:opacity-90
                        ${isCorrect ? 'bg-primary-900/20 hover:bg-primary-900/30' : 'bg-red-900/20 hover:bg-red-900/30'}`}
                      onClick={() => toggleQuestion(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
                          ${isCorrect ? 'bg-primary-500 text-white' : 'bg-red-500 text-white'}`}>
                          {isCorrect ? <FaCheck size={12} /> : <FaTimes size={12} />}
                        </div>
                        <span className="text-sm text-gray-100 line-clamp-1">
                          {question.question}
                        </span>
                      </div>
                      <div className="text-gray-300 transition-transform duration-300 ease-in-out">
                        {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 text-gray-100 border-t border-primary-900/20"
                      >
                        {question.imageUrl && (
                          <div className="mb-3 rounded overflow-hidden border border-primary-900/20">
                            <img 
                              src={question.imageUrl} 
                              alt="Imagem da questão" 
                              className="w-full h-auto max-h-[150px] object-contain bg-dark-300 p-2"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="font-medium">Sua resposta:</div>
                          <div className={`p-2 rounded
                            ${isCorrect ? 'bg-primary-900/20 text-primary-300' : 'bg-red-900/20 text-red-300'}`}>
                            {userAnswers[index] >= 0 ? question.options[userAnswers[index]] : "Sem resposta"}
                          </div>
                          
                          {!isCorrect && (
                            <>
                              <div className="font-medium">Resposta correta:</div>
                              <div className="p-2 rounded bg-primary-900/20 text-primary-300">
                                {question.options[question.correctAnswer]}
                              </div>
                            </>
                          )}
                          
                          <div className="font-medium">Explicação:</div>
                          <div className="p-2 rounded bg-dark-300/60 text-gray-200">
                            <div dangerouslySetInnerHTML={{ __html: isCorrect ? question.correctFeedback : question.incorrectFeedback }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;