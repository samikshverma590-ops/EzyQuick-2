'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import type { ServiceFAQ } from '@/data/services';

interface FaqAccordionProps {
  items: ServiceFAQ[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        const panelId = `faq-panel-${idx}`;
        const triggerId = `faq-trigger-${idx}`;
        return (
          <div key={item.question} className="py-5">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-6 text-left group"
              >
                <span className="font-display text-2xl sm:text-[1.75rem] leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary-ink)] transition-colors">
                  {item.question}
                </span>
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isOpen
                      ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white'
                      : 'border-[var(--color-border-strong)] text-[var(--color-text-primary)]'
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 pr-12 text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
