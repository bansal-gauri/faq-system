import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const Faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  language: varchar('language', { length: 10 }).notNull(),
});

export const Faq = {
  getTranslated: (faq, lang) => {
    return faq[`question_${lang}`] || faq.question;  // Get translated question or fallback to the main question
  },
};
