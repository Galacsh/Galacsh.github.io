import React from "react";

const MDIcon = ({ iconName, className = "" }) => (
  <i className={`mdi mdi-${iconName} ${className}`}></i>
);

export default MDIcon;
