import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
let AddPg = () => {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContactNumber, setDriverContactNumber] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: '',
    message: '',
  });

  const addToList = async (e) => {
    e.preventDefault()
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_API_URL}/insert`,
        {
          vehicleName,
          vehicleId,
          driverName,
          driverContactNumber,
        }
      );
      setMessage({ show: true, status: 'success', message: res.data.message });
    } catch (error) {
      setMessage({ show: true, status: 'error', message: error.response.data.message });
    }
  };

useEffect(() => {
  const hideMessage = () => {
    setMessage({ show: false, status: '', message: '' });
  };

  if (message.show) {
    const timeoutId = setTimeout(hideMessage, 3000);

    return () => clearTimeout(timeoutId);
  }
}, [message.show]);


  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <section
          className="add-pg p-3"
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            alignItems: 'center',
            marginTop: '20px',
            boxShadow:
              '0 4px 8px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)',
            borderRadius: '5%',
          }}
        >
          <div className="container">
            <div className="row">
              {message.show ? (
                <p style={{ textAlign: "center", color: `${message.status === 'success' ? 'green' : 'red'}` }}>
                  {message.message}
                </p>
              ) : ''}
              <div
                className="col"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  className="h4 text-dark"
                  style={{
                    fontSize: '30px',
                    fontWeight: '700',
                    // fontFamily: "cursive",
                    color: '#0099ff',
                    paddingTop: '20px',
                    // textDecoration: "underline",
                    marginBottom: '0px',
                  }}
                >
                  Asset Details
                </p>
                <p className="fst-italic"></p>
              </div>
            </div>
            <div
              className="row"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '7%',
                width: '100%',
              }}
            >
              <div className="col md-4">
                <form>
                  <div className="mb-2">
                    <input
                      type="text"
                      onChange={(event) => {
                        setVehicleName(event.target.value);
                      }}
                      className="form-control"
                      placeholder="Vehicle name"
                      style={{
                        padding: '10px 10px',
                        borderRadius: '2%',
                        border: '1px solid grey',
                        marginBottom: '15px',
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      onChange={(event) => {
                        setVehicleId(event.target.value);
                      }}
                      className="form-control"
                      placeholder="Vehicle id"
                      style={{
                        padding: '10px 10px',
                        borderRadius: '2%',
                        border: '1px solid grey',
                        marginBottom: '15px',
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      onChange={(event) => {
                        setDriverName(event.target.value);
                      }}
                      className="form-control"
                      placeholder="Driver name"
                      style={{
                        padding: '10px 10px',
                        borderRadius: '2%',
                        border: '1px solid grey',
                        marginBottom: '15px',
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      onChange={(event) => {
                        setDriverContactNumber(event.target.value);
                      }}
                      className="form-control"
                      placeholder="Driver contact number"
                      style={{
                        padding: '10px 10px',
                        borderRadius: '2%',
                        border: '1px solid grey',
                        marginBottom: '15px',
                      }}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="submit"
                      onClick={addToList}
                      className="btn btn-primary"
                      value="Create"
                      style={{
                        color: 'white',
                        backgroundColor: ' #0099ff',
                        fontWeight: '600',
                        // border: "1.4px solid blue",
                        //   marginTop: "40px",
                        borderRadius: '24px',
                        width: '100%',
                        padding: '1vh 1vh',
                        textDecoration: 'none',
                        fontWeight: '600',
                        // marginLeft: "130px",
                        fontSize: '20px',
                        marginLeft: '6px',
                      }}
                    />
                    <Link
                      to={'/pg/list'}
                      className="btn btn-dark ms-2"
                      style={{
                        color: 'white',
                        backgroundColor: ' #0099ff',
                        fontWeight: '600',
                        // border: "1.4px solid blue",
                        marginTop: '20px',
                        borderRadius: '24px',
                        width: '100%',
                        padding: '1vh 1vh',
                        textDecoration: 'none',
                        fontWeight: '600',
                        // marginLeft: "130px",
                        fontSize: '20px',
                      }}
                    >
                      Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default AddPg;
