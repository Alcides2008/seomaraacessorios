# Siomara Acessórios — loja online

Pulseiras, pares de casal, fios de telemóvel, porta-chaves e terços personalizados, feitos à mão em Angola.
Identidade "Sticker Club" (rosa-choque, autocolantes, doodles) e **Atelier** (`/criar`) para criar a peça ao vivo.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Firebase (Auth + Firestore) · Cloudinary (fotos do painel).

## Correr

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
node scripts/check-atelier.ts   # verificação do motor do Atelier
```

## Configuração

- Chaves em `.env.local` (não vai para o Git): `NEXT_PUBLIC_FIREBASE_*` do projeto **siomara-acessorios**, `NEXT_PUBLIC_CLOUDINARY_*`, `NEXT_PUBLIC_SITE_URL`.
- Regras do Firestore em `firestore.rules` (colar na consola do Firebase).
- Administradores em `src/config/admins.ts` **e** em `firestore.rules` (manter iguais). O painel `/admin` só abre com email autorizado e verificado (entrar com Google).
- Contactos, pagamento e categorias em `src/config/site.ts`; produtos iniciais em `src/data/products.ts` (importar no painel → Produtos).
