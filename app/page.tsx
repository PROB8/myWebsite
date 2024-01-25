'use client';
import React, { useState } from 'react';
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
