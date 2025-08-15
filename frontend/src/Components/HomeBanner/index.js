import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { useState } from "react";
import { getData } from "../../utils/api";
import { useEffect } from "react";
const HomeBanner = () => {
  const [dataSlides, setDataSlides] = useState([]);

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

  return (
    <>
      <div className="container" style={{ marginTop: "230px" }}>
        <div className="homeBannerSection mt-4">
          <Swiper
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            spaceBetween={15}
            loop={true}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="mySwiper"
          >
            {dataSlides?.map((slide, index) => {
              return (
                <>
                  <SwiperSlide key={index}>
                    <div className="item">
                      <img
                        src={slide.images[0].url}
                        alt={slide.images[0].url}
                        className="w-100"
                        style={{ height: "369px" }}
                      />
                    </div>
                  </SwiperSlide>
                </>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
