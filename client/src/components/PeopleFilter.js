import React, { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";

const PeopleFilter = () => {
  const { filter, setFilter } = useContext(SearchContext);
  const { sort, setSort } = useContext(SearchContext);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isSortExpanded, setIsSortExpanded] = useState(false);

  const clickFilterHandler = (e) => {
    const newFilter = e.target.id;
    if (newFilter !== filter) {
      setFilter(newFilter);
    }
    setIsFilterExpanded(!isFilterExpanded);
  };

  const clickSortHandler = (e) => {
    const newSort = e.target.id;
    if (newSort !== sort) {
      setSort(newSort);
    }
    setIsSortExpanded(!isSortExpanded);
  };

  const clickDefaultFilterHandler = (e) => {
    if (e.target.id === "default-filter") {
      setIsFilterExpanded(!isFilterExpanded);
    } else {
      setIsSortExpanded(!isSortExpanded);
    }
  };

  return (
    <>
      <div className="filter-relative-container">
        <ul
          className={
            isFilterExpanded
              ? "search-filter-container filter expanded"
              : "search-filter-container filter"
          }
        >
          <li id="default-filter" onClick={clickDefaultFilterHandler}>
            Filtrar Por
          </li>
          <li
            id="all"
            onClick={clickFilterHandler}
            className={filter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <li
            id="active"
            onClick={clickFilterHandler}
            className={filter === "active" ? "selected" : ""}
          >
            Activos
          </li>
          <li
            id="disabled"
            onClick={clickFilterHandler}
            className={filter === "disabled" ? "selected" : ""}
          >
            Inactivos
          </li>
        </ul>
      </div>

      <div className="sort-relative-container">
        <ul
          className={
            isSortExpanded
              ? "search-filter-container sort expanded"
              : "search-filter-container sort"
          }
          // className="search-filter-container sort expanded"
        >
          <li id="default-sort" onClick={clickDefaultFilterHandler}>
            Ordenar Por
          </li>
          <li
            id="first_name"
            onClick={clickSortHandler}
            className={sort === "first_name" ? "selected" : ""}
          >
            Primer Nombre
          </li>

          <li
            id="second_name"
            onClick={clickSortHandler}
            className={sort === "second_name" ? "selected" : ""}
          >
            Segundo Nombre
          </li>
          <li
            id="surname"
            onClick={clickSortHandler}
            className={sort === "surname" ? "selected" : ""}
          >
            Primer Apellido
          </li>
          <li
            id="second_surname"
            onClick={clickSortHandler}
            className={sort === "second_surname" ? "selected" : ""}
          >
            Segundo Apellido
          </li>
          <li
            id="rfc"
            onClick={clickSortHandler}
            className={sort === "rfc" ? "selected" : ""}
          >
            RFC
          </li>
        </ul>
      </div>
    </>
  );
};

export default PeopleFilter;
