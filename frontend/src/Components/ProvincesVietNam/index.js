import { InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ProvincesVietNam = (props) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Fetch danh sách Tỉnh/Thành phố
  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Fetch danh sách Quận/Huyện theo Tỉnh
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts || []);
      setWards([]); // Reset wards khi tỉnh thay đổi
      setSelectedDistrict(""); // Reset lựa chọn quận/huyện
      setSelectedWard(""); // Reset lựa chọn phường/xã
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Fetch danh sách Phường/Xã theo Quận
  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards || []);
      setSelectedWard(""); // Reset lựa chọn phường/xã
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchProvinces(); // Lấy danh sách tỉnh khi load component
  }, []);

  // Xử lý khi chọn Tỉnh/Thành phố
  const handleProvinceChange = (event) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    if (provinceCode) fetchDistricts(provinceCode);
  };

  // Xử lý khi chọn Quận/Huyện
  const handleDistrictChange = (event) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);
    if (districtCode) fetchWards(districtCode);
  };

  // Xử lý khi chọn Phường/Xã
  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };
  return (
    <>
      <div className="col-md-4">
        <div className="form-group">
          <InputLabel id="demo-simple-select-label">
            Tỉnh / thành phố
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={selectedProvince}
            onChange={handleProvinceChange}
            fullWidth
            label="HIHI"
          >
            <MenuItem value="">
              <em>Chọn Tỉnh / Thành phố</em>
            </MenuItem>
            {provinces.map((province) => (
              <MenuItem key={province.code} value={province.code}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <InputLabel id="demo-simple-select-label">Quận / Huyện</InputLabel>
          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedProvince}
            fullWidth
          >
            <MenuItem value="">
              <em>Chọn Quận / Huyện</em>
            </MenuItem>
            {districts.map((district) => (
              <MenuItem key={district.code} value={district.code}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="col-md-4">
        <div className="form-group">
          <InputLabel id="demo-simple-select-label">Phường / Xã</InputLabel>
          <Select
            value={selectedWard}
            onChange={handleWardChange}
            disabled={!selectedDistrict}
            fullWidth
          >
            <MenuItem value="">
              <em>Chọn Phường / Xã</em>
            </MenuItem>
            {wards.map((ward) => (
              <MenuItem key={ward.code} value={ward.code}>
                {ward.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default ProvincesVietNam;
