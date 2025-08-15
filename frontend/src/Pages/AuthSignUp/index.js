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

const AuthSignUp = () => {
  const context = useContext(MyContext);
  const history = useNavigate();
  const [formFields, setFormfields] = useState({
    username: "",
    phone: "",
    fullName: "",
    password: "",
    confirmPassword: "",
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

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const { username, phone, fullName, password, confirmPassword } =
        formFields;
      console.log(formFields);

      if (username === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập tên tài khoản.",
        });

        setTimeout(() => closeAlert(), 5000);
      }

      if (phone === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập số điện thoại.",
        });

        setTimeout(() => closeAlert(), 5000);
      }

      if (fullName === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập họ và tên",
        });

        setTimeout(() => closeAlert(), 5000);
      }

      if (password === "") {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Nhập mật khẩu.",
        });

        setTimeout(() => closeAlert(), 5000);
      }

      if (confirmPassword !== password) {
        setAlertBox({
          open: true,
          closing: false,
          status: "error",
          message: "Mật khẩu không khớp.",
        });

        setTimeout(() => closeAlert(), 5000);
      }

      if (confirmPassword === password) {
        const response = await postData("/api/user/signup", formFields);
        if (response.success === false) {
          setAlertBox({
            open: true,
            closing: false,
            status: "error",
            message: response.message,
          });
        } else {
          setAlertBox({
            open: true,
            closing: false,
            status: "success",
            message: response.message,
          });

          setTimeout(() => {
            history("/signIn");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error signing up user:", error.response.status);
    }
  };

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  return (
    <>
      <section className="section signInPage signUpPage">
        <SnowFlakes />
        <div className="container">
          <div
            className="position-absolute"
            style={{
              zIndex: "101",
              right: "17%",
              top: "20%",
            }}
          ></div>
          <div className="boxSignIn boxSignUp card p-3 border-0">
            {/* <div className="signinLogo text-center">
              <img src="logo" width="100" alt="Logo" />
              Logo
            </div> */}
            <form onSubmit={signUp} className="mt-3">
              <h2 className="mb-2 text-capitalize">Đăng ký tài khoản</h2>
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

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // error
                      className="w-100"
                      id="standard-basic"
                      label="Tên tài khoản"
                      type="text"
                      variant="standard"
                      name="username"
                      value={formFields.username}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      // error
                      className="w-100"
                      id="standard-basic"
                      label="Số điện thoại"
                      type="text"
                      variant="standard"
                      name="phone"
                      value={formFields.phone}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <TextField
                  // error
                  className="w-100"
                  id="standard-basic"
                  label="Họ và tên"
                  type="text"
                  variant="standard"
                  name="fullName"
                  value={formFields.fullName}
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <TextField
                  // error
                  className="w-100"
                  id="standard-basic"
                  label="Mật khẩu"
                  type="password"
                  placeholder="Ví du: Abcd123@"
                  autoComplete="current-password"
                  variant="standard"
                  name="password"
                  value={formFields.password}
                  onChange={onChangeInput}
                />
              </div>
              <div className="form-group">
                <TextField
                  // error
                  className="w-100"
                  id="standard-basic"
                  label="Xác nhận lại mật khẩu"
                  placeholder="Ví du: Abcd123@"
                  type="password"
                  autoComplete="current-password"
                  variant="standard"
                  name="confirmPassword"
                  value={formFields.confirmPassword}
                  onChange={onChangeInput}
                />
              </div>
              <p className="txt text-capitalize">
                Bạn Đã có tài khoản rồi?{" "}
                <Link className="border-effect" to="/signIn">
                  Đăng nhập
                </Link>
              </p>
              <div className="d-flex align-items-center mt-3 mb-3 ">
                <Button
                  type="submit"
                  className="btn-blue mr-2 col btn-lg btn-big"
                >
                  Đăng ký
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

              <h6 className="mt-4 text-center font-weight-bold">
                Hoặc tiếp tục với tài khoản xã hội
              </h6>
              <Button className="mt-2 loginWithGoogle btn-cancel text-capitalize">
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

export default AuthSignUp;
