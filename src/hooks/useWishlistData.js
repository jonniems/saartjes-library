import { useEffect, useState } from "react";
import supabase from "../utils/supabase.js";

export const useWishlistData = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getWishlist() {
      setLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("library")
          .select()
          .lte("on_wishlist", today)
          .is("off_wishlist", null)
          .eq("in_library", false);

        if (error) {
          throw error;
        }

        setWishlist(data);
      } catch (err) {
        setError(err.message || "Fout bij het laden van de verlanglijst.");
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }

    getWishlist();
  }, []);

  return { wishlist, loading, error, setWishlist };
};