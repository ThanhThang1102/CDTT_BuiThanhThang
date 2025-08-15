import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { MdCloudUpload } from "react-icons/md";
import { Button, TextField } from "@mui/material";
import { MyContext } from "../../App";
import { getData, putData, putDataOne } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyAccount = () => {
  const context = useContext(MyContext);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    image: [],
  });

  const [isSubmittingPass, setIsSubmittingPass] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Hàm thay đổi input cho các trường text
  const onChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name !== "images") {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  // Hàm tải lên ảnh và cập nhật formFields
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên (nếu có)
    if (file) {
      // Kiểm tra kích thước file trước khi xử lý
      if (file.size > 5 * 1024 * 1024) {
        context.setAlertBox({
          open: true,
          message: "Kích thước hình ảnh phải nhỏ hơn 5 MB.",
          type: "error",
        });
        return;
      }

      // Thiết lập hình ảnh xem trước
      setImagePreview(URL.createObjectURL(file));

      // Cập nhật formFields để bao gồm ảnh mới vào mảng images
      setFormFields((prev) => ({
        ...prev,
        image: [file], // Ghi đè mảng images bằng một mảng chứa file đã chọn
      }));
    }
  };

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const response = await getData(`/api/user/${context.userData.userId}`);
        if (response.success) {
          const userData = response.user;
          setFormFields((prevFields) => ({
            ...prevFields,
            ...userData,
          }));
          setAvatar(userData.avatar);
          // context.setAlertBox({
          //   open: true,
          //   message: response.message,
          //   type: "success",
          // });
        } else {
          context.setAlertBox({
            open: true,
            message: response.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        context.setAlertBox({
          open: true,
          message: "Lỗi kết nối server.",
          type: "error",
        });
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

    fetchData();
  }, []);

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmittingInfo(true);

    // Tạo FormData mới
    const formData = new FormData();
    const { username, fullName, email, phone, image } = formFields;
    let file = null;

    // Append các trường khác vào FormData
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);

    // Kiểm tra và append ảnh (nếu có)
    if (image && image[0]) {
      file = image[0];
      console.log("Có hình ảnh:", file);
      formData.append("avatar", file); // Thêm ảnh vào formData
    }

    try {
      // Lấy token từ localStorage hoặc sessionStorage
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Gửi dữ liệu lên server
      const response = await putData(
        `/api/user/${context.userData.userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Xác thực token
          },
        }
      );

      // Xử lý kết quả trả về từ server
      if (response.success) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: "success",
        });
      } else {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      context.setAlertBox({
        open: true,
        message: "Lỗi kết nối server.",
        type: "error",
      });
    } finally {
      // Dừng loading và ẩn thông báo sau 5 giây
      setLoading(false);
      setIsSubmittingInfo(false);
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmittingPass(true);

    // Chuyển payload thành JSON thay vì sử dụng FormData
    const payload = {
      currentPassword,
      newPassword,
    };

    try {
      // Lấy token từ localStorage hoặc sessionStorage
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Gửi yêu cầu PUT để thay đổi mật khẩu
      const response = await putDataOne(
        `/api/user/change-password/${context.userData.userId}`,
        payload, // Truyền payload dưới dạng JSON
        {
          headers: {
            Authorization: `Bearer ${token}`, // Xác thực token
          },
        }
      );

      // Xử lý kết quả trả về từ server
      if (response.success) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: "success",
        });
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
          navigate("/signIn"); // Đưa người dùng quay lại trang đăng nhập
        }, 1000);
      } else {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      context.setAlertBox({
        open: true,
        message: "Lỗi kết nối server.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setIsSubmittingPass(false);
      // Dừng loading và ẩn thông báo sau 5 giây
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">Thông tin tài khoản của bạn </h2>
        <Box className="myAccBox shadow border-0" sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Chỉnh sửa thông tin" {...a11yProps(0)} />
              <Tab label="Thay đổi mật khẩu" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <form onSubmit={handleSubmitInfo}>
              <div className="row">
                <div className="col-md-4">
                  <div className="userImage">
                    <img
                      src={
                        imagePreview ||
                        avatar ||
                        "https://via.placeholder.com/200"
                      } // Hiển thị ảnh avatar
                      alt="Avatar"
                      className="img-fluid"
                    />
                    <div className="overlay d-flex align-items-center justify-content-center">
                      <MdCloudUpload />
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Tên tài khoản"
                          variant="outlined"
                          fullWidth
                          name="username"
                          value={formFields.username}
                          onChange={onChangeInput}
                          disabled={isSubmittingInfo}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Họ và tên"
                          variant="outlined"
                          fullWidth
                          name="fullName"
                          value={formFields.fullName}
                          onChange={onChangeInput}
                          disabled={isSubmittingInfo}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Số điện thoại"
                          variant="outlined"
                          fullWidth
                          name="phone"
                          value={formFields.phone}
                          onChange={onChangeInput}
                          disabled={isSubmittingInfo}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Email"
                          variant="outlined"
                          fullWidth
                          name="email"
                          value={formFields.email}
                          onChange={onChangeInput}
                          disabled={isSubmittingInfo}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue bg-red btn-lg btn-big"
                      disabled={isSubmittingInfo}
                    >
                      {isSubmittingInfo ? "Đang cập nhật..." : "Lưu"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <form onSubmit={handleSubmitPassword}>
              <div className="row">
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Mật khẩu hiện tại"
                          type="password"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          id="outlined-basic"
                          label="Mật khẩu mới"
                          type="password"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue bg-red btn-lg btn-big"
                      disabled={isSubmittingPass}
                    >
                      <span>{isSubmittingPass ? "Đang cập nhật..." : "Lưu"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CustomTabPanel>
        </Box>
      </div>
    </section>
  );
};

export default MyAccount;
