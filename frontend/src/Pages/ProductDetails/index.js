import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { Button } from "@mui/material";
import { BsCartPlusFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ProductItemSlide from "../../Components/ProductItemSlide";
import RelatedProducts from "../../Components/RelatedProducts";
import { deleteData, getData, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const [quantityVal, setQuantityVal] = useState();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");

  const isActive = (type, index, value) => {
    switch (type) {
      case "size":
        setActiveSize(index);
        setSelectedSize(value);
        break;
      case "color":
        setActiveColor(index);
        setSelectedColor(value);
        break;
      case "tab":
        setActiveTabs(index);
        break;
      case "tag":
        setActiveTag(index);
        setSelectedTag(value);
        break;
      default:
        break;
    }
  };

  const onQuantityChange = (value) => {
    console.log("quantity productDetail", value);
    setQuantityVal(value);
  };

  const [loadingCart, setLoadingCart] = useState(false);

  const addCart = async (id) => {
    setLoadingCart(true);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const newCartFields = {
      userId: context.userData.userId,
      productId: id,
      quantity: quantityVal,
      size: selectedSize,
      color: selectedColor,
    };

    try {
      // Gửi dữ liệu lên server
      const response = await postData(`/api/cart/addCart`, newCartFields, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });
      if (response.status === true) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
        setTimeout(() => {
          history("/cart");
        }, 1000);
        setLoadingCart(false);
      } else {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
        setLoadingCart(false);
      }
    } catch (error) {
      setLoadingCart(false);
    } finally {
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
        setLoadingCart(false);
      }, 2000);
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const productId = id;
      const data = await getData(`/api/review/${productId}`);
      console.log("API Response:", data); // Kiểm tra dữ liệu từ API

      if (data.status === true) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
        console.error("Error fetching reviews:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchProduct = useCallback(async () => {
    try {
      getData(`/api/products/${id}`).then((data) => {
        setProduct(data);
        getData(
          `/api/products/related?catID=${data.product.category.id}&tag=${
            selectedTag || ""
          }`
        ).then((data) => {
          const filteredData = data?.products?.filter((item) => item.id !== id);
          console.log("Sản phẩm liên quan", filteredData);
          setRelatedProduct(filteredData);
          setLoading(false);
        });
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [id, selectedTag]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct(); // Gọi để làm mới sản phẩm
    fetchReviews(); // Gọi để làm mới đánh giá
  }, [id, selectedTag]); // Không cần `fetchProduct` và `fetchReviews` nếu đã gói trong `useCallback`

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData.userId;

      const setDataReview = {
        productId: id,
        rating: valueRating,
        reviewText: reviewText,
      };
      const response = await postData(
        `/api/review/newReview/${userId}`,
        setDataReview,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thay bằng token thật
          },
        }
      );
      console.log("Response from server:", response);
      if (response.status === true) {
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "success",
        });
      } else {
        console.log(response.message);
        context.setAlertBox({
          open: true,
          message: response.message,
          type: response.type || "error",
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewText("");
      setValueRating(0);
      fetchReviews(); // Làm mới danh sách đánh giá sau khi thêm thành công
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData.userId;

      if (!token) {
        context.setAlertBox({
          open: true,
          message: "Bạn chưa đăng nhập. Vui lòng đăng nhập lại.",
          type: "error",
        });
        return;
      }

      const response = await deleteData(
        `/api/review/deleteReview/${userId}/${id}`,
        null, // Không truyền body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === true) {
        context.setAlertBox({
          open: true,
          message: response.message || "Xóa đánh giá thành công!",
          type: response.type || "success",
        });
      } else {
        context.setAlertBox({
          open: true,
          message: response.message || "Không thể xóa đánh giá",
          type: response.type || "error",
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error.message);
      context.setAlertBox({
        open: true,
        message: "Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      fetchReviews();
      setTimeout(() => {
        context.setAlertBox({
          open: false,
          message: "",
          type: "",
        });
      }, 5000);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <section className="productDetails section">
        {loading ? (
          <div className="text-center w-100">
            <CircularProgress className="" />
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-md-4 pl-5">
                <ProductZoom
                  images={product?.product?.images}
                  discount={product?.product?.discount}
                />
              </div>
              <div className="col-md-8 pl-5 pr-5">
                <h2 className="hd text-capitalize">{product?.product?.name}</h2>
                <ul className="list list-inline mb-0 d-flex align-items-center">
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center ">
                      <span className="text-gray mr-2">Thương hiệu:</span>
                      <span className="text-drak badge badge-danger">
                        {product?.product?.brand}
                      </span>
                    </div>
                  </li>
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center ">
                      <span className="text-gray mr-2">Loại Danh mục:</span>
                      <span className="text-drak badge badge-info p-1">
                        {product?.product?.category?.name}
                      </span>
                    </div>
                  </li>
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center ">
                      <span className="text-gray mr-2">Danh mục phụ:</span>
                      <span className="text-drak badge badge-info p-1">
                        {product?.product?.sub_category?.name}
                      </span>
                    </div>
                  </li>
                  <li className="list-inline-item ">
                    <div className="d-flex align-items-center">
                      <Rating
                        name="read-only"
                        value={parseInt(product?.product?.rating)}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                      <span className="text-gray text-capitalize ml-2">
                        {" "}
                        {product?.product?.numberReviews > 0 &&
                          product?.product?.numberReviews}
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="d-flex my-3">
                  {product?.product?.old_price < product?.product?.price ? (
                    <span className="newPrice text-danger ml-2">
                      {formatCurrency(product?.product?.price)}
                    </span>
                  ) : (
                    <>
                      <span className="oldPrice">
                        {formatCurrency(product?.product?.old_price)}
                      </span>
                      <span className="newPrice text-danger ml-2">
                        {formatCurrency(product?.product?.price)}
                      </span>
                    </>
                  )}
                </div>

                {product?.product?.productInStock <= 0 ? (
                  <span className="badge badge-span bg-danger text-white">
                    Out of stock
                  </span>
                ) : (
                  <span className="badge badge-span bg-success text-white">
                    In stock
                  </span>
                )}

                <p className="mt-2 mb-0">
                  Mô tả ngắn:{" "}
                  {product?.product?.description.substr(0, 50) + "..."}
                </p>

                <div className="d-flex align-items-center productSize">
                  <span>Size: </span>
                  <ul className="list list-inline mb-0 pl-4">
                    {product?.product?.size?.map((item, index) => (
                      <li className="list-inline-item" key={index}>
                        <Link
                          onClick={() => isActive("size", index, item)}
                          className={`tag ${
                            activeSize === index ? "active" : ""
                          }`}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-flex align-items-center productSize">
                  <span>Màu: </span>
                  <ul className="list list-inline mb-0 pl-4">
                    {product?.product?.colors?.map((item, index) => (
                      <li className="list-inline-item" key={index}>
                        <Link
                          onClick={() => isActive("color", index, item)}
                          className={`tag ${
                            activeColor === index ? "active" : ""
                          }`}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex align-items-center mt-3">
                  <QuantityBox quantity={1} maxQuantity={10} onQuantityChange={onQuantityChange} />
                  <Button
                    onClick={() => addCart(id)}
                    className="d-flex align-items-center btn-cart ml-3 btn-blue btn-lg text-capitalize btn-big btn-round"
                  >
                    {loadingCart === true ? (
                      <CircularProgress className="" />
                    ) : (
                      <>
                        <BsCartPlusFill />
                        &nbsp; Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                  <Tooltip title="Add to Wishlist" placement="top">
                    <Button className="btn-blue btn-lg btn-circle ml-3">
                      <FaRegHeart />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Compare" placement="top">
                    <Button className="btn-blue btn-lg btn-circle ml-3">
                      <MdOutlineCompareArrows />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
            <br />
            <div className="card mt-5 detailsPageTabs">
              <div className="customTabs">
                <ul className="list list-inline">
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 0 && "active"}`}
                      onClick={() => isActive("tab", 0)}
                    >
                      Mô tả
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 1 && "active"}`}
                      onClick={() => isActive("tab", 1)}
                    >
                      Thông tin thêm
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 2 && "active"}`}
                      onClick={() => isActive("tab", 2)}
                    >
                      Đánh giá sản phẩm
                    </Button>
                  </li>
                </ul>
                <br />

                {activeTabs === 0 && (
                  <div className="tabContent">
                    {product?.product?.description}
                  </div>
                )}

                {activeTabs === 1 && (
                  <div className="tabContent">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                          <tr>
                            <th>Cao</th>
                            <td>1m63</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTabs === 2 && (
                  <div className="tabContent">
                    <div className="row">
                      <div className="col-md-8">
                        <h3>Câu hỏi & trả lời của khách hàng</h3>
                        <br />

                        {loading ? (
                          <p>Đang tải đánh giá...</p>
                        ) : error ? (
                          <p className="text-danger">{error}</p>
                        ) : reviews.length === 0 ? (
                          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        ) : (
                          reviews.map((review) => (
                            <div
                              key={review._id}
                              className="reviewBox mb-4 border-bottom"
                            >
                              <div className="info">
                                <div className="d-flex align-items-center w-100">
                                  <h5>
                                    {review.userId?.fullName || "Khách hàng"}
                                  </h5>
                                  {review.userId?.id ===
                                    context.userData.userId && (
                                    <p>
                                      <span className="ml-2 badge badge-info">
                                        Đánh giá của bạn
                                      </span>
                                    </p>
                                  )}
                                  <div className="ml-auto">
                                    <Rating
                                      name="read-only"
                                      value={review.rating}
                                      size="small"
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <h6 className="text-gray">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </h6>
                                <p>{review.reviewText}</p>
                              </div>
                              {review.userId?.id ===
                                context.userData.userId && (
                                <div>
                                  <span
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteReview(review.id)
                                    }
                                  >
                                    Xóa đánh giá
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        )}

                        <form onSubmit={handleAddReview} className="reviewForm">
                          <h4>Đánh giá của bạn ở đây!</h4>
                          <div className="form-group">
                            <textarea
                              className="form-control shadow"
                              placeholder="Viết đánh giá..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <Rating
                                  name="simple-controlled"
                                  value={valueRating}
                                  onChange={(event, newValue) =>
                                    setValueRating(newValue)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <Button
                              type="submit"
                              className="btn-blue btn-lg btn-big btn-round"
                              disabled={!reviewText || valueRating === 0}
                            >
                              Đánh giá sản phẩm
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex mt-5 align-items-center productSize">
              <span>Tags: </span>
              <ul className="list list-inline mb-0 pl-4">
                {product?.product?.tags?.map((item, index) => (
                  <li className="list-inline-item" key={index}>
                    <Link
                      onClick={() => isActive("tag", index, item)}
                      className={`tag ${activeTag === index ? "active" : ""}`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {relatedProducts?.length !== 0 ? (
              <RelatedProducts
                title="Sản phẩm liên quan"
                data={relatedProducts}
              />
            ) : (
              <p>Không có sản phẩm liên quan</p>
            )}

            {/* <RelatedProducts title="RECENTLY VIEW PRODUCTS" /> */}
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
