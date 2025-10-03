import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";
import moreIcon from "../assets/icons/more.svg";
import SearchAndSort from "../components/SearchAndSort";

function History() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("end_reading");
  const [sortOrder, setSortOrder] = useState("desc");
  const location = useLocation();

  const successMessage = location.state?.successMessage;

  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    getHistory();
  }, []);

  async function getHistory() {
    const { data, error } = await supabase
      .from("library")
      .select()
      .not("end_reading", "is", null);

    if (!error) {
      setHistory(data);
    }
  }

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortField === "end_reading") {
      // Special handling for date sorting
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    } else {
      // Regular string sorting for title and author
      if (sortOrder === "asc") {
        return a[sortField]?.localeCompare(b[sortField]);
      } else {
        return b[sortField]?.localeCompare(a[sortField]);
      }
    }
  });

  const filteredHistory = sortedHistory.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  useEffect(() => {
    if (successMessage) {
      setMessageVisible(true);
      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);

      // Cleanup the timeout if the component unmounts or the message changes
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="library-list">
      {/* Display the success message if available and visible */}
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
          { value: "author", label: "Author" }
        ]}
      />
      {filteredHistory.length > 0 ? (
        filteredHistory.map((item) => (
          <div key={item.id} className="library-list-item">
            <div className="library-list-currently">
              Finished reading on {item.end_reading.split("T")[0]}
            </div>
            <div className="library-list-title">{item.title}</div>
            <div className="library-list-author-more">
              <div className="library-list-author">{item.author}</div>
              <div className="library-list-more">
                {/* Link naar de specifieke boekpagina */}
                <Link to={`/book-details/${item.id}`}>
                  <span>see more</span>
                  <img src={moreIcon} alt="More" />
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
