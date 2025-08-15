import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import axios from "axios";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const Checkout = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    fullName: "",
    phone: "",
    detail: "",
    notes: "",
    paymentMethod: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Thay đổi giá trị mặc định
  const [selectedProvince, setSelectedProvince] = useState({
    code: "",
    name: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState({
    code: "",
    name: "",
  });
  const [selectedWard, setSelectedWard] = useState({ code: "", name: "" });
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  // Fetch danh sách Tỉnh/Thành phố
  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Fetch danh sách Quận/Huyện theo Tỉnh
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts || []);
      setWards([]); // Reset wards khi tỉnh thay đổi
      setSelectedDistrict({ code: "", name: "" }); // Reset lựa chọn quận/huyện
      setSelectedWard({ code: "", name: "" }); // Reset lựa chọn phường/xã
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Fetch danh sách Phường/Xã theo Quận
  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards || []);
      setSelectedWard({ code: "", name: "" }); // Reset lựa chọn phường/xã
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces(); // Lấy danh sách tỉnh khi load component
  }, []);

  // Xử lý khi chọn Tỉnh/Thành phố
  const handleProvinceChange = (event) => {
    const selected = provinces.find(
      (province) => province.code === event.target.value
    );
    setSelectedProvince(selected || { code: "", name: "" });
    if (selected) fetchDistricts(selected.code);
  };

  // Xử lý khi chọn Quận/Huyện
  const handleDistrictChange = (event) => {
    const selected = districts.find(
      (district) => district.code === event.target.value
    );
    setSelectedDistrict(selected || { code: "", name: "" });
    if (selected) fetchWards(selected.code);
  };

  // Xử lý khi chọn Phường/Xã
  const handleWardChange = (event) => {
    const selected = wards.find((ward) => ward.code === event.target.value);
    setSelectedWard(selected || { code: "", name: "" });
  };

  const handleCancelOrder = () => {
    localStorage.removeItem("checkoutData"); // Xóa dữ liệu từ localStorage
    setTimeout(() => {
      if (context.setAlertBox) {
        // Kiểm tra setter trước khi gọi
        context.setAlertBox({
          open: true,
          message: "Đơn đã được hủy!",
          type: "success",
        });
      } else {
        console.error("context.setAlertBox không được định nghĩa.");
      }
      navigate("/cart"); // Điều hướng về giỏ hàng
    }, 1000);
  };

  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const checkoutData = {
      ...formFields,
      userId: context.checkoutData.userId,
      items: context.checkoutData.items,
      isVoucher: context.checkoutData.isVoucher,
      voucherCode: context.checkoutData.voucherCode,
      discountPercentage: context.checkoutData.discountPercentage,
      totalPrice: context.checkoutData.totalPrice,
      appliedDate: context.checkoutData.appliedDate,
      province: selectedProvince.name,
      provinceCode: selectedProvince.code,
      district: selectedDistrict.name,
      districtCode: selectedDistrict.code,
      ward: selectedWard.name,
      wardCode: selectedWard.code,
    };

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      // Gọi API và đợi kết quả trả về
      const response = await postData("/api/order/create", checkoutData, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });

      // Kiểm tra phản hồi
      if (response.status) {
        console.log("Đã đặt đơn hàng", response.message);
        context.setAlertBox({
          open: true,
          message: response.message, // Lấy message từ response
          type: response.type || "success",
        });
        context.setCartData([]);
        context.setCheckoutCartData([])
        localStorage.removeItem("checkoutData");
        setTimeout(() => {
          navigate("/my-order"); // Điều hướng về đơn hàng người dùng
        }, 1000);
        setLoading(false);
      } else {
        console.log(response.message);
        context.setAlertBox({
          open: true,
          message: response.message, // Lấy message từ response khi lỗi
          type: response.type || "error",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("Lỗi khi gửi dữ liệu: ", error.message);
      context.setAlertBox({
        open: true,
        message: "Đã xảy ra lỗi khi đặt hàng", // Thông báo lỗi khi không gọi được API
        type: "error",
      });
      setLoading(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoading(false);
      }, 5000);
    }
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <form onSubmit={handleCheckout}>
            <div className="row">
              <div className="col-md-8">
                <h2 className="hd">Chi tiết thanh toán</h2>
                <p>
                  <strong className="text-danger">Lưu ý: </strong>
                  <span style={{ fontStyle: "italic" }}>
                    Tránh nhập sai thông tin để không ảnh hưởng đến việc giao
                    hàng! Xin cảm ơn.../
                  </span>
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <InputLabel id="demo-simple-select-label">
                        Họ và tên
                      </InputLabel>
                      <TextField
                        id="outlined-basic"
                        label="Họ và tên"
                        placeholder="Nguyễn A Chim"
                        variant="outlined"
                        name="fullName"
                        onChange={handleInputChange}
                        error={formFields.fullName === "" ? true : false}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <InputLabel id="demo-simple-select-label">
                        Số điện thoại
                      </InputLabel>
                      <TextField
                        id="outlined-basic"
                        label="Số điện thoại"
                        placeholder="0352 --- --- "
                        variant="outlined"
                        name="phone"
                        onChange={handleInputChange}
                        error={formFields.phone === "" ? true : false}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel
                        id="demo-simple-select-label"
                        error={selectedProvince.code === "" ? true : false}
                      >
                        Tỉnh / thành phố
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={selectedProvince?.code || ""}
                        onChange={handleProvinceChange}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Chọn Tỉnh / Thành phố</em>
                        </MenuItem>
                        {provinces?.map((province) => (
                          <MenuItem key={province.code} value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel
                        id="demo-simple-select-label"
                        error={selectedDistrict.code === "" ? true : false}
                      >
                        Quận / Huyện
                      </InputLabel>
                      <Select
                        value={selectedDistrict?.code || ""}
                        onChange={handleDistrictChange}
                        disabled={!selectedProvince?.code}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Chọn Quận / Huyện</em>
                        </MenuItem>
                        {districts?.map((district) => (
                          <MenuItem key={district.code} value={district.code}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <InputLabel
                        id="demo-simple-select-label"
                        error={selectedWard.code === "" ? true : false}
                      >
                        Phường / Xã
                      </InputLabel>
                      <Select
                        value={selectedWard?.code || ""}
                        onChange={handleWardChange}
                        disabled={!selectedDistrict?.code}
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Chọn Phường / Xã</em>
                        </MenuItem>
                        {wards?.map((ward) => (
                          <MenuItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <InputLabel id="demo-simple-select-label">
                        Địa chỉ giao hàng
                      </InputLabel>
                      <TextField
                        id="outlined-basic"
                        label="Số nhà cụ thể hoặc số địa chỉ nơi gần bạn nhất"
                        variant="outlined"
                        multiline
                        rows={1}
                        sx={{ width: "100%" }}
                        name="detail"
                        onChange={handleInputChange}
                        error={formFields.detail === "" ? true : false}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <InputLabel id="demo-simple-select-label">
                        Ghi chú của bạn với chúng tôi
                      </InputLabel>
                      <TextField
                        id="outlined-basic"
                        label="Nội dung bạn cần nhắn nhủ..."
                        variant="outlined"
                        multiline
                        rows={4}
                        sx={{ width: "100%" }}
                        name="notes"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card orderInfo">
                  <h4 className="hd">Đơn hàng của bạn</h4>
                  <div className="table-responsive mt-3">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {context.checkoutData?.items?.lenght !== 0 &&
                          context.checkoutData?.items?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {item.productId.name.substr(0, 20) + "..."}{" "}
                                  <b>× {item.quantity}</b>
                                </td>
                                <td>{formatCurrency(item.price)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>

                    <div className="d-flex align-items-center mb-3">
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">
                          Phương thức thanh toán
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                          value={formFields.paymentMethod} // Liên kết giá trị
                          onChange={(e) =>
                            setFormFields({
                              ...formFields,
                              paymentMethod: e.target.value,
                            })
                          }
                        >
                          <FormControlLabel
                            value="cash"
                            control={<Radio />}
                            label="Thanh toán khi nhận hàng"
                          />
                          <FormControlLabel
                            value="payment"
                            control={<Radio />}
                            disabled
                            label="Thanh toán trực tuyến(Đang phát triển...)"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="text-success mr-2">
                        {context.checkoutData?.isVoucher === true
                          ? "Đã áp dụng mã giảm giá"
                          : ""}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span>Tổng phải chi trả:</span>
                      <span className="priceCart ml-auto font-weight-bold">
                        {formatCurrency(
                          parseFloat(context.checkoutData?.totalPrice)
                        )}
                      </span>
                    </div>
                    <Button
                      type="submit"
                      fullWidth
                      className="btn-blue bg-red btn-lg btn-big my-2"
                    >
                      Đặt hàng
                    </Button>
                    <Button
                      fullWidth
                      className="btn-blue  btn-lg btn-big"
                      onClick={handleCancelOrder}
                    >
                      Không đặt đơn này nữa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
