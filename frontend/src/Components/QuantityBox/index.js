import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

const QuantityBox = (props) => {
  const [inputVal, setInputval] = useState(props.quantity || 1);
  const context = useContext(MyContext);
  const MinVal = () => {
    if (inputVal > 1) {
      setInputval(inputVal - 1);
    }
  };

  const PlusVal = () => {
    if (!props.maxQuantity || inputVal < props.maxQuantity) {
      setInputval(inputVal + 1);
    } else if (props.maxQuantity && inputVal >= props.maxQuantity) {
      context.setAlertBox({
        open: true,
        message: `Bạn chỉ có thể chọn tối đa ${props.maxQuantity} sản phẩm.`,
        type: "error",
      });
      setTimeout(() => {
      context.setAlertBox({
        open: false,
        message: "",
        type: "",
      });
    }, 5000);
    }
    
  };

  useEffect(() => {
    props.onQuantityChange(inputVal); // Gửi giá trị số lượng mới về component cha
  }, [inputVal]);

  return (
    <div className="quantityDrop d-flex align-items-center">
      <Button className="btn-blue btn-lg btn-circle" onClick={MinVal}>
        <FaMinus />
      </Button>
      <input
        type="text"
        value={inputVal}
        readOnly
        style={{ textAlign: "center", width: "50px" }}
      />
      <Button className="btn-blue btn-lg btn-circle" onClick={PlusVal}>
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
