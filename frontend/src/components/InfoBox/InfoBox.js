import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./InfoBox.css";

function InfoBox({ title, cases, ...props }) {
  return (
    <div className="infoBox" onClick={props.onClick}>
      <Typography className="title" color="textSecondary">
        {title}
      </Typography>
      <h2 className="cases">{cases}</h2>
    </div>
  );
}

export default InfoBox;
