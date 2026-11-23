import React, { useState } from "react";
import { api } from "../../api/client";
import { AdminUser } from "../../types";
import { CloseIcon, ShieldIcon } from "../Icons";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("janaina");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login(username.trim(), password);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao entrar. Verifique seus dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
            Painel da Confeiteira
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Acesso exclusivo para Janaína Mendes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm"
              placeholder="Usuário administrativo"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Verificando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
};
