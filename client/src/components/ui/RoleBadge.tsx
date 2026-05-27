import React from 'react';

interface RoleBadgeProps {
  role: 'STUDENT' | 'FACULTY' | 'GUARD' | 'ADMIN' | string;
  className?: string;
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const styles = {
    STUDENT: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40',
      label: 'Student',
    },
    FACULTY: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40',
      label: 'Faculty',
    },
    GUARD: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40',
      label: 'Guard',
    },
    ADMIN: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40',
      label: 'Admin',
    },
  };

  const current = styles[role as keyof typeof styles] || {
    bg: 'bg-gray-50 text-gray-700 border-gray-200',
    label: role,
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${current.bg} ${className}`}
    >
      {current.label}
    </span>
  );
}
