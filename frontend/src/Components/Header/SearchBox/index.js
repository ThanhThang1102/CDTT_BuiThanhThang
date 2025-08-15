import { IoIosSearch } from "react-icons/io";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { getData } from "../../../utils/api";
import { useContext } from "react";
import { MyContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const suggestions = [
    "Tìm kiếm sản phẩm... Ví dụ: Áo thun",
    "Tìm kiếm sản phẩm... Ví dụ: Giày dép",
    "Tìm kiếm sản phẩm... Ví dụ: Laptop",
    "Tìm kiếm sản phẩm... Ví dụ: Phụ kiện",
  ];
  const [placeholder, setPlaceholder] = useState(""); // Trạng thái placeholder
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số của từ hiện tại
  const [charIndex, setCharIndex] = useState(0); // Chỉ số của ký tự đang gõ
  const [isDeleting, setIsDeleting] = useState(false); // Trạng thái gõ/xóa

  useEffect(() => {
    const currentWord = suggestions[currentIndex]; // Lấy từ hiện tại
    let typingSpeed = 55; // Tốc độ gõ chữ (ms)

    if (isDeleting) {
      typingSpeed = 10; // Tốc độ xóa nhanh hơn
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        // Gõ thêm ký tự
        setPlaceholder((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        // Xóa ký tự
        setPlaceholder((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        // Đổi sang trạng thái xóa
        setIsDeleting(true);
        typingSpeed = 3000; // Tạm dừng trước khi xóa
      } else if (isDeleting && charIndex === 0) {
        // Chuyển sang từ tiếp theo
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % suggestions.length); // Quay vòng danh sách
      }
    }, typingSpeed);

    return () => clearTimeout(timeout); // Dọn dẹp timeout
  }, [charIndex, isDeleting, currentIndex, suggestions]);

  const [searchFields, setSearchFields] = useState("");
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const onChangeValue = (e) => {
    e.preventDefault();
    setSearchFields(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await getData(`/api/search?q=${searchFields}`);

      // Kiểm tra nếu phản hồi thành công và có dữ liệu
      if (response.success) {
        console.log("Tìm kiếm", response);
        context.setSearchQuery(searchFields); // Cập nhật từ khóa tìm kiếm
        context.setSearchData({
          items: response.items,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        }); // Cập nhật dữ liệu tìm kiếm
        navigate("/search"); // Chuyển hướng đến trang kết quả
      } else {
        console.log("Không có sản phẩm nào tìm thấy");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi tìm kiếm:", error);
    }
  };

  return (
    <>
      <div className="headerSearch ml-3 mr-3">
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          onChange={onChangeValue}
        />
        <Button onClick={handleSearch}>
          <IoIosSearch />
        </Button>
      </div>
    </>
  );
};

export default SearchBox;
