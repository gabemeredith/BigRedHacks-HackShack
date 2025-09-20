import React from 'react';
import { cn } from '@/lib/utils';

interface SpacingProps {
  children: React.ReactNode;
  className?: string;
}

/* === STACK COMPONENTS === */
export const VStack = ({ children, className, ...props }: SpacingProps) => (
  <div className={cn('flex flex-col', className)} {...props}>
    {children}
  </div>
);

export const HStack = ({ children, className, ...props }: SpacingProps) => (
  <div className={cn('flex flex-row items-center', className)} {...props}>
    {children}
  </div>
);

/* === SPACING COMPONENTS === */
export const Spacer = ({ className }: { className?: string }) => (
  <div className={cn('flex-1', className)} />
);

export const Divider = ({ className, orientation = 'horizontal' }: { 
  className?: string; 
  orientation?: 'horizontal' | 'vertical' 
}) => (
  <div 
    className={cn(
      'bg-border-light',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    )} 
  />
);

/* === CONTAINER COMPONENTS === */
export const Container = ({ children, className, ...props }: SpacingProps) => (
  <div className={cn('container mx-auto px-4', className)} {...props}>
    {children}
  </div>
);

export const Section = ({ children, className, ...props }: SpacingProps) => (
  <section className={cn('py-16 md:py-24', className)} {...props}>
    {children}
  </section>
);

export const Card = ({ children, className, ...props }: SpacingProps) => (
  <div 
    className={cn(
      'bg-surface border border-border-light rounded-lg p-6 shadow-sm',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const Surface = ({ children, className, elevated = false, ...props }: SpacingProps & { elevated?: boolean }) => (
  <div 
    className={cn(
      'rounded-lg border border-border-light',
      elevated ? 'bg-surface-elevated shadow-md' : 'bg-surface shadow-sm',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

/* === GRID COMPONENTS === */
export const Grid = ({ children, className, cols = 1, ...props }: SpacingProps & { cols?: number }) => (
  <div 
    className={cn(
      'grid gap-6',
      {
        'grid-cols-1': cols === 1,
        'grid-cols-2': cols === 2,
        'grid-cols-3': cols === 3,
        'grid-cols-4': cols === 4,
        'grid-cols-1 md:grid-cols-2': cols === 2,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': cols === 3,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': cols === 4,
      },
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

/* === RESPONSIVE GRID === */
export const ResponsiveGrid = ({ children, className, ...props }: SpacingProps) => (
  <div 
    className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);
