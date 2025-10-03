import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from '../utils/supabase';

const AddBookWishlist = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isFiction, setIsFiction] = useState(false); // Default to Non-Fiction
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // to redirect after success

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Add the new book to the Supabase database
    const { error } = await supabase.from("library").insert([
      {
        title,
        author,
        is_fiction: isFiction,
        on_wishlist: today,
        in_library: false,
      },
    ]);

    if (error) {
      console.error("Error adding book:", error.message);
      setLoading(false);
      return;
    }
  
    // Create the success message
    const successMessage = `${title} by ${author} was successfully added to your wishlist`;
  
    // After successfully adding, navigate to the library page and pass the success message
    navigate("/wishlist", { state: { successMessage } });
  
    setLoading(false); // End loading state
  };

  return (
    <div className="add-book-container">
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

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book to Wishlist"}
        </button>
      </form>
    </div>
  );
};

export default AddBookWishlist;
