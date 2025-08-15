import { Button, Rating } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import QuantityBox from "../../Components/QuantityBox";
import { GoTrash } from "react-icons/go";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, getData, putData, putDataOne } from "../../utils/api";
import Voucher from "../../Components/Voucher";

const Cart = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isVoucher, setIsVoucher] = useState(false);
  const [appliedDate, setAppliedDate] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculator = (price, discount) => {
    const discountPrice = price * (discount / 100);
    const discountedPrice = price - discountPrice;
    return parseFloat(discountedPrice);
  };

  useEffect(() => {
    setLoading(true);
    const cachedData = localStorage.getItem("checkoutData");
    if (cachedData) {
      const orderCachedData = JSON.parse(cachedData);
      console.log("orderCached data", orderCachedData);
      if (orderCachedData.userId === context.userData?.userId) {
        try {
          context.setCheckoutCartData(orderCachedData);
          setTimeout(() => {
            context.setAlertBox({
              open: true,
              message: "Bạn có muốn đặt đơn hàng này!",
              type: "error",
            });
            navigate("/checkout");
            setLoading(false);
          }, 1000);
        } catch (err) {
          console.error("Dữ liệu trong localStorage không hợp lệ:", err);
          navigate("/cart");
          setLoading(false);
        }
      }
    } else {
      navigate("/cart");
      setLoading(false);
    }
  }, [navigate]);

  const applyDiscount = (discount, updatedPrice) => {
    // Cập nhật giá trị khi áp dụng mã giảm giá
    setFinalPrice(updatedPrice);
    setIsVoucher(true);
  };
  const AppliedDate = (AppliedDate) => {
    setAppliedDate(AppliedDate);
    console.log("applyDate", AppliedDate);
  };
  const DiscountPercentage = (DiscountPercentage) => {
    setDiscountPercentage(DiscountPercentage);
    console.log("DiscountPercentage", DiscountPercentage);
  };
  const VoucherCode = (voucherCode) => {
    setVoucherCode(voucherCode);
    console.log("voucherCode", voucherCode);
  };

  const handleQuantityChange = (newQuantity, productId, size, color) => {
    console.log(
      "newQuantity, productId, size, color",
      newQuantity,
      productId,
      size,
      color
    );
    context.setCartData((prevData) => {
      const updatedItems = prevData.items.map((item) =>
        item.productId.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      return { ...prevData, items: updatedItems };
    });

    // Optional: Cập nhật API nếu cần
    updateCart(productId, newQuantity, size, color);
  };

  const [loadingCart, setLoadingCart] = useState(false);
  const updateCart = async (productId, newQuantity, size, color) => {
    setLoadingCart(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại.");
        return;
      }

      const newCartFields = {
        userId: context.userData?.userId,
        productId: productId,
        quantity: newQuantity,
        size: size,
        color: color,
      };

      const response = await putDataOne(`/api/cart/updateCart`, newCartFields, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });
      console.log("Response from server:", response);
      if (response.status === true) {
        // context.setAlertBox({
        //   open: true,
        //   message: response.message,
        //   type: response.type || "success",
        // });
        setFinalPrice(response.totalPrice);
        fetchData();
        setLoadingCart(false);
      } else {
        console.log(response.message);
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
        setLoadingCart(false);
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      setLoadingCart(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoadingCart(false);
      }, 5000);
    }
  };

  const removeCart = async (productId) => {
    setLoadingCart(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData?.userId;

      const response = await deleteData(
        `/api/cart/removeCart/${userId}`,
        { productId }, // Truyền body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status) {
        console.log("Sản phẩm đã được xóa khỏi giỏ hàng");
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
        fetchData();
      } else {
        console.error("Lỗi xóa sản phẩm", response.message);
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
      }
    } catch (error) {
      console.error("Error removing product from cart:", error.message);
    } finally {
      setLoadingCart(false);
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại.");
        return;
      }
      const userId = context.userData?.userId;
      const response = await getData(
        `/api/cart/getCart/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dữ liệu giỏ hàng:", response);
      context.setCartData(response); // Cập nhật dữ liệu giỏ hàng
      setTotalPrice(response.totalPrice);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Phụ thuộc vào userId để gọi lại khi userId thay đổi

  const handleOrder = () => {
    if (!context.cartData?.items?.length) {
      console.error("Giỏ hàng rỗng, không thể đặt hàng!");
      return;
    }

    const checkoutData = {
      items: context.cartData?.items,
      totalPrice: finalPrice > 0 ? finalPrice : context.cartData?.totalPrice,
      isVoucher: isVoucher ? isVoucher : false,
      appliedDate: appliedDate ? appliedDate : "",
      voucherCode: voucherCode ? voucherCode : "",
      discountPercentage: discountPercentage,
      userId: context.userData?.userId,
    };

    // Lưu vào localStorage
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    context.setCheckoutCartData(checkoutData);
    navigate("/checkout");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd text-capitalize">Giỏ hàng của bạn</h2>
          <p>
            {context.cartData?.items ? (
              <>
                Có{" "}
                <span className="badge badge-danger">
                  {context.cartData?.items?.length}
                </span>{" "}
                sản phẩm trong giỏ hàng của bạn
              </>
            ) : (
              "Giỏ hàng của bạn đang trống"
            )}
          </p>
          <div className="row">
            <div className="col-md-9">
              <div className="table-responsive">
                <table className="table text-left">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Size</th>
                      <th>Màu</th>
                      <th>Giảm giá</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Tổng phụ</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {context.cartData?.items?.lenght !== 0 &&
                      context.cartData?.items?.map((item, index) => {
                        return (
                          <tr key={item.productId.id}>
                            <td>
                              <Link to={`/product/${item.productId.id}`}>
                                <div className="d-flex align-items-center cartItemImg">
                                  <div className="imgWrapper">
                                    <img
                                      className="w-100"
                                      src={item.images}
                                      alt={item.productId.name}
                                    />
                                  </div>
                                  <div className="info px-3">
                                    <h6 className="text-ellipsis">
                                      {item.productId.name.substr(0, 20) +
                                        "..."}
                                    </h6>
                                    <Rating
                                      name="read-only"
                                      value={parseInt(item.productId.rating)}
                                      precision={0.5}
                                      size="small"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td>
                              <span className="badge badge-info">
                                {item.size}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-info">
                                {item.color}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-danger">
                                {item.productId.discount > 0
                                  ? item.productId.discount
                                  : 0}
                                %
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div>
                                  {item.productId.discount > 0 ? (
                                    <del>
                                      {formatCurrency(item.productId.price)}
                                    </del>
                                  ) : (
                                    formatCurrency(item.productId.price)
                                  )}
                                </div>
                                <div>
                                  {item.productId.discount > 0
                                    ? formatCurrency(
                                        calculator(
                                          item.productId.price,
                                          item.productId.discount
                                        )
                                      )
                                    : ""}
                                </div>
                              </div>
                            </td>
                            <td>
                              <QuantityBox
                                quantity={item.quantity} // Truyền số lượng ban đầu
                                maxQuantity={10}
                                onQuantityChange={(newQuantity) =>
                                  handleQuantityChange(
                                    newQuantity,
                                    item.productId.id,
                                    item.size,
                                    item.color
                                  )
                                }
                              />
                            </td>
                            <td>{formatCurrency(item.price)}</td>
                            <td
                              className="remove"
                              onClick={() => removeCart(item.productId.id)}
                            >
                              <GoTrash />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {context.cartData?.items?.length > 0 && (
              <div className="col-md-3">
                <div className="card p-3 cartDetails">
                  <h4 className="text-center text-uppercase mb-3 text-capitalize ">
                    Tổng số giỏ hàng
                  </h4>
                  <div className="d-flex align-items-center mb-3">
                    <span>Tổng phụ</span>
                    <span className="priceCart ml-auto font-weight-bold">
                      {formatCurrency(parseFloat(totalPrice))}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="text-capitalize">vận chuyển</span>
                    <span className="ml-auto text-capitalize">
                      <b>Miễn phí</b>
                    </span>
                  </div>
                  {/* <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto">
                    <b>United Kingdom</b>
                  </span>
                </div> */}
                  <Voucher
                    totalPrice={totalPrice}
                    applyDiscount={applyDiscount}
                    AppliedDate={AppliedDate}
                    DiscountPercentage={DiscountPercentage}
                    VoucherCode={VoucherCode}
                  />
                  <div className="d-flex align-items-center mb-3">
                    <span>Thành tiền:</span>
                    <span className="priceCart ml-auto font-weight-bold">
                      {formatCurrency(
                        parseFloat(finalPrice > 0 ? finalPrice : totalPrice)
                      )}
                    </span>
                  </div>

                  <Button
                    onClick={handleOrder}
                    className="w-100 btn-blue text-capitalize bg-red btn-lg btn-big btnCheckout"
                    disabled={!context.cartData?.items?.length} // Vô hiệu hóa nếu giỏ hàng rỗng
                  >
                    <MdOutlineShoppingCartCheckout />
                    Đặt hàng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
