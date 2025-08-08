import {
  Breadcrumbs,
  Button,
  emphasize,
  IconButton,
  LinearProgress,
  styled,
  Tooltip,
} from "@mui/material";
import { FcAddImage } from "react-icons/fc";
import { IoIosClose, IoIosSave } from "react-icons/io";
import HomeIcon from "@mui/icons-material/Home";
import Chip from "@mui/material/Chip";
import { useContext, useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { MyContext } from "../../App";
import { deleteData, getData, postData } from "../../utils/api";
import { RiDeleteBin6Line } from "react-icons/ri";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const SlideBannerCreate = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const [dataSlides, setDataSlides] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const [formFields, setFormFields] = useState({
    images: [],
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      setFormFields((prev) => ({
        ...prev,
        images: [file],
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormFields((prevFields) => ({
      ...prevFields,
      images: [],
    }));
    setImagePreview(null);
  };

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const res = await getData(`/api/slideBanner/`);
      if (res) {
        console.log(res.data);
        setDataSlides(res.data);
      } else {
        setDataSlides([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Thêm thông báo lỗi cho người dùng nếu cần
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Add form validation and submit to API
    if (formFields.images.length === 0) {
      // Kiểm tra nếu không có ảnh nào được chọn
      context.setMessage("Vui lòng chọn hình ảnh!");
      context.setTypeMessage("error");
      context.setOpen(true);
      setLoading(false);
      return; // Dừng hàm nếu chưa có ảnh
    }

    const formData = new FormData();
    if (formFields.images[0]) {
      formData.append("images", formFields.images[0]);
    }
    console.log("Submitting form with data:", formFields.images);
    try {
      const response = await postData(
        "/api/slideBanner/create",
        formData,
        true
      );
      console.log(response);
      if (response.success === true) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
        setFormFields({ images: [] });
        setImagePreview(null);
        fetchData();
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm Xóa danh mục
  const handleDeleteSlide = async (id) => {
    setLoading(true);
    try {
      const response = await deleteData("/api/slideBanner/", id);
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
      fetchData();
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card shadow my-4 border-0 flex-center p-3">
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold mb-0">Thêm slide show</h1>
          <div className="ml-auto flex items-center gap-3">
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
                <StyledBreadcrumb label="Slide Banner" />
                <StyledBreadcrumb label="tạo" />
              </Breadcrumbs>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <div className="row">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              modules={[Autoplay, Navigation]}
              className="mySwiper"
            >
              {dataSlides?.map((slide, index) => {
                return (
                  <>
                    <SwiperSlide key={index}>
                      <img
                        style={{ height: "369px" }}
                        src={slide.images[0].url}
                      />
                    </SwiperSlide>
                  </>
                );
              })}
            </Swiper>
          </div>
        </div>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">Tải ảnh lên</h2>
          <div className="flex items-center gap-4 flex-wrap">
            {imagePreview ? ( // Hiển thị preview nếu có
              <div className="imgUploadBoxWrapper">
                <span
                  className="remove flex items-center justify-center"
                  onClick={handleRemoveImage}
                >
                  <IoIosClose />
                </span>
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300">
                  <img src={imagePreview} alt="Uploaded" />
                </div>
              </div>
            ) : (
              <div className="imgUploadBoxWrapper">
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300 flex items-center justify-center flex-col">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageUpload}
                  />
                  <FcAddImage className="icon" />
                  <h4>Chọn ảnh</h4>
                </div>
              </div>
            )}
          </div>

          <div className="border-0 mt-5 flex w-100">
            <div className="ml-auto">
              <Button
                type="submit"
                className="flex items-center mr-2 py-2"
                variant="contained"
                color="primary"
              >
                <IoIosSave className="mr-1" style={{ fontSize: "25px" }} />
                <span className="text-sm capitalize">
                  {loading === true ? "Đang tải..." : "Tải ảnh lên"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="card shadow-sm my-4 productList border-0">
        {loading && <LinearProgress />}

        <table className="table tableList bg-slate-300">
          <thead className="table-dark">
            <tr className="capitalize">
              <th scope="col">#</th>
              <th scope="col text-center">_ID</th>
              <th scope="col text-center">Slide</th>
              {/* <th scope="col text-center">Vị trí</th> */}
              <th scope="col text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataSlides) && dataSlides.length > 0 ? (
              dataSlides.map((item, index) => (
                <tr key={index}>
                  <th className="align-middle w-[5%]" scope="row">
                    {index + 1}
                  </th>
                  <td className="align-middle text-center">{item.id}</td>
                  <td className="align-middle">
                    <div className="productCell justify-center">
                      <div className="imgWrapper">
                        <img
                          src={item.images?.[0]?.url || ""}
                          alt="Slide Image"
                          className="rounded-sm card"
                        />
                      </div>
                    </div>
                  </td>
                  {/* <td className="align-middle text-center">{item.position}</td> */}
                  <td className="align-middle text-center">
                    <div className="flex gap-3 justify-center">
                      <div
                        className="btnActions"
                        style={{ backgroundColor: "#ff6179" }}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteSlide(item.id)}
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
      </div>
    </div>
  );
};

export default SlideBannerCreate;
