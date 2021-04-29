import React, { useState, useContext, useRef, useEffect } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchContext } from "../context/SearchContext";
import { fetchData } from "../functions/fetchData";

const SearchPerson = () => {
  const [search, setSearch] = useState("");
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

    if (e.target.value !== " " && search[search.length - 1] !== " ") {
      search = search.trim();
      // Preventing search with more than 4 words
      if (search.split(" ").length < 5) {
        console.log("Searching person");
        const url = `/people?search=${search}`;
        try {
          const response = await fetchData("get", url);
          setPeople(response.data.people);
          setIsSearchSuccessful(true);
        } catch (err) {
          setPeople([]);
          setIsSearchSuccessful(false);
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
    console.log(searchRef.current.focus());
  }, []);

  return (
    <div className="mb-4 text-center">
      <input
        type="text"
        value={search}
        onChange={onChangeHandler}
        ref={searchRef}
        placeholder="Nombre o RFC"
      />
    </div>
  );
};

export default SearchPerson;
