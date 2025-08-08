import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Button } from "@mui/material";
import { IoIosSave } from "react-icons/io";
import { getData, postData } from "../../utils/api";
import LinearProgress from "@mui/material/LinearProgress";
import { MyContext } from "../../App";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SubCategoryCreate = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCategory: "",
  });
  const [dataCat, setDataCat] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getData("/api/category"); // Đảm bảo endpoint đúng
      if (res.success) {
        setDataCat(res.categories || []);
        console.log(res);
      } else {
        setDataCat([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const addSubCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    window.scrollTo(0, 0);
    console.log("formfield", formFields);

    try {
      const response = await postData("/api/subcategory/create", formFields);
      if (response.success === true) {
        context.setMessage(response.message);
        context.setTypeMessage(response.type || "success");
        context.setOpen(true);
        navigate("/subcategory/list");
      } else {
        context.setMessage(response.message || response.error.message);
        context.setTypeMessage(response.type || "error");
        context.setOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      context.setOpen(true);
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LinearProgress />}
      <form onSubmit={addSubCategory}>
        <div className="row">
          <div className="col-6">
            <div className="card shadow border-0 flex-center p-3">
              <h2 className="text-black mb-4 capitalize text-lg">
                Tạo danh mục phụ
              </h2>
              <div className="form-group">
                <label htmlFor="parentCategory">Danh mục cha</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-required-label">
                    Danh mục cha
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={formFields.parentCategory}
                    label="Danh mục cha"
                    onChange={onChangeInput}
                    name="parentCategory"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {dataCat.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group">
                <label htmlFor="name">Tên danh mục phụ</label>
                <TextField
                  id="name"
                  name="name"
                  label="Danh mục phụ"
                  type="text"
                  variant="outlined"
                  fullWidth
                  placeholder="Ví dụ: Giày thể thao + Giày leo núi"
                  onChange={onChangeInput}
                  value={formFields.name}
                />
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
                      Tạo danh mục phụ
                    </span>
                  </Button>
                  <Link to="/subcategory/list">
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
          </div>
        </div>
      </form>
    </>
  );
};

export default SubCategoryCreate;
