import { faBookJournalWhills, faChartBar, faChartColumn, faCreditCard, faHome, faInfoCircle, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "../types";


export const dashboardLinks: NavItem[] = [
  { name: 'Charts', link: '/dashboard/charts', icon: faChartColumn, newPage: true },
  { name: 'Journal', link: '/dashboard/journal', icon: faBookJournalWhills },

];
  
  export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Support', link: '/support', icon: faQuestionCircle},
    { name: 'Guidelines', link: '/guide', icon: faInfoCircle},
    { name: 'Pricing', link: '/#pricing', icon: faCreditCard},
    { name: 'Terms', link: '/terms'},
    { name: 'License', link: '/license'},
    { name: 'Privacy Policy', link: '/privacy'},
  ];
  