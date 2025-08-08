import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import { Button } from '@mui/material';

const NavTab = ({ index, activeTab, isToggleSubmenu, setActiveTab, submenus, title, iconNav }) => {
  return (
    <li>
      <Button
        className={`w-100 py-2 ${activeTab === index ? "active" : ""}`}
        onClick={() => setActiveTab(index)}
      >
        {iconNav && iconNav}
        <span className="">{title}</span>
        <FaAngleRight
          className={`${activeTab === index && isToggleSubmenu ? "angleIcon" : ""} mr-1 ml-auto size-3`}
        />
      </Button>

      <div
        className={`submenuWrapper ${activeTab === index && isToggleSubmenu ? "colapse" : "colapsed"}`}
      >
        <div className="submenu">
          {submenus.map((submenu, idx) => (
            <Link key={idx} to={submenu.link}>
              <Button className="w-100">{submenu.label}</Button>
            </Link>
          ))}
        </div>
      </div>
    </li>
  );
};

// Khai báo kiểu dữ liệu cho các props
NavTab.propTypes = {
  index: PropTypes.number.isRequired,
  activeTab: PropTypes.number,
  isToggleSubmenu: PropTypes.bool.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  submenus: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  iconNav: PropTypes.element, 
};

export default NavTab;
