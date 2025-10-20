import { useMemo } from "react";

const DATE_FIELDS = ["end_reading", "start_reading", "in_library_from"];

export const useSortAndFilter = (data, searchTerm, sortField, sortOrder) => {
  const sortedAndFilteredData = useMemo(() => {
    // 1. Sorteren
    const sortedData = [...data].sort((a, b) => {
      // SPECIAL HANDLING VOOR DATUMS
      if (DATE_FIELDS.includes(sortField)) {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);

        if (isNaN(dateA)) return sortOrder === "asc" ? 1 : -1;
        if (isNaN(dateB)) return sortOrder === "asc" ? -1 : 1;

        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      // REGULIERE STRING SORTERING
      const aValue = (a[sortField] || "").toString().toLowerCase();
      const bValue = (b[sortField] || "").toString().toLowerCase();

      if (sortOrder === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    // 2. Filteren
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return sortedData.filter((item) => {
      const title = item.title ? item.title.toLowerCase() : "";
      const author = item.author ? item.author.toLowerCase() : "";

      return (
        title.includes(lowerCaseSearchTerm) ||
        author.includes(lowerCaseSearchTerm)
      );
    });
  }, [data, searchTerm, sortField, sortOrder]);

  return sortedAndFilteredData;
};
