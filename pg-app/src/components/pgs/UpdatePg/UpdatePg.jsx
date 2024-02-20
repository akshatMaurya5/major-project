import React, { useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import {useState} from "react";
import Axios from "axios";
let UpdatePg=()=>{

    const {pgid} = useParams()
    const [vehicle, setVehicle] = useState(null);
      const [message, setMessage] = useState({
        show: false,
        type: '',
        message: '',
      });

    useEffect(() => {
        const getCurrentVehicle = async () => {
        try {
            const res = await Axios.get(`${process.env.REACT_APP_API_URL}/read`)
            setVehicle(res.data.pgList.find(({vehicleId}) => vehicleId === pgid ))
        } catch (error) {
            console.log("🚀 ~ getCurrentVehicle ~ error:", error)
        }
    }
    getCurrentVehicle()
    }, [pgid])

    const addToList= async (e)=>{
        e.preventDefault();
        try {
            const res = await Axios.post(`${process.env.REACT_APP_API_URL}/update`, vehicle)
            setMessage({ show: true, status: 'success', message: res.data.message });
        } catch (error) {
            setMessage({
                show: true,
                status: 'error',
                message: error.response.message,
            });
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target
        setVehicle({...vehicle, [name]: value})
    }

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
            {vehicle ? (
              <div className="container">
                {message.show ? (
                  <p
                    style={{
                      textAlign: 'center',
                      color: `${
                        message.status === 'success' ? 'green' : 'red'
                      }`,
                    }}
                  >
                    {message.message}
                  </p>
                ) : (
                  ''
                )}
                <div className="row">
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
                      Update asset
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
                          name="vehicleName"
                          value={vehicle.vehicleName}
                          onChange={handleChange}
                          className="form-control"
                          placeholder=" Name"
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
                          name="driverName"
                          value={vehicle.driverName}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Driver"
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
                          name="driverContactNumber"
                          value={vehicle.driverContactNumber}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Latitude"
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
                          value="Update"
                          style={{
                            color: 'white',
                            backgroundColor: ' #0099ff',
                            marginLeft: '8px',
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
            ) : (
              <p>Loading..</p>
            )}
          </section>
        </div>
      </>
    );
};
export default UpdatePg;