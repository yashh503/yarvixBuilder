import { nanoid } from 'nanoid';
import Site from '../models/Site.js';

export function generateSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);

  const suffix = nanoid(6);
  return `${base}-${suffix}`;
}

export async function ensureUniqueSlug(name) {
  let slug = generateSlug(name);
  let exists = await Site.findOne({ slug });

  while (exists) {
    slug = generateSlug(name);
    exists = await Site.findOne({ slug });
  }

  return slug;
}
