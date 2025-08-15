import React from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import ProductItem from "../../Components/ProductItem";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import { getData } from "../../utils/api";
import { useEffect } from "react";

const SearchPage = () => {
  const context = useContext(MyContext);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (context.searchQuery.trim()) {
        // Đảm bảo searchQuery không rỗng
        const response = await getData(
          `/api/search?q=${context.searchQuery}&page=${pagination.currentPage}&limit=8`
        );

        if (response.success) {
          context.setSearchData({
            items: response.items,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
          });
          setPagination({
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
          });
        } else {
          context.setSearchData([]);
        }
      }
    };

    fetchData();
  }, [pagination.currentPage, context.searchQuery]); // Fetch lại khi thay đổi trang hoặc từ khóa tìm kiếm

  const handlePageChange = (event, value) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: value, // Cập nhật trang hiện tại
    }));
  };

  return (
    <section className="section">
      <div className="container">
        <div className="d-flex align-items-center">
          <div className="info">
            <h3 className="mb-0 hd">Sản phẩm bạn tìm kiếm</h3>
          </div>
        </div>
        <div className="product_row productWrap w-100 mt-4">
          {context.searchData?.items?.length > 0 ? (
            context.searchData?.items?.map((product, index) => (
              <ProductItem key={product._id || index} item={product} />
            ))
          ) : (
            <p className="no-data">Không có dữ liệu</p>
          )}
        </div>
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="secondary"
            size="large"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
