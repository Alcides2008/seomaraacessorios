"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Heart,
  Package,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import {
  getUserOrders,
  getUserProfile,
  saveUserProfile,
  type UserProfile,
} from "@/lib/firestore";
import {
  getAddresses,
  saveAddress,
  removeAddress,
  newOrderId,
  type Order,
  type Address,
} from "@/lib/account";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { buttonClasses } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/ui/SocialIcons";
import { isFirebaseConfigured } from "@/lib/firebase";
import { isAdminEmail } from "@/config/admins";

const provinces = [
  "Luanda", "Benguela", "Huambo", "Huíla", "Bié", "Cabinda",
  "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene",
  "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe",
  "Uíge", "Zaire", "Bengo",
];

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email ou palavra-passe incorretos.";
    case "auth/email-already-in-use":
      return "Já existe uma conta com este email.";
    case "auth/weak-password":
      return "A palavra-passe deve ter pelo menos 6 caracteres.";
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/operation-not-allowed":
      return "Ative o início de sessão com Google no Firebase Console (Authentication → Sign-in method).";
    case "auth/account-exists-with-different-credential":
      return "Já existe uma conta com este email usando outro método.";
    case "auth/unauthorized-domain":
      return "Domínio não autorizado. No Firebase → Authentication → Settings → Domínios autorizados, adicione o domínio do site (ex.: siomara.vercel.app).";
    case "auth/network-request-failed":
      return "Falha de ligação. Verifique a internet e tente novamente.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
      return "Configuração do Firebase em falta (variáveis de ambiente na Vercel).";
    case "auth/popup-blocked":
    case "auth/popup-closed-by-user":
      return "A janela do Google foi fechada ou bloqueada. Permita pop-ups e tente de novo.";
    default:
      return "Ocorreu um erro. Tente novamente.";
  }
}

export function AccountPage() {
  const { user, loading } = useAuth();

  return (
    <main className="flex-1 py-10 md:py-14">
      <Container>
        <Breadcrumb
          items={[{ label: "Início", href: "/" }, { label: "Conta" }]}
        />
        {loading ? (
          <p className="mt-10 text-sm text-muted">A carregar…</p>
        ) : user ? (
          <Dashboard user={user} />
        ) : (
          <AuthForm />
        )}
      </Container>
    </main>
  );
}

/* ---- Autenticação (Firebase) ---- */
function AuthForm() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await signIn(email.trim(), password);
      else await signUp(name.trim(), email.trim(), password);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (
        code !== "auth/popup-closed-by-user" &&
        code !== "auth/cancelled-popup-request"
      )
        setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="text-center text-5xl text-ink">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>

      {!isFirebaseConfigured && (
        <p role="status" className="mt-5 rounded-2xl border-2 border-ink bg-butter p-4 text-sm font-bold">
          As contas ficam ativas em breve ✦ Entretanto pode encomendar sem conta — o pedido segue
          pelo WhatsApp na mesma.
        </p>
      )}

      <div className="mt-6 flex rounded-full border-2 border-ink bg-white p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError("");
            }}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-black transition-colors",
              mode === m ? "bg-ink text-cream" : "text-muted hover:text-ink",
            )}
          >
            {m === "login" ? "Entrar" : "Registar"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy || !isFirebaseConfigured}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border-2 border-ink bg-white py-3 text-sm font-medium text-ink transition-colors hover:border-ink disabled:opacity-50"
      >
        <GoogleIcon className="h-5 w-5" />
        Continuar com Google
      </button>

      <div className="mt-5 flex items-center gap-3 font-hand text-xl text-ink/50">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="h-12 rounded-full border-2 border-ink bg-white px-5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-12 rounded-full border-2 border-ink bg-white px-5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Palavra-passe (mín. 6 caracteres)"
          className="h-12 rounded-full border-2 border-ink bg-white px-5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy || !isFirebaseConfigured}
          className={buttonClasses("primary", "lg", "mt-2")}
        >
          {busy ? "A processar…" : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-muted">
        Autenticação segura com Firebase.
      </p>
    </div>
  );
}

/* ---- Painel da conta ---- */
function Dashboard({ user }: { user: AuthUser }) {
  const { logout } = useAuth();
  const wishlist = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    getUserOrders(user.uid)
      .then(setOrders)
      .catch((e) => console.error("orders:", e))
      .finally(() => setLoadingOrders(false));
    setAddresses(getAddresses());
  }, [user.uid]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="font-hand text-2xl font-bold text-gold-deep">
            A minha conta
          </span>
          <h1 className="mt-1 text-5xl text-ink">
            Olá, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdminEmail(user.email) && user.emailVerified && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-full border-2 border-ink bg-gold px-4 py-1.5 text-sm font-black shadow-[3px_3px_0_var(--color-ink)]"
            >
              Painel ADM ✦
            </Link>
          )}
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-black hover:bg-sand"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <ProfileCard user={user} />

          {/* Pedidos */}
          <section>
          <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
            <Package className="h-4 w-4 text-gold" /> Os meus pedidos
          </h2>
          {loadingOrders ? (
            <p className="mt-4 text-sm text-muted">A carregar pedidos…</p>
          ) : orders.length === 0 ? (
            <p className="mt-4 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-white p-8 text-center text-sm text-muted">
              Ainda não fez nenhum pedido.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {orders.map((o) => (
                <li key={o.id} className="rounded-2xl border-2 border-ink bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-ink">{o.id}</span>
                    <span className="rounded-full border-2 border-ink bg-butter px-3 py-0.5 text-xs font-black">
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(o.date).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {o.items.reduce((s, i) => s + i.quantity, 0)} artigos ·{" "}
                    {o.payment}
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {formatPrice(o.total)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          </section>
        </div>

        {/* Lateral: favoritos + endereços */}
        <aside className="flex flex-col gap-8">
          <Link
            href="/favoritos"
            className="flex items-center justify-between rounded-2xl border-2 border-ink bg-white p-5 transition-colors hover:border-ink"
          >
            <span className="flex items-center gap-2 font-display text-2xl text-ink">
              <Heart className="h-4 w-4 text-gold" /> Favoritos
            </span>
            <span className="text-sm text-muted">{wishlist.count}</span>
          </Link>

          <AddressBook
            addresses={addresses}
            onChange={() => setAddresses(getAddresses())}
          />
        </aside>
      </div>
    </div>
  );
}

const genders = ["Feminino", "Masculino", "Outro", "Prefiro não dizer"];
const inputCls =
  "mt-1.5 h-11 w-full rounded-full border-2 border-ink bg-white px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40";

function ProfileCard({ user }: { user: AuthUser }) {
  const { updateName } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [profile, setProfile] = useState<UserProfile>({});

  useEffect(() => {
    getUserProfile(user.uid)
      .then(setProfile)
      .catch((e) => console.error("profile:", e));
  }, [user.uid]);

  const initials = user.name.trim().charAt(0).toUpperCase() || "?";

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (name.trim() && name.trim() !== user.name)
        await updateName(name.trim());
      await saveUserProfile(user.uid, profile);
      setEditing(false);
    } catch (err) {
      console.error("save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border-2 border-ink bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">O meu perfil</h2>
        {!editing && (
          <button
            onClick={() => {
              setName(user.name);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 text-sm font-black text-gold-deep hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-xl text-gold-deep">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{user.name}</p>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={save} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="text-sm font-bold text-ink/60">
              Nome
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink/60">
              Telefone
            </span>
            <input
              value={profile.phone ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="+244 9XX XXX XXX"
              className={inputCls}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink/60">
                Data de nascimento
              </span>
              <input
                type="date"
                value={profile.birthday ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, birthday: e.target.value })
                }
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink/60">
                Género
              </span>
              <select
                value={profile.gender ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className={inputCls}
              >
                <option value="">—</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-1 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className={buttonClasses("primary", "sm")}
            >
              {saving ? "A guardar…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm font-bold text-ink/60 hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-5 divide-y divide-line border-t border-line">
          {(
            [
              ["Telefone", profile.phone],
              ["Data de nascimento", profile.birthday],
              ["Género", profile.gender],
            ] as [string, string | undefined][]
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5 text-sm">
              <dt className="text-muted">{label}</dt>
              <dd className="text-ink">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function AddressBook({
  addresses,
  onChange,
}: {
  addresses: Address[];
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line: "",
    city: "",
    province: "",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.line || !form.city || !form.province) return;
    saveAddress({ id: newOrderId(), ...form });
    setForm({ name: "", phone: "", line: "", city: "", province: "" });
    setAdding(false);
    onChange();
  };

  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-2xl text-ink">
        <MapPin className="h-4 w-4 text-gold" /> Endereços
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between rounded-2xl border-2 border-ink bg-white p-4 text-sm"
          >
            <span className="text-muted">
              {a.line}, {a.city} — {a.province}
            </span>
            <button
              onClick={() => {
                removeAddress(a.id);
                onChange();
              }}
              aria-label="Remover endereço"
              className="text-muted hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {adding ? (
          <form
            onSubmit={submit}
            className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-white p-4"
          >
            <input
              value={form.line}
              onChange={(e) => setForm({ ...form, line: e.target.value })}
              placeholder="Morada"
              className="h-10 rounded-full border-2 border-ink bg-white px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
            />
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Cidade"
              className="h-10 rounded-full border-2 border-ink bg-white px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
            />
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="h-10 rounded-full border-2 border-ink bg-white px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-gold/40"
            >
              <option value="">Província…</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button type="submit" className={buttonClasses("primary", "sm", "mt-1")}>
              Guardar
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center justify-center gap-2 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-white py-3 text-sm font-black text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <Plus className="h-4 w-4" /> Adicionar endereço
          </button>
        )}
      </div>
    </section>
  );
}
