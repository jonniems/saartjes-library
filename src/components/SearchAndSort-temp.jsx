import PropTypes from "prop-types";
import azDownIcon from "../assets/icons/az-down.svg";
import zaDownIcon from "../assets/icons/za-down.svg";
import searchIcon from "../assets/icons/search.svg";

function SearchAndSort({ 
  searchTerm, 
  onSearchChange, 
  sortField, 
  onSortFieldChange, 
  sortOrder, 
  onSortToggle,
  sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" }
  ],
  placeholder = "Search"
}) {
  return (
    <div className="search-filter-container">
      <div className="search-container">
        <img src={searchIcon} alt="" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sort-container">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value)}
          className="sort-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={() => onSortToggle(sortField)} className="sort-button">
          {sortOrder === "asc" ? (
            <img src={azDownIcon} alt="Ascending" className="sort-icon" />
          ) : (
            <img src={zaDownIcon} alt="Descending" className="sort-icon" />
          )}
        </button>
      </div>
    </div>
  );
}

SearchAndSort.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortField: PropTypes.string.isRequired,
  onSortFieldChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortToggle: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  placeholder: PropTypes.string
};

export default SearchAndSort;
