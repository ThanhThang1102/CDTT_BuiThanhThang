import React, { useContext } from "react";

import Button from "@mui/material/Button";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
// import required modules
import { Rating } from "@mui/material";
import { MyContext } from "../../App";
import { useEffect } from "react";
import { postData } from "../../utils/api";

const ProductItem = (props) => {
  const context = useContext(MyContext);

  const viewProductDetails = (id) => {
    context.setisOpenProductModal({
      id: id,
      open: true,
    });
  };

  useEffect(() => {
    console.log(props.item);
  }, [props.item]);

  const handleHeart = async (id) => {
    console.log(id);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = context.userData.userId;

      const setDataReview = {
        userId: userId,
        productId: id,
      };

      const response = await postData(`/api/favorite/add`, setDataReview, {
        headers: {
          Authorization: `Bearer ${token}`, // Thay bằng token thật
        },
      });
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
      
      <div className={`item productItem ${props.itemView}`}>
        <div className="imgWrapper" style={{ width: "100%" }}>
          <Link to={`/product/${props.item?.id}`}>
            <img
              className="w-100"
              src={props.item?.images[0].url}
              alt={props.item?.name?.substr(0, 19) + "..."}
              style={{ height: "250px" }}
            />
          </Link>

          {props.item?.discount > 0 && (
            <span className="badge badge-danger">
              Giảm {props.item?.discount}%
            </span>
          )}
          <div className="actions">
            {/* <Button onClick={() => viewProductDetails(props.item?.id)}>
                <TfiFullscreen />
              </Button> */}
            <Button onClick={() => handleHeart(props.item.id)}>
              <IoMdHeartEmpty style={{ fontSize: "20px" }} />
            </Button>
          </div>
        </div>

        <div className="info">
          <Link to={`/product/${props.item?._id}`}>
            <h4>{props.item?.name?.substr(0, 19) + "..."}</h4>
          </Link>
          <span className="text-success d-block">
            {props.item?.productInStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={props.item?.rating}
            readOnly
            size="small"
            precision={0.5}
          />

          <div className="d-flex">
            {props.item?.old_price < props.item?.price ? (
              <span className="newPrice text-danger ml-2">
                {formatCurrency(props.item?.price)}
              </span>
            ) : (
              <>
                <span className="oldPrice">
                  {formatCurrency(props.item?.old_price)}
                </span>
                <span className="newPrice text-danger ml-2">
                  {formatCurrency(props.item?.price)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
