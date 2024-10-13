import { faBookJournalWhills, faChartColumn, faCreditCard, faExternalLink, faHome, faQuestionCircle, } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";


export const dashboardLinks: NavItem[] = [
  { name: 'Charts', link: '/dashboard/charts', icon: faChartColumn, newPage: true },
  { name: 'Journal', link: '/dashboard/journal', icon: faBookJournalWhills },

];
  
  export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Pricing', link: '/#pricing', icon: faCreditCard},
    { name: 'Guidelines', link: '/guide', icon: faExternalLink, newPage: true},
    { name: 'Terms', link: '/terms', icon: faExternalLink, newPage: true},
    { name: 'License', link: '/license', icon: faExternalLink, newPage: true},
    { name: 'Privacy Policy', link: '/privacy', icon: faExternalLink, newPage: true},
  ];
  