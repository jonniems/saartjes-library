import { useEffect, useState } from "react";
import supabase from "../utils/supabase.js";

export const useReadingData = () => {
  const [reading, setReading] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getReading() {
      setLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("library")
          .select()
          .lte("start_reading", today)
          .is("end_reading", null)
          .eq("in_library", true);

        if (error) {
          throw error;
        }

        setReading(data);
      } catch (err) {
        setError(err.message || "Fout bij het laden van de leeshistorie.");
        setReading([]);
      } finally {
        setLoading(false);
      }
    }

    getReading();
  }, []);

  return { reading, loading, error, setReading };
};