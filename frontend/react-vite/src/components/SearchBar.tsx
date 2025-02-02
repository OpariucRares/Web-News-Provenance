import { useState, KeyboardEvent } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchInput);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchInput);
    }
  };

  return (
    <div
      className="input-group mb-4"
      vocab="http://schema.org/"
      typeof="SearchAction"
    >
      <input
        type="text"
        className="form-control"
        placeholder="Search articles..."
        value={searchInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        property="query-input"
      />
      <button
        className="btn btn-outline-secondary"
        onClick={handleSearchClick}
        property="target"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
