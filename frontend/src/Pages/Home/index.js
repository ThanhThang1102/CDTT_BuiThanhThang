import HomeBanner from "../../Components/HomeBanner";
import Button from "@mui/material/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import React from "react";
import { useContext } from "react";

import ProductItemSlide from "../../Components/ProductItemSlide";
import HomeCatSilde from "../../Components/HomeCatSlide";
import ProductItem from "../../Components/ProductItem";
import { IoMailOutline } from "react-icons/io5";

import banner3 from "../../assets/images/banner3.jpg";
import banner4 from "../../assets/images/banner4.jpg";
import coupons from "../../assets/images/coupons.png";
import { useEffect } from "react";
import { getData } from "../../utils/api";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const context = useContext(MyContext);
  const [dataFeatured, setDataFeatured] = useState([]);
  const [dataNewProduct, setDataNewProduct] = useState([]);
  const [valueFeatured, setValueFeatured] = useState(0);
  const [valueNew, setValueNew] = useState(0);

  const handleChange = (envent, newValue) => {
    setValueFeatured(newValue);
  };
  const handleChangeNew = (envent, newValue) => {
    setValueNew(newValue);
  };

  useEffect(() => {
    context.setLoading(true);
    const fetchInitialData = async () => {
      // Lấy sản phẩm nổi bật khi thay đổi `valueFeatured`
      const selectedCategoryId =
        valueFeatured === 0
          ? ""
          : context.categoryData?.[valueFeatured - 1]?.id;
      const [featuredRes] = await Promise.all([
        getData(`/api/products/featured?perPage=8&idCat=${selectedCategoryId}`),
      ]);
      const selectedCategoryIdNew =
        valueNew === 0 ? "" : context.categoryData?.[valueNew - 1]?.id;
      const [newProductRes] = await Promise.all([
        getData(`/api/products/new?perPage=8&idCat=${selectedCategoryIdNew}`),
      ]);

      setDataFeatured(featuredRes.products);
      setDataNewProduct(newProductRes.products);
    };

    fetchInitialData();
    context.setLoading(false);
  }, [valueFeatured, valueNew, context.categoryData, context]);

  return (
    <>
      {context.loading ? (
        <div className="text-center w-100">
          <CircularProgress className="" />
        </div>
      ) : (
        <div>
          <HomeBanner />
          {context.categoryData?.length !== 0 ? (
            <HomeCatSilde dataCat={context.categoryData} />
          ) : (
            <div>Không có dữ liệu!</div>
          )}
          <section className="homeProducts">
            <div className="container">
              <div className="row">
                <div className="col-md-12 productRow">
                  {/* BESTSELLERS */}
                  <div className="d-flex align-items-center">
                    <div className="info">
                      <h3 className="mb-0 hd">Sản phẩm nổi bật</h3>
                      <p className="text-title mb-0 mt-1 text-danger">
                        Đừng bỏ lỡ các ưu đãi hiện tại bạn nhé...!
                      </p>
                    </div>

                    <Box
                      sx={{
                        maxWidth: { xs: 320, sm: 480 },
                        bgcolor: "background.paper",
                      }}
                      className="ml-auto"
                    >
                      <Tabs
                        value={valueFeatured}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                        className="filterTabs"
                      >
                        {/* Tab "All" */}
                        <Tab key="all" className="item" label="Tất cả" />
                        {context.categoryData?.map((item, index) => (
                          <Tab
                            key={item.id}
                            className="item"
                            label={item.name}
                          />
                        ))}
                      </Tabs>
                    </Box>
                  </div>

                  <div className="product_row w-100 mt-4">
                    {dataFeatured?.length !== 0 ? (
                      <ProductItemSlide dataFeatured={dataFeatured} />
                    ) : (
                      <div>Không có dữ liệu!</div>
                    )}
                  </div>
                  {/* BESTSELLERS END*/}

                  {/* NEW PRODUCTS */}
                  <div className="d-flex align-items-center mt-5">
                    <div className="info">
                      <h3 className="mb-0 hd">Sản phẩm mới</h3>
                      <p className="text-title mb-0 mt-1 text-danger">
                        Sản phẩm mới ưu đãi mới bạn ơi...!
                      </p>
                    </div>
                    <Box
                      sx={{
                        maxWidth: { xs: 320, sm: 480 },
                        bgcolor: "background.paper",
                      }}
                      className="ml-auto"
                    >
                      <Tabs
                        value={valueNew}
                        onChange={handleChangeNew}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                        className="filterTabs"
                      >
                        {/* Tab "All" */}
                        <Tab key="all" className="item" label="Tất cả" />
                        {context.categoryData?.map((item, index) => (
                          <Tab
                            key={item.id}
                            className="item"
                            label={item.name}
                          />
                        ))}
                      </Tabs>
                    </Box>
                  </div>

                  <div className="product_row productWrap w-100 mt-4">
                    {dataNewProduct?.length !== 0 &&
                      dataNewProduct?.map((item, index) => (
                        <ProductItem key={index} item={item} />
                      ))}

                    {dataNewProduct?.length === 0 && (
                      <div>Không có dữ liệu!</div>
                    )}
                  </div>
                  {/* NEW PRODUCTS END */}
                  
                </div>
              </div>
            </div>
          </section>
          {/* <section className="newLetterSection mb-3 mt-3 d-flex align-items-center">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p className="text-white text-discount mb-1">
                    $20 discount for your first order
                  </p>
                  <h2 className="text-white mb-2">Join Our Newsletter</h2>
                  <p className="text-light text-subscription mb-4">
                    Join our email subscription now to get updates on <br />{" "}
                    promotions and coupons.
                  </p>

                  <form>
                    <IoMailOutline />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      required
                    />
                    <Button>Subscribe</Button>
                  </form>
                </div>
                <div className="col-md-6">
                  <img src={coupons} alt="" />
                </div>
              </div>
            </div>
          </section> */}
        </div>
      )}
    </>
  );
};

export default Home;
