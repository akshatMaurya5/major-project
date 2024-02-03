import React from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LeafletMap from "./lmap";
import Records from "./history";
import ReactDOM from "react-dom";
import Axios from "axios";

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//  }

// let myInterval,map;
// let arr=[[31.3,75.57],[31.304,75.5720],[31.3060,75.5762],[31.3070,75.5790],[31.3080,75.58],[31.3090,75.5809]];
// let i=0,pgid;
// let lati=arr[0][0],longi=arr[0][1],key=0;
// let coords={lati:0,long:0,key:0,},setCoords;

function ViewPg() {
  const { pgid } = useParams();
  const [pglist, setpglist] = useState([]);
  const [coords, setCoords] = useState({ lati: 0, long: 0, key: 0 });
  const [i, setI] = useState(0);
  const arr = [
    [31.3, 75.57],
    [31.304, 75.572],
    [31.306, 75.5762],
    [31.307, 75.579],
    [31.308, 75.58],
    [31.309, 75.5809],
  ];

  const update = async () => {
    const response = await Axios.get("http://localhost:5000/getLocation?key=" + pgid);
    const arr = response.data.map(location => [location.lati, location.long]);
    if (i === arr.length) {
        return;
    }
    const lati = arr[i][0];
    const longi = arr[i][1];
    await Axios.post("http://localhost:5000/insertLocation", {
      lati: lati,
      long: longi,
      key: pgid,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const liveLocationResponse = await Axios.get("http://localhost:5000/getLiveLocation?key=" + pgid);
    setCoords(liveLocationResponse.data);
    setI(i + 1);
  };

  useEffect(() => {
    Axios.get("http://localhost:5000/read").then((response) => {
      setpglist(response.data);
    });

    const myInterval = setInterval(update, 5000);

    return () => {
      setI(0);
      clearInterval(myInterval);
    };
  }, []);

  return (
    <>
      <section className="view-pg-intro p-3">
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="h2 text-dark"> Tracking Info</p>
              <p className="fst-italic"></p>
            </div>
          </div>
        </div>
      </section>
      <div className="abc">
        {pglist.map((val, key) => {
          if (key == pgid) {
            return (
              // <div className="row-4 mt-5 mb-5">
              <section key={key} className="view-pg mt-3">
                <div className="container">
                  <div className="row">
                    <div className="col-md-5">
                      {/* <img src={"/gta map.jpeg"} style={{ width: '28rem',height:"23rem" }}/> */}
                      <LeafletMap
                        key={key}
                        lat={coords.lati}
                        long={coords.long}
                      />
                    </div>
                    <div className="col-md-7">
                      <ul className="list-group">
                        <li className="list-group-item list-group-item-action fw-bold">
                          {" "}
                          Name :
                          <span className="fw-normal">{" " + val.pname}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Driver :
                          <span className="fw-normal">
                            {" " + val.paddress}
                          </span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Latitude :
                          <span className="fw-normal">{" " + coords.lati}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Longitude :
                          <span className="fw-normal">{" " + coords.long}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Speed :
                          <span className="fw-normal">{" " + val.oemail}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Contact :
                          <span className="fw-normal">
                            {" " + val.ocontact}
                          </span>
                        </li>
                        <div className="col">
                          <Link
                            to="/pg/list"
                            className="btn btn-outline-primary mt-3"
                            style={{
                              color: "white",
                              backgroundColor: "#008ae6",
                              fontWeight: "600",
                              marginLeft: "89%",
                            }}
                          >
                            Home
                          </Link>
                        </div>
                      </ul>
                      <Records id={key} />
                    </div>
                  </div>
                </div>
              </section>
              // </div>
            );
          }
        })}
        ;
      </div>
    </>
  );
}
export default ViewPg;
