import React, { useState, useMemo } from "react";
import { Product, ProductSize, ProductOption, CartItemCustomization } from "../types.ts";
import { useCart } from "../context/CartContext.tsx";
import { formatCurrency } from "../utils/whatsapp.ts";
import { DOUGHS, FILLINGS, TOPPINGS, OPTIONALS } from "../data/products.ts";
import { CloseIcon, CheckCircleIcon } from "./Icons.tsx";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [selectedDough, setSelectedDough] = useState<string>(DOUGHS[0]);
  const [selectedFillings, setSelectedFillings] = useState<string[]>([FILLINGS[0]]);
  const [selectedTopping, setSelectedTopping] = useState<string>(TOPPINGS[0]);
  const [selectedOptionals, setSelectedOptionals] = useState<ProductOption[]>([]);
  const [customText, setCustomText] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  
  // Reference Image (for custom cakes)
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Topo de Bolo
  const [hasTopper, setHasTopper] = useState<boolean>(false);
  const [topperNotes, setTopperNotes] = useState("");

  const [desiredDate, setDesiredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleToggleFilling = (filling: string) => {
    if (selectedFillings.includes(filling)) {
      setSelectedFillings(selectedFillings.filter((f) => f !== filling));
    } else {
      if (selectedFillings.length < 2) {
        setSelectedFillings([...selectedFillings, filling]);
      }
    }
  };

  const handleToggleOptional = (opt: ProductOption) => {
    if (selectedOptionals.some((o) => o.name === opt.name)) {
      setSelectedOptionals(selectedOptionals.filter((o) => o.name !== opt.name));
    } else {
      setSelectedOptionals([...selectedOptionals, opt]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Formato inválido. Selecione uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Imagem muito pesada. O tamanho máximo permitido é 5MB.");
      return;
    }
    setReferenceImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setReferenceImagePreview(null);
    setReferenceImageName(null);
    setImageError(null);
  };

  const unitPrice = useMemo(() => {
    const base = selectedSize.price;
    const optionalsSum = selectedOptionals.reduce((acc, opt) => acc + opt.price, 0);
    return base + optionalsSum;
  }, [selectedSize, selectedOptionals]);

  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      size: selectedSize,
      optionals: selectedOptionals,
      hasTopper,
      notes: notes.trim() || undefined,
    };

    if (hasTopper) {
      customization.topperNotes = topperNotes.trim() || undefined;
    }

    if (product.category === "bolos-aniversario") {
      customization.dough = selectedDough;
      customization.fillings = selectedFillings;
      customization.topping = selectedTopping;
      customization.customText = customText.trim() || undefined;
    } else if (product.category === "bolos-personalizados") {
      customization.dough = selectedDough;
      customization.fillings = selectedFillings;
      customization.topping = selectedTopping;
      customization.themeDescription = themeDescription.trim() || undefined;
      customization.customText = customText.trim() || undefined;
      if (referenceImagePreview) {
        customization.referenceImagePreview = referenceImagePreview;
        customization.referenceImageName = referenceImageName || "foto-referencia.jpg";
      }
    } else if (product.category === "natal-anonovo") {
      customization.dough = selectedDough;
      customization.fillings = selectedFillings;
      customization.desiredDate = desiredDate || undefined;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      customization,
      quantity,
      unitPrice,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-[#DDD6FE] my-4 sm:my-6 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#7C3AED] rounded-full hover:bg-[#EDE9FE] transition-colors z-10"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-6 pb-2">
          {/* Top: Image & Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Main Picture + Gallery Thumbnails */}
            <div className="md:col-span-5 space-y-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F3FF] border border-[#DDD6FE] shadow-sm">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {product.gallery && product.gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImage === img ? "border-[#8B5CF6] scale-95 shadow-xs" : "border-transparent opacity-70"
                      }`}
                    >
                      <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center space-x-2">
                {product.badge && (
                  <span className="bg-[#1C1C2E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  <span>★</span>
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({product.reviewCount} avaliações)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C2E] font-serif leading-snug">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {product.description}
              </p>

              {/* Step indicator breadcrumb */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#8B5CF6]">
                <span className="bg-[#EDE9FE] px-2 py-0.5 rounded-md whitespace-nowrap">Passo 1: Tamanho</span>
                <span>→</span>
                <span className="bg-[#EDE9FE] px-2 py-0.5 rounded-md whitespace-nowrap">Passo 2: Sabores</span>
                <span>→</span>
                <span className="bg-[#EDE9FE] px-2 py-0.5 rounded-md whitespace-nowrap">Passo 3: Topo & Detalhes</span>
              </div>
            </div>
          </div>

          <hr className="border-[#DDD6FE]" />

          {/* DYNAMIC CUSTOMIZATION FIELDS BY CATEGORY */}
          <div className="space-y-6">
            {/* 1. SIZE SELECTION */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C2E] mb-2.5">
                1. Escolha o Tamanho & Rendimento *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.sizes.map((s, idx) => {
                  const isSelected = selectedSize.name === s.name;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSize(s)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-[#8B5CF6] bg-[#F5F3FF] shadow-xs"
                          : "border-[#DDD6FE] hover:border-[#C4B5FD] bg-white"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#1C1C2E]">{s.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{s.slices}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#7C3AED]">
                          {formatCurrency(s.price)}
                        </span>
                        {isSelected && <CheckCircleIcon className="w-4 h-4 text-[#8B5CF6] ml-auto mt-0.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. DOUGH SELECTION */}
            {product.category !== "bolos-caseiros" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C2E] mb-2">
                  2. Sabor da Massa *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {DOUGHS.map((dough) => (
                    <button
                      key={dough}
                      type="button"
                      onClick={() => setSelectedDough(dough)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        selectedDough === dough
                          ? "border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-xs"
                          : "border-[#DDD6FE] text-[#4C1D95] bg-white hover:bg-[#F5F3FF]"
                      }`}
                    >
                      {dough}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. FILLINGS SELECTION (Up to 2) */}
            {product.category !== "bolos-caseiros" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C2E]">
                    3. Escolha até 2 Recheios Nobres *
                  </label>
                  <span className="text-[11px] font-bold text-[#8B5CF6] bg-[#EDE9FE] px-2 py-0.5 rounded-full border border-[#C4B5FD]">
                    {selectedFillings.length}/2 selecionados
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FILLINGS.map((filling) => {
                    const isSelected = selectedFillings.includes(filling);
                    return (
                      <button
                        key={filling}
                        type="button"
                        onClick={() => handleToggleFilling(filling)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-[#8B5CF6] bg-[#8B5CF6] text-white"
                            : "border-[#DDD6FE] text-[#4C1D95] bg-white hover:border-[#C4B5FD]"
                        }`}
                      >
                        <span className="truncate">{filling}</span>
                        {isSelected && <span className="ml-1 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. TOPPING SELECTION */}
            {product.category !== "bolos-caseiros" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C2E] mb-2">
                  4. Cobertura Principal *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {TOPPINGS.map((top) => (
                    <button
                      key={top}
                      type="button"
                      onClick={() => setSelectedTopping(top)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        selectedTopping === top
                          ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#5B21B6] font-extrabold shadow-2xs"
                          : "border-[#DDD6FE] text-[#4C1D95] bg-white hover:bg-[#F5F3FF]"
                      }`}
                    >
                      {top}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. OPTIONALS */}
            {product.category !== "bolos-caseiros" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C2E] mb-2">
                  Adicionais & Frutas Especiais (opcional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OPTIONALS.map((opt) => {
                    const isSelected = selectedOptionals.some((o) => o.name === opt.name);
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => handleToggleOptional(opt)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-[#8B5CF6] bg-[#EDE9FE] text-[#5B21B6] font-bold"
                            : "border-[#DDD6FE] text-[#6B7280] bg-white hover:border-[#C4B5FD]"
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] font-extrabold text-[#7C3AED] mt-1">
                          +{formatCurrency(opt.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. TOPO DE BOLO (SECTION 8 - REQUISITO OBRIGATÓRIO) */}
            <div className="bg-[#F8F7FB] p-4 sm:p-5 rounded-3xl border border-[#DDD6FE] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1C1C2E]">
                    ✨ Deseja adicionar topo de bolo?
                  </h4>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    Personalize seu bolo com topper temático exclusivo (nome, idade ou tema comemorativo).
                  </p>
                </div>
              </div>

              {/* Radio-style option buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasTopper(false)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                    !hasTopper
                      ? "border-[#1C1C2E] bg-[#1C1C2E] text-white shadow-xs"
                      : "border-[#DDD6FE] text-[#4C1D95] bg-white hover:bg-[#F5F3FF]"
                  }`}
                >
                  Não preciso de topo
                </button>

                <button
                  type="button"
                  onClick={() => setHasTopper(true)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                    hasTopper
                      ? "border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-xs"
                      : "border-[#DDD6FE] text-[#4C1D95] bg-white hover:bg-[#F5F3FF]"
                  }`}
                >
                  Sim, quero topo de bolo ✨
                </button>
              </div>

              {/* Informações e Detalhes do Topo (Apenas quando escolhe SIM) */}
              {hasTopper && (
                <div className="pt-3 border-t border-[#DDD6FE] space-y-3 animate-fade-in-up">
                  {/* Banner explicativo de envio pelo WhatsApp */}
                  <div className="bg-[#EDE9FE]/80 p-3.5 rounded-2xl border border-[#C4B5FD] flex items-start space-x-2.5">
                    <span className="text-xl flex-shrink-0 mt-0.5">📸</span>
                    <div className="text-xs text-[#5B21B6] leading-relaxed">
                      <strong className="block font-bold text-[#4C1D95] mb-0.5">
                        Envio da Imagem de Referência do Topo:
                      </strong>
                      <p className="text-[#6D28D9]">
                        Não precisa anexar foto aqui pelo site! Ao finalizar e enviar seu pedido pelo WhatsApp, <strong>basta enviar a imagem ou print de inspiração diretamente na conversa com a Janaína</strong> para que ela prepare o modelo idêntico.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                      Observações sobre o Topo de Bolo (Nome, Idade, Tema ou Cores)
                    </label>
                    <input
                      type="text"
                      value={topperNotes}
                      onChange={(e) => setTopperNotes(e.target.value)}
                      placeholder="Ex: Nome: Rafaela, Idade: 7 anos, Cores: lilás e dourado..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none bg-white focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 7. BOLOS PERSONALIZADOS (Tema & Foto Geral do Bolo) */}
            {product.category === "bolos-personalizados" && (
              <div className="bg-[#F5F3FF] p-4 rounded-3xl border border-[#DDD6FE] space-y-4">
                <h4 className="text-xs font-extrabold text-[#5B21B6] uppercase tracking-wider">
                  🎨 Personalização Geral do Bolo
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                    Tema ou Ocasião Especial *
                  </label>
                  <input
                    type="text"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    placeholder="Ex: Aniversário Moana, tema Vasco, Bodas de Prata..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none bg-white focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                    Frase ou Nome que deverá aparecer no Bolo (Plaquinha confeitada)
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ex: Parabéns Sophia 5 Anos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none bg-white focus:border-[#8B5CF6]"
                  />
                </div>

                {/* Upload & Preview of Reference Image */}
                <div>
                  <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                    📸 Enviar Imagem de Referência Geral do Bolo (Opcional)
                  </label>
                  <p className="text-[11px] text-[#9CA3AF] mb-2 leading-relaxed">
                    Você pode selecionar uma foto de exemplo da internet ou de outro bolo que você goste.
                  </p>

                  {!referenceImagePreview ? (
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#C4B5FD] hover:border-[#8B5CF6] rounded-2xl cursor-pointer bg-white transition-colors">
                      <span className="text-2xl mb-1">📷</span>
                      <span className="text-xs font-bold text-[#5B21B6]">Clique para escolher uma imagem</span>
                      <span className="text-[10px] text-[#9CA3AF]">JPG, PNG ou WEBP até 5MB</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative bg-white p-3 rounded-2xl border border-[#8B5CF6] flex items-center space-x-3">
                      <img
                        src={referenceImagePreview}
                        alt="Prévia de referência"
                        className="w-16 h-16 rounded-xl object-cover border border-[#DDD6FE]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1C1C2E] truncate">
                          {referenceImageName || "Imagem selecionada"}
                        </p>
                        <p className="text-[10px] text-green-700 font-semibold">
                          ✓ Imagem carregada na pré-visualização
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                        title="Remover imagem"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {imageError && (
                    <p className="text-xs text-red-600 font-semibold mt-1.5">{imageError}</p>
                  )}
                </div>
              </div>
            )}

            {/* 8. ANIVERSÁRIO: FRASE NO BOLO */}
            {product.category === "bolos-aniversario" && (
              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Texto ou Frase no Bolo (Opcional)
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Felicidades Laura!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none bg-white focus:border-[#8B5CF6]"
                />
              </div>
            )}

            {/* 9. NATAL & ANO NOVO */}
            {product.category === "natal-anonovo" && (
              <div className="bg-[#F5F3FF] p-4 rounded-3xl border border-[#DDD6FE] space-y-2">
                <label className="block text-xs font-bold text-[#5B21B6] mb-1">
                  🎄 Data Desejada para a Ceia *
                </label>
                <select
                  value={desiredDate}
                  onChange={(e) => setDesiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs font-semibold bg-white outline-none focus:border-[#8B5CF6]"
                >
                  <option value="">Selecione o dia da ceia</option>
                  <option value="24 de Dezembro (Véspera de Natal)">24 de Dezembro (Véspera de Natal)</option>
                  <option value="25 de Dezembro (Natal)">25 de Dezembro (Natal)</option>
                  <option value="31 de Dezembro (Véspera de Ano Novo)">31 de Dezembro (Véspera de Ano Novo)</option>
                  <option value="01 de Janeiro (Ano Novo)">01 de Janeiro (Ano Novo)</option>
                  <option value="Outra data de Dezembro">Outra data comemorativa de Dezembro</option>
                </select>
              </div>
            )}

            {/* 10. OBSERVAÇÕES GERAIS */}
            <div>
              <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                Observações Especiais (Alergias, ponto do recheio, cores)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Menos açúcar no chantilly, retirar morangos se possível..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none bg-white focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar: Quantity & Add to Cart */}
        <div className="pt-3 sm:pt-4 mt-2 border-t border-[#DDD6FE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center justify-between sm:justify-start space-x-3 bg-[#F5F3FF] px-3.5 py-2 rounded-2xl border border-[#DDD6FE]">
            <span className="text-xs font-bold text-[#6B7280] sm:hidden">Quantidade:</span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-white shadow-xs text-sm font-bold text-[#5B21B6] hover:bg-[#EDE9FE] flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-sm font-extrabold text-[#1C1C2E] min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-white shadow-xs text-sm font-bold text-[#5B21B6] hover:bg-[#EDE9FE] flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Price & Submit Button */}
          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block leading-none">
                Total do Item
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#1C1C2E]">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 whitespace-nowrap min-h-[44px]"
            >
              <span>Adicionar ao Pedido</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
