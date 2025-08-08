import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/SpaceX-Logo.png";
import { Button } from "@mui/material";
import { FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

const ForgotPassword = () => {
  const context = useContext(MyContext);

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
            <Link to="">
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
          <div className="flex items-center gap-3 my-4 socialBtn">
            <Button className="col">
              <FcGoogle />
              <span>Sigin with google</span>
            </Button>
            <Button className="col">
              <FaFacebook style={{ color: "#3872fa" }} />
              <span>Sigin with google</span>
            </Button>
          </div>
          <h1 className="text-center  font-weight-bold text-2xl">
            Having trouble to login?
            <br />
            Reset your password.
          </h1>
          
          <form action="" className="form mt-3">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name" className="text-bold mb-2">
                  <strong>Username</strong>
                </label>
                <TextField
                  id="name"
                  name="name"
                  label="Name Account"
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="Please enter name account"
                  required
                />
                <FormHelperText>Required</FormHelperText>
              </div>
            </div>

            <div className="col">
              <Button className="btnAuthSend w-100 mb-2">
                <span className="text-gray-600 capitalize">Reset password</span>
              </Button>
            </div>
            <div className="col">
              <p className="text-center text">
                Don’t want to reset? <a href="/authen/login">Sign In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
