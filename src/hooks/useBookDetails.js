import { useEffect, useState, useCallback } from "react";
import supabase from "../utils/supabase";

/**
 * Custom Hook voor het ophalen, updaten en beheren van de staat van een enkel boek.
 *
 * @param {string} id - De ID van het boek.
 * @param {function} navigate - De useNavigate hook functie voor navigatie na verwijdering.
 * @returns {object} Bevat boekdata, status en alle actiehandlers.
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
    } else {
      setBook(updatedBook); // Update de state met de bijgewerkte data
    }
  };

  // --- API HANDLERS ---

  // 5. Bewerking Opslaan (voor EditBookModal)
  const handleSaveEdit = async (updatedFields) => {
    // 1. CLEANUP: Converteer alle lege strings naar null voor de database
    const cleanedFields = Object.fromEntries(
      Object.entries(updatedFields).map(([key, value]) => {
        // Als de waarde een lege string is, vervang deze dan door null
        if (value === "") {
          return [key, null];
        }
        // Behoud de waarde anders
        return [key, value];
      })
    );

    const { error } = await supabase
      .from("library")
      .update(cleanedFields) // <-- Gebruik de opgeschoonde data
      .eq("id", id);

    if (error) {
      console.error("Error updating book details:", error.message);
      // Toon de specifieke foutmelding in de console, zodat je weet wat misging
      console.error("Supabase Error details:", error);
      return false;
    }

    await refreshBookState();
    return true;
  };

  // 1. Start Reading actie
  const confirmStartReading = async (startDate) => {
    // ... (Bestaande implementatie) ...
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
    // ... (Bestaande implementatie) ...
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
    // ... (Bestaande implementatie) ...
    const { error } = await supabase
      .from("library")
      .update({ in_library: false })
      .eq("id", id);

    if (error) {
      console.error("Error removing book:", error.message);
      return false;
    }

    navigate("/library", {
      state: {
        successMessage: `${book.title} is verwijderd uit je bibliotheek.`,
      },
    });
    return true;
  };

  // 4. Wishlist acties
  const handleRemoveFromWishlist = async () => {
    // ... (Bestaande implementatie) ...
    const today = new Date().toISOString();

    const { error } = await supabase
      .from("library")
      .update({ off_wishlist: today })
      .eq("id", id);

    if (error) {
      console.error("Error removing from wishlist:", error.message);
      return false;
    }

    navigate("/wishlist", {
      state: {
        successMessage: `${book.title} is van je verlanglijst verwijderd.`,
      },
    });
    return true;
  };

  const handleAddToLibrary = (book) => {
    // ... (Bestaande implementatie) ...
    const searchParams = new URLSearchParams({
      title: book.title,
      author: book.author,
    });
    navigate(`/add-book-library?${searchParams.toString()}`);
  };

  const handleCheckOnBol = (book) => {
    // ... (Bestaande implementatie) ...
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
    handleSaveEdit, // <-- GEWIJZIGD: Naam van updateBook naar handleSaveEdit
  };
};
