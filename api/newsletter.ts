/**
 * Vercel Serverless Function - Newsletter Subscription
 * Handles newsletter subscriptions with rate limiting
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (3 requests per hour for newsletter)
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
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
    const { email } = req.body;

    // Validate required field
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    // Sanitize and validate email
    const sanitizedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Here you would save to your newsletter service
    // For now, we'll just log it
    console.log('Newsletter subscription:', {
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with newsletter service
    // Examples:
    // - Mailchimp
    // - ConvertKit
    // - Resend
    // - Save to database

    // Example with Mailchimp:
    // const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email_address: sanitizedEmail,
    //     status: 'subscribed'
    //   })
    // });

    return res.status(200).json({
      success: true,
      message: 'Subscription successful',
    });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
