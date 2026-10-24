import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">🌟 Peyroo (پیرو)</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Global Mentorship Platform — Monorepo Scaffold Initialized
        </p>

        <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-left text-sm text-emerald-800">
          <p className="font-semibold">Technical Foundation Status:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            <li>Frontend: React + Vite + Tailwind CSS (apps/web)</li>
            <li>Backend: Node.js + Express + Zod REST API (apps/api)</li>
            <li>Database: PostgreSQL + Prisma ORM (prisma/)</li>
            <li>Contracts: Shared types & DTOs (packages/shared)</li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          University Software Analysis and Design Project
        </p>
      </div>
    </div>
  );
};
