import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import SnowFlakes from "../../Event/SnowFlakes";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { postData } from "../../utils/api";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const AuthSignIn = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormfields] = useState({
    usernameOrPhone: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setFormfields((prevFormField) => ({
      ...prevFormField,
      [e.target.name]: e.target.value,
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
    try {
      const { usernameOrPhone, password } = formFields;

      // Kiểm tra các trường bắt buộc
      if (usernameOrPhone.trim() === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập tên tài khoản hoặc số điện thoại.",
        });
        setTimeout(() => closeAlert(), 5000);
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
        return;
      }

      // Gửi dữ liệu đến API
      const response = await postData("/api/user/signin", {
        usernameOrPhone,
        password,
      });
      if (response.success === false) {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: response.message,
        });
      } else {
        console.log("SignIn data", response.iat);

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

        sessionStorage.setItem("token", response.token); // Lưu token tạm thời
        sessionStorage.setItem("user", JSON.stringify(user)); // Lưu user tạm thời

        // Chuyển hướng sau khi đăng nhập thành công
        setTimeout(() => {
          context.setisHeaderFooterShow(true);
          history("/");
        }, 1000);
      }
    } catch (error) {
      setAlertBox({
        open: true,
        closing: false,
        status: "error",
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Trigger Google sign-in popup
      const result = await signInWithPopup(auth, provider);

      // Extract credential and token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Extract user data
      const user = result.user;
      const fields = {
        fullName: user.providerData[0].displayName,
        email: user.providerData[0].email,
        images: user.providerData[0].photoURL,
      };

      // Send user data to your backend
      const response = await postData(`/api/user/authWithGoogle`, fields);

      // Handle successful response
      if (response.success === true) {
        // Store token and user details in localStorage
        localStorage.setItem("token", response.token);
        const userData = {
          userId: response.user?._id,
          username: response.user?.username,
          email: response.user?.email,
          fullName: response.user?.fullName,
          phone: response.user?.phone,
          avatar: response.user?.avatar,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setAlertBox({
          open: true,
          closing: false,
          status: "success",
          message: response.message,
        });
        // Chuyển hướng sau khi đăng nhập thành công
        setTimeout(() => {
          context.setisHeaderFooterShow(true);
          history("/");
        }, 1000);
      } else {
        // Handle failure if needed (e.g., user not created)
        console.error("Authentication failed:", response.message);
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: response.message,
        });
      }
    } catch (error) {
      // Handle Firebase-specific errors
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error(`Error during sign-in: ${errorCode} - ${errorMessage}`);
      alert(`Authentication failed: ${errorMessage}`); // Optionally alert the user
    }
  };

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  return (
    <>
      <section className="section signInPage">
        <SnowFlakes />
        <div className="container">
          <div className="boxSignIn card p-3 border-0">
            {/* <div className="signinLogo text-center">
              <img src="logo" width="100" alt="Logo" />
              Logo
            </div> */}
            <form onSubmit={signIn} className="mt-3">
              <h2 className="mb-4 text-capitalize">Đăng nhập</h2>
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
              <div className="form-group">
                <TextField
                  className="w-100"
                  id="standard-basic"
                  label="Tên tài khoản hoặc số điện thoại"
                  type="text"
                  variant="standard"
                  name="usernameOrPhone"
                  onChange={onChangeInput}
                  value={formFields.usernameOrPhone}
                />
              </div>
              <div className="form-group">
                <TextField
                  className="w-100"
                  id="standard-basic"
                  label="Mật khẩu"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  name="password"
                  onChange={onChangeInput}
                  value={formFields.password}
                />
              </div>
              <Link className="border-effect text-capitalize cursor txt">
                Quên mật khẩu?
              </Link>
              <div className="d-flex align-items-center mt-3 mb-3 ">
                <Button
                  type="submit"
                  className="btn-blue mr-2 col btn-lg btn-big"
                >
                  Đăng nhập
                </Button>
                <Link to="/">
                  <Button
                    onClick={() => context.setisHeaderFooterShow(true)}
                    className="btn-lg btn-big btn-cancel"
                  >
                    Hủy
                  </Button>
                </Link>
              </div>
              <p className="txt text-capitalize">
                Bạn đã đăng ký chưa?{" "}
                <Link className="border-effect" to="/signUp">
                  Đăng ký
                </Link>
              </p>
              <h6 className="mt-4 text-center font-weight-bold">
                Hoặc tiếp tục với tài khoản xã hội
              </h6>
              <Button
                onClick={signInWithGoogle}
                className="mt-2 loginWithGoogle btn-cancel text-capitalize"
              >
                <FcGoogle />
                Đăng nhập bằng google
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthSignIn;
