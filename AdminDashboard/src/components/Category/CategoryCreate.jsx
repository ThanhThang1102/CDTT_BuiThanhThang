import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Button } from "@mui/material";
import { IoIosSave } from "react-icons/io";
import { postData } from "../../utils/api";
import LinearProgress from "@mui/material/LinearProgress";
import { FcAddImage } from "react-icons/fc";
import { MyContext } from "../../App";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

const CategoryCreate = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
    color: "",
    type: "",
  });

  const onChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name !== "images") {
      setFormFields({ ...formFields, [name]: value });
    }
  };

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

  const handleSelectChange = (field, value) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  // Hàm thêm danh mục
  const addCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    window.scrollTo(0, 0);

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("color", formFields.color);
    formData.append("type", formFields.type);
    if (formFields.images[0]) {
      formData.append("file", formFields.images[0]);
    }

    try {
      // Gọi API để thêm danh mục
      const response = await postData("/api/category/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.success === true) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
        navigate("/category/list");
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

  return (
    <>
      {/* Thanh tiến trình */}
      {loading && <LinearProgress />}
      <div className="card shadow my-4 border-0 flex-center p-3">
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold mb-0">Thêm danh mục</h1>
          <div className="ml-auto flex items-center gap-3">
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
                <StyledBreadcrumb label="Danh mục" />
                <StyledBreadcrumb label="tạo" />
              </Breadcrumbs>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={addCategory}>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">
            Thông tin cần thiết:
          </h2>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="name">Tên danh mục</label>
                <TextField
                  id="name"
                  name="name"
                  label="Tên danh mục"
                  type="text"
                  variant="outlined"
                  fullWidth
                  tabIndex="1"
                  placeholder="Ví dụ: Giày thể thao"
                  onChange={onChangeInput}
                  value={formFields.name}
                />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label htmlFor="color">Màu nền</label>
                <TextField
                  id="color"
                  name="color"
                  label="Màu nền"
                  type="text"
                  variant="outlined"
                  fullWidth
                  tabIndex="2"
                  placeholder="Ví dụ: #FFF"
                  onChange={onChangeInput}
                  value={formFields.color}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="type">Vị trí</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Vị trí
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    label="Type"
                    name="type"
                    tabIndex="3"
                    value={formFields.type}
                    onChange={(e) => handleSelectChange("type", e.target.value)}
                  >
                    <MenuItem value="nav" defaultValue="nav">
                      Danh mục
                    </MenuItem>
                    <MenuItem value="menu">On Menu</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">
            Tải ảnh lên
          </h2>
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
                  {loading === true ? "Creating..." : "Tạo danh mục"}
                </span>
              </Button>
              <Link to="/category/list">
                <Button
                  type="button"
                  className="flex items-center mr-2 py-2"
                  variant="contained"
                  color="error"
                >
                  <IoIosClose style={{ fontSize: "25px" }} />
                  <span className="text-sm capitalize">Hủy</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CategoryCreate;
