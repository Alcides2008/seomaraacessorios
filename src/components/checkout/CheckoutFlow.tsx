"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Smartphone, FileText, Banknote, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatPrice } from "@/lib/utils";
import {
  shippingFor,
  shippingText,
  addOrder,
  getAddresses,
  saveAddress,
  newOrderId,
  type Order,
} from "@/lib/account";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { siteConfig } from "@/config/site";
import { productCover } from "@/lib/product-options";
import { Container } from "@/components/layout/Container";
import { buttonClasses } from "@/components/ui/Button";
import { HeartDoodle, SparkleDoodle, StarDoodle } from "@/components/ui/Doodles";
import { PaymentInfo } from "./PaymentInfo";
import { HIDDEN_OPTIONS } from "@/components/cart/CartDrawer";
import { orderWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

const provinces = [
  "Luanda", "Benguela", "Huambo", "Huíla", "Bié", "Cabinda",
  "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene",
  "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe",
  "Uíge", "Zaire", "Bengo",
];

// só aparecem os métodos com dados preenchidos em config/site.ts
const payments = [
  { id: "multicaixa-express", label: "Multicaixa Express", icon: Smartphone, hint: "Pague pela app Multicaixa Express.", on: !!siteConfig.payment.expressNumber },
  { id: "referencia", label: "Referência Multicaixa", icon: FileText, hint: "Pague no ATM ou no Internet Banking.", on: !!siteConfig.payment.reference.entity },
  { id: "entrega", label: "Pagamento na entrega", icon: Banknote, hint: "Pague em numerário quando receber.", on: true },
].filter((p) => p.on);

const steps = ["Os seus dados", "Entrega", "Pagamento"];

function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <input
        {...props}
        className="mt-1.5 h-12 w-full rounded-full border-2 border-ink bg-white px-5 text-sm font-semibold text-ink placeholder:text-ink/30 focus:outline-none focus:ring-4 focus:ring-gold/40"
      />
    </label>
  );
}

export function CheckoutFlow() {
  const { lines, subtotal, count, clear } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<Order | null>(null);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ line: "", city: "", province: "Luanda" });
  const [payment, setPayment] = useState(payments[0].id);

  // pré-preencher com dados da conta / último endereço
  useEffect(() => {
    if (user) setCustomer((c) => ({ ...c, name: user.name, email: user.email }));
    const addr = getAddresses()[0];
    if (addr) setAddress({ line: addr.line, city: addr.city, province: addr.province });
  }, [user]);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  // o email é opcional: muita gente em Angola só usa WhatsApp
  const phoneOk = customer.phone.replace(/\D/g, "").length >= 9;
  const validStep =
    step === 0
      ? !!customer.name.trim() && phoneOk
      : step === 1
        ? !!(address.line.trim() && address.city.trim() && address.province)
        : !!payment;

  const placeOrder = () => {
    const order: Order = {
      id: newOrderId(),
      date: new Date().toISOString(),
      items: lines.map((l) => ({
        name: l.product.name,
        quantity: l.quantity,
        price: l.product.price,
        options: l.options,
      })),
      subtotal,
      shipping,
      total,
      customer,
      address: { name: customer.name, phone: customer.phone, ...address },
      payment: payments.find((p) => p.id === payment)?.label ?? payment,
      status: "Aguarda pagamento",
    };
    addOrder(order);
    // grava na nuvem quando o Firebase da Siomara estiver ligado (não bloqueia a confirmação)
    if (isFirebaseConfigured)
      void createOrder(order, user?.uid ?? null).catch((e) => console.error("Firestore order:", e));
    saveAddress({ id: newOrderId(), name: customer.name, phone: customer.phone, ...address });
    clear();
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  /* ---------- Confirmação ---------- */
  if (placed) {
    return (
      <main className="relative flex-1 overflow-hidden py-14 md:py-20">
        {/* chuva de doodles */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute top-0"
            style={{ left: `${(i * 97) % 100}%` }}
            initial={{ y: -60, rotate: 0, opacity: 0 }}
            animate={{ y: 520 + (i % 3) * 120, rotate: i % 2 ? 160 : -160, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6 + (i % 4) * 0.4, delay: i * 0.12, ease: "easeIn" }}
          >
            {i % 3 === 0 ? <HeartDoodle size={30} /> : i % 3 === 1 ? <SparkleDoodle size={28} /> : <StarDoodle size={26} />}
          </motion.span>
        ))}

        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mx-auto max-w-lg rounded-[2rem] border-[2.5px] border-ink bg-white p-7 text-center shadow-[8px_8px_0_var(--color-ink)] md:p-10"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-gold">
              <Check className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-5xl text-ink">Pedido feito!</h1>
            <p className="mt-3 font-semibold text-ink/70">
              Obrigada, {placed.customer.name.split(" ")[0]}! O seu pedido{" "}
              <span className="rounded-md bg-butter px-1.5 font-black text-ink">{placed.id}</span> foi registado.
            </p>

            <div className="mt-7 rounded-2xl border-2 border-dashed border-ink/30 bg-cream p-5 text-left text-sm">
              <div className="flex justify-between font-bold">
                <span className="text-ink/60">Total das peças</span>
                <span className="font-black">{formatPrice(placed.total)}</span>
              </div>
              <div className="mt-1.5 flex justify-between font-bold">
                <span className="text-ink/60">Entrega</span>
                <span>{shippingText(placed.shipping)}</span>
              </div>
              <div className="mt-1.5 flex justify-between font-bold">
                <span className="text-ink/60">Pagamento</span>
                <span>{placed.payment}</span>
              </div>
              <div className="mt-4 border-t-2 border-dashed border-ink/20 pt-4">
                <p className="font-display text-xl">Como pagar</p>
                <div className="mt-3">
                  <PaymentInfo method={payment} />
                </div>
              </div>
            </div>

            <a
              href={orderWhatsAppUrl(placed)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg", "mt-6 w-full")}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enviar o pedido à Siomara
            </a>
            <p className="mt-3 text-xs font-semibold text-ink/60">
              O pedido vai já escrito na mensagem. A Siomara confirma os nomes, a entrega e o pagamento consigo.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {user && (
                <Link href="/conta" className={buttonClasses("outline", "md")}>
                  Os meus pedidos
                </Link>
              )}
              <Link href="/loja" className={buttonClasses("gold", "md")}>
                Continuar a ver
              </Link>
            </div>
          </motion.div>
        </Container>
      </main>
    );
  }

  /* ---------- Carrinho vazio ---------- */
  if (count === 0) {
    return (
      <main className="flex-1 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-md rounded-[2rem] border-2 border-dashed border-ink/30 bg-white p-10 text-center">
            <h1 className="text-4xl text-ink">O carrinho está vazio</h1>
            <p className="mt-3 font-semibold text-ink/60">Escolha uma peça na loja ou crie a sua no Atelier.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/loja" className={buttonClasses("outline", "md")}>
                Ir para a loja
              </Link>
              <Link href="/criar" className={buttonClasses("primary", "md")}>
                Abrir o Atelier
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  /* ---------- Fluxo ---------- */
  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <h1 className="text-5xl text-ink md:text-6xl">Finalizar pedido</h1>

        {/* Passos */}
        <ol className="mt-6 flex flex-wrap items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-black transition-colors",
                  i === step ? "bg-gold shadow-[3px_3px_0_var(--color-ink)]" : i < step ? "bg-mint" : "bg-white text-ink/40",
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-white text-[11px]">
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < steps.length - 1 && <span className="h-0.5 w-4 bg-ink/30 sm:w-8" />}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Formulário */}
          <div className="rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)] md:p-8">
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <Field
                  label="Nome completo"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="O seu nome"
                  autoComplete="name"
                />
                <Field
                  label="WhatsApp / telefone"
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+244 9XX XXX XXX"
                  autoComplete="tel"
                />
                <Field
                  label="Email (opcional)"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  autoComplete="email"
                />
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <p className="rounded-2xl border-2 border-ink bg-butter p-4 text-sm font-bold">
                  ✦ A taxa e o dia da entrega são combinados consigo pelo WhatsApp.
                </p>
                <label className="block">
                  <span className="text-sm font-bold text-ink/70">Província</span>
                  <select
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    className="mt-1.5 h-12 w-full rounded-full border-2 border-ink bg-white px-5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Município / bairro"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Ex.: Talatona"
                />
                <Field
                  label="Morada ou ponto de referência"
                  value={address.line}
                  onChange={(e) => setAddress({ ...address, line: e.target.value })}
                  placeholder="Rua, casa, perto de…"
                  autoComplete="street-address"
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                {payments.map(({ id, label, icon: Icon, hint }) => (
                  <button
                    key={id}
                    onClick={() => setPayment(id)}
                    aria-pressed={payment === id}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border-2 border-ink p-4 text-left transition-all",
                      payment === id ? "bg-sand shadow-[3px_3px_0_var(--color-ink)]" : "bg-white hover:bg-cream",
                    )}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-black">{label}</span>
                      <span className="block text-xs font-semibold text-ink/60">{hint}</span>
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink",
                        payment === id ? "bg-gold" : "bg-white",
                      )}
                    >
                      {payment === id && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                ))}
                <div className="mt-2">
                  <PaymentInfo method={payment} />
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className={buttonClasses("ghost", "md")}>
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
              ) : (
                <Link href="/carrinho" className={buttonClasses("ghost", "md")}>
                  <ChevronLeft className="h-4 w-4" />
                  Carrinho
                </Link>
              )}

              {step < 2 ? (
                <button
                  onClick={() => validStep && setStep(step + 1)}
                  disabled={!validStep}
                  className={buttonClasses("primary", "lg")}
                >
                  Continuar
                </button>
              ) : (
                <button onClick={placeOrder} disabled={!validStep} className={buttonClasses("primary", "lg")}>
                  Fazer pedido
                </button>
              )}
            </div>
            {step === 0 && customer.phone && !phoneOk && (
              <p className="mt-3 text-right text-xs font-bold text-gold-deep">
                O número precisa de 9 dígitos para a Siomara o contactar.
              </p>
            )}
          </div>

          {/* Resumo */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
              <h2 className="font-display text-2xl">O seu pedido</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-3 text-sm">
                    <span
                      className="h-14 w-14 shrink-0 rounded-xl border-2 border-ink bg-cover bg-center"
                      style={{ backgroundImage: productCover(l.product) }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold leading-tight">
                        {l.quantity}× {l.product.name}
                      </span>
                      {l.options && (
                        <span className="mt-0.5 block text-xs font-semibold text-ink/60">
                          {Object.entries(l.options)
                            .filter(([k]) => !HIDDEN_OPTIONS.includes(k))
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </span>
                      )}
                    </span>
                    <span className="font-black">{formatPrice(l.product.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t-2 border-dashed border-ink/20 pt-4 text-sm font-bold">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Peças</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Entrega</dt>
                  <dd>{shippingText(shipping)}</dd>
                </div>
                <div className="flex items-center justify-between border-t-2 border-ink pt-3">
                  <dt className="font-display text-xl">Total</dt>
                  <dd className="rotate-[-3deg] rounded-full border-2 border-ink bg-butter px-3 py-0.5 font-display text-xl font-black">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
