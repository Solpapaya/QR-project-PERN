import React, { useState, useEffect, useRef, useContext } from "react";
import AddPerson from "../components/AddPerson";
import AddPersonSubsections from "../components/AddPersonSubsections";
import AddUser from "../components/AddUser";
import { AddPersonSubsectionContext } from "../context/AddPersonSubsectionContext";

const AddSection = () => {
  const { addPersonSection } = useContext(AddPersonSubsectionContext);

  const sections = ["Agregar Persona", "Agregar Usuario"];

  return (
    <>
      <div className="search-header">
        <h2>{`${sections[addPersonSection - 1]}`}</h2>
      </div>
      <AddPersonSubsections />
      {addPersonSection === 1 ? <AddPerson /> : <AddUser />}
    </>
  );
};

export default AddSection;
