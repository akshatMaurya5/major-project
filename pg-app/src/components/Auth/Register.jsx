import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const { func, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  async function submitfunc(e) {
    try {
      e.preventDefault();
      const formData = {
        email,
        password,
        confirmPassword,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/`,
        formData
      );
      console.log(response);
      if(response.data.success == false)
      {
        alert(`${response.data.message}`)
        return;
      }
      await func();
      navigate("/pg/list");
      func();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {/* <div>Register Form</div>
      <form onSubmit={submitfunc}>
        <input
          type="email"
          value={email}
          placeholder="Enter the email"
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
         <input
          type="password"
          value={password}
          placeholder="Enter the password"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
         <input
          type="password"
          value={confirmPassword}
          placeholder="Enter the password again"
          onChange={(e) => {
            setconfirmPassword(e.target.value);
          }}
        />
        <button type="submit">
            Submit
        </button>
      </form> */}
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              width: "42%",
              alignItems: "center",
              marginTop: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
              borderRadius: "5%"
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: "700",
                // fontFamily: "cursive",
                color: "#0099ff",
                paddingTop: "30px",
                // textDecoration: "underline",
                marginBottom: "0px",
              }}
            >
              Register Form
            </div>
            <form
              onSubmit={submitfunc}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "7%",
                width: "80%",
              }}
            >
              {/* <p
                style={{
                  color: "Blue",
                  fontSize: "20px",
                  fontWeight: "600",
                  paddingTop: "0px",
                  marginBottom: "8px",
                }}
              >
                Email
              </p> */}
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                // pattern="[a-z.]*[@]\bsac.isro.gov.in"
                style={{ padding: "16px 10px", borderRadius: "2%", border: "1px solid grey", marginBottom: "30px"}}
              />
              {/* <p
                style={{
                  color: "Blue",
                  fontSize: "20px",
                  fontWeight: "600",
                  paddingTop: "20px",
                  marginBottom: "8px",
                }}
              >
                Password
              </p> */}
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                style={{ padding: "16px 10px", borderRadius: "2%", border: "1px solid grey"}}
              />
              {/* <p
                style={{
                  color: "Blue",
                  fontSize: "20px",
                  fontWeight: "600",
                  paddingTop: "20px",
                  marginBottom: "8px",
                }}
              >
                Confirm Password
              </p> */}
              <input
                type="password"
                value={confirmPassword}
                placeholder="Verify password"
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
                style={{ marginTop: "30px", paddingTop: "0px", padding: "16px 10px", borderRadius: "2%", border: "1px solid grey"}}
              />
              <button
                type="submit"
                style={{
                  color: "white",
                backgroundColor: " #0099ff",
                fontWeight: "600",
                // border: "1.4px solid blue",
                marginTop: "40px",
                borderRadius: "24px",
                width: "100%",
                padding: "1vh 1vh",
                textDecoration: "none",
                fontWeight: "600",
                // marginLeft: "130px",
                fontSize: "20px"
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </>
    </>
  );
}
