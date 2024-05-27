import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/img/logo.png"

const Header = () => {

  const navigate = useNavigate();

  const logout =  () => {

    localStorage.removeItem("fake_token");
    navigate("/login");

  };

  return (
    <header className='header'>
      <div className="header_web">
        <div className="header_web_left">
          <div className="logo">
            <img src={Logo} alt="logo"/>
          </div>
        </div>
        {localStorage.getItem("fake_token") && (
          <div className="header_web_right">
              <Link to={"/"}>
                Ana Sayfa
              </Link>
              <div className="logout" onClick={logout}>
                  Log Out
              </div>
            </div>
          )}
      </div>
    </header>
  )
}

export default Header