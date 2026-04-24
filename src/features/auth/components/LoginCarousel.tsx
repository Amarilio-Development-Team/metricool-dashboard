'use client';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { allImages } from '@/assets/login-carousel';
import 'swiper/css';
import 'swiper/css/autoplay';
import React from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@/core/hooks/useMediaQuery';

const LoginCarousel: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Swiper modules={[A11y, Autoplay]} slidesPerView={1} autoplay={{ delay: 8500 }} speed={1200} loop className="relative h-full w-full">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-30 h-full w-full bg-black/55"></div>

      <article className={`bottom-0 left-0 right-0 top-0 z-50 h-full flex-col justify-around px-14 ${isDesktop ? 'absolute flex' : 'hidden'}`}>
        <h2 className="font-principal-semibold w-full max-w-[650px] text-3xl font-extralight text-white xl:text-4xl 2xl:text-5xl 2xl:leading-tight">
          Toma el control de tu <span className="text-primary-500 font-medium text-primary">estrategia digital</span>
        </h2>

        <p className="max-w-[500px] text-lg font-extralight leading-relaxed text-gray-200 lg:text-xl xl:text-2xl">
          Visualiza el impacto real de tu marca en
          <span className="bg-gradient-to-r from-[#FE2C55] via-[#FBBC05] to-[#34A853] bg-clip-text font-semibold text-transparent"> Google</span>,
          <span className="bg-gradient-to-r from-[#0064e0] to-[#0668E1] bg-clip-text font-semibold text-transparent"> Meta</span> y
          <span className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] bg-clip-text font-semibold text-transparent"> TikTok</span> desde un solo lugar.
        </p>
      </article>

      {allImages.map((image, index) => (
        <SwiperSlide key={index}>
          <Image src={image} className="min-h-full w-full object-cover" alt="Imagen de fondo" width={1920} height={1080} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default React.memo(LoginCarousel);
