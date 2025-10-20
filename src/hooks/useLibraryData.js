import { useEffect, useState } from "react";
import supabase from "../utils/supabase.js";

/**
 * Custom Hook om de boekenlijst uit de Supabase 'library' tabel op te halen.
 * Filtert op boeken die in_library=true zijn.
 * * @returns {object} { library, loading, error, setLibrary }
 */
export const useLibraryData = () => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getLibrary() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("library")
          .select()
          .eq("in_library", true);

        if (error) {
          throw error;
        }

        setLibrary(data);
      } catch (err) {
        setError(err.message || "Er is een onbekende fout opgetreden bij het laden.");
        setLibrary([]);
      } finally {
        setLoading(false);
      }
    }

    getLibrary();
  }, []);

  return { library, loading, error, setLibrary };
};