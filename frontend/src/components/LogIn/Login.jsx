import { useState } from "react";
import "./Login.css"
import {useCookies} from 'react-cookie'
import {Link, useNavigate} from 'react-router-dom'
import axios from "axios"

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [cookies, setCookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://covid-19-tracker-mt79.onrender.com/login", {
        username,
        password,
      });



      setCookies("access_token", response.data.token);
      localStorage.setItem("access_token", response.data.token);
      window.localStorage.setItem("adminID", response.data.adminID);

      const isValidToken = response.data.token && response.data.adminID;


      // Check the response status before navigating
      if (isValidToken) {
        navigate("/admin-panel");
      } else {
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-2 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">
                      Please enter your username and password!
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(event) =>
                            setUsername(event.target.value)
                          }
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="username">
                          Username
                        </label>
                      </div>

                      <div className="form-outline form-white mb-4">
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>

                      <button
                        className="btn btn-outline-light btn-lg px-5"
                        type="submit"
                      >
                        Login
                      </button>
                      {errorMessage && (
                        <p className="text-danger mt-3">{errorMessage}</p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LogIn;
