import type { Request } from 'express';

export const constructImageUrl = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request<any, any, any, any>,
  imagePath: string | null,
): string | null => {
  if (!imagePath) {
    return null;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}${imagePath}`;
};
