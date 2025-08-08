import { IoSearchOutline } from "react-icons/io5";

const SearchBox = () => {
  return (
    <>
      <div className="searchBox w-[300px] h-[40px] relative">
        <IoSearchOutline className="searchIconHeader" />
        <input
          type="text"
          className="w-[100%] h-[100%] px-10 cursor-pointer"
          placeholder="Search here..."
        />
      </div>
    </>
  );
};

export default SearchBox;
