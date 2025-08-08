import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import SearchBox from "../SearchBox";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import { deleteData, getData } from "../../utils/api";
import { MyContext } from "../../App";
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ContactList = (props) => {
  const [open, setOpen] = useState(false);
  const [messageCustom, setMessageCustom] = useState("");

  const handleClickOpen = (message) => {
    setMessageCustom(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { title, isSharedPage } = props;
  const [dataCat, setDataCat] = useState([]);
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  // Hàm Xóa danh mục
  const handleDeleteContact = async (id) => {
    setLoading(true);
    window.scrollTo(0, 0);
    try {
      const response = await deleteData("/api/contact/", id);
      console.log(response);
      if (response.success === true) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
      context.setOpen(true);
    } finally {
      fetchData(); // Làm mới dữ liệu khi xóa
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu từ API
  const fetchData = async (currentPage = 1) => {
    try {
      const res = await getData(`/api/contact?page=${currentPage}`);
      if (res) {
        setDataCat(res.contacts);
        setTotalPages(res.totalPages);
        console.log(res);
      } else {
        setDataCat([]);
        setTotalPages(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Thêm thông báo lỗi cho người dùng nếu cần
    }
  };

  // Hàm thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang hiện tại
    fetchData(value); // Gọi API với trang mới
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (context.openDraw === false) {
      fetchData(page);
    }
  }, [context.openDraw, page, context]);

  return (
    <>
      <Drawer
        open={context.openDraw}
        anchor="right"
        onClose={() => context.setOpenDraw(false)}
      >
      </Drawer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Lời nhắn của khách hàng"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {messageCustom}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {!isSharedPage && (
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="flex items-center justify-between">
            <h1 className="font-weight-bold mb-0">Liên hệ</h1>
          </div>
        </div>
      )}
      <div className="card shadow-sm my-4 productList border-0">
        {loading && <LinearProgress />}
        <div className="flex items-center mb-4 justify-between  pt-3 px-4">
          <h2 className="mb-0 font-bold text-md capitalize">{title}</h2>

          <div className="ml-auto">
            <SearchBox />
          </div>
        </div>

        <table className="table tableList bg-slate-300">
          <thead className="table-dark">
            <tr className="capitalize">
              <th scope="col">#</th>
              <th scope="col">_ID</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Email</th>
              <th scope="col">Lời nhắn</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataCat) && dataCat.length > 0 ? (
              dataCat.map((item, index) => (
                <tr key={index}>
                  <th className="align-middle" scope="row">
                    {index + 1}
                  </th>
                  <td className="align-middle w-[23%]">{item._id}</td>
                  <td className="align-middle w-[15%]">
                    <div className="info">
                      <h6>{item.userId?.fullName}</h6>
                    </div>
                  </td>
                  <td className="align-middle w-[15%]">
                    <div className="info">
                      <h6>{item.userId?.phone}</h6>
                    </div>
                  </td>
                  <td className="align-middle w-[15%]">
                    <div className="info">
                      <h6>{item.userId?.email}</h6>
                    </div>
                  </td>
                  <td className="align-middle w-[15%]">
                    <div className="info">
                      <Button
                        variant="outlined"
                        onClick={() => handleClickOpen(item.message)} // Truyền message vào
                      >
                        Nội dung
                      </Button>
                      {/* <h6>{item.message}</h6> */}
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="flex gap-3">
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#ff6179" }}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteContact(item.id)}
                          >
                            <RiDeleteBin6Line />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-end py-3 pr-3">
          <div>
            Trang <strong>{page}</strong> Hiện{" "}
            <strong>
              {Array.isArray(dataCat) && dataCat.length > 0
                ? dataCat.length
                : "No data found"}
            </strong>
          </div>
          <Pagination
            count={totalPages}
            page={page}
            showFirstButton
            showLastButton
            color="secondary"
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

ContactList.propTypes = {
  title: PropTypes.node.isRequired,
  isSharedPage: PropTypes.bool,
};

export default ContactList;
