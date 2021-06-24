import React, { useState, useContext, useEffect } from "react";
import { MonthsContext } from "../../../global/context/MonthsContext";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { useParams } from "react-router";
import { fetchData } from "../../../global/functions/fetchData";

const PersonDetailFilter = () => {
  const [isMonthFilterExpanded, setIsMonthFilterExpanded] = useState(false);
  const [isYearFilterExpanded, setIsYearFilterExpanded] = useState(false);
  const {
    yearTaxReceiptFilter,
    setYearTaxReceiptFilter,
    monthTaxReceiptFilter,
    setMonthTaxReceiptFilter,
  } = useContext(PersonTaxReceiptsContext);
  const [years, setYears] = useState([]);
  const { months } = useContext(MonthsContext);

  const rfcParam = useParams().rfc;

  const getYears = async () => {
    const response = await fetchData(
      "get",
      `/person/taxreceipts/${rfcParam}?get=years`
    );
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
              setMonthTaxReceiptFilter("all");
              setIsMonthFilterExpanded(!isMonthFilterExpanded);
            }}
            className={monthTaxReceiptFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          <div className="months-container">
            {months.map((month) => (
              <div
                onClick={() => {
                  setMonthTaxReceiptFilter(month);
                  setIsMonthFilterExpanded(!isMonthFilterExpanded);
                }}
                className={
                  monthTaxReceiptFilter === month ? "month selected" : "month"
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
              setYearTaxReceiptFilter("all");
              setIsYearFilterExpanded(!isYearFilterExpanded);
            }}
            className={yearTaxReceiptFilter === "all" ? "selected" : ""}
          >
            Todos
          </li>
          {years.map((year) => {
            return (
              <li
                onClick={() => {
                  setYearTaxReceiptFilter(year.years);
                  setIsYearFilterExpanded(!isYearFilterExpanded);
                }}
                className={
                  yearTaxReceiptFilter === year.years ? "selected" : ""
                }
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

export default PersonDetailFilter;
