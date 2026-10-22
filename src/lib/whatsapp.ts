import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { shippingText, type Order } from "@/lib/account";

/** Constrói um link wa.me com texto pré-preenchido. */
export function whatsappUrl(
  text: string,
  number: string = siteConfig.contact.whatsapp,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Mensagem de pedido para enviar à loja por WhatsApp. */
export function orderWhatsAppMessage(order: Order): string {
  const items = order.items
    .map((i) => {
      const opts = i.options
        ? ` (${Object.entries(i.options)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")})`
        : "";
      return `• ${i.quantity}× ${i.name}${opts} — ${formatPrice(i.price * i.quantity)}`;
    })
    .join("\n");

  return [
    `Olá Siomara Acessórios! Confirmo o meu pedido *${order.id}*.`,
    "",
    "*Itens:*",
    items,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Taxa de entrega: ${shippingText(order.shipping)}`,
    `*Total: ${formatPrice(order.total)}*`,
    "",
    `*Cliente:* ${order.customer.name}`,
    `*Telefone:* ${order.customer.phone}`,
    `*Entrega:* ${order.address.line}, ${order.address.city} — ${order.address.province}`,
    `*Pagamento:* ${order.payment}`,
    "",
    "Vou enviar o comprovativo do pagamento. Obrigado(a)!",
  ].join("\n");
}

export function orderWhatsAppUrl(order: Order): string {
  return whatsappUrl(orderWhatsAppMessage(order));
}
