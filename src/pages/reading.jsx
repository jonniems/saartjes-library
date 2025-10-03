import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { Link } from "react-router-dom";
import moreIcon from "../assets/icons/more.svg";
import SearchAndSort from "../components/searchandsort.jsx";

function Reading() {
  const [reading, setReading] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const successMessage = location.state?.successMessage;

  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    getReading();
  }, []);

  async function getReading() {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from("library")
      .select()
      .lte("start_reading", today)
      .is("end_reading", null)
      .eq("in_library", true);

    if (!error) {
      setReading(data);
    }
  }

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedReading = [...reading].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField]?.localeCompare(b[sortField]);
    } else {
      return b[sortField]?.localeCompare(a[sortField]);
    }
  });

  const filteredReading = sortedReading.filter((item) => {
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
          { value: "title", label: "Title" },
          { value: "author", label: "Author" }
        ]}
      />
      {filteredReading.length > 0 ? (
        filteredReading.map((item) => (
          <div key={item.id} className="library-list-item">
            <div className="library-list-currently">Currently reading</div>
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
        <p>No books currently being read</p>
      )}
    </div>
  );
}

export default Reading;
