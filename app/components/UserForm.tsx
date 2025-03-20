'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { professionOptions } from '../data/quizData';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useScreenSize } from '../utils/useScreenSize';

const UserForm: React.FC = () => {
  const { setUserData, score } = useQuiz();
  const { isMobile, isTablet } = useScreenSize();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    profession: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      profession: ''
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone) && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
      isValid = false;
    }

    if (!formData.profession) {
      newErrors.profession = 'Profissão é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      // Formata o telefone como (99) 99999-9999
      if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      }
      if (value.length > 10) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`;
      }
      
      setFormData(prev => ({ ...prev, phone: value }));
      
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulando um pequeno atraso para mostrar o estado de envio
      await new Promise(resolve => setTimeout(resolve, 800));
      setUserData(formData);
      setIsSubmitting(false);
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Função para calcular o estilo de progresso do formulário
  const calculateProgress = () => {
    let filledFields = 0;
    if (formData.name) filledFields++;
    if (formData.email) filledFields++;
    if (formData.phone) filledFields++;
    if (formData.profession) filledFields++;
    
    return (filledFields / 4) * 100;
  };

  // Variáveis de scoreClass para estilização baseada na pontuação
  let scoreColor = 'rgb(16, 185, 129)';
  if (score < 4) {
    scoreColor = '#ef4444';
  } else if (score < 7) {
    scoreColor = '#f59e0b';
  } else {
    scoreColor = '#10b981';
  }

  // Variação de animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[800px] bg-dark-100/80 backdrop-blur-lg rounded-xl shadow-lg border border-primary-900/20 overflow-hidden"
      >
        {/* Progress bar at the top */}
        <div className="h-1 w-full bg-dark-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress()}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
          />
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="text-center mb-6 md:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 shadow-lg shadow-primary-900/20"
            >
              <span className="text-3xl font-bold text-white">{score}/10</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-2 text-white"
            >
              Seu Diagnóstico está Pronto!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-sm md:text-base max-w-xl mx-auto"
            >
              Complete seus dados abaixo para receber sua análise personalizada e material exclusivo:
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {[
              {
                title: 'Diagnóstico Personalizado',
                description: 'Análise detalhada do seu conhecimento atual em Anatomia, identificando pontos fortes e áreas de desenvolvimento'
              },
              {
                title: 'Guia de Estudos Completo',
                description: 'Material exclusivo com roteiro de estudos, resumos e dicas práticas para dominar a Anatomia'
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-dark-200/50 rounded-lg p-4 border border-primary-900/20 relative overflow-hidden"
              >
                {/* Left accent border */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600" />
                
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-primary-400 flex-shrink-0" />
                  <h3 className="font-semibold text-white text-sm md:text-base">{benefit.title}</h3>
                </div>
                <p className="text-gray-300 text-xs md:text-sm pl-6">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  placeholder="Seu nome completo"
                  className={`w-full bg-dark-200 border text-white py-3 px-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500/30' : 
                    focusedField === 'name' ? 'border-primary-500 focus:ring-primary-500/30' : 'border-dark-300'
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-red-400 text-xs flex items-center gap-1"
                  >
                    <span className="bg-red-500/20 p-0.5 rounded-full">!</span>
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  placeholder="Seu melhor e-mail"
                  className={`w-full bg-dark-200 border text-white py-3 px-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500/30' : 
                    focusedField === 'email' ? 'border-primary-500 focus:ring-primary-500/30' : 'border-dark-300'
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-red-400 text-xs flex items-center gap-1"
                  >
                    <span className="bg-red-500/20 p-0.5 rounded-full">!</span>
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  placeholder="Seu telefone com DDD"
                  className={`w-full bg-dark-200 border text-white py-3 px-10 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-500/30' : 
                    focusedField === 'phone' ? 'border-primary-500 focus:ring-primary-500/30' : 'border-dark-300'
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-red-400 text-xs flex items-center gap-1"
                  >
                    <span className="bg-red-500/20 p-0.5 rounded-full">!</span>
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
                  <FaBriefcase />
                </span>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  onFocus={() => handleFocus('profession')}
                  onBlur={handleBlur}
                  className={`w-full bg-dark-200 border text-white py-3 px-10 rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none ${
                    errors.profession ? 'border-red-500 focus:ring-red-500/30' : 
                    focusedField === 'profession' ? 'border-primary-500 focus:ring-primary-500/30' : 'border-dark-300'
                  }`}
                >
                  <option value="">Selecione sua área de atuação</option>
                  {professionOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              <AnimatePresence>
                {errors.profession && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-red-400 text-xs flex items-center gap-1"
                  >
                    <span className="bg-red-500/20 p-0.5 rounded-full">!</span>
                    {errors.profession}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-dark-200/50 rounded-lg p-3 flex items-start gap-3 border border-primary-900/20 mt-2"
            >
              <FaLock className="text-primary-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300 text-xs">
                Seus dados estão seguros e serão utilizados apenas para enviar informações sobre o curso Anatomia Sem Medo. Não compartilhamos seus dados com terceiros.
              </p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Receber Meu Diagnóstico Completo <FaArrowRight />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserForm; 