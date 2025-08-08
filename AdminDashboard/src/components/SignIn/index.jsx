import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/SpaceX-Logo.png";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { postData } from "../../utils/api";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import SnowFlakes from "../../Event/SnowFlakes";

const SignIn = () => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const history = useNavigate();

  const [formFields, setFormfields] = useState({
    usernameOrPhone: "",
    password: "",
    rememberMe: false,
  });

  const onChangeInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormfields((prevFields) => ({
      ...prevFields,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [AlertBox, setAlertBox] = useState({
    open: false,
    closing: false,
    status: "",
    message: "",
  });

  const closeAlert = () => {
    setAlertBox((prev) => ({ ...prev, closing: true }));
    setTimeout(() => {
      setAlertBox({
        open: false,
        closing: false,
        status: "",
        message: "",
      });
    }, 500);
  };

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { usernameOrPhone, password, rememberMe } = formFields;
      console.log(formFields);

      // Kiểm tra các trường bắt buộc
      if (usernameOrPhone.trim() === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập tên tài khoản hoặc số điện thoại.",
        });
        setTimeout(() => closeAlert(), 5000);
        setLoading(false);
        return;
      }

      if (password.trim() === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập mật khẩu.",
        });
        setTimeout(() => closeAlert(), 5000);
        setLoading(false);
        return;
      }

      // Gửi dữ liệu đến API
      const response = await postData("/api/user/authencation/signin", {
        usernameOrPhone,
        password,
        rememberMe, // Chuyển rememberMe vào API
      });

      if (response.success === false) {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: response.message,
        });
        setLoading(false);
      } else {
        setAlertBox({
          open: true,
          closing: false,
          status: "success",
          message: response.message,
        });

        const user = {
          username: response.user?.username,
          fullName: response.user?.fullName,
          phone: response.user?.phone,
          avatar: response.user?.avatar,
          userId: response.user?._id,
        };

        // Lưu token và user vào localStorage hoặc sessionStorage dựa trên rememberMe
        if (rememberMe) {
          localStorage.setItem("token", response.token); // Lưu token lâu dài
          localStorage.setItem("user", JSON.stringify(user)); // Lưu user lâu dài
        } else {
          sessionStorage.setItem("token", response.token); // Lưu token tạm thời
          sessionStorage.setItem("user", JSON.stringify(user)); // Lưu user tạm thời
        }

        // Chuyển hướng sau khi đăng nhập thành công
        setTimeout(() => {
          history("/"); // Điều hướng đến trang chủ hoặc dashboard
          context.setIsShowHeaderFooter(false);
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log("Error: " + error);
      setAlertBox({
        open: true,
        closing: false,
        status: "error",
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setIsShowHeaderFooter(true);
    console.log("SignIn");
  }, [context]);

  return (
    <>
      <div className="AuthSection">
        <SnowFlakes />
        <header className="header flex items-center justify-between">
          <div className="logo">
            <Link to="/" onClick={() => context.setIsShowHeaderFooter(false)}>
              <img src={Logo} alt="" />
            </Link>
          </div>
          <div className="btnAuth ml-auto flex items-center justify-end gap-3">
            {/* <Link to="/authen/login">
              <Button className="btn-round btn-sigin btn-border">
                <FiLogIn />
                <span>Sign In</span>
              </Button>
            </Link> */}
            {/* <Link to="">
              <Button className="btn-round btn-sigup btn-border btn-blue">
                <FaRegUser />
                <span>Sign Up</span>
              </Button>
            </Link> */}
          </div>
        </header>
        <div className="container container_auth">
          <h5 className="text-center text-white font-weight-bold text-2xl">
            Chào mừng trở lại!
            <br />
            Đăng nhập bằng thông tin của bạn.
          </h5>
          {/* <div className="flex items-center gap-3 my-4 socialBtn">
            <Button className="col">
              <FcGoogle />
              <span>Sigin with google</span>
            </Button>
            <Button className="col">
              <FaFacebook style={{ color: "#3872fa" }} />
              <span>Sigin with google</span>
            </Button>
          </div>
          <h3 className="text-center text-sm font-bold">
            Or, Sign in with your account
          </h3> */}
          <form onSubmit={signIn} className="form mt-3">
            {loading && <LinearProgress />}
            {AlertBox.open && (
              <Collapse in={AlertBox.open}>
                <Alert
                  severity={AlertBox.status}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertBox({
                          closing: false,
                        });
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {AlertBox.message}
                </Alert>
              </Collapse>
            )}
            <div className="col">
              <div className="form-group">
                <label htmlFor="name" className="text-white mb-2">
                  <strong>Tên tài khoản hoặc số điện thoại</strong>
                </label>
                <TextField
                  color="secondary"
                  id="name"
                  label="Tên tài khoản hoặc số điện thoại"
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: abcd hoặc 035...."
                  name="usernameOrPhone"
                  onChange={onChangeInput}
                  value={formFields.usernameOrPhone}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="password" className="text-white mb-2">
                  <strong>Mật khẩu</strong>
                </label>
                <div className="formPassword relative">
                  <TextField
                    color="secondary"
                    id="password"
                    label="Mât khẩu"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    placeholder="Nhập mật khẩu"
                    name="password"
                    onChange={onChangeInput}
                    value={formFields.password}
                  />
                  <Button onClick={handleTogglePassword}>
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="flex items-center justify-between">
                <div className="form-group">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formFields.rememberMe}
                      onChange={onChangeInput}
                    />
                    <span className="text-white ml-2">Nhớ tài khoản!</span>
                  </label>
                </div>
                <div className="form-group">
                  <p className="text mb-0">
                    <Link to="/authen/forgot-password" className="text-white">
                      Quên mật khẩu?
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <Button type="submit" className="btnAuthSend w-100 mb-2">
                <span className="text-gray-600">Đăng nhập</span>
              </Button>
            </div>
            {/* <div className="col">
              <p className="text-center text">
                Don’t have an account? <a href="/signUp">Sign Up</a>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
