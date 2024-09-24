import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import actions from "../../actions";
import banners from "./banners.json";
import CarouselSlider from "../../components/Common/CarouselSlider";
import { responsiveOneItemCarousel } from "../../components/Common/CarouselSlider/utils";
import { COMPANY_NAME, CONTACT_PHONE } from "../../constants";

class Homepage extends React.PureComponent {
  render() {
    return (
      <div className="homepage">
        <Row className="flex-row">
          <Col xs="12" lg="6" className="order-lg-2 mb-3 px-3 px-md-2">
            <div className="home-carousel">
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
          <Col xs="12" lg="3" className="order-lg-1 mb-3 px-3 px-md-2">
            <div className="d-flex flex-column h-100 justify-content-between">
              <img src="/images/banners/banner-metal-1.jpg" className="mb-3" />
              <img src="/images/banners/banner-5.jpg" />
            </div>
          </Col>
          <Col xs="12" lg="3" className="order-lg-3 mb-3 px-3 px-md-2">
            <div className="d-flex flex-column h-100 justify-content-between">
              <img src="/images/banners/banner-metal-2.jpg" className="mb-3" />
              <img src="/images/banners/banner-6.jpg" />
            </div>
          </Col>
        </Row>

        <Row className="flex-row">
          <Col
            xs="12"
            md="6"
            lg="4"
            className="order-lg-2 mb-3 px-3 px-md-2 mx-auto text-center"
          >
            <img src="/images/mmlogo-sunburst.jpg" alt="MM" />
            <img src="/images/mm-name.gif" alt={COMPANY_NAME} />
          </Col>
          <Col xs="12" className="order-lg-2 mb-3 px-3 px-md-2 text-center">
            <h1>“Your One Stop Roller-Lock Shop”</h1>
            <h2 className="text-danger">{CONTACT_PHONE}</h2>
          </Col>
          <Col xs="12" className="order-lg-2 mb-3 px-3 px-md-2 text-center">
            <h2>
              {COMPANY_NAME} (MM) Specializes in Firearms Based On the HK*
              Recoil Operated and Delayed Roller Lock Bolt System. MM is a Class
              2 Manufacture and NFA Dealer. MM's focus is on custom belt-fed
              rifles in 5.56 and 7.62 NATO calibers. {COMPANY_NAME} manufactures
              a full line of HK* style rifles, parts and accessories.
            </h2>
          </Col>
          <Col xs="12" className="order-lg-2 mb-3 px-3 px-md-2 text-center">
            <h3>* HK is a registered trademark of Heckler and Koch</h3>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
