import express from "express";
import config from "./Scripts/config.js";
import doten from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productsRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import path from "path";

doten.config();
// *  Mongo DB URI c'est le mongo DB atlas pas le compass en local
const MONGODB_URI = config.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    // * Pour enlever les warnings
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected ! ", process.env.NODE_ENV);
});

const app = express();

app.use(bodyParser.json());
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/product", productRoute); // ! Il fallait mettre cela pour pouvoir voir les détais du produit
var __dirname = path.resolve(path.dirname(""));
// * Middleware pour changer entre developpement et production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api Running !!! ");
  });
}

app.get("/api/config/paypal", (req, res) => {
  //* Pour récupérer le client ID paypal dans le back end
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.set("PORT", PORT);
app.listen(PORT, () => {
  console.log(`Serve at http://localhost:${PORT}`);
});
