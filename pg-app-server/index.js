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

// app.use('/auth', authRoutes);

app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: "http://localhost:49680", credentials: true }));

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
  console.log("🚀 ~ app.get ~ req:", req)
  locations
    .find({ key: req.query.key })
    .sort({ _id: -1 })
    .limit(1)
    .then((products) => {
      console.log(products);
      products = products[0];
      let slice = {
        lati: products.lati,
        long: products.long,
        key: products.key,
      };
      res.send(slice);
    });
});

app.get("/getLocation", async (req, res) => {
  locations
    .find({ key: req.query.key })
    .sort({ _id: -1 })
    .then((locations) => {
      res.send(locations);
    });
});

app.post("/insert", async (req, res) => {
  try {
    const { authorization } = req.headers
    const userId = await getUserId(authorization);
    const { vehicleId, vehicleName, driverName, driverContactNumber } = req.body
    const existingRecord = await PgModel.findOne({ vehicleId })
    if (existingRecord) throw new Error('Vehicle already registered')
    const pg = new PgModel({
      vehicleId, 
      vehicleName, 
      driverName, 
      driverContactNumber,
      UserId: userId,
    });
    const resData = await pg.save();
    res.status(200).send({ data: resData });
  } catch (error) {
    res.status(500).send({ message: error.message })
    console.log(err);
  }
});

app.post("/update", async (req, res) => {
  try {
    const { authorization } = req.headers
    const userId = await getUserId(authorization)
    const { pname, paddress, pfacilities, oname, oemail, ocontact } = req.body;
    const pgData = await PgModel.findOne({ pname, UserId: userId })
    if (!pgData) throw new Error('No records found')
    // pgData.pname = pname;
    // pgData.userId = userId;
    pgData.paddress = paddress;
    pgData.pfacilities = pfacilities;
    pgData.oname = oname;
    pgData.oemail = oemail;
    pgData.ocontact = ocontact;
    pgData.save();
    res.status(200).json({ message: 'Data updated successfully' })
    // return res.redirect("back");
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.get("/read", async (req, res) => {
  try {
    const { authorization } = req.headers
    const userId = await getUserId(authorization)
    const pgList = await PgModel.find({ UserId: userId })
    res.status(200).json({ data: pgList })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

app.post('/validate-vehicle', async (req, res, next) => {
  try {
    const key = req.headers['auth-key'] // extremely barebone 
    if (!key || key != "mindstask-api-key") {
      res.status(401).json({ error: 'Unauthorized request' });
    }
    const inputData = computeRawDataToJson(req.body.data)

    if (inputData && inputData.Vendor_ID) {
      const existingRecord = await PgModel.findOne({ vehicleId: inputData.Vendor_ID });

      if (existingRecord) {
        const { _id } = existingRecord;
        const newRecord = new locations(inputData)
        newRecord.PgId = _id
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
