/**
 * Vercel Serverless Function - Contact Form
 * Handles contact form submissions and sends email
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (5 requests per hour)
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

function sanitize(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const clientIP = Array.isArray(ip) ? ip[0] : ip;

  // Rate limiting
  if (!rateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitize(name);
    const sanitizedEmail = email.trim();
    const sanitizedMessage = sanitize(message);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Validate lengths
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({
        error: 'Name must be between 2 and 100 characters',
      });
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 1000) {
      return res.status(400).json({
        error: 'Message must be between 10 and 1000 characters',
      });
    }

    // Here you would send the email
    // For now, we'll just log it (you'll need to integrate with a service like SendGrid, Resend, etc.)
    console.log('Contact form submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@kairostudio.com.co',
    //   to: process.env.PUBLIC_CONTACT_EMAIL,
    //   subject: `Nuevo mensaje de ${sanitizedName}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${sanitizedName}</p>
    //     <p><strong>Email:</strong> ${sanitizedEmail}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${sanitizedMessage}</p>
    //   `
    // });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
