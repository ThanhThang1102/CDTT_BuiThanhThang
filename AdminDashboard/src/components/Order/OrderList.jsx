import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { PiExport } from "react-icons/pi";
import SearchBox from "../SearchBox";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import { deleteData, getData } from "../../utils/api";
import { MyContext } from "../../App";
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import OrderEdit from "./OrderEdit";

const OrderList = (props) => {
  const { title, isSharedPage } = props;
  const [dataCat, setDataCat] = useState([]);
  const context = useContext(MyContext);
  const [id, setId] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  // Hàm Edit danh mục
  const handleEditOrder = (id) => {
    // Tùy chỉnh code để chỉnh sửa danh mục tại đây
    if (id) {
      console.log("Edit order:", id);
      context.setOpenDraw(true);
      setId(id);
    }
  };

  // Hàm Xóa danh mục
  const handleDeleteOrder = async (id) => {
    setLoading(true);
    window.scrollTo(0, 0);
    try {
      const response = await deleteData("/api/order/", id);
      console.log(response);
      if (response.success === true) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
        fetchData(); // Làm mới dữ liệu khi xóa
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
      context.setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu từ API
  const fetchData = async (currentPage = 1) => {
    try {
      const res = await getData(`/api/order?page=${currentPage}`);
      if (res) {
        setDataCat(res.orders);
        setTotalPages(res.totalPages);
        console.log("Đơn hàng", res);
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

  function getStatusDetails(status) {
    switch (status) {
      case "Pending":
        return {
          className: "badge-warning",
          label: "Đang xử lý",
        };
      case "Packed":
        return {
          className: "badge-info",
          label: "Đã đóng hàng",
        };
      case "In Transit":
        return {
          className: "badge-primary",
          label: "Đang vận chuyển",
        };
      case "Completed":
        return {
          className: "badge-success",
          label: "Hoàn thành",
        };
      case "Cancelled":
        return {
          className: "badge-danger",
          label: "Đã hủy",
        };
      default:
        return {
          className: "badge-secondary",
          label: "Không xác định",
        };
    }
  }

  return (
    <>
      <Drawer
        open={context.openDraw}
        anchor="right"
        onClose={() => context.setOpenDraw(false)}
      >
        {<OrderEdit orderID={String(id)} />}
      </Drawer>
      {!isSharedPage && (
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="flex items-center justify-between">
            <h1 className="font-weight-bold mb-0">Đơn hàng</h1>
            <div className="ml-auto flex items-center gap-3">
              <Button className="btn-sm btn-border">
                <PiExport />
                Export to Excel
              </Button>
            </div>
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
              <th scope="col">Order ID</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Địa chỉ giao</th>
              <th scope="col">Điện thoại</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Thanh toán</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataCat) && dataCat.length > 0 ? (
              dataCat.map((order, index) => (
                <tr key={order._id}>
                  <th className="align-middle" scope="row">
                    {index + 1}
                  </th>
                  <td className="align-middle">{order._id}</td>
                  <td className="align-middle">
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="align-middle">
                    {`${order.address.detail}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`}
                  </td>
                  <td className="align-middle">{order.address.phone}</td>
                  <td className="align-middle">
                    {order.totalPrice.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="align-middle">{order.paymentMethod}</td>
                  <td className="align-middle">
                    {(() => {
                      const { className, label } = getStatusDetails(
                        order.status
                      );
                      return (
                        <span className={`badge ${className}`}>{label}</span>
                      );
                    })()}
                  </td>

                  <td className="align-middle">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </td>
                  <td className="align-middle">
                    <div className="flex gap-3">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditOrder(order._id)}
                      >
                        Xem
                      </button>
                      {order.status === "Cancelled" && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  Không có dữ liệu
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

OrderList.propTypes = {
  title: PropTypes.node.isRequired,
  isSharedPage: PropTypes.bool,
};

export default OrderList;
