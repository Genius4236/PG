import React from 'react';
import { Skeleton } from './ui/skeleton';

// Skeleton for PG card
export const PGCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

// Skeleton for PG list
export const PGListSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <PGCardSkeleton key={i} />
    ))}
  </div>
);

// Skeleton for PG details
export const PGDetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <Skeleton className="h-64 w-full mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
      <div>
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

// Skeleton for booking form
export const BookingFormSkeleton = () => (
  <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <Skeleton className="h-6 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full mb-4" />
    <Skeleton className="h-10 w-full mb-4" />
    <Skeleton className="h-10 w-full mb-6" />
    <Skeleton className="h-12 w-full" />
  </div>
);

// Skeleton for dashboard
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-1/3" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/4" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  </div>
);

// Skeleton for table rows
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }, (_, j) => (
          <Skeleton key={j} className="h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Generic content skeleton
export const ContentSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);
