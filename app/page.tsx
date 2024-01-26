'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import AboutMe from '@/components/AboutMe/AboutMe';
import Footer from '@/components/Footer/Footer';
import ContactForm from '@/components/ContactForm/ContactForm';
import useInfoLog from '@/hooks/useInfoLog';
import MyWork from '@/components/MyWork/MyWork';
import Script from 'next/script';
import Donate from '@/components/Donate/Donate';
import ReturnArrow from '@/components/ReturnArrow/ReturnArrow';
import ArticleTileView from '@/components/ArticleTileView/ArticleTileView';
import ShoppingCartIcon from '@/components/ShoppingCartIcon/ShoppingCartIcon';

export default function Home() {
  useInfoLog();
  // useEffect(() => {
  //   if (window.particlesJS) {
  //     window.particlesJS('particles-js',{"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":5,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":3,"direction":"none","random":false,"straight":false,"out_mode":"out","attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true,"config_demo":{"hide_card":false,"background_color":"#b61924","background_image":"","background_position":"50% 50%","background_repeat":"no-repeat","background_size":"cover"}});
  //   }
  // }, [])
  const [whichSection, setWhichSection] = useState('');
  const Section = (): JSX.Element | null => {
    switch (whichSection) {
      case 'aboutMe':
        return <AboutMe />;
      case 'contact':
        return <ContactForm />;
      case 'myWork':
        return <MyWork />;
      case 'donate':
        return <Donate />;
      case 'articles':
        return <ArticleTileView />;
      default:
        return <div />;
    }
  };

  return (
    <div className={styles.root}>
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-00FHGBS0KW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-00FHGBS0KW');
          `}
      </Script>
      <div id="particles-js" className="particles" />
      <Header setWhichSection={setWhichSection} />
      <ShoppingCartIcon />
      <Section />
      <Footer />
      <ReturnArrow />
    </div>
  );
}
