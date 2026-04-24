import NavbarLogoutButton from './NavbarLogoutButton';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import Image from 'next/image';
import USER_PROFILE from '@/assets/amelia.jpg';

export default async function Navbar() {
  return (
    <nav className="main-container-color navbar sticky top-0 z-[99999] h-[80px] w-full justify-between py-6 shadow-sm">
      <div className="container mx-auto w-full max-w-[1440px]">
        <div className="flex flex-1 items-center gap-2">
          <Link href="/" className="btn btn-circle grid size-12 place-items-center rounded-full border border-white/20">
            <Image src="https://static.metricool.com/brand-logo/202504/4418854-file-16961997889540799233.com-brand-facebook-page-image" className="rounded-full" alt="Logo" width={50} height={50} />
          </Link>
          <span className="text-medium hidden font-bold sm:block">Maderas gavilán</span>
        </div>

        <div className="center flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="hover:container-color-hover group avatar btn btn-circle grid size-12 place-items-center rounded-full border border-white/20 hover:opacity-90">
                <Image src={USER_PROFILE} className="rounded-full" alt="Logo" width={50} height={50} />
              </div>
              <ul tabIndex={0} className="z-99999 menu dropdown-content menu-sm mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                <li>
                  <Link href="/administracion/mi-perfil" className="justify-between">
                    Perfil
                  </Link>
                </li>
                <li>
                  <a className="justify-between">Ajustes</a>
                </li>
                <li>
                  <NavbarLogoutButton />
                </li>
              </ul>
            </div>
            <span className="text-medium hidden text-sm font-medium sm:block">Andrea Medina</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
