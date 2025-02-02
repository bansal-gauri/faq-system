import { db } from '../../lib/db';
import { Faqs } from '../../models/Faq';
import { chatSession } from "../../lib/translate";
import { eq } from 'drizzle-orm';
import client from "../../lib/cache";

export default async function handler(req, res) {
  const { lang, id } = req.query;
  const language = lang || 'en';

  const translateText = async (text, targetLang) => {
    try {
      const cacheKey = `translation:${targetLang}:${text}`;
      const cachedTranslation = await client.get(cacheKey);

      if (cachedTranslation) {
        // Return cached translation if available
        return cachedTranslation;
      }

      // If not cached, perform translation
      const prompt = `Translate the following text to ${targetLang}: "${text}". Only return the translation, no extra supporting text required.`;

      const result = await chatSession.sendMessage(prompt);
      const translatedText = result.response.text().trim(); 
      
      await client.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Handle GET request to fetch FAQs and translate them
  if (req.method === 'GET') {
    try {
      if (id) {
        // If an `id` is provided, fetch the FAQ with that ID
        const faq = await db.select().from(Faqs).where(eq(Faqs.id, id));
        if (faq.length > 0) {
          const translatedQuestion = await translateText(faq[0].question, language);
          const translatedAnswer = await translateText(faq[0].answer, language);

          res.status(200).json({
            ...faq[0],
            question: translatedQuestion,
            answer: translatedAnswer,
          });
        } else {
          res.status(404).json({ error: "FAQ not found" });
        }
      } else {
        // If an `id` is not provided, fetch the all FAQs
        const faqEntries = await db.select().from(Faqs);
        const translatedFaqs = await Promise.all(faqEntries.map(async (faq) => {
        const translatedQuestion = await translateText(faq.question, language);
        const translatedAnswer = await translateText(faq.answer, language);

        return {
          ...faq,
          question: translatedQuestion,
          answer: translatedAnswer,
        };
      }));

      res.status(200).json(translatedFaqs);
    } 
  } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  }

  // Handle POST request to add a new FAQ
  if (req.method === 'POST') {
    const { question, answer, language } = req.body;

    if (!question || !answer || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const newFaq = await db.insert(Faqs).values({
        question,
        answer,
        language,
      });

      return res.status(201).json(newFaq);
    } catch (error) {
      console.error('Error inserting FAQ:', error);
      return res.status(500).json({ error: 'Failed to add FAQ to database' });
    }
  }

  // Handle PUT request to update an existing FAQ
  if (req.method === 'PUT') {
    try {
      const { question, answer, language } = req.body;
      const updatedFaq = await db
        .update(Faqs)
        .set({ question, answer, language })
        .where(eq(Faqs.id, Number(id)));
      
      if (updatedFaq) {
        res.status(200).json({ message: "FAQ updated successfully" });
      } else {
        res.status(404).json({ error: "FAQ not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  }

  // Handle DELETE request to delete a FAQ
  if (req.method === 'DELETE') {
    try {
      console.log(id, "Inside function")
      if (!id) {
        return res.status(400).json({ error: "FAQ ID is required" });
      }

      const deletedFaq = await db
        .delete(Faqs)
        .where(eq(Faqs.id, Number(id)));

      if (deletedFaq) {
        res.status(200).json({ message: "FAQ deleted successfully" });
      } else {
        res.status(404).json({ error: "FAQ not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  }
}