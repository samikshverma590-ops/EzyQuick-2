'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ServiceFAQ } from '@/data/services';

export function FaqAccordion({ items }: { items: ServiceFAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#0C1E3A]/12 rounded-3xl border border-[#0C1E3A]/12 bg-[#FFFFFF]">
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
              <span className="font-display text-lg font-bold text-[#0C1E3A]">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#0059FD] transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <p className="mt-3 text-sm leading-relaxed text-[#475B78]">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
