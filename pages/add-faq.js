import { useState } from "react";
import { useRouter } from "next/router";

export default function AddFaq() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle form submission to add a new FAQ
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          language,
        }),
      });

      if (response.ok) {
        // Redirect back to the home page after successfully adding the FAQ
        router.push("/");
      } else {
        throw new Error("Failed to add FAQ");
      }
    } catch (error) {
      setError("Error adding FAQ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add FAQ</h1>

      {/* Display error if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* FAQ form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block">Question:</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-2 w-full border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="answer" className="block">Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="p-2 w-full border rounded-md"
            rows="5"
            required
          />
        </div>

        <div>
          <label htmlFor="language" className="block">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 w-full border rounded-md"
            required
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}
