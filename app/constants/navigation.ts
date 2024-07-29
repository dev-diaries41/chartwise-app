import { faCreditCard, faHome, faQuestionCircle, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";

export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
  ];
  
  export const footerLinks: NavItem[] = [
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/#pricing', icon: faCreditCard},
    { name: 'Terms', link: '/terms'},
    { name: 'License', link: '/license'},
    { name: 'Privacy Policy', link: '/privacy'},
  ];
  

  export const headerLinks: NavItem[] = [
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/#pricing', icon: faCreditCard},
  ];

  export const accountNav: NavItem[] = [
    { name: 'Usage', link: '/account', icon: faUser},
    { name: 'Sign out', link: '/api/auth/logout', icon: faSignOut},
  ];
  

  
  