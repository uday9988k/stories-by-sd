import Logo from "./images/logo.png";
import { FaInstagram, FaThreads, FaWhatsapp } from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer_footer">
      <div className="container_footer">
        <img src={Logo} alt="RVR PRO" className="logo_footer" />

        <div className="social_footer">
          <a
            className="anchor_footer"
            href="https://www.instagram.com/itz__uday______?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>

          <a
            className="anchor_footer"
            href="https://www.threads.com/@itz__uday______?xmt=AQG0_vTMyfkoDGTYDwsFZUFWnIXcFqn5BzG_SZEdOM1yCWU"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaThreads />
          </a>

          <a
            className="anchor_footer"
            href="https://wa.me/918328339382"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        </div>

        <div className="links_footer">
          <a className="link_footer" href="/OurStories">
            Our Stories
          </a>
          <a className="link_footer" href="/contact">
            Contact Us
          </a>
        </div>

        <div className="bottom_footer">
          <p className="copyright_footer">
            © {new Date().getFullYear()} Stories By SD. All Rights Reserved.
          </p>

          <button
            className="button_footer"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
