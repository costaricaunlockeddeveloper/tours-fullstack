import Link from 'next/link';
import DropDown from './DropDown';

export default function Nav({ setMobileToggle }: { setMobileToggle: any }) {
  return (
    <ul className="cs_nav_list fw-medium">
      <li>
        <Link href="/">Home</Link>
      </li>

      <li>
        <Link href="/about" onClick={() => setMobileToggle(false)}>
        About Us
        </Link>
      </li>

      <li className="menu-item-has-children">
        <Link href="/destination" onClick={() => setMobileToggle(false)}>
        Destination
        </Link>
        <DropDown>
          <ul>
            <li>
              <Link href="/destination" onClick={() => setMobileToggle(false)}>
              Destination
              </Link>
            </li>
            <li>
              <Link href="/destination/destination-details" onClick={() => setMobileToggle(false)}>
              Destination Details
              </Link>
            </li>
          </ul>
        </DropDown>
      </li>

      <li className="menu-item-has-children">
        <Link href="/tour" onClick={() => setMobileToggle(false)}>
        Tour
        </Link>
        <DropDown>
          <ul>
            <li>
              <Link href="/tour" onClick={() => setMobileToggle(false)}>
              Tour
              </Link>
            </li>          
            <li>
              <Link href="/tour/tour-details" onClick={() => setMobileToggle(false)}>
              Tour Details
              </Link>
            </li>
          </ul>
        </DropDown>
      </li> 
      
      <li className="menu-item-has-children">
        <Link href="/tour-packages" onClick={() => setMobileToggle(false)}>
        Packages
        </Link>
        <DropDown>
          <ul>
            <li>
              <Link href="/tour-packages" onClick={() => setMobileToggle(false)}>
              Tour Packages
              </Link>
            </li>          
            <li>
              <Link href="/tour-packages/tour-packages-details" onClick={() => setMobileToggle(false)}>
              Package Details
              </Link>
            </li>
          </ul>
        </DropDown>
      </li> 
      
      <li>
        <Link href="/contact" onClick={() => setMobileToggle(false)}>
          Contact
        </Link>
      </li>
      <li className="cs_mobile_only p-3 pt-0 d-xl-none">
        <div className="d-flex flex-column gap-2">
          <Link href="/login" className='theme-btn py-2 px-4 w-100 text-center' onClick={() => setMobileToggle(false)}>
            <span>Login</span>
          </Link>
        </div>
      </li>
    </ul>
  );
}
