import React, { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect } from "react";

const HomeCatSilde = (props) => {
  const [dataCat, setDataCat] = useState([]);

  useEffect(() => {
    setDataCat(props.dataCat);
  }, [props.dataCat]);

  const [itemBackground, setItemBackground] = useState([
    "#fffceb",
    "#ecffec",
    "#feefea",
    "#fff3ff",
    "#f2fce4",
    "#feefea",
    "#ecffec",
    "#feefea",
    "#fffceb",
    "#ecffec",
    "#feefea",
    "#fff3ff",
  ]);

  return (
    <>
      <section className="homeCatSilde">
        <div className="container">
          <h3 className="mb-3 hd">Danh mục</h3>
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            modules={[Autoplay]}
            className="mySwiper"
            style={{padding: '10px'}}
          >
            {dataCat?.map((item, index) => {
              return (
                <SwiperSlide key={index} className="shadow-sm">
                  <div
                    className="item text-center"
                    style={{ background: item.color }}
                  >
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      style={{ height: "200px", borderRadius: "5px", objectFit: "cover" }}
                    />
                    <h6>{item.name}</h6>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default HomeCatSilde;
