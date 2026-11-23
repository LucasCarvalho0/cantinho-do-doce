import React, { useState } from "react";
import { Cake } from "../../types";
import { api } from "../../api/client";
import { PlusIcon, EditIcon, TrashIcon, CloseIcon } from "../Icons";
import { formatCurrency } from "../../utils/whatsapp";

interface AdminProductsProps {
  products: Cake[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onRefresh,
}) => {
  const [editingProduct, setEditingProduct] = useState<Partial<Cake> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct({
      type: "round",
      cm: 20,
      price: 150,
      slices: "20 fatias",
      image: "/images/bolo_rosas_30cm.jpg",
      title: "",
      description: "",
      category: "bolos",
      is_active: 1,
      is_christmas: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Cake) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    setMessage(null);

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
        setMessage("Produto atualizado com sucesso!");
      } else {
        await api.createProduct(editingProduct);
        setMessage("Produto cadastrado com sucesso!");
      }
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingProduct(null);
        onRefresh();
      }, 800);
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto do cardápio?")) return;
    try {
      await api.deleteProduct(id);
      onRefresh();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleToggleActive = async (p: Cake) => {
    if (!p.id) return;
    try {
      await api.updateProduct(p.id, { is_active: p.is_active ? 0 : 1 });
      onRefresh();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div>
          <h3 className="text-xl font-bold font-serif text-gray-900">
            Gerenciamento de Cardápio & Bolos
          </h3>
          <p className="text-xs text-gray-500">
            Cadastre novos tamanhos, altere preços e ative ou pause produtos disponíveis no site
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 shadow-md"
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          Cadastrar Novo Bolo
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id || `${p.type}-${p.cm}`}
            className={`bg-white p-4 rounded-3xl border transition-all flex flex-col justify-between ${
              p.is_active
                ? "border-purple-100 shadow-sm hover:shadow-md"
                : "border-gray-200 opacity-60 bg-gray-50"
            }`}
          >
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={p.image}
                alt={p.title || `Bolo ${p.cm}cm`}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-purple-50"
                onError={(e) => {
                  e.currentTarget.src = "/images/hero01.jpg";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {p.type === "round" ? "Redondo" : p.type === "square" ? "Quadrado" : "Especial"}
                  </span>
                  {p.is_christmas === 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
                      🎄 Natal
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {p.title || `Bolo ${p.cm}cm`}
                </h4>
                <p className="text-xs text-gray-500">{p.slices}</p>
                <p className="text-sm font-extrabold text-purple-700 mt-1">
                  {formatCurrency(p.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => handleToggleActive(p)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  p.is_active
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {p.is_active ? "Ativo no Site" : "Pausado"}
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Editar produto"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                {p.id && (
                  <button
                    onClick={() => handleDelete(p.id!)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir produto"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-gray-900 mb-4">
              {editingProduct.id ? "Editar Bolo" : "Cadastrar Novo Bolo"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Formato *
                  </label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  >
                    <option value="round">Redondo</option>
                    <option value="square">Quadrado</option>
                    <option value="christmas">Especial de Natal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Diâmetro / Tamanho (cm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.cm}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        cm: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Preço Base (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Fatias / Rendimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slices}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        slices: e.target.value,
                      })
                    }
                    placeholder="Ex: 20-25 fatias"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Título do Produto
                </label>
                <input
                  type="text"
                  value={editingProduct.title || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  placeholder="Ex: Bolo Redondo 20cm com Flores"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Caminho / URL da Imagem *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      image: e.target.value,
                    })
                  }
                  placeholder="/images/bolo_rosas_30cm.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Informações sobre rendimento e sabores ideais."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_christmas === 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_christmas: e.target.checked ? 1 : 0,
                      })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>🎄 Produto Especial de Natal</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active === 1}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_active: e.target.checked ? 1 : 0,
                      })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>Visível no site</span>
                </label>
              </div>

              {message && (
                <p className="text-xs font-bold text-purple-700 mt-2">{message}</p>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700"
                >
                  {isSaving ? "Salvando..." : "Salvar Bolo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
