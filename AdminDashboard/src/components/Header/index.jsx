import { Button } from "@mui/material";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import UserImage from "../UserImage";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { useContext, useState } from "react";
import SearchBox from "../SearchBox";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
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
    context.setMessage("Đăng xuất thành công");
    context.setTypeMessage("success");
    context.setOpen(true);
    setTimeout(() => {
      // Chuyển hướng về trang login
      navigate("/authen/login");
    }, 1000);
  };

  return (
    <>
      <header className="fixed shadow-sm top-0 right-0 bg-white py-3 z-[100] flex items-center justify-between px-4">
        <SearchBox />
        <div className="ml-auto part2">
          <ul className="flex items-center gap-3">
            <li>
              <Button>
                <IoNotificationsOutline />
              </Button>
            </li>
            <li>
              <Button>
                <IoMailOutline />
              </Button>
            </li>
            <li>
              <div className="d-flex myAcc" onClick={handleClick}>
                <UserImage avatar={context.userData?.avatar} />
                <div>
                  <h5 className="text-sm mb-1">{context.userData?.username}</h5>
                  <p>{context.userData?.phone}</p>
                </div>
              </div>
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
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};
export default Header;
