'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { FaPlay, FaBrain, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';
import { useScreenSize } from '../utils/useScreenSize';

const Welcome: React.FC = () => {
  const { questionTotalTime, setCurrentStep } = useQuiz();
  const [isReady, setIsReady] = useState(false);
  const { isMobile, isTablet, screenSize } = useScreenSize();

  // Formatar o tempo total em segundos
  const formatTimeSeconds = (seconds: number): string => {
    return `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  };

  const handleStartQuiz = () => {
    if (isReady) {
      setCurrentStep('question');
    } else {
      setIsReady(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Ajustar os tamanhos e espaçamentos com base no tamanho da tela
  const getMainContainerPadding = () => {
    if (isMobile) return '1rem';
    if (isTablet) return '1.5rem';
    return '2.5rem';
  };

  const getIconSize = () => {
    if (isMobile) return '4rem';
    if (isTablet) return '5rem';
    return '5.5rem';
  };

  const getTitleSize = () => {
    if (isMobile) return '1.75rem';
    if (isTablet) return '2rem';
    return '2.5rem';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo animados - bolhas de efeito */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(isMobile ? 4 : 8)].map((_, i) => (
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
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[800px] md:max-w-[90%] lg:max-w-[800px]"
        style={{
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: getMainContainerPadding(),
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          overflow: 'hidden'
        }}
      >
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="animate-glow"
              style={{ 
                fontSize: getIconSize(),
                color: 'var(--primary-500)',
              }}
            >
              <FaBrain />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '0',
                right: '-10px',
                fontSize: isMobile ? '1.5rem' : '2rem',
                color: 'var(--primary-300)',
                filter: 'drop-shadow(0 0 8px rgba(110, 231, 183, 0.6))'
              }}
            >
              <BsLightningChargeFill />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: getTitleSize(),
            fontWeight: '800',
            textAlign: 'center',
            color: 'white',
            marginTop: '1rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'linear-gradient(to right, var(--primary-300), var(--primary-500))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
          }}
        >
          Anatomia Sem Medo
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-center mb-6 text-sm md:text-base"
          style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}
        >
          Teste seus conhecimentos sobre anatomia humana e descubra como aprimorar sua compreensão deste fascinante universo.
        </motion.p>

        {!isReady ? (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-dark-200/50 rounded-xl p-3 md:p-4 lg:p-6 mb-6"
              style={{
                borderRadius: '0.75rem',
                marginBottom: '2rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaInfoCircle className="text-primary-400" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }} />
                <h3 className="text-base md:text-xl font-bold text-white uppercase tracking-wider">
                  Como Funciona:
                </h3>
              </div>
              
              <ul className="flex flex-col gap-2 md:gap-3 text-sm md:text-base">
                {[
                  'O quiz é composto por 10 perguntas sobre anatomia humana',
                  `Você terá ${formatTimeSeconds(questionTotalTime)} para responder cada pergunta`,
                  'Quando o timer chegar a zero, a próxima pergunta será exibida automaticamente',
                  'Responda com atenção, mas não demore muito em cada questão',
                  'Quanto maior sua pontuação, maior seu conhecimento em anatomia'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded bg-black/20 border border-primary-900/20"
                  >
                    <div className="min-w-[20px] md:min-w-[24px] h-[20px] md:h-[24px] rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs mt-0.5">
                      {index + 1}
                    </div>
                    <span dangerouslySetInnerHTML={{ __html: 
                      item.includes(formatTimeSeconds(questionTotalTime)) 
                        ? item.replace(formatTimeSeconds(questionTotalTime), `<strong style="color: var(--primary-400)">${formatTimeSeconds(questionTotalTime)}</strong>`) 
                        : item 
                    }} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-300 p-4 mb-6 text-sm md:text-base"
          >
            Pronto para começar? Clique no botão abaixo!
          </motion.div>
        )}

        <motion.button
          onClick={handleStartQuiz}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 flex items-center justify-center gap-2 md:gap-3 rounded-xl font-bold text-base md:text-lg text-white"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--primary-600), var(--primary-800))',
            margin: '0 auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
          }}
        >
          {isReady ? (
            <>
              Iniciar Quiz <FaPlay style={{ marginLeft: '0.25rem' }} />
            </>
          ) : (
            <>
              Estou Pronto <FaArrowRight style={{ marginLeft: '0.25rem' }} />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome; 