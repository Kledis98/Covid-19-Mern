import React from "react";
import {
  HousesFill,
  FileEarmarkPlusFill,
  FileEarmarkMinusFill,
  PlugFill,
  DatabaseFillGear,
} from "react-bootstrap-icons";
import "./AdminPanel.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Sidebar({ onOptionClick }) {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("access_token");

    navigate("/");
  };

  return (
    <div className="'bg-white sidebar p-2">
      <div className="m-3">
        <HousesFill className="me-3 fs-4" />
        <span className="brand-name fs-4">Admin dashboard</span>
      </div>
      <hr className="text-dark"></hr>
      <div className="list-group list-group-flush">
        <a
          onClick={() => onOptionClick("modify")}
          className="list-group-item py-2 my-1"
        >
          <DatabaseFillGear className="me-3 fs-4" />
          <span>Modify</span>
        </a>

        <a
          onClick={() => onOptionClick("add")}
          className="list-group-item py-2 my-1"
        >
          <FileEarmarkPlusFill className="me-3 fs-4" />
          <span>Add</span>
        </a>
        <a
          onClick={() => onOptionClick("delete")}
          className="list-group-item py-2 my-1"
        >
          <FileEarmarkMinusFill className="me-3 fs-4" />
          <span>Delete</span>
        </a>
        <a onClick={logout} className="list-group-item py-2 my-1">
          <PlugFill className="me-3 fs-4" />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
