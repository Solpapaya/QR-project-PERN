import React, { useState, useContext, useEffect } from "react";
import { SearchTaxReceiptsContext } from "../context/SearchTaxReceiptsContext";
import { MonthsContext } from "../context/MonthsContext";
import { fetchData } from "../functions/fetchData";

const SearchTaxReceiptFilter = () => {
  const [isMonthFilterExpanded, setIsMonthFilterExpanded] = useState(false);
  const [isYearFilterExpanded, setIsYearFilterExpanded] = useState(false);
  const { yearFilter, setYearFilter, monthFilter, setMonthFilter } = useContext(
    SearchTaxReceiptsContext
  );
  const [years, setYears] = useState([]);
  const { months } = useContext(MonthsContext);

  const getYears = async () => {
    const response = await fetchData("get", `/taxreceipts?get=years`);
    setYears(response.data.tax_receipts_years);
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
            id="default-status-filter"
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
          //   className="search-filter-container month expanded"
          style={
            isYearFilterExpanded
              ? {
                  minHeight: `${(years.length + 2) * 3.5}rem`,
                }
              : {}
          }
        >
          <li
            id="default-status-filter"
            onClick={() => setIsYearFilterExpanded(!isYearFilterExpanded)}
          >
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
    </div>
  );
};

export default SearchTaxReceiptFilter;
