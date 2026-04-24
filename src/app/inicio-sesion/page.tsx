import LoginCarousel from '@/features/auth/components/LoginCarousel';
import React from 'react';
import AuthForm from '@/features/auth/components/AuthForm';
import MobileChangeThemeWrapper from '@/core/components/MobileChangeThemeWrapper';
import Image from 'next/image';
import AMARILIO_LOGO from '@/assets/amarilio.png';

const InicioSesion: React.FC = () => {
  return (
    <MobileChangeThemeWrapper>
      <section className="relative z-10 grid min-h-full w-full place-items-center overflow-y-scroll px-4 pb-[80px] pt-[120px] lg:main-container-color lg:w-6/12 xl:w-5/12 2xl:w-4/12">
        <div className="mx-auto flex w-full max-w-[430px] flex-col gap-8">
          <header>
            <h1 className="text-strong text-[26px] font-medium md:text-[30px] xl:text-[35px]">Bienvenido de nuevo</h1>
            <span className="text-placeholder text-sm md:text-[16px]">Inicia sesión en tu cuenta</span>
          </header>

          <AuthForm isSignIn={true} />

          <article className="mx-auto mt-12 w-max rounded-xl bg-white/50 p-1.5 backdrop-blur-lg">
            <Image src={AMARILIO_LOGO} alt="Powered by Amarilio" className="mx-auto h-auto w-full max-w-[120px] object-scale-down lg:max-w-[150px]" width={200} />
          </article>
        </div>
      </section>

      <section className="hidden min-h-full w-full lg:block lg:w-6/12 xl:w-7/12 2xl:w-8/12">
        <LoginCarousel />
      </section>

      <section className="absolute left-0 top-0 h-full w-full lg:hidden">
        <LoginCarousel />
      </section>
    </MobileChangeThemeWrapper>
  );
};

export default InicioSesion;
