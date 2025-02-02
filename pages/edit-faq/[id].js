import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditFaq() {
  const [faq, setFaq] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query; 

  // Fetch the FAQ details by ID
  useEffect(() => {
    if (id) {
      const fetchFaq = async () => {
        try {
          const response = await fetch(`/api/faqs?id=${id}`);
          const data = await response.json();
          if (data) {
            setFaq(data);
            setQuestion(data.question);
            setAnswer(data.answer);
            setLanguage(data.language);
          }
        } catch (error) {
          setError("Failed to fetch FAQ details.");
        } finally {
          setLoading(false);
        }
      };
      fetchFaq();
    }
  }, [id]);

  // Handle form submission to update the FAQ
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/faqs?id=${id}`, {
        method: "PUT",
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
        // Redirect to the home page after successful edit
        router.push("/");
      } else {
        throw new Error("Failed to update FAQ");
      }
    } catch (error) {
      setError("Error updating FAQ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit FAQ</h1>

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
            {loading ? "Updating..." : "Update FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}
