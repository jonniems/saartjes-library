import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

import CloseIcon from "../assets/icons/close.svg?react";

const LibraryBookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Stop Reading popup
  const [showStartReadingPopup, setShowStartReadingPopup] = useState(false); // NIEUW: Start Reading popup
  const [rating, setRating] = useState(1);
  const [readingComplete, setReadingComplete] = useState(true);
  const [preservationBook, setPreservationBook] = useState(false);
  const navigate = useNavigate();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // NIEUWE STATE VOOR START READING MODAL
  const [startDateOption, setStartDateOption] = useState("today"); // 'today' of 'choose'
  const [selectedStartDate, setSelectedStartDate] = useState(""); // Voor de datumpicker

  useEffect(() => {
    // ... (Bestande logica voor het ophalen van boekdetails)
    const fetchLibraryBookDetails = async () => {
      const { data, error } = await supabase
        .from("library")
        .select()
        .eq("id", id)
        .single();

      if (data) {
        setBook(data);
        // Initialiseer selectedStartDate met vandaag, voor de modal
        setSelectedStartDate(new Date().toISOString().substring(0, 10)); 
      } else {
        console.error("Error fetching book:", error);
      }
    };

    fetchLibraryBookDetails();
  }, [id]);

  // Hide bottom navigation when any modal is open
  useEffect(() => {
    // AANPASSING: Voeg de nieuwe modal state toe
    const anyModalOpen = showPopup || showRemoveConfirm || showStartReadingPopup;
    if (anyModalOpen) {
      document.body.classList.add("overlay-open");
    } else {
      document.body.classList.remove("overlay-open");
    }
    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, [showPopup, showRemoveConfirm, showStartReadingPopup]);

  const renderRating = (rating) => {
    // ... (Bestaande renderRating functie)
    const totalCircles = 5;
    const filledCircles = rating
      ? Math.min(Math.max(rating, 1), totalCircles)
      : 0;

    const circles = [];
    for (let i = 1; i <= totalCircles; i++) {
      circles.push(
        <span
          key={i}
          className={i <= filledCircles ? "filled-circle" : "unfilled-circle"}
        ></span>
      );
    }

    return circles;
  };

  // Button 1: Start Reading (opent de popup)
  const handleStartReading = () => {
    setStartDateOption("today"); // Reset naar "Today" bij openen
    setSelectedStartDate(new Date().toISOString().substring(0, 10)); // Reset de datum
    setShowStartReadingPopup(true);
  };

  // NIEUW: Bevestig en update de startdatum vanuit de modal
  const confirmStartReading = async () => {
    // Bepaal de datum op basis van de gekozen optie
    const startDate =
      startDateOption === "today"
        ? new Date().toISOString()
        : new Date(selectedStartDate).toISOString();

    const { error } = await supabase
      .from("library")
      .update({ start_reading: startDate })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating start_reading:", error.message);
    }

    const { data: updatedBook, error: fetchError } = await supabase
      .from("library")
      .select()
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated book data:", fetchError.message);
    } else {
      setBook(updatedBook); // Update de state met de bijgewerkte data
      setShowStartReadingPopup(false); // Sluit de popup
    }
  };

  // NIEUW: Functie om de start reading modal te annuleren/sluiten
  const cancelStartReading = () => {
    setShowStartReadingPopup(false);
  };

  // ... (Bestaande handleRemoveFromLibrary, confirmRemoveFromLibrary, etc.)
  // Button 2: Remove from Library
  const handleRemoveFromLibrary = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemoveFromLibrary = async () => {
    const { error } = await supabase
      .from("library")
      .update({ in_library: false })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error removing book:", error.message);
      return;
    }

    const { data: updatedBook, error: fetchError } = await supabase
      .from("library")
      .select()
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated book data:", fetchError.message);
      setShowRemoveConfirm(false);
      return;
    }

    setBook(updatedBook);
    setShowRemoveConfirm(false);
    navigate("/library");
  };

  const cancelRemoveFromLibrary = () => {
    setShowRemoveConfirm(false);
  };

  // Button 3: Stop Reading (opens the popup)
  const handleStopReading = () => {
    setShowPopup(true);
  };

  // Handle the form submission inside the popup
  const handleSubmitPopup = async () => {
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({
        end_reading: today,
        rating: rating,
        reading_complete: readingComplete,
        preservation_book: preservationBook,
      })
      .eq("id", id)
      .select(); 

    if (error) {
      console.error("Error updating book details:", error.message);
    } else {
      const { data: updatedBook, error: fetchError } = await supabase
        .from("library")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching updated book data:", fetchError.message);
      } else {
        setBook(updatedBook); 
        setShowPopup(false); 
      }
    }
  };

  // Wishlist button handlers
  const handleCheckOnBol = () => {
    // ... (Bestaande Bol.com logica)
    const formattedTitle = book.title.replace(/\s+/g, "+");
    const formattedAuthor = book.author.replace(/\s+/g, "+");
    const searchQuery = `${formattedTitle}+${formattedAuthor}`;
    const bolUrl = `https://www.bol.com/nl/nl/s/?searchtext=${searchQuery}`;
    window.open(bolUrl, "_blank");
  };

  const handleAddToLibrary = () => {
    // ... (Bestaande Add to Library logica)
    const searchParams = new URLSearchParams({
      title: book.title,
      author: book.author,
    });
    navigate(`/add-book-library?${searchParams.toString()}`);
  };

  const handleRemoveFromWishlist = async () => {
    // ... (Bestaande Remove from Wishlist logica)
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({ off_wishlist: today })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error removing from wishlist:", error.message);
    } else {
      const { data: updatedBook, error: fetchError } = await supabase
        .from("library")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching updated book data:", fetchError.message);
      } else {
        setBook(updatedBook);
        navigate("/wishlist");
      }
    }
  };

  return (
    <div>
      {/* ... (Bestaande weergave van boekdetails) */}
      {book ? (
        <div className="book-details-container">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>
          <div className="book-details-genre">
            {book.is_fiction ? "Fiction" : "Non-Fiction"}
          </div>
          <hr />
          {book.in_library && (
            <div className="book-details-summary">
              <div className="book-details-dates">
                In library since: {book.in_library_from}
              </div>
              <div className="book-details-dates">
                Started reading on:{" "}
                {book.start_reading ? book.start_reading : "-"}
              </div>
              <div className="book-details-dates">
                Finished reading on: {book.end_reading ? book.end_reading : "-"}
              </div>
              <div className="book-details-rating">
                Rating: {renderRating(book.rating)}
              </div>
            </div>
          )}

          {/* Show wishlist buttons if book is on wishlist (has on_wishlist date) */}
          {book.on_wishlist && (
            <div className="wishlist-buttons">
              <button className="main-button" onClick={handleCheckOnBol}>
                Check on Bol.com
              </button>
              <button className="main-button" onClick={handleAddToLibrary}>
                Add to Library
              </button>
              <button
                className="remove-button"
                onClick={handleRemoveFromWishlist}
              >
                Remove from Wishlist
              </button>
            </div>
          )}

          {/* Show Start Reading button only if no start_reading date is set and not on wishlist */}
          {/* AANGEPAST: Roept nu handleStartReading aan om de modal te openen */}
          {!book.start_reading && !book.on_wishlist && (
            <button className="main-button" onClick={handleStartReading}>
              Start Reading
            </button>
          )}

          {/* Show Stop Reading button only if start_reading is set and end_reading is null */}
          {book.start_reading && !book.end_reading && (
            <button className="main-button" onClick={handleStopReading}>
              Stop Reading
            </button>
          )}

          {/* Show Remove from Library button only if the book is in the library */}
          {book.in_library && (
            <button className="remove-button" onClick={handleRemoveFromLibrary}>
              Remove from Library
            </button>
          )}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}

      {/* NIEUWE: Start Reading Modal */}
      {showStartReadingPopup && (
        <div className="stop-reading-popup">
          <div className="stop-reading-popup-content">
            <CloseIcon
              alt="Close"
              className="stop-reading-popup-close-icon"
              width="24px"
              height="24px"
              onClick={cancelStartReading} // Sluit zonder wijzigingen
            />
            <div className="stop-reading-popup-details">
              <h1>{book.title}</h1>
              <h3>{book.author}</h3>
              <hr />
              <div className="start-reading-question">
                <label><h3><i>When did you start reading {book.title}?</i></h3></label>
                
                <div className="add-book-options">
                  <label>
                    <input
                      type="radio"
                      name="startDateOption"
                      value="today"
                      checked={startDateOption === "today"}
                      onChange={() => setStartDateOption("today")}
                    />
                    <span></span>
                    Today
                  </label>
                  
                  <label>
                    <input
                      type="radio"
                      name="startDateOption"
                      value="choose"
                      checked={startDateOption === "choose"}
                      onChange={() => setStartDateOption("choose")}
                    />
                    <span></span>
                    Choose a date
                  </label>
                </div>

                {startDateOption === "choose" && (
                  <div className="add-book-date">
                    <input
                      type="date"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                      max={new Date().toISOString().substring(0, 10)} // Max datum is vandaag
                    />
                  </div>
                )}
              </div>
              
              <div className="confirmation-buttons">
                <button
                  type="button"
                  className="confirm-button"
                  onClick={confirmStartReading}
                  // Schakel de knop uit als 'choose a date' is gekozen maar geen datum is geselecteerd
                  disabled={startDateOption === "choose" && !selectedStartDate}
                >
                  Start reading
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelStartReading} // Sluit zonder wijzigingen
                >
                  Not reading it now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OUDE: Stop Reading Modal (showPopup) */}
      {showPopup && (
        <div className="stop-reading-popup">
          {/* ... (Bestaande Stop Reading modal code) */}
          <div className="stop-reading-popup-content">
            <CloseIcon
              alt="Close"
              className="stop-reading-popup-close-icon"
              width="24px"
              height="24px"
              onClick={() => setShowPopup(false)}
            />
            <div className="stop-reading-popup-details">
              <h1>{book.title}</h1>
              <h3>{book.author}</h3>
              <div className="book-details-genre">
                {book.is_fiction ? "Fiction" : "Non-Fiction"}
              </div>
              <hr />
              <div className="reading-status">
                <label>Did you finish {book.title}?</label>
                <div className="reading-status-buttons">
                  <button
                    type="button"
                    className={
                      readingComplete === true
                        ? "status-button green active"
                        : "status-button green"
                    }
                    onClick={() => setReadingComplete(true)}
                  >
                    I finished the book
                  </button>
                  <button
                    type="button"
                    className={
                      readingComplete === false
                        ? "status-button red active"
                        : "status-button red"
                    }
                    onClick={() => setReadingComplete(false)}
                  >
                    I stopped reading
                  </button>
                </div>
              </div>
              <div className="reading-status">
                <label>How do you rate {book.title}?</label>
                <div className="reading-status-rate">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i + 1}
                      onClick={() => setRating(i + 1)}
                      className={
                        rating >= i + 1
                          ? "filled-circle-rate"
                          : "unfilled-circle-rate"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="reading-status-preservation">
                <label>
                  <input
                    type="checkbox"
                    checked={preservationBook}
                    onChange={() => setPreservationBook(!preservationBook)}
                  />
                  <span></span>
                  Preservation book
                </label>
              </div>
              <button
                onClick={handleSubmitPopup}
                className="reading-status-save"
              >
                Stop reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirmation modal */}
      {showRemoveConfirm && (
        <div className="stop-reading-popup">
          <div className="stop-reading-popup-content">
            <CloseIcon
              alt="Close"
              className="stop-reading-popup-close-icon"
              onClick={cancelRemoveFromLibrary}
              width="24px"
              height="24px"
            />
            <div className="stop-reading-popup-details">
              <h3>
              <i>Are you sure you want to remove {book.title} from your
                library?</i>
              </h3>
              <div className="confirmation-buttons">
                <button
                  type="button"
                  className="confirm-button"
                  onClick={confirmRemoveFromLibrary}
                >
                  Yes, I&apos;m sure
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelRemoveFromLibrary}
                >
                  No, I&apos;ll keep it for now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryBookDetails;