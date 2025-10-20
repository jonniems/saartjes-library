import { useEffect, useState, useCallback } from "react";
import supabase from "../utils/supabase";

/**
 * @param {string} id
 * @param {function} navigate
 * @returns {object}
 */

export const useBookDetails = (id, navigate) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Functie om de meest recente boekdata op te halen
  const fetchBook = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("library")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      setError(error.message);
      setBook(null);
    } else {
      setBook(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  // Functie om de lokale book state te verversen
  const refreshBookState = async () => {
    const { data: updatedBook, error: fetchError } = await supabase
      .from("library")
      .select()
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated book data:", fetchError.message);
      // Foutmelding kan hier ook gezet worden, maar we houden de bestaande data
    } else {
      setBook(updatedBook); // Update de state met de bijgewerkte data
    }
  };

  // --- API HANDLERS ---

  // 1. Start Reading actie
  const confirmStartReading = async (startDate) => {
    const isoDate = new Date(startDate).toISOString();

    const { error } = await supabase
      .from("library")
      .update({ start_reading: isoDate })
      .eq("id", id);

    if (error) {
      console.error("Error updating start_reading:", error.message);
      return false;
    }
    await refreshBookState();
    return true;
  };

  // 2. Stop Reading actie (en beoordeling/status opslaan)
  const handleSubmitPopup = async (
    rating,
    readingComplete,
    preservationBook
  ) => {
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({
        end_reading: today,
        rating: rating,
        reading_complete: readingComplete,
        preservation_book: preservationBook,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating book details:", error.message);
      return false;
    }
    await refreshBookState();
    return true;
  };

  // 3. Remove from Library actie
  const confirmRemoveFromLibrary = async () => {
    const { error } = await supabase
      .from("library")
      .update({ in_library: false })
      .eq("id", id);

    if (error) {
      console.error("Error removing book:", error.message);
      return false;
    }

    // Navigeer direct weg omdat het boek technisch gezien niet meer in deze lijst thuishoort
    // We gebruiken de navigate functie die via de hook is doorgegeven
    navigate("/library", {
      state: {
        successMessage: `${book.title} is verwijderd uit je bibliotheek.`,
      },
    });
    return true;
  };

  // 4. Wishlist acties

  const handleRemoveFromWishlist = async () => {
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({ off_wishlist: today })
      .eq("id", id);

    if (error) {
      console.error("Error removing from wishlist:", error.message);
      return false;
    }

    // Navigeer direct weg na succesvolle update
    navigate("/wishlist", {
      state: {
        successMessage: `${book.title} is van je verlanglijst verwijderd.`,
      },
    });
    return true;
  };

  const handleAddToLibrary = (book) => {
    // Navigatie naar de toevoegpagina. De logica blijft hier.
    const searchParams = new URLSearchParams({
      title: book.title,
      author: book.author,
    });
    navigate(`/add-book-library?${searchParams.toString()}`);
  };

  const handleCheckOnBol = (book) => {
    // Externe link logica blijft hier.
    const formattedTitle = book.title.replace(/\s+/g, "+");
    const formattedAuthor = book.author.replace(/\s+/g, "+");
    const searchQuery = `${formattedTitle}+${formattedAuthor}`;
    const bolUrl = `https://www.bol.com/nl/nl/s/?searchtext=${searchQuery}`;
    window.open(bolUrl, "_blank");
  };

  return {
    book,
    loading,
    error,
    confirmStartReading,
    handleSubmitPopup,
    confirmRemoveFromLibrary,
    handleRemoveFromWishlist,
    handleAddToLibrary,
    handleCheckOnBol,
    refreshBookState,
  };
};
