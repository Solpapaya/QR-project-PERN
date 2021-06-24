import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { fetchData } from "../../../global/functions/fetchData";

const PersonStatusLogFilter = () => {
  const [years, setYears] = useState([]);
  const [isMonthFilterExpanded, setIsMonthFilterExpanded] = useState(false);
  const [isYearFilterExpanded, setIsYearFilterExpanded] = useState(false);
  const [isStatusFilterExpanded, setIsStatusFilterExpanded] = useState(false);
  const { months } = useContext(MonthsContext);

  const {
    yearStatusLogFilter,
    setYearStatusLogFilter,
    monthStatusLogFilter,
    setMonthStatusLogFilter,
    statusFilter,
    setStatusFilter,
  } = useContext(PersonStatusLogsContext);

  const rfcParam = useParams().rfc;

  const getYears = async () => {
    const response = await fetchData(
      "get",
      `/statuslogs/${rfcParam}?get=years`
    );
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
              setMonthStatusLogFilter("all");
              setIsMonthFilterExpanded(!isMonthFilterExpanded);
            }}
            className={monthStatusLogFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <div className="months-container">
            {months.map((month) => (
              <div
                onClick={() => {
                  setMonthStatusLogFilter(month);
                  setIsMonthFilterExpanded(!isMonthFilterExpanded);
                }}
                className={
                  monthStatusLogFilter === month ? "month selected" : "month"
                }
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
              setYearStatusLogFilter("all");
              setIsYearFilterExpanded(!isYearFilterExpanded);
            }}
            className={yearStatusLogFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          {years.map((year) => {
            return (
              <li
                onClick={() => {
                  setYearStatusLogFilter(year.years);
                  setIsYearFilterExpanded(!isYearFilterExpanded);
                }}
                className={yearStatusLogFilter === year.years ? "selected" : ""}
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

export default PersonStatusLogFilter;
