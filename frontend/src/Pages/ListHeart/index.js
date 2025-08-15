import { Rating } from "@mui/material";
import { Link } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, getData } from "../../utils/api";

const ListHeart = () => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [listHeart, setListHeart] = useState([]);

  const remove = async (productId) => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData.userId;

      const response = await deleteData(
        `/api/favorite/delete/${userId}`,
        { productId }, // Truyền body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
        fetchData();
      } else {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
      }
    } catch (error) {
      console.error("Error removing product from :", error.message);
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

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại.");
        return;
      }
      const response = await getData(
        `/api/favorite/${context.userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dữ liệu yeu thich:", response.data);
      setListHeart(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Phụ thuộc vào userId để gọi lại khi userId thay đổi

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
          <h2 className="hd text-capitalize">Sản phẩm yêu thích của bạn</h2>
          <p>
            {listHeart?.products ? (
              <>
                Có{" "}
                <span className="badge badge-danger">
                  {listHeart?.products?.length}
                </span>{" "}
                Sản phẩm yêu thích của bạn
              </>
            ) : (
              "Sản phẩm yêu thích của bạn đang trống"
            )}
          </p>
          <div className="row">
            <div className="col-md-9">
              <div className="table-responsive">
                <table className="table text-left">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listHeart?.products?.lenght !== 0 &&
                      listHeart?.products?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <Link to={`/product/${item.productId.id}`}>
                                <div className="d-flex align-items-center cartItemImg">
                                  <div className="imgWrapper">
                                    <img
                                      className="w-100"
                                      src={item.productId.images[0].url}
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
                            <td>{formatCurrency(item.productId.price)}</td>
                            <td
                              className="remove"
                              onClick={() => remove(item.productId.id)}
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
          </div>
        </div>
      </section>
    </>
  );
};

export default ListHeart;
