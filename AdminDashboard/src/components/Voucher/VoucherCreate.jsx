import { useContext, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FaGift } from "react-icons/fa";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const VoucherCreate = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState({
    code: "",
    discountType: "",
    discountValue: "",
    minOrderValue: "",
    maxDiscountValue: "",
    expirationDate: "",
    usageLimit: 1,
  });

  const handleClose = () => {
    setVoucher({
      code: "",
      discountType: "",
      discountValue: "",
      minOrderValue: "",
      maxDiscountValue: "",
      expirationDate: "",
      usageLimit: 1,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVoucher((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log(voucher);
    setLoading(true);
    window.scrollTo(0, 0);

    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      expirationDate,
      usageLimit,
    } = voucher;

    try {
      // Chuẩn hóa dữ liệu voucher
      const voucherData = {
        code,
        discountType,
        discountValue: parseFloat(discountValue || 0),
        minOrderValue: parseFloat(minOrderValue || 0),
        maxDiscountValue: maxDiscountValue
          ? parseFloat(maxDiscountValue)
          : null,
        expirationDate,
        usageLimit: parseInt(usageLimit || 1, 10),
      };

      // Gửi yêu cầu tạo voucher
      const response = await postData("/api/voucher/create", voucherData);

      if (response?.success) {
        // Thông báo thành công
        context.setMessage(
          response.message || "Voucher đã được tạo thành công."
        );
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);

        // Đóng modal và chuyển hướng
        handleClose();
        setTimeout(() => navigate("/voucher/list"), 1000);
      } else {
        // Thông báo lỗi từ server
        const errorMessage =
          response.message || response.error?.message || "Có lỗi xảy ra.";
        context.setMessage(errorMessage);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      // Xử lý lỗi bất ngờ
      console.error("Error creating voucher:", error);
      context.setMessage("Đã xảy ra lỗi trong quá trình thêm voucher.");
      context.setTypeMessage("error");
      context.setOpen(true);
    } finally {
      // Hoàn tất quá trình xử lý
      setLoading(false);
    }
  };

  // Hàm tạo mã ngẫu nhiên
  const generateRandomCode = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    setVoucher((prev) => ({ ...prev, code: randomCode }));
  };

  return (
    <div>
      <form onSubmit={handleCreate}>
        {loading && <LinearProgress />}

        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name">Tạo mã voucher hoặc</label>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={generateRandomCode}
                  className="ml-2 position-absolute text-capitalize"
                  style={{ top: "-10px" }}
                >
                  ngẫu nhiên
                </Button>
                <TextField
                  label="Mã Voucher"
                  name="code"
                  variant="outlined"
                  fullWidth
                  value={voucher.code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="discountType">Loại Giảm Giá</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Loại Giảm Giá
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    label="Loại Giảm Giá"
                    name="discountType"
                    tabIndex="4"
                    value={voucher.discountType}
                    onChange={handleChange}
                  >
                    {["percentage", "fixed"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === "percentage" ? "Phần Trăm" : "Cố Định"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="discountValue">Số Tiền Giảm</label>
                <TextField
                  label="Số Tiền Giảm"
                  name="discountValue"
                  variant="outlined"
                  placeholder="[Cố định], ví dụ: 50.000đ ; [Phần trăm]], ví dụ: 10%"
                  fullWidth
                  value={voucher.discountValue}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="minOrderValue">
                  Giá Trị Đơn Hàng Tối Thiểu
                </label>
                <TextField
                  label="Giá Trị Đơn Hàng Tối Thiểu"
                  name="minOrderValue"
                  variant="outlined"
                  fullWidth
                  value={voucher.minOrderValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="maxDiscountValue">Giới Hạn Giảm Giá</label>
                <TextField
                  label="Giới Hạn Giảm Giá"
                  name="maxDiscountValue"
                  variant="outlined"
                  fullWidth
                  value={voucher.maxDiscountValue}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="expirationDate">Ngày Hết Hạn</label>
                <TextField
                  label="Ngày Hết Hạn"
                  name="expirationDate"
                  variant="outlined"
                  fullWidth
                  value={voucher.expirationDate}
                  onChange={handleChange}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="usageLimit">Số Lượng Sử Dụng</label>
                <TextField
                  label="Số Lượng Sử Dụng"
                  name="usageLimit"
                  variant="outlined"
                  fullWidth
                  value={voucher.usageLimit}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="w-100 d-flex">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<FaGift />}
              className="ml-auto"
            >
              Thêm Voucher
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VoucherCreate;
