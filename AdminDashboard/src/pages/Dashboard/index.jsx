import DashboardBox from "../../components/DashboardBox";
import { FaCircleUser, FaEye } from "react-icons/fa6";
import { IoMdTrendingUp } from "react-icons/io";
import { IconButton, Pagination, Rating, Stack, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { getData } from "../../utils/api";
import { useEffect, useState } from "react";
import { FaBabyCarriage } from "react-icons/fa";
import { RiProductHuntLine } from "react-icons/ri";

const dataOld = [
  ["Name", "Popularity"],
  ["Cesar", 250],
  ["Rachel", 4200],
  ["Patrick", 2900],
  ["Eric", 8200],
];

const dataNew = [
  ["Name", "Popularity"],
  ["Cesar", 370],
  ["Rachel", 600],
  ["Patrick", 700],
  ["Eric", 1500],
];

export const diffdata = {
  old: dataOld,
  new: dataNew,
};

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0); // Tổng số đơn hàng
  const [totalUsers, setTotalUsers] = useState(0); // Tổng số người dùng
  const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm

  const [dataProducts, setDataProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(null);

  const fetchData = async (currentPage = 1) => {
    try {
      // Thực hiện nhiều yêu cầu API song song
      const [productsRes, usersRes, ordersRes, totalProductsRes] =
        await Promise.all([
          getData(`/api/products/getProductSeller?page=${currentPage}`),
          getData(`/api/user/users`),
          getData(`/api/order/completed-orders`),
          getData(`/api/products/all-products`), // Gọi API thống kê tổng số sản phẩm
        ]);

      // Cập nhật danh sách sản phẩm
      if (productsRes) {
        setDataProducts(productsRes.products);
        setTotalPages(productsRes.totalPages);
      } else {
        setDataProducts([]);
        setTotalPages(null);
      }

      // Cập nhật tổng số người dùng
      if (usersRes && usersRes.success) {
        setTotalUsers(usersRes.totalItems || 0); // Đảm bảo API trả về `totalItems`
      } else {
        setTotalUsers(0);
      }

      // Cập nhật tổng số đơn hàng đã hoàn thành
      if (ordersRes && ordersRes.success) {
        setTotalOrders(ordersRes.totalCompletedOrders || 0); // Đảm bảo API trả về `totalCompletedOrders`
      } else {
        setTotalOrders(0);
      }

      // Cập nhật tổng số sản phẩm hiện có
      if (totalProductsRes && totalProductsRes.success) {
        setTotalProducts(totalProductsRes.totalProducts || 0); // Đảm bảo API trả về `totalProducts`
      } else {
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Thêm thông báo lỗi cho người dùng nếu cần
    }
  };

  // Gọi fetchData khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang hiện tại
    fetchData(value); // Gọi API với trang mới
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <section className="py-3">
        <div className="dashboardBoxWrapper flex">
          <DashboardBox
            color={["#2c78e5", "#60aff5"]}
            icon={<FaCircleUser />}
            iconTrending={<IoMdTrendingUp />}
            total={totalOrders}
            title="Tổng số đơn hàng đã hoàn thành"
          />
          <DashboardBox
            color={["#1da256", "#48d483"]}
            icon={<FaBabyCarriage />}
            iconTrending={<IoMdTrendingUp />}
            total={totalUsers}
            title="Tổng số người dùng"
          />
          <DashboardBox
            color={["#e1950e", "#f3cd29"]}
            icon={<RiProductHuntLine />}
            iconTrending={<IoMdTrendingUp />}
            total={totalProducts}
            title="Tổng số sản phẩm"
          />
        </div>

        <div className="card shadow-sm my-4 productList border-0">
          <div className="flex items-center mb-4 justify-between  pt-3 px-4">
            <h2 className="mb-0 font-bold text-md capitalize">
              Sản phẩn bán chạy
            </h2>
          </div>
          <table className="table tableList bg-slate-300">
            <thead className="table-dark">
              <tr className="capitalize">
                <th scope="col" className="text-center">
                  #
                </th>
                <th scope="col" className="text-center">
                  Tên sản phẩm
                </th>
                <th scope="col" className="text-center">
                  Ảnh
                </th>
                <th scope="col" className="text-center">
                  Danh mục
                </th>
                <th scope="col" className="text-center">
                  Danh mục phụ
                </th>
                <th scope="col" className="text-center">
                  Thương hiệu
                </th>
                <th scope="col" className="text-center">
                  Đánh giá
                </th>
                <th scope="col" className="text-center">
                  Giá
                </th>
                <th scope="col" className="text-center">
                  Đã bán
                </th>
                <th scope="col" className="text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataProducts) && dataProducts.length > 0 ? (
                dataProducts.map((item, index) => (
                  <tr key={index}>
                    <th className="align-middle" scope="row">
                      {index + 1}
                    </th>
                    <td className="align-middle text-left">
                      <div className="info">
                        <Link to={`/products/view/${item._id}`}>
                          <h6>{item.name.substr(0, 15) + "..."}</h6>
                        </Link>
                      </div>
                    </td>
                    <td className="align-middle">
                      <div className="productCell">
                        <div className="imgWrapper">
                          <img
                            src={item.images?.[0]?.url || ""}
                            alt="Category Image"
                            className="rounded-sm card"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      {item.category?.name || "N/A"}
                    </td>
                    <td className="align-middle text-center">
                      {item.sub_category?.name || "N/A"}
                    </td>
                    <td className="align-middle text-center">
                      <span className="badge badge-danger p-2 text-white">
                        {item.brand}
                      </span>
                    </td>
                    <td className="align-middle text-center">
                      <Stack spacing={1}>
                        <Rating
                          name="simple-controlled"
                          value={item.rating}
                          readOnly={true}
                          size="small"
                          // precision={0.5}
                        />
                      </Stack>
                    </td>
                    <td className="align-middle text-center">
                      <div>
                        <del className="old">
                          {formatCurrency(item.old_price || 0)}
                        </del>
                        <span className="new text-danger  d-block w-100">
                          {formatCurrency(item.price || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      <span className="badge badge-success  d-block w-100">
                        {item.totalSold}
                      </span>
                    </td>
                    <td className="align-middle">
                      <div className="flex gap-3">
                        <div
                          className="btnActions"
                          style={{ backgroundColor: "#6dc4c4" }}
                        >
                          <Tooltip title="View">
                            <Link to={`/products/view/${item._id}`}>
                              <IconButton>
                                <FaEye />
                              </IconButton>
                            </Link>
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
                {Array.isArray(dataProducts) && dataProducts.length > 0
                  ? dataProducts.length
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
      </section>
    </>
  );
};

export default Dashboard;
