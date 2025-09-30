import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { Link } from "react-router-dom";
import crowneIcon from "./assets/icons/crowne.svg";
import azDownIcon from "./assets/icons/az-down.svg";
import zaDownIcon from "./assets/icons/za-down.svg";
import moreIcon from "./assets/icons/more.svg";
import searchIcon from "./assets/icons/search.svg";

function Library() {
  const [library, setLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const successMessage = location.state?.successMessage;

  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    getLibrary();
  }, []);

  async function getLibrary() {
    const { data, error } = await supabase
      .from("library")
      .select()
      .eq("in_library", true);

    if (!error) {
      setLibrary(data);
    }
  }

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedLibrary = [...library].sort((a, b) => {
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

  const filteredLibrary = sortedLibrary.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const title = item.title ? item.title.toLowerCase() : "";
    const author = item.author ? item.author.toLowerCase() : "";

    return (
      title.includes(lowerCaseSearchTerm) ||
      author.includes(lowerCaseSearchTerm)
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
      <div className="search-filter-container">
        <div className="search-container">
          <img src={searchIcon} alt="" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="sort-select"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <button onClick={() => handleSort(sortField)} className="sort-button">
            {sortOrder === "asc" ? (
              <img src={azDownIcon} alt="Ascending" className="sort-icon" />
            ) : (
              <img src={zaDownIcon} alt="Descending" className="sort-icon" />
            )}
          </button>
        </div>
      </div>
      {filteredLibrary.length > 0 ? (
        filteredLibrary.map((item) => (
          <div key={item.id} className="library-list-item">
            <div className="library-list-currently">
              {item.start_reading &&
              item.start_reading.split("T")[0] <=
                new Date().toISOString().split("T")[0] &&
              !item.end_reading
                ? "Currently reading"
                : ""}
            </div>
            <div className="library-list-title">
              {item.preservation_book && (
                <img
                  src={crowneIcon}
                  alt="Preservation Book"
                  className="crowne-icon"
                />
              )}
              {item.title}
            </div>
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
        <p>No results found</p>
      )}
    </div>
  );
}

export default Library;
