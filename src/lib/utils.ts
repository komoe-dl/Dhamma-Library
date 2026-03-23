import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeFileName(file: File, prefix: string = 'dhamma-ebook'): File {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const newName = `${prefix}-${timestamp}.${extension}`;
  return new File([file], newName, { type: file.type });
}
