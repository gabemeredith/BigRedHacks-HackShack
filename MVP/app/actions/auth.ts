'use server';

import bcrypt from 'bcryptjs';
import { signIn } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

export interface SignUpData {
  email: string;
  password: string;
  businessName: string;
  website?: string;
  category: 'RESTAURANTS' | 'CLOTHING' | 'ART' | 'ENTERTAINMENT';
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function signUpAction(data: SignUpData) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user and business in a transaction
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'BUSINESS',
        business: {
          create: {
            name: data.businessName,
            website: data.website,
            category: data.category,
            address: data.address,
          }
        }
      },
      include: {
        business: true
      }
    });

    // Sign in the new user
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}

export async function loginAction(data: LoginData) {
  try {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  // This will be called from the client
  redirect('/login');
}
