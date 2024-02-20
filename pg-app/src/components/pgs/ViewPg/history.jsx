import React, { useEffect, useState } from "react";
import Axios from "axios";

let locList = [], setLocList;

function Records(props) {

    [locList, setLocList] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const res = await Axios.get(
                    `${process.env.REACT_APP_API_URL}/getLocation?key=${props.id}`
                );
                setLocList(res.data);

            } catch (error) {
                console.log(error, 'something broke');
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }
    )
    return (
        <table className="fixed_header">
            <thead>
                <tr>
                    <th>id</th>
                    <th>latitude</th>
                    <th>longitude</th>
                </tr>
            </thead>
            <tbody>
                {locList.map(({Latitude, Longitude}) => {

                    return (
                        <tr>
                            <td>{Latitude}</td>
                            <td>{Longitude}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Records;