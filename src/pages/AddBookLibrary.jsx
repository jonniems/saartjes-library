import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../utils/supabase";
import BackIcon from "../assets/icons/back.svg?react";

const AddBookLibrary = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isFiction, setIsFiction] = useState(false); // Default to Non-Fiction
  const [isGift, setIsGift] = useState(false);
  const [inLibraryFrom, setInLibraryFrom] = useState("today"); // Default to "today"
  const [manualDate, setManualDate] = useState(""); // To store the manually selected date
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // to redirect after success

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) {
      return;
    }
    
    setError(null);
    setLoading(true);

    const inLibraryDate =
      inLibraryFrom === "today"
        ? new Date().toISOString().split("T")[0]
        : manualDate;

    // Validate manual date if manual option is selected
    if (inLibraryFrom === "manual" && !manualDate) {
      setError("Please select a date when choosing 'Choose a date' option.");
      setLoading(false);
      return;
    }

    try {
      // Add the new book to the Supabase database
      const { error: dbError, data } = await supabase
        .from("library")
        .insert([
          {
            title,
            author,
            is_fiction: isFiction,
            is_gift: isGift,
            in_library_from: inLibraryDate,
            in_library: true,
          },
        ])
        .select();

      if (dbError) {
        console.error("Error adding book:", dbError);
        
        // Provide user-friendly error message for common issues
        let errorMessage = "Failed to add book. ";
        if (dbError.message.includes("duplicate key") || dbError.message.includes("unique constraint")) {
          errorMessage += "There was a database conflict. Please try again, or contact support if the issue persists.";
        } else {
          errorMessage += dbError.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Create the success message
      const successMessage = `${title} by ${author} was successfully added to your library`;

      // After successfully adding, navigate to the library page and pass the success message
      navigate("/library", { state: { successMessage } });
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <div className="go-back">
        {/* Link naar de specifieke boekpagina */}
        <Link onClick={handleGoBack}>
          <BackIcon alt="Back" style={{ width: "12px", height: "12px" }} />
          <span>go back</span>
        </Link>
      </div>
      {error && (
        <div style={{ color: "red", padding: "12px", marginBottom: "12px" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="add-book">
          <input
            type="text"
            id="title"
            className="add-book-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            id="author"
            className="add-book-input"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="add-book">
          <div className="add-book-options">
            <label>
              <input
                type="radio"
                name="bookType"
                value="fiction"
                checked={isFiction === true}
                onChange={() => setIsFiction(true)}
              />
              <span></span>
              Fiction
            </label>
            <label>
              <input
                type="radio"
                name="bookType"
                value="non-fiction"
                checked={isFiction === false}
                onChange={() => setIsFiction(false)}
              />
              <span></span>
              Non-Fiction
            </label>
          </div>
        </div>

        <div className="add-book">
          <div className="add-book-options">
            <label>
              <input
                type="checkbox"
                id="isGift"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
              />
              <span></span>
              Mark as gift
            </label>
          </div>
        </div>

        <div className="add-book">
          <label className="add-book-date-label">
            When did the book enter the library?
          </label>
          <div className="add-book-options">
            <label>
              <input
                type="radio"
                name="inLibraryFrom"
                value="today"
                checked={inLibraryFrom === "today"}
                onChange={() => setInLibraryFrom("today")}
              />
              <span></span>
              Today
            </label>
            <label>
              <input
                type="radio"
                name="inLibraryFrom"
                value="manual"
                checked={inLibraryFrom === "manual"}
                onChange={() => setInLibraryFrom("manual")}
              />
              <span></span>
              Choose a date
            </label>
          </div>
        </div>

        {/* Date picker for manual date selection */}
        {inLibraryFrom === "manual" && (
          <div className="add-book-date">
            <input
              type="date"
              id="manualDate"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book to Library"}
        </button>
      </form>
    </div>
  );
};

export default AddBookLibrary;
