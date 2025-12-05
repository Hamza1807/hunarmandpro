import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Categories from '../components/Categories/Categories';
import Footer from '../components/Footer/Footer';
import './IndexPage.css';

const IndexPage = () => {
  return (
    <div className="index-page">
      <Header />
      <Hero />
      <Categories />
      <Footer />
    </div>
  );
};

export default IndexPage;
