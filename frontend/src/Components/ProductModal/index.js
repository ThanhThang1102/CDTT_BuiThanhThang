import Dialog from "@mui/material/Dialog";
import { Button, Rating } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import QuantityBox from "../QuantityBox";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";

const ProductModal = (props) => {
  const context = useContext(MyContext);

  return (
    <>
      <Dialog
        onClose={() => context.setisOpenProductModal(false)}
        className="product-modal"
        open={true}
      >
        <Button
          className="close_country"
          onClick={() => context.setisOpenProductModal(false)}
        >
          <IoMdClose />
        </Button>
        <h4 className="mb-1 font-weight-bold pr-5">
          {props.data?.product?.name}
        </h4>
        <div className="d-flex mt-2 align-items-center">
          <div className="d-flex align-items-center">
            <span>Thương hiệu:</span>
            <span className="ml-2 badge badge-danger p-2">
              {props.data?.product?.brand}
            </span>
          </div>
          <Rating
            name="read-only"
            value={Number(props.data?.product?.rating)}
            size="small"
            precision={0.5}
            readOnly
            className="ml-3"
          />
        </div>
        <hr />

        <div className="row mt-2 productDetailModal">
          <div className="col-md-5">
            <ProductZoom images={props.data?.product?.images} discount={props.data?.product?.discount}/>
          </div>
          <div className="col-md-7">
            <div className="d-flex info  align-items-center mb-3">
              <span className="oldPrice lg">
                {props.data?.product?.old_price}
              </span>
              <span className="newPrice lg text-danger ml-2">{props.data?.product?.price}</span>
            </div>

            <span className="badge badge-span bg-success text-white">
              {props.data?.product?.productInStock > 0
                ? "In Stock"
                : "Out of Stock"}
            </span>
            <p className="mt-3">{props.data?.product?.description}</p>
            <div className="d-flex align-items-center">
              <QuantityBox />
              <Button className="btn-blue text-white bg-red btn-lg btn-big btn-round ml-3 ">
                Add to cart
              </Button>
            </div>
            <div className="d-flex align-items-center mt-5 actions">
              <Button className="btn-round" variant="outlined">
                {" "}
                <IoIosHeartEmpty /> ADD to WISHLIST
              </Button>
              <Button className=" ml-3 btn-round" variant="outlined">
                {" "}
                <MdOutlineCompareArrows /> COMPARE
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProductModal;
