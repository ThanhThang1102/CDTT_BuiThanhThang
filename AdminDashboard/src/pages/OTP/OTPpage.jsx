import { useContext, useEffect, useRef } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/SpaceX-Logo.png";
import { Button } from "@mui/material";
import { FiLogIn } from "react-icons/fi";

const OTPpage = () => {
  const context = useContext(MyContext);

  // Tạo tham chiếu cho các ô input OTP
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Xử lý sự kiện thay đổi khi người dùng nhập OTP
  const onChangeOTPInput = (e, index) => {
    const value = e.target.value;

    // Nếu người dùng nhập 1 ký tự và có ô tiếp theo, chuyển sang ô tiếp theo
    if (value.length === 1 && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
    // Nếu người dùng xóa, chuyển sang ô trước đó
    else if (value.length === 0 && index > 0) {
      otpRefs[index - 1].current.focus();
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
        <header className="header flex items-center justify-between">
          <div className="logo">
            <Link to="/" onClick={() => context.setIsShowHeaderFooter(false)}>
              <img src={Logo} alt="" />
            </Link>
          </div>
          <div className="btnAuth ml-auto flex items-center justify-end gap-3">
            <Link to="/authen/login">
              <Button className="btn-round btn-sigin btn-border">
                <FiLogIn />
                <span>Sign In</span>
              </Button>
            </Link>
            {/* <Link to="">
              <Button className="btn-round btn-sigup btn-border btn-blue">
                <FaRegUser />
                <span>Sign Up</span>
              </Button>
            </Link> */}
          </div>
        </header>
        <div className="container container_auth">
          <h1 className="text-center capitalize font-weight-bold text-2xl">
            OTP verification
          </h1>
          <h5 className="text-center text-success">
            OTP has been sent to +********19
          </h5>

          <form action="" className="form mt-3">
            <div className="col">
              <div className="flex items-center justify-center otpBox ml-auto my-5">
                {otpRefs.map((ref, index) => (
                  <input
                    key={index}
                    type="text"
                    className="text-center"
                    maxLength={1}
                    ref={ref}
                    onChange={(e) => onChangeOTPInput(e, index)}
                  />
                ))}{" "}
              </div>
            </div>

            <div className="col">
              <Button className="btnAuthSend btnOTP w-100 mb-2">
                <span className="text-gray-600 capitalize">Resend OTP</span>
              </Button>
            </div>
            <div className="col">
              <Button className="btnAuthSend w-100 mb-2">
                <span className="text-gray-600 capitalize">Verify OTP</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPpage;
