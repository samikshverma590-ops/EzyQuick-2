'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ServiceFAQ } from '@/data/services';

export function FaqAccordion({ items }: { items: ServiceFAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#091933]/12 rounded-3xl border border-[#091933]/12 bg-[#FFFFFF]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question} className="p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-display text-lg font-bold text-[#091933]">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#0B56E8] transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <p className="mt-3 text-sm leading-relaxed text-[#3B4F6B]">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
