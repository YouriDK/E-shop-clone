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

const mongodb_Url = config.MONGODB_URI || config.MONGODB_URL;

mongoose
  .connect(mongodb_Url, {
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
const PORT = process.env.PORT || 5000;

// * Middleware pour changer entre developpement et production
if (process.env.NODE_ENV === "production ") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api Running ! ");
  });
}

app.use(bodyParser.json());
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/product", productRoute); // ! Il fallait mettre cela pour pouvoir voir les détais du produit

app.get("/api/config/paypal", (req, res) => {
  //* Pour récupérer le client ID paypal dans le back end
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

// ! express understand only ES5 and we're in ES6  that's why we need babel
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

app.listen(PORT, () => {
  console.log(`Serve at http://localhost:${PORT}`);
});
