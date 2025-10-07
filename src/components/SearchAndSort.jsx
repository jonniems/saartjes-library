import PropTypes from "prop-types";
import AzDownIcon from "../assets/icons/az-down.svg?react";
import ZaDownIcon from "../assets/icons/za-down.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";

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
        <SearchIcon alt="" className="search-icon" />
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
            <AzDownIcon alt="Ascending" className="sort-icon" width="16px" height="16px" />
          ) : (
            <ZaDownIcon alt="Descending" className="sort-icon" width="16px" height="16px" />
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
