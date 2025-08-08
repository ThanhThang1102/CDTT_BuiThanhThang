import PropTypes from "prop-types";

const UserImage = (props) => {
  return (
    <>
      <span className="userImage flex w-[55px] h-[55px] mr-1 overflow-hidden cursor-pointer">
        <img
          src={props.avatar}
          alt="myacc"
          className="img-fluid"
        />
      </span>
    </>
  );
};

// Khai báo kiểu dữ liệu cho các props
UserImage.propTypes = {
  avatar: PropTypes.string.isRequired,
};

export default UserImage;
