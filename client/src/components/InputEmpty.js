import React from "react";

const InputEmpty = ({ msg, className }) => {
  return <span className={`input-empty-msg ${className}`}>{msg}</span>;
};

export default InputEmpty;
