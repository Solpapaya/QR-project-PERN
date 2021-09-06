import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { fetchData } from "../functions/fetchData";

const ChangePassword = () => {
  const { token } = useParams();
  const [render, setRender] = useState(false);
  const [hasValidatedLink, setHasValidatedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidLink = async () => {
    try {
      const headers = { token };
      await fetchData("get", "/change-password", { headers });
      setRender(true);
    } catch (err) {
      if (err.status === 401)
        setErrorMsg("Lo sentimos 😞, este link ha expirado");
      else setErrorMsg(err.data.msg);

      setRender(false);
    }
    setHasValidatedLink(true);
  };

  useEffect(() => {
    isValidLink();
  }, []);
  return (
    <>
      {hasValidatedLink ? (
        render ? (
          <ChangePasswordForm isValidLink={isValidLink} />
        ) : (
          <div style={{ textAlign: "center" }}>{errorMsg}</div>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default ChangePassword;
