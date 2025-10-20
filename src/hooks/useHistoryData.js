import { useEffect, useState } from "react";
import supabase from "../utils/supabase.js";

export const useHistoryData = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getHistory() {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("library")
          .select()
          .not("end_reading", "is", null); 

        if (error) {
          throw error;
        }

        setHistory(data);
      } catch (err) {
        setError(err.message || "Fout bij het laden van de geschiedenis.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    getHistory();
  }, []);

  return { history, loading, error, setHistory };
};