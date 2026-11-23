import React, { useState } from "react";
import { ConfectionerySettings } from "../../types";
import { api } from "../../api/client";

interface AdminSettingsProps {
  settings: ConfectionerySettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<ConfectionerySettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await api.updateSettings(formData);
      setSaveMessage("Configurações salvas com sucesso!");
      onRefresh();
    } catch (err: any) {
      setSaveMessage(`Erro: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage("A nova senha e a confirmação não coincidem.");
      return;
    }

    setPwdLoading(true);
    setPwdMessage(null);

    try {
      await api.changePassword(currentPassword, newPassword);
      setPwdMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdMessage(`Erro: ${err.message}`);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
          Configurações da Confeitaria
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Atualize os dados de contato, endereço, horários e textos que aparecem no site e aplicativo
        </p>

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nome do Negócio
              </label>
              <input
                type="text"
                value={formData.store_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, store_name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                WhatsApp para Encomendas (apenas números com DDD)
              </label>
              <input
                type="text"
                value={formData.whatsapp_number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                placeholder="5524999679906"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Endereço de Retirada
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Bairro / Cidade
              </label>
              <input
                type="text"
                value={formData.neighborhood || ""}
                onChange={(e) =>
                  setFormData({ ...formData, neighborhood: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={formData.cep || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Horários de Atendimento & Retirada
              </label>
              <input
                type="text"
                value={formData.pickup_hours || ""}
                onChange={(e) =>
                  setFormData({ ...formData, pickup_hours: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Formas de Pagamento Aceitas
              </label>
              <input
                type="text"
                value={formData.payment_methods || ""}
                onChange={(e) =>
                  setFormData({ ...formData, payment_methods: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Texto Institucional de Apresentação
            </label>
            <textarea
              rows={3}
              value={formData.about_text || ""}
              onChange={(e) =>
                setFormData({ ...formData, about_text: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
            />
          </div>

          {/* Sazonal: Seção de Natal Toggle */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.christmas_active === "true"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    christmas_active: e.target.checked ? "true" : "false",
                  })
                }
                className="rounded text-red-600 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-red-900 block">
                  🎄 Ativar Seção Especial de Encomendas de Natal no Site
                </span>
                <span className="text-[11px] text-red-700">
                  Desmarque fora do período natalino para ocultar a aba de Natal dos clientes.
                </span>
              </div>
            </label>
          </div>

          {saveMessage && (
            <p className="text-xs font-bold text-purple-700">{saveMessage}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 shadow-md"
            >
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm max-w-xl">
        <h3 className="text-lg font-bold font-serif text-gray-900 mb-1">
          Segurança: Alterar Senha de Acesso
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          A senha é protegida com criptografia no servidor.
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Senha Atual
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nova Senha (mín. 6 caracteres)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          {pwdMessage && (
            <p className="text-xs font-bold text-purple-700">{pwdMessage}</p>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-purple-900 hover:bg-purple-950"
          >
            {pwdLoading ? "Alterando..." : "Atualizar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};
