import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Sidebar from "./Sidebar";
import DeleteForm from "./DeleteForm";
import ModifyForm from "./ModifyForm";
import AddForm from "./AddForm";
import axios from "axios";

function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("modify"); // State to track selected option

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the token from cookies or local storage
        const token = localStorage.getItem("access_token");

        // Make a request to the protected route on your server
        const response = await axios.get("http://localhost:5000/admin-panel", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If successful, set loading to false
        setLoading(false);
      } catch (error) {
        // If the request fails, you can redirect the user or handle it in some way
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>You do not have access to this route!</div>;
  }
  return (
    <div className="container-fluid bg-secondary ">
      <div className="row">
        <div className="col-3 bg-white vh-100">
          <Sidebar onOptionClick={handleOptionClick} />
        </div>
        <div className="col">
          {selectedOption === "modify" && <ModifyForm />}{" "}
          {selectedOption === "add" && <AddForm />}{" "}
          {selectedOption === "delete" && <DeleteForm />}
          {/* Render ModifyForm if 'modify' is selected */}
          {/* Add similar conditions for other options */}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
