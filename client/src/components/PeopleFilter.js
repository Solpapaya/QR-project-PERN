import React, { useContext, useState, useEffect } from "react";
import { SearchContext } from "../context/SearchContext";
import { fetchData } from "../functions/fetchData";

const PeopleFilter = () => {
  const { statusFilter, setStatusFilter } = useContext(SearchContext);
  const { departmentFilter, setDepartmentFilter } = useContext(SearchContext);
  const { sort, setSort } = useContext(SearchContext);
  const [isFilterStatusExpanded, setIsFilterStatusExpanded] = useState(false);
  const [isFilterDepartmentExpanded, setIsFilterDepartmentExpanded] =
    useState(false);
  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const [departments, setDepartments] = useState([]);

  const getDepartments = async () => {
    const response = await fetchData("get", "/departments");
    setDepartments(response.data.departments);
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const clickStatusFilterHandler = (e) => {
    const newFilter = e.target.id;
    if (newFilter !== statusFilter) {
      setStatusFilter(newFilter);
    }
    setIsFilterStatusExpanded(!isFilterStatusExpanded);
  };

  const clickDepartmentFilterHandler = (e) => {
    const newFilter = e.target.id;
    if (newFilter !== departmentFilter) {
      setDepartmentFilter(newFilter);
    }
    setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
  };

  const clickSortHandler = (e) => {
    const newSort = e.target.id;
    if (newSort !== sort) {
      setSort(newSort);
    }
    setIsSortExpanded(!isSortExpanded);
  };

  const clickDefaultFilterHandler = (e) => {
    switch (e.target.id) {
      case "default-status-filter":
        setIsFilterStatusExpanded(!isFilterStatusExpanded);
        break;
      case "default-department-filter":
        setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
        break;
      case "default-sort":
        setIsSortExpanded(!isSortExpanded);
        break;
    }
  };

  return (
    <>
      <div className="filter-relative-container">
        <ul
          className={
            isFilterStatusExpanded
              ? "search-filter-container filter expanded"
              : "search-filter-container filter"
          }
        >
          <li id="default-status-filter" onClick={clickDefaultFilterHandler}>
            Estado
          </li>
          <li
            id="all"
            onClick={clickStatusFilterHandler}
            className={statusFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <li
            id="active"
            onClick={clickStatusFilterHandler}
            className={statusFilter === "active" ? "selected" : ""}
          >
            Activos
          </li>
          <li
            id="disabled"
            onClick={clickStatusFilterHandler}
            className={statusFilter === "disabled" ? "selected" : ""}
          >
            Inactivos
          </li>
        </ul>
      </div>

      <div className="filter-relative-container">
        <ul
          className={
            isFilterDepartmentExpanded
              ? "search-filter-container department expanded"
              : "search-filter-container department"
          }
          style={
            isFilterDepartmentExpanded
              ? {
                  minHeight: `${(departments.length + 2) * 3.5}rem`,
                }
              : {}
          }
        >
          <li
            id="default-department-filter"
            onClick={clickDefaultFilterHandler}
          >
            Area
          </li>
          <li
            id="all_areas"
            onClick={clickDepartmentFilterHandler}
            className={departmentFilter === "all_areas" ? "selected" : ""}
          >
            Todas
          </li>
          {departments.map((department) => {
            const { id, department_name } = department;
            return (
              <li
                key={id}
                id={department_name}
                onClick={clickDepartmentFilterHandler}
                className={
                  departmentFilter === department_name ? "selected" : ""
                }
              >
                {department_name}
              </li>
            );
          })}
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
          <li
            id="creation_date"
            onClick={clickSortHandler}
            className={sort === "creation_date" ? "selected" : ""}
          >
            Fecha de Alta
          </li>
        </ul>
      </div>
    </>
  );
};

export default PeopleFilter;
