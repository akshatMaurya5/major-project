import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LeafletMap from './lmap';
import Records from './history';
import ReactDOM from 'react-dom';
import Axios from 'axios';

let ViewPg = () => {
  let { pgid } = useParams();
  let lati, longi;
  const [vehicle, setVehicle] = useState([]);
  const [message, setMessage] = useState({
    show: false,
    type: '',
    message: '',
  });
  const [coords, setCoords] = useState({ lati: 0, long: 0 });
  const [vehicleData, setVehicleData] = useState({});

  const handleComputation = (input) => {
    // const input = parseFloat(i)
    const computedValue =
      Math.floor(input / 100) +
      (100 / 60) * (input / 100 - Math.floor(input / 100));
    return computedValue;
  };
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await Axios.get(
          `${process.env.REACT_APP_API_URL}/getLiveLocation?key=${pgid}`
        );
        const { lat, lng } = res.data;
        const computedLat = handleComputation();
        const computedLng = handleComputation(lng);
        setCoords({ lati: lat, long: lng });
        setVehicleData(res.data);
        setMessage({
          show: false,
          status: '',
          message: '',
        });
      } catch (error) {
        setMessage({
          show: true,
          status: 'error',
          message: error.response?.data?.message
            ? error.response?.data?.message
            : 'Something went wrong',
        });
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [coords]);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        const res = await Axios.get(`${process.env.REACT_APP_API_URL}/read`);
        setVehicle(res.data.pgList.find(({ vehicleId }) => vehicleId === pgid));
      } catch (error) {
        console.log(error);
      }
    };
    getVehicles();
  }, []);
  // async function update() {
  //   if (i == arr.length) {
  //     return;
  //   }
  //   let splitArr = arr[i].split(',');
  //   lati = splitArr[11];
  //   longi = splitArr[13];
  //   Axios.post(`${process.env.REACT_APP_API_URL}/insertLocation`, {
  //     lati: lati,
  //     long: longi,
  //     key: pgid,
  //   });
  //   await sleep(1000);
  //   Axios.get(`${process.env.REACT_APP_API_URL}/getLiveLocation?key=` + pgid).then(
  //     (response) => {
  //       setCoords(response.data);
  //     }
  //   );
  //   i = i + 1;
  // }

  // useEffect(() => {
  //   // Axios.get(`${process.env.REACT_APP_API_URL}/read`).then((response) => {
  //   //   setpglist(response.data);
  //   // });

  //   myInterval = setInterval(update, 5000);

  //   return () => {
  //     i = 0;
  //     clearInterval(myInterval);
  //   };
  // }, []);
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
        <section className="view-pg mt-3">
          <div className="container">
            {message.show ? (
              <p
                style={{
                  textAlign: 'center',
                  color: `${message.status === 'success' ? 'green' : 'red'}`,
                }}
              >
                {message.message}
              </p>
            ) : (
              ''
            )}
            <div className="row">
              <div className="col-md-5">
                {/* <img src={"/gta map.jpeg"} style={{ width: '28rem',height:"23rem" }}/> */}
                <LeafletMap
                  // key={vehicle.vehicleId}
                  lat={coords.lati}
                  long={coords.long}
                />
              </div>

              <div className="col-md-7">
                <ul className="list-group">
                  <li className="list-group-item list-group-item-action fw-bold">
                    {' '}
                    Name :
                    <span className="fw-normal">
                      {' ' + vehicleData.vehicleId}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    {' '}
                    Date :
                    <span className="fw-normal">
                      {' ' + vehicleData.dateTime?.split(',')[0]}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    {' '}
                    Time :
                    <span className="fw-normal">
                      {' ' + vehicleData.dateTime?.split(',')[1]}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Driver :
                    <span className="fw-normal">
                      {' ' + vehicle.driverName}
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
                    <span className="fw-normal">{' ' + vehicleData.speed}</span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Network operator :
                    <span className="fw-normal">
                      {' ' + vehicleData.networkOperator}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    IMEI number :
                    <span className="fw-normal">
                      {' ' + vehicleData.imeiNumber}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Gps fix status :
                    <span className="fw-normal">
                      {' ' + vehicleData.gpsFixStatus}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Packet status :
                    <span className="fw-normal">
                      {' ' + vehicleData.packetStatus}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Heading :
                    <span className="fw-normal">
                      {' ' + vehicleData.heading}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Altitude :
                    <span className="fw-normal">
                      {' ' + vehicleData.altitude}
                    </span>
                  </li>
                  <li className="list-group-item list-group-item-action fw-bold">
                    Driver contact number :
                    <span className="fw-normal">
                      {' ' + vehicle.driverContactNumber}
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

                <Records id={vehicle.vehicleId} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default ViewPg;
