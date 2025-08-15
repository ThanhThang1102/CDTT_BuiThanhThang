import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/bacola-logo.png";
import CountryDropdown from "../CountryDropDown";
import Button from "@mui/material/Button";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext } from "react";
import { MyContext } from "../../App";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { FaShippingFast } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import * as React from "react";
import { FaHeart } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { getData } from "../../utils/api";
import { useEffect } from "react";
import { useState } from "react";

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và thông tin người dùng
    localStorage.clear();
    sessionStorage.clear();

    // Cập nhật trạng thái login
    context.setIsLogin(false);
    context.setUserData({});
    setTimeout(() => {
      // Chuyển hướng về trang login
      navigate("/signIn");
    }, 1000);
  };

  const [logoWebData, setLogoWeb] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData("/api/logoWeb/");
        if (res && res.success) {
          setLogoWeb(res.data); // Lưu dữ liệu logo vào state
        } else {
          console.log("No logo found");
        }
      } catch (error) {
        console.error("Error fetching logo data:", error);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const [isSticky, setIsSticky] = React.useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      // Kiểm tra vị trí cuộn khi cuộn qua 200px
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`headerWrapper ${isSticky ? "fixed" : ""}`}>
        <div className="top-strip bg-blue">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Xin chào! Chào mừng đến với trang web của chúng tôi.
            </p>
          </div>
        </div>

        <header className="header">
          <div className="container">
            <div className="row">
              {logoWebData?.images?.length > 0 && logoWebData.images[0].url && (
                <div className="logoWrapper d-flex align-items-center col-sm-2">
                  <Link to="/">
                    <img
                      src={logoWebData?.images[0].url}
                      alt={logoWebData?.type}
                    />
                  </Link>
                </div>
              )}

              <div className="col-sm-10 d-flex align-items-center part2">
                {/* {context.countryList.lenght !== 0 && <CountryDropdown />} */}

                {/* Header Search Start Here */}
                <SearchBox />
                {/* Header Search Ends Here */}

                <div className="part3 d-flex align-items-center ml-auto">
                  {context.isLogin !== true ? (
                    <Link to="signIn">
                      <Button className="btn-blue btnHeaderSignin text-capitalize btn-big btn-round mr-3">
                        Đăng nhập
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button onClick={handleClick} className="circle mr-3">
                        <FiUser />
                      </Button>

                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <Link to="/my-account">
                          <MenuItem onClick={handleClose}>
                            <Avatar /> Tài khoản
                          </MenuItem>
                          <Divider />
                        </Link>

                        <Link to="/my-order">
                          <MenuItem onClick={handleClose}>
                            <FaShippingFast
                              className="mr-2"
                              style={{ fontSize: "23px" }}
                            />{" "}
                            Đơn hàng
                          </MenuItem>
                        </Link>
                        <Link to="/list-heart">
                          <MenuItem onClick={handleClose}>
                            <FaHeart
                              className="mr-2"
                              style={{ fontSize: "23px" }}
                            />{" "}
                            Yêu thích
                          </MenuItem>
                        </Link>

                        <MenuItem onClick={handleLogout}>
                          <IoMdLogOut
                            className="mr-2"
                            style={{ fontSize: "23px" }}
                          />
                          Đăng xuất
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price">
                      {formatCurrency(
                        parseFloat(context.cartData?.totalPrice) || 0
                      )}
                    </span>
                    <div className=" position-relative ml-2">
                      <Link to="/cart">
                        <Button className="circle ">
                          <IoBagOutline />
                        </Button>
                      </Link>
                      <span className="count d-flex align-items-center justify-content-center">
                        {context.cartData?.items ? (
                          <>{context.cartData.items.length}</>
                        ) : (
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {context.subCategoryData?.lenght !== 0 && (
          <Navigation navData={context.subCategoryData} />
        )}
      </div>
    </>
  );
};

export default Header;
