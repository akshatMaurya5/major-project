export const getValidDateTimeString = (dateInput, timeInput) => {
 const day = parseInt(dateInput.substring(0, 2), 10);
 const month = parseInt(dateInput.substring(2, 4), 10) - 1; // Months are zero-based in JavaScript
const year = 2000 + parseInt(dateInput.substring(4, 6), 10);

const hours = parseInt(timeInput.substring(0, 2), 10);
const minutes = parseInt(timeInput.substring(2, 4), 10);
const seconds = parseInt(timeInput.substring(4, 6), 10);

// Create a new Date object
const dateTime = new Date(year, month, day, hours, minutes, seconds);

// Format the date in a readable format
const readableDateTime = dateTime.toLocaleString();
return readableDateTime;
}