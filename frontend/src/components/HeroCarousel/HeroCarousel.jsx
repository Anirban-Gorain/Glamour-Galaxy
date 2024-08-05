import React from "react";
import { CCarousel, CCarouselItem } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import carouselImagesPath from "./carouselImagesPath";

function HeroCarousel() {
  return (
    // <img src={path} alt="Not visible" />
    <CCarousel controls indicators dark interval={2000}>
      {carouselImagesPath.map((elem, index) => (
        <CCarouselItem key={index}>
          <img height={"auto"} src={elem.path} width={"100%"} effect="blur" />
        </CCarouselItem>
      ))}
    </CCarousel>
  );
}

export default HeroCarousel;
