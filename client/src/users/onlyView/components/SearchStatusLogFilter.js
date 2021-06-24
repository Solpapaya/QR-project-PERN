import React, { useState, useContext, useEffect } from "react";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { fetchData } from "../../../global/functions/fetchData";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";

const SearchStatusLogFilter = () => {
  const [years, setYears] = useState([]);
  const [isMonthFilterExpanded, setIsMonthFilterExpanded] = useState(false);
  const [isYearFilterExpanded, setIsYearFilterExpanded] = useState(false);
  const [isStatusFilterExpanded, setIsStatusFilterExpanded] = useState(false);
  const { months } = useContext(MonthsContext);

  const {
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    statusFilter,
    setStatusFilter,
  } = useContext(SearchStatusLogsContext);

  const getYears = async () => {
    const response = await fetchData("get", `/statuslogs?get=years`);
    setYears(response.data.status_logs_years);
  };

  useEffect(() => {
    getYears();
  }, []);

  return (
    <div className="filters-container">
      <div className="filter-relative-container person-detail month">
        <ul
          className={
            isMonthFilterExpanded
              ? "search-filter-container month expanded"
              : "search-filter-container month"
          }
          //   className="search-filter-container month expanded"
        >
          <li
            // id="default-status-filter"
            onClick={() => setIsMonthFilterExpanded(!isMonthFilterExpanded)}
          >
            Mes
          </li>
          <li
            id="first-month-option"
            onClick={() => {
              setMonthFilter("all");
              setIsMonthFilterExpanded(!isMonthFilterExpanded);
            }}
            className={monthFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <div className="months-container">
            {months.map((month) => (
              <div
                onClick={() => {
                  setMonthFilter(month);
                  setIsMonthFilterExpanded(!isMonthFilterExpanded);
                }}
                className={monthFilter === month ? "month selected" : "month"}
              >
                {month}
              </div>
            ))}
          </div>
        </ul>
      </div>

      <div className="filter-relative-container person-detail year">
        <ul
          className={
            isYearFilterExpanded
              ? "search-filter-container year expanded"
              : "search-filter-container year"
          }
          //   className="search-filter-container year expanded"
          style={
            isYearFilterExpanded
              ? {
                  minHeight: `${(years.length + 2) * 3.5}rem`,
                }
              : {}
          }
        >
          <li onClick={() => setIsYearFilterExpanded(!isYearFilterExpanded)}>
            Año
          </li>
          <li
            onClick={() => {
              setYearFilter("all");
              setIsYearFilterExpanded(!isYearFilterExpanded);
            }}
            className={yearFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          {years.map((year) => {
            return (
              <li
                onClick={() => {
                  setYearFilter(year.years);
                  setIsYearFilterExpanded(!isYearFilterExpanded);
                }}
                className={yearFilter === year.years ? "selected" : ""}
              >
                {year.years}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="filter-relative-container person-detail">
        <ul
          className={
            isStatusFilterExpanded
              ? "search-filter-container filter expanded"
              : "search-filter-container filter"
          }
        >
          <li
            onClick={() => setIsStatusFilterExpanded(!isStatusFilterExpanded)}
          >
            Estado
          </li>
          <li
            onClick={() => {
              setStatusFilter("all");
              setIsStatusFilterExpanded(!isStatusFilterExpanded);
            }}
            className={statusFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <li
            onClick={() => {
              setStatusFilter("active");
              setIsStatusFilterExpanded(!isStatusFilterExpanded);
            }}
            className={statusFilter === "active" ? "selected" : ""}
          >
            Activos
          </li>
          <li
            onClick={() => {
              setStatusFilter("disabled");
              setIsStatusFilterExpanded(!isStatusFilterExpanded);
            }}
            className={statusFilter === "disabled" ? "selected" : ""}
          >
            Inactivos
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchStatusLogFilter;
