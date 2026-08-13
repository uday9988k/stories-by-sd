import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
import logo from "./images/logo.png";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <NavLink to="/" onClick={closeMenu}>
          <img src={logo} alt="RVR Productions" className="logo" />
        </NavLink>
        <div className="brand-text">
          <span className="brand-name">STORIES</span>
          <span className="brand-sub">BY SD Satyadeva</span>
        </div>
      </div>

      {/* Hamburger Menu Toggle */}
      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation Links - Only Home & About */}
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            ABOUT
          </NavLink>
        </li>
        <li className="mobile-contact">
          <NavLink
            to="/contact"
            className="contact-btn-mobile"
            onClick={closeMenu}
          >
            CONTACT
          </NavLink>
        </li>
      </ul>

      {/* Contact Button - Desktop */}
      <div className="navbar-action">
        <NavLink to="/contact" className="contact-btn">
          CONTACT
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
