import { useContext, useEffect, useState } from "react";
import { getData, putDataJson } from "../../utils/api";
import PropTypes from "prop-types";
import { MyContext } from "../../App";
import LinearProgress from "@mui/material/LinearProgress";

const OrderEdit = (props) => {
  const { orderID } = props;
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    status: "",
    paymentMethod: "",
    totalPrice: 0,
    address: "",
  });

  // Fetch order data by ID
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getData(`/api/order/item/${orderID}`);
      if (response.success) {
        const { status, paymentMethod, totalPrice, address, items } =
          response.order;
        setFormFields({
          status,
          paymentMethod,
          totalPrice,
          address,
          items: items,
        });
      } else {
        context.setMessage(response.message || "Lỗi không xác định.");
        context.setTypeMessage("error");
        context.setOpen(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      context.setMessage("Không thể tải dữ liệu đơn hàng.");
      context.setTypeMessage("error");
      context.setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [orderID]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const editOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    window.scrollTo(0, 0);

    const newData = {
      status: formFields.status,
      paymentMethod: formFields.paymentMethod,
      address: JSON.stringify(formFields.address),
    };

    try {
      const response = await putDataJson(`/api/order/${orderID}`, newData);
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
      console.error("Error:", error);
      context.setOpen(true);
    } finally {
      context.setOpenDraw(false);
      setLoading(false);
    }
  };

  const statusSequence = [
    "Pending",
    "Packed",
    "In Transit",
    "Completed",
    "Cancelled",
  ];

  const getValidStatuses = (currentStatus) => {
    const currentIndex = statusSequence.indexOf(currentStatus);
    return statusSequence.slice(currentIndex); // Chỉ lấy các trạng thái sau trạng thái hiện tại
  };

  return (
    <>
      <form onSubmit={editOrder}>
        <div className="card shadow border-0 flex-center p-3">
          <div className="flex items-center justify-between py-3">
            <h1 className="font-weight-bold mb-0 ">
              _ID: <strong className="text-indigo-400">{orderID}</strong>
            </h1>
          </div>
          {loading && <LinearProgress />}
          <h5 className="text-black/55 capitalize text-xl ">
            Thông tin cần thiết:
          </h5>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
            {formFields?.items && formFields?.items?.length > 0 ? (
              formFields?.items?.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-4 mb-4 border rounded-lg flex gap-4"
                >
                  {/* Hình ảnh sản phẩm */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.images?.[0] || "/path-to-placeholder-image.jpg"}
                      alt={item.productId || "Hình sản phẩm"}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  {/* Thông tin sản phẩm */}
                  <div className="flex-1">
                    <p className="font-medium">Mã sản phẩm: {item.productId}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Giá: {item.price.toLocaleString()} VNĐ</p>
                    <p>Màu: {item.color}</p>
                    <p>Kích cỡ: {item.size}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                Không có sản phẩm nào trong đơn hàng.
              </p>
            )}
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cập nhật đơn hàng</h2>

            {/* Trạng thái đơn hàng */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formFields.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              >
                {getValidStatuses(formFields.status).map((status) => (
                  <option key={status} value={status}>
                    {status === "Pending"
                      ? "Đang xử lý"
                      : status === "Packed"
                      ? "Đã đóng hàng"
                      : status === "In Transit"
                      ? "Đang vận chuyển"
                      : status === "Completed"
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </option>
                ))}
              </select>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={formFields.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="cash">Tiền mặt</option>
                <option value="credit_card">Thẻ tín dụng</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Tổng tiền */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Tổng tiền
              </label>
              <input
                type="number"
                name="totalPrice"
                value={formFields.totalPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                readOnly
              />
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Địa chỉ giao hàng
              </label>
              <textarea
                name="address"
                value={formFields.address?.detail || ""}
                onChange={(e) =>
                  setFormFields((prev) => ({
                    ...prev,
                    address: { ...prev.address, detail: e.target.value },
                  }))
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4">
              <button
                // onClick={onCancel}
                className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

// Khai báo kiểu dữ liệu cho các props
OrderEdit.propTypes = {
  orderID: PropTypes.string.isRequired,
};

export default OrderEdit;
