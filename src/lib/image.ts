const PLACEHOLDER_IMAGE = '/images/placeholder-product.svg';

export function resolveImageUrl(imageKey?: string | null): string {
  if (!imageKey) return PLACEHOLDER_IMAGE;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  if (!baseUrl) return PLACEHOLDER_IMAGE;

  return `${baseUrl.replace(/\/+$/, '')}/${imageKey.replace(/^\/+/, '')}`;
}
