/**
 * Emails com acesso ao painel de administração (/admin).
 * Só estas contas veem o painel. Manter igual à lista em firestore.rules.
 */
export const adminEmails: string[] = [
  "siomaramartinho3@gmail.com",
  "alcideslafamilia@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails.includes(email.toLowerCase());
}
