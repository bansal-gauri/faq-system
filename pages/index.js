import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';


export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [selectedLang, setSelectedLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch FAQs from API based on selected language
  const fetchFaqs = async (lang) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/faqs?lang=${lang}`);
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initially fetch FAQs in English
    fetchFaqs(selectedLang);
  }, [selectedLang]);

  // Function to redirect to Add FAQ page
  const handleAddFaqClick = () => {
    router.push("/add-faq");
  };

  // Function to redirect to Edit FAQ page for a specific FAQ ID
  const handleEditFaqClick = (id) => {
    router.push(`/edit-faq/${id}`);
  };

  // Function to handle Delete FAQ
  const handleDeleteFaqClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const response = await fetch(`/api/faqs?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("FAQ deleted successfully!");
          // Fetch the updated list of FAQs after deletion
          fetchFaqs(selectedLang);
        } else {
          alert("Error deleting FAQ.");
        }
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        alert("Error deleting FAQ.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">FAQs</h1>
      
      {/* Language Dropdown */}
      <div className="mb-4">
        <label htmlFor="language" className="mr-2 text-lg">Select Language:</label>
        <select
          id="language"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
      </div>

      {/* FAQ List */}
      <div>
        {loading ? (
          <p>Loading FAQs...</p>
        ) : faqs.length > 0 ? (
          <ul>
          {faqs.map((faq) => (
            <li key={faq.id}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
              {/* Edit button */}
              <button
                onClick={() => handleEditFaqClick(faq.id)}
                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mt-2"
              >
                Edit FAQ
              </button>
              {/* Delete FAQ Button */}
              <button
                  onClick={() => handleDeleteFaqClick(faq.id)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete FAQ
                </button>
            </li>
          ))}
        </ul>
        ) : (
          <p>No FAQs available.</p>
        )}
      </div>

      {/* Link to Add FAQ Page */}
      <div className="mt-6">
        <button
          onClick={handleAddFaqClick}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add FAQ
        </button>
      </div>
    </div>
  );
}