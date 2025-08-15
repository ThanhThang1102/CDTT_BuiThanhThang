import React, { useContext, useEffect, useState } from "react";
import { getData, putDataOne } from "../../utils/api";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { GoTrash } from "react-icons/go";

const MyOrder = () => {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        context.setAlertBox({
          open: true,
          message: "Vui lòng đăng nhập để xem đơn hàng.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const userId = context.userData?.userId;
      if (userId) {
        const response = await getData(`/api/order/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status) {
          console.log("Load my order", response.orders);
          context.setAlertBox({
            open: true,
            message: response.message,
            type: response.type || "success",
          });
          setOrders(response.orders);
        } else {
          context.setAlertBox({
            open: true,
            message: response.message,
            type: response.type || "error",
          });
        }
      } else {
        context.setAlertBox({
          open: true,
          message: "Người dùng không xác định.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu: ", error.message);
      context.setAlertBox({
        open: true,
        message: "Đã xảy ra lỗi khi tải đơn hàng.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  useEffect(() => {
    if (context.userData?.userId) {
      fetchData();
    }
  }, [context.userData]);

  const cancelOrder = async (id) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const newData = {
        status: "Cancelled",
      };
      const response = await putDataOne(`/api/order/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        console.log("Load my order", response.orders);
        context.setAlertBox({
          open: true,
          message: response.message, // Lấy message từ response
          type: response.type || "success",
        });
        fetchData();
        setLoading(false);
      } else {
        console.log(response.message);
        context.setAlertBox({
          open: true,
          message: response.message, // Lấy message từ response khi lỗi
          type: response.type || "error",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("Lỗi khi gửi dữ liệu: ", error.message);
      context.setAlertBox({
        open: true,
        message: "Đã xảy ra lỗi khi đặt hàng", // Thông báo lỗi khi không gọi được API
        type: "error",
      });
      setLoading(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoading(false);
      }, 5000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
    <section className="section cartPage">
      <div className="container">
        <h2 className="hd text-capitalize">Danh sách đơn hàng</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {orders?.length > 0 ? (
              orders?.map((item, index) => {
                return (
                  <div key={index}>
                    <h5 className="card-title my-0">
                      <strong>#Mã đơn hàng:</strong> {item.id}
                    </h5>
                    <p className="card-text m-0">
                      Ngày đặt hàng:{" "}
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="card-text mb-2">
                      Địa chỉ giao hàng: {item.address.detail},{" "}
                      {item.address.ward}, {item.address.district},{" "}
                      {item.address.province}, {" Số điện thoại"} :
                      {item.address.phone}
                    </p>
                    <div className="row">
                      <div className="col-md-9">
                        <div className="items-list">
                          <div key={index}>
                            <div className="table-responsive">
                              <table className="table text-left">
                                <thead>
                                  <tr>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Tổng giá</th>
                                    <th>Màu</th>
                                    <th>Size</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.items?.map((item, index) => {
                                    return (
                                      <>
                                        <tr key={index}>
                                          <td>
                                            <Link
                                              to={`/product/${item.productId}`}
                                            >
                                              <div className="d-flex align-items-center cartItemImg">
                                                <div className="imgWrapper">
                                                  <img
                                                    className="w-100"
                                                    src={item.images[0]}
                                                    alt={item.productId}
                                                  />
                                                </div>
                                              </div>
                                            </Link>
                                          </td>
                                          <td>{item.quantity}</td>
                                          <td>{formatCurrency(item.price)}</td>
                                          <td>{item.size}</td>
                                          <td>{item.color}</td>
                                        </tr>
                                      </>
                                    );
                                  })}
                                </tbody>
                              </table>

                              <hr />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div>
                          <p>
                            <strong>
                              Tổng giá trị:{" "}
                              <span className="badge badge-danger">
                                {formatCurrency(item.totalPrice)}
                              </span>
                            </strong>
                            <br />
                            <strong>
                              Trạng thái đơn hàng:{" "}
                              {(() => {
                                const { className, label } = getStatusDetails(
                                  item.status
                                );
                                return (
                                  <span className={`badge ${className}`}>
                                    {label}
                                  </span>
                                );
                              })()}
                            </strong>
                            <br />
                          </p>
                          {item.status === "Pending" && (
                            <button
                              className="btn btn-danger btn-block"
                              onClick={() => cancelOrder(item.id)}
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Không có đơn hàng nào</div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MyOrder;
