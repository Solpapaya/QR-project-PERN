import React, { useState, useContext, useRef, useEffect } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchContext } from "../context/SearchContext";
import { fetchData } from "../functions/fetchData";

const SearchPerson = () => {
  const [search, setSearch] = useState("");
  // State used for preventing making requests to the server after knowing that the
  // name typed by the user doesn't exist in the database
  const [noMatch, setNoMatch] = useState(null);
  const { setIsSearchSuccessful } = useContext(SearchContext);
  const { setPeople } = useContext(PeopleContext);
  const searchRef = useRef(null);

  const onChangeHandler = async (e) => {
    // Prevent blank spaces at the beginning of the search
    let search = e.target.value.trimLeft();
    if (
      search[search.length - 1] === " " &&
      search[search.length - 2] === " "
    ) {
      // Prevent Double Blank Space between words
      search = search.substring(0, search.length - 1);
    }

    setSearch(search);

    if (
      e.target.value !== " " &&
      search[search.length - 1] !== " " &&
      !search.includes(noMatch)
    ) {
      search = search.trim();
      // Preventing search with more than 4 words
      if (search.split(" ").length < 5) {
        // console.log("Searching person");
        const url = `/people?search=${search}`;
        try {
          const response = await fetchData("get", url);
          setPeople(response.data.people);
          setIsSearchSuccessful(true);
          setNoMatch(null);
        } catch (err) {
          setPeople([]);
          setIsSearchSuccessful(false);
          setNoMatch(search);
        }
      } else {
        // Tell user is not allowed search with more than 4 words
        // console.log("No more than 4 words");
        // Remove the 5th word
        setSearch(search.split(" ").slice(0, 4).join(" "));
      }
    }
  };

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <div className="search-input-container">
      <i className="fas fa-search sidebar-item-icon"></i>

      <input
        className="search-input"
        type="text"
        value={search}
        onChange={onChangeHandler}
        ref={searchRef}
        placeholder="Busca por Nombre o RFC"
      />
    </div>
  );
};

export default SearchPerson;
