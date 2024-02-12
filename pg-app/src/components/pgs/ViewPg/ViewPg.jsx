import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LeafletMap from './lmap';
import Records from './history';
import ReactDOM from 'react-dom';
import Axios from 'axios';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
let myInterval, map;
let arr = [
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,1,120124,164852.000,2829.522172,N,07730.387996,E,0.01,146.57,12,239.682,1.4,0.0,airtel,1,1,24.8,4.2,0,C,29,D9*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,0,120124,164854.000,2829.522040,N,07730.388086,E,0.15,146.57,12,239.686,1.4,0.0,airtel,1,1,24.8,4.2,0,C,28,D3*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,1,120124,165106.000,2829.521074,N,07730.387420,E,0.11,154.96,12,239.795,1.4,0.0,airtel,1,1,24.8,4.2,0,C,29,C8*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,0,120124,165108.000,2829.521080,N,07730.387468,E,0.07,154.96,12,239.800,1.4,0.0,airtel,1,1,24.8,4.2,0,C,30,C2*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,1,120124,165315.000,2829.519274,N,07730.386166,E,0.24,321.79,12,239.724,1.4,0.0,airtel,1,1,24.8,4.2,0,C,29,D2*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,0,120124,165318.000,2829.519070,N,07730.386370,E,0.18,321.79,12,239.723,1.4,0.0,airtel,1,1,24.8,4.2,0,C,28,CC*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,1,120124,165524.604,2829.520870,N,07730.388578,E,0.14,149.98,12,239.782,1.4,0.0,airtel,1,1,24.8,4.2,0,C,30,E5*',
  '$PVT,VENDOR001,VTS_VER_00.01,NR,2,L,866477064977617,OD00GE1234,0,120124,165528.000,2829.518500,N,07730.390912,E,0.10,149.98,12,239.719,1.4,0.0,airtel,1,1,24.8,4.2,0,C,29,D0*',
];
// Split the first string into an array of substrings
// let splitArr = arr[0].split(',');

// Extract the pgid from the Vendor_ID (assuming Vendor_ID is at index 1)
// pgid = splitArr[1];

// Extract the lati and longi from Latitude and Longitude (assuming Latitude is at index 11 and Longitude is at index 13)
// lati = splitArr[11];
// longi = splitArr[13];
let i = 0;

// let coords={lati:0,long:0,key:0,},setCoords;
// async function update()
// {
//     if(i==arr.length)
//     {    return;    }
//     lati=arr[i][0];
//     longi=arr[i][1];
//     Axios.post(`${process.env.REACT_APP_API_URL}/insertLocation`,{
//         lati:lati,
//         long:longi,
//         key:pgid,
//     });
//     await sleep(1000);
//     Axios.get(`${process.env.REACT_APP_API_URL}/getLiveLocation?key=`+pgid).then((response)=>{

//         setCoords(response.data);
//     })
//     //console.log(i);
//     i=i+1;
//     // setCoords([lati,longi]);

// }

let ViewPg = () => {
  let obj = useParams();
  let pgid = obj.pgid;
  let lati, longi;
  const [pglist, setpglist] = useState([]);
  const [coords, setCoords] = useState({ lati: 0, long: 0, key: 0 });

  async function update() {
    if (i == arr.length) {
      return;
    }
    let splitArr = arr[i].split(',');
    lati = splitArr[11];
    longi = splitArr[13];
    Axios.post(`${process.env.REACT_APP_API_URL}/insertLocation`, {
      lati: lati,
      long: longi,
      key: pgid,
    });
    await sleep(1000);
    Axios.get(`${process.env.REACT_APP_API_URL}/getLiveLocation?key=` + pgid).then(
      (response) => {
        setCoords(response.data);
      }
    );
    i = i + 1;
  }

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/read`).then((response) => {
      setpglist(response.data);
    });

    myInterval = setInterval(update, 5000);

    return () => {
      i = 0;
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
                          {' '}
                          Name :
                          <span className="fw-normal">{' ' + val.pname}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Driver :
                          <span className="fw-normal">
                            {' ' + val.paddress}
                          </span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Latitude :
                          <span className="fw-normal">{' ' + coords.lati}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Longitude :
                          <span className="fw-normal">{' ' + coords.long}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Speed :
                          <span className="fw-normal">{' ' + val.oemail}</span>
                        </li>
                        <li className="list-group-item list-group-item-action fw-bold">
                          Contact :
                          <span className="fw-normal">
                            {' ' + val.ocontact}
                          </span>
                        </li>
                        <div className="col">
                          <Link
                            to="/pg/list"
                            className="btn btn-outline-primary mt-3"
                            style={{
                              color: 'white',
                              backgroundColor: '#008ae6',
                              fontWeight: '600',
                              marginLeft: '89%',
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
};
export default ViewPg;
