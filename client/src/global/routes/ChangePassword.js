import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { fetchData } from "../functions/fetchData";

const ChangePassword = () => {
  const { token } = useParams();
  const [render, setRender] = useState(false);
  const [hasValidatedLink, setHasValidatedLink] = useState(false);

  const isValidLink = async () => {
    try {
      const headers = { token };
      const response = await fetchData("get", "/auth", { headers });
      console.log({ response });
      setRender(true);
    } catch (err) {
      console.log({ err });
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
          <div>Sorry, this link has expired</div>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default ChangePassword;
