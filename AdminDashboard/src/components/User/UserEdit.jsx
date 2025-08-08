import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useCallback, useContext, useEffect, useState } from "react";
import { IoIosClose, IoIosSave } from "react-icons/io";
import { FcAddImage } from "react-icons/fc";
import { MyContext } from "../../App";

import LinearProgress from "@mui/material/LinearProgress";
import { Button } from "@mui/material";
import { deleteData, getData, putData } from "../../utils/api";

const UserEdit = (props) => {
  const userID = props.userID;
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formFields, setFormFields] = useState({
    username: "",
    fullName: "",
    password: "",
    phone: "",
    role: "",
    isActive: true,
    image: [],
  });

  useEffect(() => {
    setFormFields((prevFields) => ({
      ...prevFields,
    }));
  }, []);

  // Hàm thay đổi input cho các trường text
  const onChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Nếu trường là images, bạn không cần cập nhật images ở đây
    if (name !== "images") {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const handleSelectChange = (field, value) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  // Hàm tải lên ảnh và cập nhật formFields
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Thiết lập ảnh xem trước
      setImagePreview(URL.createObjectURL(file));

      // Cập nhật formFields để bao gồm ảnh mới vào mảng images
      setFormFields((prev) => ({
        ...prev,
        image: [file], // Ghi đè mảng images bằng một mảng chứa file đã chọn
      }));
    }
  };

  // Hàm xóa ảnh
  const handleRemoveImage = async () => {
    setLoading(true);
    setFormFields((prev) => ({
      ...prev,
      image: [], // Xóa ảnh hiện tại
      public_id: [], // Xóa public_id của ảnh hiện tại
    }));
    setImagePreview(null);
    setLoading(false);
  };

  const [avatar, setAvatar] = useState("");

  const fetchData = useCallback(async () => {
    window.scrollTo(0, 0);
    try {
      const [resUser] = await Promise.all([getData(`/api/user/${userID}`)]);

      // Xử lý dữ liệu sản phẩm
      if (resUser) {
        const userData = resUser.user;
        setAvatar(userData.avatar);
        setFormFields((prevFields) => ({
          ...prevFields,
          ...userData,
          role: userData.role || "", // Cung cấp giá trị mặc định nếu không có role
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isValidPassword = (password) => {
    // Kiểm tra độ dài mật khẩu tối thiểu là 8 ký tự
    const minLength = 8;
    if (password.length < minLength) {
      return false;
    }

    // Kiểm tra có ít nhất một chữ hoa
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      return false;
    }

    // Kiểm tra có ít nhất một chữ thường
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
      return false;
    }

    // Kiểm tra có ít nhất một chữ số
    const hasDigit = /\d/.test(password);
    if (!hasDigit) {
      return false;
    }

    // Kiểm tra có ít nhất một ký tự đặc biệt
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
      return false;
    }

    return true; // Nếu tất cả các điều kiện đều thoả mãn
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, fullName, password, phone, role, isActive, image } =
      formFields;

    // Nếu mật khẩu có, kiểm tra tính hợp lệ (có thể thêm hàm kiểm tra mật khẩu)
    if (password && !isValidPassword(password)) {
      context.setMessage("Password is invalid.");
      context.setTypeMessage("error");
      context.setOpen(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("isActive", isActive);

    // Nếu có mật khẩu, thêm mật khẩu vào formData
    if (password) {
      formData.append("password", password);
    }

    // Append the image if available
    if (image && image[0]) {
      // Optional: Validate image type and size (for example, max 5MB)
      const file = image[0];
      if (file.size > 5 * 1024 * 1024) {
        context.setMessage("Kích thước hình ảnh phải nhỏ hơn 5 MB.");
        context.setTypeMessage("error");
        context.setOpen(true);
        setLoading(false);
        return;
      }
      formData.append("avatar", file); // Send the uploaded file
    }

    try {
      const response = await putData(`/api/user/${userID}`, formData);

      // Handle success or failure response
      if (response.success) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
      }
      context.setOpen(true);
    } catch (error) {
      console.error("Error updating user:", error);
      context.setMessage("An error occurred while updating.");
      context.setTypeMessage("error");
      context.setOpen(true);
    } finally {
      context.setOpenDraw(false);
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    // Kiểm tra nếu không có userID
    if (!userID) {
      context.setMessage("Không xác định được người dùng để xóa.");
      context.setTypeMessage("error");
      context.setOpen(true);
      return;
    }

    // Hiển thị xác nhận xóa
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này?"
    );
    if (!confirmDelete) {
      return;
    }

    // Bắt đầu trạng thái loading
    setLoading(true);
    try {
      const response = await deleteData(`/api/user/delete-user/`, userID);

      // Xử lý phản hồi thành công hoặc thất bại
      if (response.success) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
      } else {
        context.setMessage(
          response.message || "Đã xảy ra lỗi khi xóa người dùng."
        );
        context.setTypeMessage(response.type || "error");
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình gọi API
      console.error("Error deleting user:", error);
      context.setMessage("Đã xảy ra lỗi khi xóa người dùng.");
      context.setTypeMessage("error");
    } finally {
      // Kết thúc trạng thái loading
      context.setOpenDraw(false);
      context.setOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="flex items-center justify-between">
            <h1 className="font-weight-bold mb-0">
              _ID: <strong className="text-indigo-400">{userID}</strong>
            </h1>
          </div>
        </div>
        {loading && <LinearProgress />}
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">
            Thông tin cần thiết:
          </h2>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="username">Tên tài khoản</label>
                <TextField
                  id="username"
                  name="username"
                  label="Tên tài khoản"
                  type="text"
                  value={formFields.username}
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: UserOne"
                  onChange={onChangeInput}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên</label>
                <TextField
                  id="fullName"
                  name="fullName"
                  label="Họ và tên"
                  type="text"
                  value={formFields.fullName}
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: Nguyễn A Cu"
                  onChange={onChangeInput}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <TextField
                  id="phone"
                  name="phone"
                  label="Số điện thoại"
                  type="text"
                  value={formFields.phone}
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: 0342123456"
                  onChange={onChangeInput}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <TextField
                  id="password"
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  value={formFields.password}
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: UserOne123@"
                  onChange={onChangeInput}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="role">Quyền truy cập</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Quyền truy cập
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={formFields.role}
                    label="Quyền truy cập"
                    name="role"
                    onChange={(e) => handleSelectChange("role", e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Quyền truy cập</em>
                    </MenuItem>
                    <MenuItem value="user">Người dùng</MenuItem>
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="isActive">Cấp phép</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Cấp phép
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={formFields.isActive}
                    label="Cấp phép"
                    name="isActive"
                    onChange={(e) =>
                      handleSelectChange("isActive", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Cấp phép</em>
                    </MenuItem>
                    <MenuItem value={true}>Hoạt động</MenuItem>
                    <MenuItem value={false}>Khóa hoạt động</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">Tải ảnh lên</h2>
          <div className="flex items-center gap-4 flex-wrap">
            {avatar ? (
              <div className="imgUploadBoxWrapper">
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300">
                  <img src={avatar} alt="Uploaded" />
                </div>
              </div>
            ) : (
              <span>Chưa có ảnh đại diện</span>
            )}
            {imagePreview ? (
              <div className="imgUploadBoxWrapper">
                <span
                  className="remove flex items-center justify-center"
                  onClick={handleRemoveImage}
                >
                  <IoIosClose />
                </span>
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300">
                  <img src={imagePreview} alt="Uploaded" />
                </div>
              </div>
            ) : (
              <div className="imgUploadBoxWrapper">
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300 flex items-center justify-center flex-col">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageUpload}
                  />
                  <FcAddImage className="icon" />
                  <h4>Chọn ảnh</h4>
                </div>
              </div>
            )}
          </div>

          <div className="border-0 mt-5 flex w-100">
            <div className="ml-auto">
              <Button
                type="submit"
                className="flex items-center mr-2 py-2"
                variant="contained"
                color="primary"
              >
                <IoIosSave className="mr-1" style={{ fontSize: "25px" }} />
                <span className="text-sm capitalize">
                  {loading === true ? "Đang cập nhật..." : "Cập nhật"}
                </span>
              </Button>
              <Button
                onClick={() => context.setOpenDraw(false)}
                type="button"
                className="flex items-center mr-2 py-2"
                variant="contained"
                color="error"
              >
                <IoIosClose style={{ fontSize: "25px" }} />
                <span className="text-sm capitalize">Hủy</span>
              </Button>
            </div>
          </div>
          <div>
            <Button
              type="button"
              className="flex items-center mr-2 py-2"
              variant="contained"
              color="error"
              onClick={handleDeleteUser}
            >
              <IoIosClose style={{ fontSize: "25px" }} />
              <span className="text-sm capitalize">
              {loading === true ? "Đang xóa..." : "Xóa tài khoản"}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

// Khai báo kiểu dữ liệu cho các props
UserEdit.propTypes = {
  userID: PropTypes.string.isRequired,
};

export default UserEdit;
