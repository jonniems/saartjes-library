import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLibraryData } from "../hooks/useLibraryData.js";
import { useSortAndFilter } from "../hooks/useSortAndFilter.js";
import { Link } from "react-router-dom";
import CrowneIcon from "../assets/icons/crowne.svg?react";
import MoreIcon from "../assets/icons/more.svg?react";
import SearchAndSort from "../components/SearchAndSort.jsx";
import { isBookReadyToRead } from "../utils/libraryUtils.js";

function Library() {
  const { library, loading } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const successMessage = location.state?.successMessage;
  const [messageVisible, setMessageVisible] = useState(false);

  const filteredLibrary = useSortAndFilter(
    library,
    searchTerm,
    sortField,
    sortOrder
  );

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    if (successMessage) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) return <p>Loading library...</p>;

  return (
    <div className="library-list">
      {messageVisible && successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <SearchAndSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortToggle={handleSort}
        sortOptions={[
          { value: "title", label: "Title" },
          { value: "author", label: "Author" },
        ]}
      />
      {filteredLibrary.length > 0 ? (
        filteredLibrary.map((item) => {
          const readyClass = isBookReadyToRead(item) 
            ? "" 
            : "ready-dot--not-ready";

          return (
            <div key={item.id} className="library-list-item">
              <div className="library-list-currently">
                {item.start_reading &&
                item.start_reading.split("T")[0] <=
                  new Date().toISOString().split("T")[0] &&
                !item.end_reading
                  ? "Currently reading"
                  : ""}
              </div>
              <div className="library-list-title-ready">
                <div className="library-list-title">
                  {item.preservation_book && (
                    <CrowneIcon
                      alt="Preservation Book"
                      className="crowne-icon"
                      style={{ width: "16px", height: "16px" }}
                    />
                  )}
                  {item.title}
                </div>
                <div className="library-list-ready">
                  <span className={`ready-dot ${readyClass}`}></span>
                </div>
              </div>
              <div className="library-list-author-more">
                <div className="library-list-author">{item.author}</div>
                <div className="library-list-more">
                  <Link to={`/book-details/${item.id}`}>
                    <span>see more</span>
                    <MoreIcon
                      alt="More"
                      style={{ width: "12px", height: "12px" }}
                    />
                  </Link>
                </div>
              </div>
              <hr />
            </div>
          );
        })
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default Library;