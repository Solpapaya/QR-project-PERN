import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PeopleFinder from "../apis/PeopleFinder";

const PersonDetailPage = () => {
  const [person, setPerson] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    rfc: "",
  });
  const rfcParam = useParams().rfc;
  useEffect(() => {
    const fetchData = async () => {
      const results = await PeopleFinder.get(`/people/${rfcParam}`);
      const foundPerson = results.data.data.person;
      if (foundPerson.segundo_nombre) setPerson({ ...foundPerson });
      else setPerson({ ...foundPerson, segundo_nombre: "" });
    };

    fetchData();
  });
  return (
    <div>
      <h1>{`${person.primer_nombre} ${person.segundo_nombre} ${person.primer_apellido} ${person.segundo_apellido}`}</h1>
      <h4>{person.rfc}</h4>
    </div>
  );
};

export default PersonDetailPage;
