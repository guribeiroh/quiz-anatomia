'use client';

import React from 'react';
import { useQuiz } from './context/QuizContext';
import Welcome from './components/Welcome';
import Question from './components/Question';
import UserForm from './components/UserForm';
import Results from './components/Results';

export default function Home() {
  const { currentStep } = useQuiz();

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 text-gray-100">
      {currentStep === 'welcome' && <Welcome />}
      {currentStep === 'question' && <Question />}
      {currentStep === 'userForm' && <UserForm />}
      {currentStep === 'results' && <Results />}
    </main>
  );
}
