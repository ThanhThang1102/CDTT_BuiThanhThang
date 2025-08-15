import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from "../../../App";
import CircularProgress from "@mui/material/CircularProgress";

const Navigation = () => {
  const [isOpenSibarVal, setIsOpenSidebarNav] = useState(false);
  const context = useContext(MyContext);

  return (
    <>
      <nav>
        <div className="container">
          <div className="row">
            {/* Navigation ALL CATEGORY */}
            <div className="col-sm-2 navPart1">
              <div className="catWrapper">
                <Button
                  className="allCatTab align-items-center"
                  onClick={() => setIsOpenSidebarNav(!isOpenSibarVal)}
                >
                  <span className="icon1 mr-2">
                    <IoIosMenu />
                  </span>
                  <span className="text">Danh mục</span>
                  <span className="icon2 ml-2">
                    <FaAngleDown />
                  </span>
                </Button>

                <div
                  className={`sidebarNav ${
                    isOpenSibarVal === true ? "open" : ""
                  }`}
                >
                  <ul>
                    {context.categoryData
                      ?.filter((category) => category.type === "nav")
                      .map((category) => {
                        const matchedSubCategories =
                          context.subCategoryData?.filter(
                            (subCategory) =>
                              subCategory.parentCategory.id === category.id
                          );
                        return (
                          <li key={category.id}>
                            <Link to={`/cat/${category.id}` || `/${category.link}`}>
                              <Button>
                                {category.name}{" "}
                                {matchedSubCategories.length > 0 && (
                                  <FaAngleRight className="ml-auto" />
                                )}
                              </Button>
                            </Link>
                            {/* Hiển thị danh mục con nếu có */}
                            {matchedSubCategories?.length > 0 && (
                              <div className="submenu">
                                {matchedSubCategories.map((subCategory) => (
                                  <Link
                                    to={`/cat/${subCategory.id}` || `/${subCategory.link}`}
                                    key={subCategory.id}
                                  >
                                    <Button>{subCategory.name}</Button>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
            {/* Navigation ALL CATEGORY */}

            {/* Navigation HEADER ON MENU*/}
            <div className="col-sm-10 navPart2 d-flex align-items-center">
              <ul className="list list-inline ml-auto">
                <li className="list-inline-item">
                  <Link to="/">
                    <Button>Trang chủ</Button>
                  </Link>
                </li>
                {context.categoryData
                  ?.filter((category) => category.type === "menu")
                  .map((category) => {
                    // Tìm các subcategory khớp với category
                    const matchedSubCategories =
                      context.subCategoryData?.filter(
                        (subCategory) =>
                          subCategory.parentCategory.id === category.id
                      );

                    return (
                      <li className="list-inline-item" key={category.id}>
                        <Link to={`/cat/${category.id}` || `/${category.link}`}>
                          <Button>{category.name}</Button>
                        </Link>
                        {/* Kiểm tra và hiển thị subcategory */}
                        {matchedSubCategories?.length > 0 ? (
                          <div className="submenu shadow">
                            {matchedSubCategories.map((subCategory) => (
                              <Link
                                to={`/cat/${subCategory.id}` || `/${subCategory.link}`}
                                key={subCategory.id}
                              >
                                <Button>{subCategory.name}</Button>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                {/* <li className="list-inline-item">
                  <Link to="/blog">
                    <Button>Blog</Button>
                  </Link>
                </li> */}
                <li className="list-inline-item">
                  <Link to="/contact">
                    <Button>Liên hệ</Button>
                  </Link>
                </li>
              </ul>
            </div>
            {/* Navigation HEADER END*/}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
