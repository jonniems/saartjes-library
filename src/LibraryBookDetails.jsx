import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from './utils/supabase';

import closeIcon from './assets/icons/close.svg';

const LibraryBookDetails = () => {
  const { id } = useParams();  // Get book ID from URL
  const [book, setBook] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [rating, setRating] = useState(1); // Default rating is 1
  const [readingComplete, setReadingComplete] = useState(true); // Default: finished the book
  const [preservationBook, setPreservationBook] = useState(false); // Default: unchecked
  const navigate = useNavigate(); // Navigate after actions like updating or deleting the book

  useEffect(() => {
    const fetchLibraryBookDetails = async () => {
      const { data, error } = await supabase
        .from("library")
        .select()
        .eq("id", id)
        .single();  // Fetch the book with the specific ID

      if (data) {
        setBook(data);
      } else {
        console.error("Error fetching book:", error);
      }
    };

    fetchLibraryBookDetails();
  }, [id]);

  const renderRating = (rating) => {
    const totalCircles = 5;
    const filledCircles = rating ? Math.min(Math.max(rating, 1), totalCircles) : 0;

    const circles = [];
    for (let i = 1; i <= totalCircles; i++) {
      circles.push(
        <span key={i} className={i <= filledCircles ? "filled-circle" : "unfilled-circle"}></span>
      );
    }

    return circles;
  };

  // Button 1: Start Reading
  const handleStartReading = async () => {
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({ start_reading: today })
      .eq("id", id)
      .select(); // Keep .select() for consistency with handleRemoveFromLibrary
  
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
      setBook(updatedBook);  // Update the state with the updated data
    }
  };

  // Button 2: Remove from Library
  const handleRemoveFromLibrary = async () => {
    const { error } = await supabase
      .from("library")
      .update({ in_library: false })
      .eq("id", id)
      .select();  // Adding .select() to get the updated data

    if (error) {
      console.error("Error removing book:", error.message);
    } else {
      const { data: updatedBook, error: fetchError } = await supabase
        .from("library")
        .select()
        .eq("id", id)
        .single(); // Fetch the updated book

      if (fetchError) {
        console.error("Error fetching updated book data:", fetchError.message);
      } else {
        setBook(updatedBook); // Update the local state with the newly fetched data
        navigate("/library");  // Redirect to the library page after successful removal
      }
    }
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
        preservation_book: preservationBook
      })
      .eq("id", id)
      .select();  // Adding select() to get the updated data

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
        setBook(updatedBook);  // Update the state with the updated data
        setShowPopup(false); // Close the popup after submission
      }
    }
  };

  // Wishlist button handlers
  const handleCheckOnBol = () => {
    const formattedTitle = book.title.replace(/\s+/g, '+');
    const formattedAuthor = book.author.replace(/\s+/g, '+');
    const searchQuery = `${formattedTitle}+${formattedAuthor}`;
    const bolUrl = `https://www.bol.com/nl/nl/s/?searchtext=${searchQuery}`;
    window.open(bolUrl, '_blank');
  };

  const handleAddToLibrary = () => {
    const searchParams = new URLSearchParams({
      title: book.title,
      author: book.author
    });
    navigate(`/add-book-library?${searchParams.toString()}`);
  };

  const handleRemoveFromWishlist = async () => {
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
      {book ? (
        <div className="book-details-container">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>
          <div className="book-details-genre">{book.is_fiction ? "Fiction" : "Non-Fiction"}</div>
          <hr />
          {book.in_library && (
            <div className="book-details-summary">
              <div className="book-details-dates">
                In library since: {book.in_library_from}
              </div>
              <div className="book-details-dates">
                Started reading on: {book.start_reading ? book.start_reading : "-"}
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
              <button className="main-button" onClick={handleCheckOnBol}>Check on Bol.com</button>
              <button className="main-button" onClick={handleAddToLibrary}>Add to Library</button>
              <button className="remove-button" onClick={handleRemoveFromWishlist}>Remove from Wishlist</button>
            </div>
          )}

          {/* Show Start Reading button only if no start_reading date is set and not on wishlist */}
          {!book.start_reading && !book.on_wishlist && (
            <button className="main-button" onClick={handleStartReading}>Start Reading</button>
          )}

          {/* Show Stop Reading button only if start_reading is set and end_reading is null */}
          {book.start_reading && !book.end_reading && (
            <button className="main-button" onClick={handleStopReading}>Stop Reading</button>
          )}

          {/* Show Remove from Library button only if the book is in the library */}
          {book.in_library && (
            <button className="remove-button" onClick={handleRemoveFromLibrary}>Remove from Library</button>
          )}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="stop-reading-popup">
          <div className="stop-reading-popup-content">
              {/* Close icon */}
            <img 
              src={closeIcon} 
              alt="Close" 
              className="stop-reading-popup-close-icon" 
              onClick={() => setShowPopup(false)} 
            />
            <div className="stop-reading-popup-details">
              <h1>{book.title}</h1>
              <h3>{book.author}</h3>
              <div className="book-details-genre">{book.is_fiction ? "Fiction" : "Non-Fiction"}</div>
              <hr />
              <div className="reading-status">
                <label>Did you finish {book.title}?</label>
                <div className="reading-status-buttons">
                  <button
                    type="button"
                    className={readingComplete === true ? "status-button green active" : "status-button green"}
                    onClick={() => setReadingComplete(true)}
                  >
                    I finished the book
                  </button>
                  <button
                    type="button"
                    className={readingComplete === false ? "status-button red active" : "status-button red"}
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
                      className={rating >= i + 1 ? "filled-circle-rate" : "unfilled-circle-rate"}
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
    </div>
  );
};

export default LibraryBookDetails;
