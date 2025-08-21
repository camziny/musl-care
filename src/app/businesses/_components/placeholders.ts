export function getCategoryPlaceholder(category?: string | null): string {
  const c = (category || "").toLowerCase();
  if (c.includes("tutor")) return "/placeholders/book.svg";
  if (c.includes("food") || c.includes("cater")) return "/placeholders/utensils.svg";
  if (c.includes("legal")) return "/placeholders/gavel.svg";
  if (c.includes("therap")) return "/placeholders/stethoscope.svg";
  if (c.includes("product")) return "/placeholders/cart.svg";
  if (c.includes("cloth") || c.includes("accessories")) return "/placeholders/shirt.svg";
  if (c.includes("umrah") || c.includes("hajj") || c.includes("booking")) return "/placeholders/airplane.svg";
  if (c.includes("daycare") || c.includes("senior")) return "/placeholders/storefront.svg";
  return "/placeholders/storefront.svg";
}


