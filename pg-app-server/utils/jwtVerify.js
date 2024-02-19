import jwt from "jsonwebtoken";

export const getUserId = (token) => {
 if(!token) throw new Error('Invalid Request')
 return new Promise((resolve, reject) => {
  const tokenKey = token.split(' ')[1]
  jwt.verify(tokenKey, process.env.JWT_PASSWORD, (err, decoded) => {
   if (err) {
    reject(err);
   } else {
    resolve(decoded.id);
   }
  });
 });
};