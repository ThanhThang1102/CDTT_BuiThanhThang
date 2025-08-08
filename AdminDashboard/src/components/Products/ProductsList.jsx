import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FaRegEdit } from "react-icons/fa";
// import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { PiExport } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SearchBox from "../SearchBox";
import { FaEye } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import { deleteData, getData } from "../../utils/api";
import { MyContext } from "../../App";
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import ProductEdit from "./ProductEdit";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const ProductsList = (props) => {
  const { title, isSharedPage } = props;
  const [dataProducts, setDataProducts] = useState([]);
  const context = useContext(MyContext);
  const [id, setId] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  // Hàm Edit sản phẩm
  const handleEditProduct = (id) => {
    // Tùy chỉnh code để chỉnh sản phẩm mục tại đây
    if (id) {
      console.log("Edit Product:", id);
      context.setOpenDraw(true);
      setId(id);
    }
  };

  // Hàm Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      const response = await deleteData("/api/products/", id);
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
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu từ API
  const fetchData = async (currentPage = 1) => {
    try {
      const res = await getData(`/api/products?page=${currentPage}`);
      if (res) {
        setDataProducts(res.products);
        setTotalPages(res.totalPages);
        console.log(res);
      } else {
        setDataProducts([]);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <Drawer
        open={context.openDraw}
        anchor="right"
        onClose={() => context.setOpenDraw(false)}
      >
        <ProductEdit productID={String(id)} />
      </Drawer>
      {!isSharedPage && (
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="flex items-center justify-between">
            <h1 className="font-weight-bold mb-0 text-capitalize">sản phẩm</h1>
            <div className="ml-auto flex items-center gap-3">
              <Button className="btn-sm btn-border capitalize">
                <PiExport />
                Export to Excel
              </Button>
              <Link to="/products/create">
                <Button className="btn-sm btn-border btn-blue capitalize">
                  <IoMdAdd />
                  Thêm sản phẩm
                </Button>
              </Link>
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
                  <td className="align-middle">
                    <div className="flex gap-3">
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#6dc4c4" }}
                      >
                        <Tooltip title="View">
                          <Link to={`/products/view/${item.id}`}>
                            <IconButton>
                              <FaEye />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </div>
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#de2fff" }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditProduct(item.id)}
                          >
                            <FaRegEdit />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#ff6179" }}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteProduct(item.id)}
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
    </>
  );
};

ProductsList.propTypes = {
  title: PropTypes.node.isRequired,
  isSharedPage: PropTypes.bool,
};

export default ProductsList;
