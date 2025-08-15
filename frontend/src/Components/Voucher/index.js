import React, { useState } from "react";
import { BiSolidDiscount } from "react-icons/bi";
import { postData } from "../../utils/api";
import { Button } from "@mui/material";

const Voucher = ({
  totalPrice,
  applyDiscount,
  AppliedDate,
  DiscountPercentage,
  VoucherCode,
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [isApplied, setIsApplied] = useState(false); // Trạng thái để kiểm soát nút
  const [voucherData, setVoucherData] = useState(null);

  const handleApplyDiscount = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      console.log("Khong co token");
      return;
    }
    const dataProp = {
      code: discountCode,
      totalPrice,
    };
    try {
      const response = await postData("/api/voucher/apply", dataProp, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });

      if (response.status) {
        // Nếu mã hợp lệ
        console.log("apply success", response);
        setVoucherData(response);
        setMessage(response.message);
        setIsValid(true);
        setIsApplied(true); // Đánh dấu mã đã áp dụng
        applyDiscount(response.discount, response.finalPrice);
        AppliedDate(response.applyDate);
        DiscountPercentage(response.discount);
        VoucherCode(response.voucherCode)
      } else {
        // Nếu mã không hợp lệ
        setMessage(response.message);
        setIsValid(false);
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi áp dụng mã giảm giá");
      setIsValid(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="d-flex align-items-center flex-column mb-2">
      <p className="mb-2">Mã giảm giá (Nếu có)</p>
      <div className="discountCode">
        <div className="iconDiscount">
          <BiSolidDiscount />
        </div>
        <input
          type="text"
          id="discount-code"
          className="input-discount form-control mr-2"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          disabled={isApplied} // Vô hiệu hóa nếu đã áp dụng mã giảm giá
        />
        <p className="my-2">
          <strong className="text-danger">Lưu ý: </strong>
          <span style={{ fontStyle: "italic" }}>
            Hãy chắc chắn bạn muốn đặt hàng, khi áp dụng sẽ mất số lần sử dụng
            voucher! Xin cảm ơn.../
          </span>
        </p>
        <Button
          className="my-3 text-capitalize bg-red btnCheckout"
          onClick={handleApplyDiscount}
          disabled={isApplied} // Vô hiệu hóa nếu đã áp dụng mã giảm giá
        >
          Áp dụng
        </Button>
        {message && (
          <p
            style={{ marginTop: "-10px", fontSize: "12px" }}
            className={`checkCode ${isValid ? "success" : "error"}`}
          >
            {message}
          </p>
        )}
        {voucherData?.applyDate && (
          <p
            style={{ marginTop: "7px", fontSize: "12px" }}
            className={`checkCode ${isValid ? "success" : "error"}`}
          >
            {voucherData?.applyDate}
          </p>
        )}
        {voucherData?.discount && (
          <p style={{ marginTop: "25px", fontSize: "12px" }} className="mb-0">
            Đã giảm: {formatCurrency(voucherData?.discount)}
          </p>
        )}

        {voucherData?.usedCount && (
          <p
            style={{ marginTop: "", fontSize: "12px" }}
            className={`mb-0 ${
              voucherData?.usedCount === voucherData?.usageLimit
                ? "text-danger"
                : "text-success"
            }`}
          >
            Đã dùng: {voucherData?.usedCount}
          </p>
        )}
        {voucherData?.usageLimit && (
          <p
            style={{ marginTop: "", fontSize: "12px" }}
            className={`mb-0 ${
              voucherData?.usedCount < voucherData?.usageLimit
                ? "text-danger"
                : "text-danger"
            }`}
          >
            Giới hạn: {voucherData?.usageLimit}
          </p>
        )}
      </div>
    </div>
  );
};

export default Voucher;
