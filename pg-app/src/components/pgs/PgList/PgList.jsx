import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import AuthContext from "../../../context/AuthContext";

let PgList = () => {
  const { loggedIn } = useContext(AuthContext);
  const [vehicleList, setVehicleList] = useState([]);
  const [filteredVehicleList, setFilteredVehicleList] = useState([]);
  const [oglist, setoglist] = useState([]);
  const [searchterm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({
    show: false,
    type: '',
    message: '',
  });

  useEffect(() => {
    const hideMessage = () => {
      setMessage({ show: false, status: '', message: '' });
    };
    if (message.show) {
      const timeoutId = setTimeout(hideMessage, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [message.show]);
  // useEffect(() => {
  //   const newpglist = oglist.filter((value) =>
  //     value.pname.toLowerCase().includes(searchterm.toLowerCase())
  //   );
  //   setpglist(newpglist);
  // }, [searchterm]);

  useEffect( () => {
    const getVehicles = async () => {
      try {
        const res = await Axios.get(`${process.env.REACT_APP_API_URL}/read`);
        setVehicleList(res.data.pgList);
        setFilteredVehicleList(res.data.pgList);
      } catch (error) {
        console.log(error);
      }
    }
    getVehicles()
  }, []);

  const filterVehicles = () => {
    const filteredList = vehicleList.filter(({vehicleName}) => vehicleName.toLowerCase().includes(searchterm.toLowerCase()))
    setFilteredVehicleList(filteredList)

  }
  return (
    <>
      {loggedIn && (
        <>
          <section className="pg-search p-3">
            <div className="container">
              <div className="grid">
                <div className="row">
                  <div className="col">
                    <p className="h3">
                      <p
                        style={{
                          color: '#212529',
                          display: 'inline',
                          marginRight: '57.5%',
                        }}
                      >
                        Asset tracking
                      </p>
                      <div style={{ display: 'inline' }}>
                        <Link
                          to={'/pg/add'}
                          className="btn btn-outline-primary ms-3"
                          style={{
                            color: 'white',
                            backgroundColor: '#008ae6',
                            fontWeight: '600',
                          }}
                        >
                          List new asset
                          <i className="fa fa-plus-circle me-2" />
                        </Link>
                        {/* <Link
                          to={'/pg/update'}
                          className="btn btn-outline-primary ms-3"
                          style={{
                            color: 'white',
                            backgroundColor: '#008ae6',
                            fontWeight: '600',
                          }}
                        >
                          Update asset
                          <i className="fa fa-plus-circle me-2" />
                        </Link> */}
                      </div>
                    </p>
                    <p style={{ color: '#212529' }}>
                      The best asset tracking platform
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-1 mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search here"
                        onChange={(event) => {
                          setSearchTerm(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-1 mt-2">
                      <input
                        type="submit"
                        className="btn btn-primary"
                        onClick={filterVehicles}
                        value="Search"
                        style={{
                          color: 'white',
                          backgroundColor: '#008ae6',
                          fontWeight: '600',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="pg-list">
            <div className="container">
              <div className="row mb-5">
                {filteredVehicleList.length ? filteredVehicleList.map((val, key) => {
                  // pglist.filter((val,key))=>{
                  // if(key%9==0)
                  // {
                  return (
                    // <div className="row-4 mt-5 mb-5">
                    <div key={key} className="col-4 md-4 mt-3">
                      <div
                        className="card"
                        style={{
                          width: '21rem',
                          height: '25rem',
                          boxShadow:
                            '0 4px 8px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)',
                          marginTop: '2rem',
                          // borderRadius: "5%"
                        }}
                        //   style={{
                        //     backgroundColor: "white",
                        //     display: "flex",
                        //     flexDirection: "column",
                        //     width: "21rem",
                        //     height: "25rem",
                        //     alignItems: "center",
                        //     marginTop: "50px",
                        //     boxShadow: "0 4px 8px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
                        //     borderRadius: "5%"
                        //   }}
                      >
                        <img
                          alt={val.vehicleName}
                          variant="top"
                          style={{ width: '21rem', height: '15rem' }}
                          src={'/pg' + (key % 9) + '.jpeg'}
                        />
                        <div className="card-body">
                          <div className="card-title">
                            <h4>{val.vehicleName}</h4>
                          </div>
                          <div className="card-text mb-3">{val.driverName}</div>
                          {/* <input type="submit" className="btn btn-outline-primary"/> */}
                          <Link
                            to={'/pg/view/' + val.vehicleId}
                            className="btn btn-outline-primary"
                          >
                            Explore
                          </Link>
                          <Link
                            to={`/pg/update/${val.vehicleId}`}
                            className="btn btn-outline-primary"
                          >
                            Update
                          </Link>
                        </div>
                      </div>
                    </div>
                    // </div>
                  );
                }): <>No vehicles</>}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
export default PgList;
