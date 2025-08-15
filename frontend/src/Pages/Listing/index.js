import Sidebar from "../../Components/Sidebar";
import { Link, useParams } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import ProductItem from "../../Components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { getData } from "../../utils/api";

const Listing = () => {
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState("four");
  const openDropdown = Boolean(anchorEl);
  const [price, setPrice] = useState([200000, 6000000]);
  const [rating, setRating] = useState(0);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Hàm mở dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Hàm đóng dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Hàm thay đổi trang
  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, currentPage: value });
  };

  // Hàm thay đổi số lượng sản phẩm trên mỗi trang
  const handlePerPageChange = (newPerPage) => {
    setPagination({ ...pagination, perPage: newPerPage, currentPage: 1 });
  };

  // Hàm gọi API lấy sản phẩm với các tham số trang và giá
  const fetchProducts = async (
    page = 1,
    perPage = 12,
    priceRange,
    rating = 0,
    status = ""
  ) => {
    setLoading(true);
    try {
      const response = await getData(
        `/api/products/cat?id=${id}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&rating=${rating}&status=${status}&perPage=${perPage}&page=${page}`
      );
      setProducts(response.products || []);
      setPagination(
        response.pagination || { currentPage: 1, perPage, totalPages: 1 }
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterDataChange = (priceRange, newRating, newStatus) => {
    setPrice(priceRange); // Cập nhật lại phạm vi giá
    setRating(newRating); // Cập nhật đánh giá
    console.log(
      "Đang lọc với giá:",
      priceRange,
      "đánh giá:",
      newRating,
      "trạng thái:",
      newStatus
    );

    // Gọi API với các tham số mới
    fetchProducts(
      pagination.currentPage,
      pagination.perPage,
      priceRange,
      newRating,
      newStatus
    );
  };

  // Fetch sản phẩm ngay khi load trang hoặc khi giá hoặc ID thay đổi
  useEffect(() => {
    fetchProducts(pagination.currentPage, pagination.perPage, price, rating); // Fetch sản phẩm khi load trang hoặc ID thay đổi
  }, [id, pagination.currentPage, pagination.perPage]);

  return (
    <>
      <section className="product_listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar filterData={handleFilterDataChange} />

            <div className="content_right">
              <div className="showBy mt-3 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setProductView("three")}
                  >
                    <BsGrid3X3GapFill />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setProductView("four")}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>
                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>
                    <span>
                      Hiện {pagination.perPage} <FaAngleDown />{" "}
                    </span>
                  </Button>
                  <Menu
                    className="showPerPageDropdown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handlePerPageChange(12)}>
                      12
                    </MenuItem>
                    <MenuItem onClick={() => handlePerPageChange(24)}>
                      24
                    </MenuItem>
                    <MenuItem onClick={() => handlePerPageChange(36)}>
                      36
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <div className="productListing">
                {loading ? (
                  <p>Đang tải dữ liệu...</p>
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductItem
                      key={product._id || index}
                      itemView={productView}
                      item={product}
                    />
                  ))
                ) : (
                  <p className="no-data">Không có dữ liệu</p>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination
                  count={pagination.totalPages}
                  color="secondary"
                  size="large"
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
