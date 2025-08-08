import { useEffect } from "react";

const SnowFlakes = () => {
  useEffect(() => {
    createSnowflakes();
  }, []);

  const createSnowflakes = () => {
    const snowContainer = document.querySelector(".snow-container");
    for (let i = 0; i < 70; i++) {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`; // Tạo thời gian rơi từ 5 đến 15 giây
      snowflake.style.opacity = `${Math.random()}`;
      snowflake.addEventListener("animationend", () => {
        snowflake.remove(); // Xóa hạt tuyết sau khi rơi xong
      });
      snowContainer.appendChild(snowflake);
    }
  };

  return (
    <>
      <div className="snow-container"></div>
    </>
  );
};

export default SnowFlakes;
