import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";

import Newsletter from "../../../containers/Newsletter";
import { COMPANY_NAME, COMPANY_START_YEAR } from "../../../constants";

const Footer = () => {
  const yearNow = new Date().getFullYear();
  const serviceLinks = [
    { id: 0, name: "Products", to: "/shop" },
    { id: 1, name: "Brands", to: "/brands" },
    { id: 2, name: "Shipping", to: "/shipping" }
  ];
  const contactLinks = [
    { id: 0, name: "Contact Us", to: "/contact" },
    { id: 1, name: "Sell With Us", to: "/sell" }
  ];
  const bizLinks = [
    { id: 0, name: "Account Details", to: "/dashboard" },
    { id: 1, name: "Orders", to: "/dashboard/orders" }
  ];

  const footerServiceLinks = serviceLinks.map((item) => (
    <li key={item.id} className="footer-link">
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));
  const footerContactLinks = contactLinks.map((item) => (
    <li key={item.id} className="footer-link">
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-block">
            <div className="block-title">
              <h3 className="text-uppercase">Services</h3>
            </div>
            <div className="block-content">
              <ul>{footerServiceLinks}</ul>
            </div>
          </div>
          <div className="footer-block">
            <div className="block-title">
              <h3 className="text-uppercase">Contacts</h3>
            </div>
            <div className="block-content">
              <ul>{footerContactLinks}</ul>
            </div>
          </div>
          <div className="footer-block">
            <div className="block-title">
              <h3 className="text-uppercase">News</h3>
              <Newsletter />
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <span>
            © {COMPANY_START_YEAR} - {yearNow} {COMPANY_NAME}
            <br />
            All Right Reserved.
          </span>
        </div>
        <ul className="footer-social-item">
          <li>
            <a
              href="https://www.facebook.com/MichaelsMachines"
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="facebook-icon" title="Facebook" />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/MichaelsMachines"
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="twitterx-icon" title="X (Twitter)" />
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
};

export default Footer;
