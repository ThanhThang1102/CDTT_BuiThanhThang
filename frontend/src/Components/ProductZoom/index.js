import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, EffectFade } from "swiper/modules";
import { useRef, useState } from "react";

const ProductZoom = (props) => {
  const zoomSliderRefBig = useRef(null);
  const zoomSliderRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderRef.current.slideTo(index);
    zoomSliderRefBig.current.slideTo(index);
  };

  return (
    <>
      <div className="productZoom position-relative mb-3 productZoomBig">
        <div className="badge badge-primary">{props.discount}%</div>
        <Swiper
          onSwiper={(swiper) => (zoomSliderRefBig.current = swiper)}
          slidesPerView={1}
          spaceBetween={0}
          navigation={false}
          slidesPerGroup={1}
          modules={[Navigation, EffectFade]}
          effect="fade"
          className="zoomSliderBig"
        >
          {props?.images?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <img className="img-fluid" src={item.url} alt={item.name}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Swiper
        onSwiper={(swiper) => (zoomSliderRef.current = swiper)}
        slidesPerView={5}
        spaceBetween={5}
        navigation={false}
        slidesPerGroup={1}
        modules={[Navigation]}
        className="zoomSlider"
      >
        {props?.images?.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className={`item ${slideIndex === index ? "item_active" : ""}`}
            >
              <img
                className="img-fluid"
                src={item.url}
                alt={item.name}
                onClick={() => goto(index)}
                style={{height: '100px'}}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ProductZoom;
