import React, { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const PeopleFilter = () => {
  const { setFilter } = useContext(SearchContext);

  return (
    <select
      onChange={(e) => setFilter(e.target.value)}
      name="people_filter"
      id="people_filter"
    >
      <option value="all">Todos</option>
      <option value="active">Activos</option>
      <option value="inactive">Inactivos</option>
    </select>
  );
};

export default PeopleFilter;
