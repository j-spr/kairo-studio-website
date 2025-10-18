/**
 * Utilidades de validación y sanitización para formularios
 */

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * Previene XSS básico
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remueve < y >
    .replace(/javascript:/gi, '') // Remueve javascript:
    .replace(/on\w+=/gi, ''); // Remueve event handlers como onclick=
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un string no esté vacío después de sanitizar
 */
export function isNotEmpty(input: string): boolean {
  return sanitizeInput(input).length > 0;
}

/**
 * Valida longitud mínima
 */
export function hasMinLength(input: string, minLength: number): boolean {
  return sanitizeInput(input).length >= minLength;
}

/**
 * Valida longitud máxima
 */
export function hasMaxLength(input: string, maxLength: number): boolean {
  return sanitizeInput(input).length <= maxLength;
}

/**
 * Valida formulario de contacto
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validar nombre
  if (!isNotEmpty(data.name)) {
    errors.name = 'El nombre es requerido';
  } else if (!hasMinLength(data.name, 2)) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  } else if (!hasMaxLength(data.name, 100)) {
    errors.name = 'El nombre es demasiado largo';
  }

  // Validar email
  if (!isNotEmpty(data.email)) {
    errors.email = 'El correo es requerido';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'El correo no es válido';
  }

  // Validar mensaje
  if (!isNotEmpty(data.message)) {
    errors.message = 'El mensaje es requerido';
  } else if (!hasMinLength(data.message, 10)) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  } else if (!hasMaxLength(data.message, 1000)) {
    errors.message = 'El mensaje es demasiado largo (máx. 1000 caracteres)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida email para newsletter
 */
export function validateNewsletterEmail(email: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isNotEmpty(email)) {
    errors.email = 'El correo es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'El correo no es válido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
