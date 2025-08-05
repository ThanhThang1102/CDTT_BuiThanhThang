const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.options("*", cors);
app.use(bodyParser.json());

// Routes user
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const subCategoryRoutes = require("./routes/subCategoriesRoutes");
const productsRoutes = require("./routes/productsRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const favoriteProductRoutes = require("./routes/favoriteProductRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const slideBannerRoutes = require("./routes/slideBannerRoutes");
const searchRoutes = require("./routes/searchRoutes");
const contactRoutes = require("./routes/contactRoutes");
const logoWebRoutes = require("./routes/logoWebRoutes");

app.use(`/api/user`, userRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subcategory`, subCategoryRoutes);
app.use(`/api/products`, productsRoutes);
app.use(`/api/voucher`, voucherRoutes);
app.use(`/api/favorite`, favoriteProductRoutes);
app.use(`/api/review`, reviewRoutes);
app.use(`/api/order`, orderRoutes);
app.use(`/api/slideBanner`, slideBannerRoutes);
app.use(`/api/search`, searchRoutes);
app.use(`/api/contact`, contactRoutes);
app.use(`/api/logoWeb`, logoWebRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    // Database is ready
    console.log("Đã kết nối cơ sở dữ liệu...");
    // Server is ready
    app.listen(process.env.PORT, () => {
      console.log(`server đang chạy http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Lỗi kết nối cơ sở dữ liệu: ", err);
  });
