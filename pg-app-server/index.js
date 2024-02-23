import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { dataDump, locations } from "./models/postMessage.js";
import { Pg as PgModel } from "./models/postMessage.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import router from "./routes/userRoutes.js";
import cookieparser from "cookie-parser";
import { computeRawDataToJson } from "./utils/compute.js";
import { getUserId } from "./utils/jwtVerify.js";
import jwt from "jsonwebtoken";
import { getValidDateTimeString } from "./utils/utils.js";


// app.use('/auth', authRoutes);

app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: "http://navic.mindstask.us:3000", credentials: true }));

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;
app.use("/auth", router);
mongoose
  .connect(CONNECTION_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port : ${process.env.PORT}`))
  )
  .catch((error) => console.log(error.message));

// app.post("/insertLocation", async (req, res) => {
//   const lat = req.body.lati;
//   const long = req.body.long;
//   const key = req.body.key;
//   const loc = new locations({ lati: lat, long: long, key: key });
//   try {
//     loc.save();
//     console.log(loc);
//     console.log("saving location in db");
//     res.end();
//   } catch {
//     console.log(err);
//     res.end();
//   }
// });

app.get("/getLiveLocation", async (req, res) => {
  const Vendor_ID = req.query.key
  try {
    const location = await locations.find({Vendor_ID}).sort({TimeStamp: -1}).limit(1)
    if(!location[0]) throw new Error('No location data found')
    // res.status(200).json(location)
    const responseData = {
      lng: location[0].Longitude, 
      lat: location[0].Latitude, 
      lngDirection: location[0].Longitude_Direction, 
      latDirection: location[0].Latitude_Direction,
      speed: location[0].Speed,
      vehicleId: location[0].Vendor_ID,
      packetStatus: location[0].Packet_Status,
      imeiNumber: location[0].IMEI_Number,
      vehicleRegNumber: location[0].VehicleRegNumber,
      gpsFixStatus: location[0].GPS_Fix_Status,
      heading: location[0].Heading,
      heading: location[0].Heading,
      altitude: location[0].Altitude,
      networkOperator: location[0].Network_Operator,
      dateTime: getValidDateTimeString(location[0].Date, location[0].Time)
    }
    // const responseData = {lng: Math.random() * 180 - 90, lat: Math.random() * 360 - 180, lngDirection: location.Longitude_Direction, latDirection: location.Latitude_Direction}
    res.status(200).json(responseData)
  } catch (error) {
    res.status(500).json({message: error.message});
  }
  // locations
  //   .find({ key: req.query.key })
  //   .sort({ _id: -1 })
  //   .limit(1)
  //   .then((products) => {
  //     console.log(products);
  //     products = products[0];
  //     let slice = {
  //       lati: products.lati,
  //       long: products.long,
  //       key: products.key,
  //     };
  //     res.send(slice);
  //   });
});

app.get("/getLocation", async (req, res) => {
  console.log(req.query.key, 'req.query.key');
  const {id: userId} = jwt.verify(
      req.cookies.token,
      process.env.JWT_PASSWORD
    );
  locations
    .find({ Vendor_ID: req.query.key, UserId: userId })
    .sort({ _id: -1 })
    .then((locations) => {
      res.send(locations);
    });
});

app.post("/insert", async (req, res) => {
  try {
    // const { authorization } = req.headers
    // const userId = await getUserId(authorization);
    const {id: userId} = jwt.verify(
      req.cookies.token,
      process.env.JWT_PASSWORD
    );
    const { vehicleId, vehicleName, driverName, driverContactNumber } = req.body
    const existingRecord = await PgModel.findOne({ vehicleId })
    console.log('existingRecord', existingRecord);
    if (existingRecord) throw new Error('Vehicle already registered')
    const pg = new PgModel({
      vehicleId, 
      vehicleName, 
      driverName, 
      driverContactNumber,
      UserId: userId,
    });
    const resData = await pg.save();
    console.log(resData);
    res.status(200).json({ message: 'Record created successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message })
  }
});

app.post("/update", async (req, res) => {
  try {
    const {id: userId} = jwt.verify(
      req.cookies.token,
      process.env.JWT_PASSWORD
    );
    const { vehicleId, vehicleName, driverName, driverContactNumber } = req.body;
    const pgData = await PgModel.findOne({ vehicleId, UserId: userId })
    if (!pgData) throw new Error('No records found')
    // pgData.pname = pname;
    // pgData.userId = userId;
    // pgData.vehicleId = vehicleId;
    pgData.vehicleName = vehicleName;
    pgData.driverName = driverName;
    pgData.driverContactNumber = driverContactNumber;
    pgData.save();
    res.status(200).json({ message: 'Data updated successfully' })
    // return res.redirect("back");
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.get("/read", async (req, res) => {
  try {
    const {id: userId} = jwt.verify(
      req.cookies.token,
      process.env.JWT_PASSWORD
    );
    const pgList = await PgModel.find({ UserId: userId })
    res.status(200).json({ pgList })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.post('/validate-vehicle', async (req, res, next) => {
console.log('hello');
console.log(req.body);
console.log('hello');
try {
    const key = req.headers['auth-key'] // extremely barebone 
    if (!key || key != "mindstask-api-key") {
      res.status(401).json({ error: 'Unauthorized request' });
    }
    const inputData = computeRawDataToJson(req.body.data)

    if (inputData && inputData.Vendor_ID) {
      console.log('inputData', inputData);
      const existingRecord = await PgModel.findOne({ vehicleId: inputData.Vendor_ID });
      console.log(existingRecord,'existingRecord');
      if (existingRecord) {
        const { _id } = existingRecord;
        const newRecord = new locations(inputData)
        console.log(newRecord, 'newRecord');
        newRecord.PgId = _id
        newRecord.TimeStamp = new Date()
        await newRecord.save()
        // const {_id} = await newRecord.save();
        // existingRecord.locations.push(_id);
        // existingRecord.save();
        const dumpInstance = new dataDump(inputData)
        await dumpInstance.save(); // just storing to keep track of the data
        res.status(200).json({ status: 'location updated successfully' })
      } else {
        res.status(404).json({ error: 'Vehicle not registered' })
      }
    } else {
      throw new Error('invalid request')
    }
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` })
  }
})

