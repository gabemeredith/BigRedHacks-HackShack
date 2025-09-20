import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/* === HEADINGS === */
export const Display = ({ children, className, as: Component = 'h1', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-6xl font-bold text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Headline = ({ children, className, as: Component = 'h2', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-4xl font-bold text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Title = ({ children, className, as: Component = 'h3', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-2xl font-semibold text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Subtitle = ({ children, className, as: Component = 'h4', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-xl font-medium text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);

/* === BODY TEXT === */
export const BodyLarge = ({ children, className, as: Component = 'p', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-lg text-text-primary leading-relaxed', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Body = ({ children, className, as: Component = 'p', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-base text-text-primary leading-normal', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const BodySmall = ({ children, className, as: Component = 'p', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-sm text-text-secondary leading-normal', className)} 
    {...props}
  >
    {children}
  </Component>
);

/* === CAPTIONS & LABELS === */
export const Caption = ({ children, className, as: Component = 'span', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-xs text-text-tertiary leading-normal', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Label = ({ children, className, as: Component = 'label', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-sm font-medium text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);

/* === SPECIALIZED === */
export const Overline = ({ children, className, as: Component = 'span', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-xs font-medium text-text-secondary uppercase tracking-wider', className)} 
    {...props}
  >
    {children}
  </Component>
);

export const Code = ({ children, className, as: Component = 'code', ...props }: TypographyProps) => (
  <Component 
    className={cn('text-sm font-mono bg-surface px-2 py-1 rounded-base text-text-primary', className)} 
    {...props}
  >
    {children}
  </Component>
);
