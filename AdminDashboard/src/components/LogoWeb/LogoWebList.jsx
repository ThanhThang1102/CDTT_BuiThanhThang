import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FcAddImage } from "react-icons/fc";
import { IoIosClose, IoIosSave } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { getData, putData } from "../../utils/api";

const LogoWebList = () => {
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);

  const [imagePreview, setImagePreview] = useState(null);
  const [formFields, setFormFields] = useState({
    images: [],
    type: "",
  });

  const [logoData, setLogoData] = useState(null); // State để lưu logo hiện tại

  // Hàm lấy dữ liệu logo từ API
  const fetchData = async () => {
    try {
      const res = await getData("/api/logoWeb/");
      if (res && res.success) {
        setLogoData(res.data); // Lưu dữ liệu logo vào state
      } else {
        console.log("No logo found");
      }
    } catch (error) {
      console.error("Error fetching logo data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData(); // Lấy logo khi component load
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formFields.images.length === 0) {
      context.setMessage("Vui lòng chọn hình ảnh!");
      context.setTypeMessage("error");
      context.setOpen(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (formFields.images[0]) {
      formData.append("file", formFields.images[0]); // Dùng "file" thay vì "images"
      formData.append("type", formFields.type);
    }

    try {
      const response = await putData("/api/logoWeb/", formData, true);
      if (response.success) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
        setFormFields({ images: [], type: "" });
        setImagePreview(null);
        fetchData(); // Lấy lại dữ liệu logo sau khi cập nhật
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      console.error("Error submitting logo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card shadow my-4 border-0 flex-center p-3">
        <div className="flex items-center justify-between">
          <h1 className="font-weight-bold mb-0">Logo web</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card shadow my-4 border-0 flex-center p-3">
          <h2 className="text-black/55 mb-4 capitalize text-lg">Tải ảnh lên</h2>
          <div className="flex  gap-4 flex-wrap">
            {logoData?.images?.length > 0 && logoData.images[0].url && (
              <div className="imgUploadBoxWrapper">
                <div className="imgUploadBox cursor-pointer overflow-hidden rounded-md duration-300">
                  <img src={logoData.images[0].url} alt="Logo Web" />
                </div>
              </div>
            )}
            {imagePreview ? (
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

            <div className="col-3">
              <div className="form-group mb-0">
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
                    value={formFields.type} // Bind value to formFields.type
                    onChange={(e) =>
                      setFormFields((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    } // Handle change
                  >
                    <MenuItem value="nav">Loại logo</MenuItem>
                    <MenuItem value="logoweb">Logo web</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
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
                  {loading ? "Đang tải..." : "Tải ảnh lên"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogoWebList;
