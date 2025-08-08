import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const DashboardBox = (props) => {
  const { color, icon, iconTrending, total, title } = props;
  const [displayTotal, setDisplayTotal] = useState(0); // Giá trị hiển thị

  const buttonStyle = {
    background: `linear-gradient(${color[0]}, ${color[1]})`,
  };

  // Hiệu ứng chạy số
  useEffect(() => {
    let start = 0; // Bắt đầu từ 0
    const duration = 1000; // Tổng thời gian animation (1 giây)
    const increment = Math.ceil(total / (duration / 16)); // Tính bước tăng mỗi frame (~16ms)

    const interval = setInterval(() => {
      start += increment;
      if (start >= total) {
        clearInterval(interval);
        start = total; // Đảm bảo không vượt quá giá trị thực
      }
      setDisplayTotal(start); // Cập nhật giá trị hiển thị
    }, 16); // Mỗi frame ~16ms (60 FPS)

    return () => clearInterval(interval); // Dọn dẹp khi unmount
  }, [total]);

  return (
    <Button className="dashboardBox" style={buttonStyle}>
      <span className="chart">{iconTrending}</span>
      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">{title}</h4>
          <span className="text-white">{displayTotal}</span> {/* Hiển thị giá trị chạy */}
        </div>
        <div className="ml-auto">
          <span className="icon">{icon}</span>
        </div>
      </div>
    </Button>
  );
};

DashboardBox.propTypes = {
  color: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.node.isRequired,
  iconTrending: PropTypes.node.isRequired,
  total: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default DashboardBox;
