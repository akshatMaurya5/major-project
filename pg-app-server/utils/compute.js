export const computeRawDataToJson = (data) => {
 try {
   const rawData = data.split(',')
 const dataKeys = {
  StartDollerCharHeader: '',
  Vendor_ID: '',
  FW_Version: '',
  Packet_Type: '',
  Alert_ID: '',
  Packet_Status: '',
  IMEI_Number: '',
  VehicleRegNumber: '',
  GPS_Fix_Status: '',
  Date: '',
  Time: '',
  Latitude: '',
  Latitude_Direction: '',
  Longitude: '',
  Longitude_Direction: '',
  Speed: '',
  Heading: '',
  NoOfSatellites: '',
  Altitude: '',
  PDOP: '',
  HDOP: '',
  Network_Operator: '',
  Ignition: '',
  Main_Power_Status: '',
  Main_Input_Voltage: '',
  Internal_Batt_Voltage: '',
  Emergency_Status: '',
  Tamper_Alert: '',
  GSM_Signal_Strength: '',
  CheckSum: '',
 }
 const computedData = Object.keys(dataKeys).reduce((acc, key, index) => {
  acc[key] = rawData[index];
  return acc;
 }, {});
 return computedData
 } catch (error) {
  return null;
 }

}