'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import { useScreenSize } from '../utils/useScreenSize';
import { FaClock } from 'react-icons/fa';

interface TimerProps {
  timeLeft: number; // tempo restante em segundos
  totalTime: number; // tempo total em segundos
  isActive: boolean; // controla se o timer está ativo ou pausado
  isSmall?: boolean; // se o timer deve usar tamanho reduzido (para mobile)
  warningThreshold?: number; // limiar para começar alertas visuais (percentual 0-1)
  criticalThreshold?: number; // limiar para alertas críticos (percentual 0-1)
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  timeLeft,
  totalTime,
  isActive = true,
  isSmall = false,
  warningThreshold = 0.5, 
  criticalThreshold = 0.25,
  className = '',
}) => {
  const { isMobile } = useScreenSize();
  const actualIsSmall = isSmall || isMobile;
  
  // Calcula a porcentagem de tempo restante
  const timePercentage = timeLeft / totalTime;
  const progress = (timeLeft / totalTime) * 100;
  
  // Determina o estado atual do timer
  const timerState = 
    timePercentage <= criticalThreshold 
      ? 'critical' 
      : timePercentage <= warningThreshold 
        ? 'warning' 
        : 'normal';

  // Determina se deve mostrar a animação pulsante
  const shouldPulse = timerState === 'critical' && isActive;

  // Cores baseadas no estado do timer
  const getTimerColor = () => {
    if (progress > 0.6) return { 
      textColor: 'text-primary-400',
      ringColor: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10'
    };
    if (progress > 0.3) return {
      textColor: 'text-yellow-400', 
      ringColor: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10'
    };
    return {
      textColor: 'text-red-400',
      ringColor: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10'
    };
  };

  // Formata o tempo restante em MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const { textColor, ringColor, bgColor } = getTimerColor();
  const size = isSmall ? 'w-[60px] h-[60px]' : 'w-[70px] h-[70px]';
  const fontSize = isSmall ? 'text-xs' : 'text-sm';

  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      {/* Fundo do timer */}
      <div className={`absolute inset-0 rounded-full ${bgColor} border border-dark-300/50`}></div>
      
      {/* Anel de progresso */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <motion.circle
          initial={{ pathLength: 1 }}
          animate={{ pathLength: progress }}
          transition={{ type: "tween", duration: 0.5 }}
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={`url(#${ringColor.replace(/\s+/g, '')})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="289.027"
          strokeDashoffset="0"
          transform="rotate(-90, 50, 50)"
          className="drop-shadow-glow-sm"
        />
        
        {/* Gradiente para o anel */}
        <defs>
          <linearGradient id={ringColor.replace(/\s+/g, '')} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-500)" />
            <stop offset="100%" stopColor="var(--primary-700)" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="flex flex-col items-center justify-center z-10">
        <span className={`font-bold ${textColor} ${fontSize} drop-shadow-md`}>
          {formatTime(timeLeft)}
        </span>
        <span className={`text-gray-300 text-[9px] mt-[-2px] opacity-80`}>
          <FaClock className="inline-block mr-1 text-[8px]" />
          {isActive ? "ATIVO" : "PAUSADO"}
        </span>
      </div>
      
      {/* Efeito de pulso quando o tempo está acabando */}
      {isActive && progress < 0.3 && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-red-500/10"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      )}
    </div>
  );
};

export default Timer; 