import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

const Sidebar = ({ filterData }) => {
  const [price, setPrice] = useState([200000, 6000000]);
  const [rating, setRating] = useState(0); // Đánh giá
  const [status, setStatus] = useState(""); // Trạng thái sản phẩm: "" | "in-stock" | "out-of-stock"

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (value) => {
    setPrice(value);
    filterData(value, rating, status); // Gọi filterData với các tham số mới
  };

  // Hàm xử lý thay đổi đánh giá
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    filterData(price, newValue, status); // Gọi filterData với các tham số mới
  };

  // Hàm xử lý thay đổi trạng thái sản phẩm
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    filterData(price, rating, newStatus); // Gọi filterData với các tham số mới
  };

  // Hàm định dạng tiền tệ VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div className="sidebar">
        <div className="fillterBox">
          <h6>Lọc theo giá</h6>
          <RangeSlider
            value={price}
            onInput={handlePriceChange}
            onChange={handlePriceChange}
            min={200000}
            max={10000000}
            step={5000}
          />
          <div className="d-flex pt-2 pd-2 priceRange">
            <span>
              Từ:{" "}
              <strong className="text-dark">{formatCurrency(price[0])}</strong>
            </span>
            <span className="ml-auto">
              Đến:{" "}
              <strong className="text-dark">{formatCurrency(price[1])}</strong>
            </span>
          </div>
        </div>

        <div className="fillterBox">
          <h6>Trạng thái sản phẩm</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={
                    <Checkbox
                      checked={status === "in-stock"}
                      onChange={() =>
                        handleStatusChange(
                          status === "in-stock" ? "" : "in-stock"
                        )
                      }
                    />
                  }
                  label="Còn hàng"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={
                    <Checkbox
                      checked={status === "out-of-stock"}
                      onChange={() =>
                        handleStatusChange(
                          status === "out-of-stock" ? "" : "out-of-stock"
                        )
                      }
                    />
                  }
                  label="Hết hàng"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="fillterBox">
          <h6>Đánh giá</h6>
          <div className="scroll">
            <ul>
              <li>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={handleRatingChange}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar END */}
    </>
  );
};

export default Sidebar;
