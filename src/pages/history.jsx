import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistoryData } from "../hooks/useHistoryData.js";
import { useSortAndFilter } from "../hooks/useSortAndFilter.js";
import { Link } from "react-router-dom";
import MoreIcon from "../assets/icons/more.svg?react";
import SearchAndSort from "../components/SearchAndSort.jsx";

function History() {
  const { history, loading } = useHistoryData();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("end_reading"); 
  const [sortOrder, setSortOrder] = useState("desc");
  const location = useLocation();

  const successMessage = location.state?.successMessage;
  const [messageVisible, setMessageVisible] = useState(false);

  const filteredHistory = useSortAndFilter(
    history,
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

  if (loading) {
      return <p>Loading history...</p>;
  }

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
          { value: "end_reading", label: "Finished Date" },
          { value: "title", label: "Title" },
          { value: "author", label: "Author" },
        ]}
      />
      {filteredHistory.length > 0 ? (
        filteredHistory.map((item) => (
          <div key={item.id} className="library-list-item">
            <div className="library-list-currently">
              Finished reading on {item.end_reading ? item.end_reading.split("T")[0] : 'Unknown date'}
            </div>
            <div className="library-list-title">{item.title}</div>
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
        ))
      ) : (
        <p>No books finished yet</p>
      )}
    </div>
  );
}

export default History;