
import React from 'react';
import ColoringBookGenerator from './components/ColoringBookGenerator';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
      <header className="p-6 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-800 tracking-tight">
          Gemini Boyama Kitabı ve Sohbet
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Yapay Zeka ile Yarat, Boya ve Sohbet Et!
        </p>
      </header>
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ColoringBookGenerator />
          </div>
          <div className="lg:col-span-2">
            <Chatbot />
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-slate-500 mt-8">
        <p>&copy; 2024 - React ve Gemini API ile oluşturuldu</p>
      </footer>
    </div>
  );
};

export default App;