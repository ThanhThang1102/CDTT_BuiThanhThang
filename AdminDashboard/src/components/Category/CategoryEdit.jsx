import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import { IoIosClose } from "react-icons/io";
import { Button } from "@mui/material";
import { IoIosSave } from "react-icons/io";
import { getData, putData } from "../../utils/api";
import PropTypes from "prop-types";
import { MyContext } from "../../App";
import LinearProgress from "@mui/material/LinearProgress";
import { FcAddImage } from "react-icons/fc";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CategoryEdit = (props) => {
  const CatID = props.CatID;
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formFields, setFormFields] = useState({
    name: "",
    image: [], // Chỉ lưu trữ một ảnh trong mảng
    color: "",
    type: "",
    public_id: [],
  });

  // Hàm thay đổi input cho các trường text
  const onChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // Nếu trường là images, bạn không cần cập nhật images ở đây
    if (name !== "images") {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  // Hàm tải lên ảnh và cập nhật formFields
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Thiết lập ảnh xem trước
      setImagePreview(URL.createObjectURL(file));

      // Cập nhật formFields để bao gồm ảnh mới vào mảng images
      setFormFields((prev) => ({
        ...prev,
        image: [file], // Ghi đè mảng images bằng một mảng chứa file đã chọn
      }));
    }
  };

  const fetchData = () => {
    getData(`/api/category/${CatID}`).then((res) => {
      setFormFields({
        name: res.data.name,
        color: res.data.color,
        type: res.data.type,
        image: res.data.images.map((img) => img.url), // Giữ hình ảnh hiện tại
        public_id: res.data.images.map((id) => id.public_id), // Giữ hình ảnh hiện tại
      });
      setImagePreview(res.data.images[0]?.url || null); // Hiển thị hình ảnh đầu tiên
      console.log(res.data);
    });
  };

  useEffect(() => {
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
    fetchData();
  }, [CatID]);

  const handleSelectChange = (field, value) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const editCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    window.scrollTo(0, 0);
    if (formFields.image.length === 0) {
      context.setOpen(true);
      setLoading(false);
      return; // Dừng hàm nếu không có ảnh
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("color", formFields.color);
    formData.append("type", formFields.type);

    // Thêm tệp hình ảnh nếu có
    if (formFields.image.length > 0) {
      // Kiểm tra nếu có hình ảnh mới
      formData.append("file", formFields.image[0]);
    }
    try {
      const response = await putData(`/api/category/${CatID}`, formData);
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
      context.setOpenDraw(false);
      setLoading(false);
    }
  };

  // Hàm xóa ảnh
  const handleRemoveImage = async () => {
    setLoading(true);
    setFormFields((prev) => ({
      ...prev,
      image: [], // Xóa ảnh hiện tại
      public_id: [], // Xóa public_id của ảnh hiện tại
    }));
    setImagePreview(null);
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={editCategory}>
        <div className="card shadow border-0 flex-center p-3">
          <div className="flex items-center justify-between py-3">
            <h1 className="font-weight-bold mb-0 ">
              _ID:{" "}
              <strong className="text-indigo-400">{CatID}</strong>
            </h1>
          </div>
          {loading && <LinearProgress />}
          <h5 className="text-black/55 capitalize text-xl ">
            Thông tin cần thiết:
          </h5>
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
                  required
                  onChange={onChangeInput}
                  value={formFields.name}
                />
                <FormHelperText>Required</FormHelperText>
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
                  required
                  onChange={onChangeInput}
                  value={formFields.color}
                />
                <FormHelperText>Error</FormHelperText>
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
                    label="Vị trí"
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
                  {loading === true ? "Đang cập nhật..." : "Cập nhật danh mục"}
                </span>
              </Button>
              <Button
                onClick={() => context.setOpenDraw(false)}
                type="button"
                className="flex items-center mr-2 py-2"
                variant="contained"
                color="error"
              >
                <IoIosClose style={{ fontSize: "25px" }} />
                <span className="text-sm capitalize">Hủy</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

// Khai báo kiểu dữ liệu cho các props
CategoryEdit.propTypes = {
  CatID: PropTypes.string.isRequired,
};

export default CategoryEdit;
