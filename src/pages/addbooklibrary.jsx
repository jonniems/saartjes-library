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
  const navigate = useNavigate(); // to redirect after success

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inLibraryDate =
      inLibraryFrom === "today"
        ? new Date().toISOString().split("T")[0]
        : manualDate;

    // Add the new book to the Supabase database
    const { error } = await supabase.from("library").insert([
      {
        title,
        author,
        is_fiction: isFiction,
        is_gift: isGift,
        in_library_from: inLibraryDate,
        in_library: true,
      },
    ]);

    if (error) {
      console.error("Error adding book:", error.message);
      setLoading(false);
      return;
    }

    // Create the success message
    const successMessage = `${title} by ${author} was successfully added to your library`;

    // After successfully adding, navigate to the library page and pass the success message
    navigate("/library", { state: { successMessage } });

    setLoading(false); // End loading state
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
