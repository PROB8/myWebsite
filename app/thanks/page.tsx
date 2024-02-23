'use client';
import Footer from 'components/Footer/Footer';
import '../globals.css';
import ThanksView from '@/components/PaymentResponseMessage/ThanksView';

export default function Thanks(): JSX.Element {
  return (
    <>
      <ThanksView />
      <Footer />
    </>
  );
}
