import React, { Fragment, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel";
import Footer from "../../components/Footer/Footer";
import productSaree from "../../Products/Saree/saree1";
import productKurta from "../../Products/Men/menKurta";
import { mensPant } from "../../Products/Pants/mensPant";
import womenTop from "../../Products/Women/womenTop.json";
import womenDress from "../../Products/Women/womenDress.json";
import { shoes } from "../../Products/Shoes/shoes";
import Popup from "../../components/Popup/Popup";
import { useState } from "react";
import { api } from "../../config/api";
import { StopCircleIcon } from "@heroicons/react/24/outline";
import { capitalize, replaceAll } from "../../config/string.js";

function Home() {
  const thirdLevelCategory = [
    "mens_ethnic_set",
    "women_sarees",
    "mens_blazer",
    "women_kurta_salwar",
    "women_jeans",
    "women_heels",
    "mens_formal_shirt",
    "mens_t_shirt",
    "women_jackets",
  ]; //  Third level category
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts([]);

    const fetchProducts = async () => {
      try {
        for (let category of thirdLevelCategory) {
          const response = await api.post(
            "/api/admin/product/get-products-on-query",
            { thirdLevelCategory: category }
          );

          setProducts((prev) => [...prev, response.data.content.content]);
        }
      } catch (error) {}
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroCarousel />
      {products.map((eachProductSet, ind) => {
        let sectionHeading = replaceAll("_", " ", thirdLevelCategory[ind]);
        sectionHeading = capitalize(sectionHeading);

        return (
          <ProductCarousel
            key={ind}
            products={eachProductSet}
            sectionHeading={sectionHeading}
          />
        );
      })}
    </>
  );
}

export default Home;
