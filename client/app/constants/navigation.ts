import { faBook, faChartColumn, faCreditCard, faExternalLink, faHome, faMagnifyingGlassChart, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";


export const dashboardLinks: NavItem[] = [
  { name: 'Analyse', link: '/dashboard', icon: faMagnifyingGlassChart },
  { name: 'Charts', link: '/dashboard/charts', icon: faChartColumn, newPage: true },
  // { name: 'Journal', link: '/dashboard/journal', icon: faBook },

];
  
  export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Support', link: '/#support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/#pricing', icon: faCreditCard},
    { name: 'Guide', link: '/guide', icon: faExternalLink, newPage: true},
    { name: 'Terms', link: '/terms', icon: faExternalLink, newPage: true},
    { name: 'License', link: '/license', icon: faExternalLink, newPage: true},
    { name: 'Privacy Policy', link: '/privacy', icon: faExternalLink, newPage: true},
  ];

  export const footerLinks = navLinks.filter(footerLink => !['Home', 'Pricing'].includes(footerLink.name))

  