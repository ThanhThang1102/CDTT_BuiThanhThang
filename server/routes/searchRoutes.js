const express = require("express");
const { ProductModel } = require("../models/ProductModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 8; // Số lượng sản phẩm trên mỗi trang, mặc định là 10

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query",
        type: "error",
      });
    }

    // Tìm sản phẩm theo tên (case-insensitive)
    const items = await ProductModel.find({
      name: { $regex: query, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    })
      .skip((page - 1) * limit) // Bỏ qua các sản phẩm của các trang trước đó
      .limit(limit); // Giới hạn số lượng sản phẩm trả về cho trang hiện tại

    // Tính tổng số sản phẩm để tính toán tổng số trang
    const totalItems = await ProductModel.countDocuments({
      name: { $regex: query, $options: "i" },
    });

    const totalPages = Math.ceil(totalItems / limit); // Tính số trang

    // Trả kết quả tìm kiếm và phân trang
    res.json({
      success: true,
      message: "Search results",
      items,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `An error occurred while searching for products: ${error.message}`,
      type: "error",
    });
  }
});

module.exports = router;
