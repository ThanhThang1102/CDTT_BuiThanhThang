import Button from "@mui/material/Button";
import { FaAngleDown } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {
  const [isOpenModal, setisOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [countryList, setcountryList] = useState([]);
  const [filteredCountryList, setFilteredCountryList] = useState([]);

  const context = useContext(MyContext);

  const selectCountry = (index, country) => {
    setSelectedTab(index);
    setisOpenModal(false);
    context.setSelectedCountry(country);
  };

  useEffect(() => {
    setcountryList(context.countryList);
    setFilteredCountryList(context.countryList);
  }, [context.countryList]);

  const fillterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword !== "") {
      const list = countryList.filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });
      setFilteredCountryList(list);
    } else {
      setFilteredCountryList(countryList);
    }
  };

  return (
    <>
      <Button className="countryDrop" onClick={() => setisOpenModal(true)}>
        <div className="info d-flex flex-column">
          <span className="lable">Your Location</span>
          <span className="name">
            {context.selectedCountry !== ""
              ? context.selectedCountry.length > 15
                ? context.selectedCountry.substring(0, 15) + "..."
                : context.selectedCountry
              : "Select Location"}
          </span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>
      <Dialog
        className="localtionModal"
        open={isOpenModal}
        onClose={() => setisOpenModal(false)}
      >
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your address and we will specify the offer for your area.</p>
        <Button className="close_country" onClick={() => setisOpenModal(false)}>
          <IoMdClose />
        </Button>
        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="Search for area..."
            onChange={fillterList}
          />
          <Button>
            <IoIosSearch />
          </Button>
        </div>
        <ul className="countryList mt-3">
          {filteredCountryList.length !== 0 ? (
            filteredCountryList.map((item, index) => {
              return (
                <li key={index}>
                  <Button
                    onClick={() => selectCountry(index, item.country)}
                    className={`${selectedTab === index ? "active" : ""}`}
                  >
                    {item.country}
                  </Button>
                </li>
              );
            })
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
