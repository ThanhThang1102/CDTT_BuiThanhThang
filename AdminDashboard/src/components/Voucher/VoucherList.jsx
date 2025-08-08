import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { PiExport } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SearchBox from "../SearchBox";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import { deleteData, getData } from "../../utils/api";
import { MyContext } from "../../App";
import LinearProgress from "@mui/material/LinearProgress";

const VoucherList = (props) => {
  const { title, isSharedPage } = props;
  const [dataVoucher, setDataVoucher] = useState([]);
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  // Hàm Xóa voucher
  const handleDeleteVoucher = async (id) => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      const response = await deleteData("/api/voucher/delete", id);
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
      const res = await getData(`/api/voucher?page=${currentPage}`);
      if (res) {
        setDataVoucher(res.voucher);
        setTotalPages(res.totalPages);
        console.log(res);
      } else {
        setDataVoucher([]);
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

  const [activeCodeId, setActiveCodeId] = useState(null);

  const showCode = (id) => {
    setActiveCodeId((prevId) => (prevId === id ? null : id)); // Bật/tắt theo ID
  };

  return (
    <>
      {!isSharedPage && (
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="flex items-center justify-between">
            <h1 className="font-weight-bold mb-0 text-capitalize">
              Voucher (Mã giảm giá)
            </h1>
            <div className="ml-auto flex items-center gap-3">
              <Button className="btn-sm btn-border capitalize">
                <PiExport />
                Export to Excel
              </Button>
              <Link to="/voucher/create">
                <Button className="btn-sm btn-border btn-blue capitalize">
                  <IoMdAdd />
                  Thêm voucher
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
                Mã
              </th>
              <th scope="col" className="text-center">
                Loại
              </th>
              <th scope="col" className="text-center">
                % Giảm
              </th>
              <th scope="col" className="text-center">
                Giá Đơn tối thiểu
              </th>
              <th scope="col" className="text-center">
                Số tiền giảm nếu dùng [percentage]
              </th>
              <th scope="col" className="text-center">
                Ngày hết hạng
              </th>
              <th scope="col" className="text-center">
                Số lần dùng
              </th>
              <th scope="col" className="text-center">
                Số lần đã dùng
              </th>
              <th scope="col" className="text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataVoucher) && dataVoucher.length > 0 ? (
              dataVoucher.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle text-right">
                    <div className="info">
                      <span
                        onClick={() => showCode(item.id)}
                        className="badge badge-light cursor-pointer"
                      >
                        {activeCodeId === item.id ? item.code : "Click to show"}
                      </span>
                    </div>
                  </td>

                  <td className="align-middle">
                    <span className="badge badge-info p-2">
                      {item.discountType}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-danger">
                      {item.discountType === "percentage"
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue)}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-danger">
                      {formatCurrency(item.minOrderValue)}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-danger">
                      {formatCurrency(item.maxDiscountValue)}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-danger">
                      {item.expirationDate}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-info">{item.usageLimit}</span>
                  </td>
                  <td className="align-middle text-center">
                    <span className="badge badge-info">{item.usedCount}</span>
                  </td>
                  <td className="align-middle">
                    <div className="flex gap-3">
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#ff6179" }}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteVoucher(item.id)}
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
            Page <strong>{page}</strong> Show{" "}
            <strong>
              {Array.isArray(dataVoucher) && dataVoucher.length > 0
                ? dataVoucher.length
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

VoucherList.propTypes = {
  title: PropTypes.node.isRequired,
  isSharedPage: PropTypes.bool,
};

export default VoucherList;
