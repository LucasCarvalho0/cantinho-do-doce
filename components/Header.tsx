
import React, { useState } from 'react';
import { CakeIcon, MenuIcon, CloseIcon } from './Icons';

interface HeaderProps {
  onChristmasOrder: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChristmasOrder }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Nossos Bolos', href: '#bolos' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Informações', href: '#informacoes' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header className="bg-purple-50/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <CakeIcon className="h-8 w-8 text-purple-600" />
            <span className="ml-3 text-2xl font-bold text-purple-800 tracking-tight">Cantinho do Doce</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center">
            <button
              onClick={onChristmasOrder}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Encomenda de Natal
            </button>
            <div className="md:hidden ml-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-100"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 px-3">
              <button
                onClick={() => {
                  onChristmasOrder();
                  setIsMenuOpen(false);
                }}
                className="w-full items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Encomenda de Natal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
