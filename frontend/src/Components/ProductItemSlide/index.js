import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";
import { useState } from "react";
import { useEffect } from "react";
const ProductItemSlide = (props) => {
  const [dataFeatured, setDataFeatured] = useState([]);
  useEffect(() => {
    setDataFeatured(props.dataFeatured);
  }, [props.dataFeatured]);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {dataFeatured?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <ProductItem item={item} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default ProductItemSlide;
