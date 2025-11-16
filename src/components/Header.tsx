import React, { useState } from "react";
import { MenuIcon, CloseIcon } from "./Icons";

interface HeaderProps {
  onChristmasOrder: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChristmasOrder }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Nossos Bolos", href: "#bolos" },
    { name: "Galeria", href: "#galeria" },
    { name: "Informações", href: "#informacoes" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <header className="bg-purple-50/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-purple-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center flex-shrink-0 transition-transform hover:scale-105 duration-200"
          >
            <img
              src="/public/images/cake.png"
              alt="Logo Cantinho do Doce"
              className="h-8 w-8 md:h-10 md:w-10 drop-shadow-sm"
            />
            <span className="ml-2 text-xl md:text-2xl font-bold text-purple-800 tracking-tight whitespace-nowrap">
              Cantinho do Doce
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 text-sm lg:text-base hover:underline underline-offset-4 decoration-2"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onChristmasOrder}
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 min-w-[160px]"
            >
              🎄 Encomenda de Natal
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all duration-200"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200 border border-transparent hover:border-purple-200"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 px-4">
              <button
                onClick={() => {
                  onChristmasOrder();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🎄 Encomenda de Natal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
