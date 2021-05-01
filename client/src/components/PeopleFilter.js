import React, { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";

const PeopleFilter = () => {
  const { filter, setFilter } = useContext(SearchContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const clickFilterHandler = (e) => {
    const newFilter = e.target.getAttribute("for");
    if (newFilter !== filter) {
      setFilter(newFilter);
    }
    setIsExpanded(!isExpanded);
  };

  const clickDefaultFilterHandler = (e) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        className={
          isExpanded
            ? "search-filter-container filter expanded"
            : "search-filter-container filter"
        }
      >
        <input
          type="radio"
          name="filterBy"
          value="default"
          checked="checked"
          id="default"
        />
        <label for="default" onClick={clickDefaultFilterHandler}>
          Filtrar Por
        </label>
        <input type="radio" name="filterBy" value="all" id="all" />
        <label
          for="all"
          onClick={clickFilterHandler}
          className={filter === "all" ? "selected" : ""}
        >
          Todos
        </label>
        <input type="radio" name="filterBy" value="active" id="active" />
        <label
          for="active"
          onClick={clickFilterHandler}
          className={filter === "active" ? "selected" : ""}
        >
          Activos
        </label>
        <input type="radio" name="filterBy" value="inactive" id="inactive" />
        <label
          for="inactive"
          onClick={clickFilterHandler}
          className={filter === "inactive" ? "selected" : ""}
        >
          Inactivos
        </label>
      </div>

      <div className="search-filter-container">
        <select
          // onChange={(e) => setFilter(e.target.value)}
          className="search-filter"
          name="people_filter"
          id="people_filter"
        >
          <option value="default">Ordenar Por</option>
          <option value="first_name">Primer Nombre</option>
          <option value="second_name">Segundo Nombre</option>
          <option value="surname">Primer Apellido</option>
          <option value="second_surname">Segundo Apellido</option>
        </select>
      </div>
    </>
  );
};

export default PeopleFilter;
