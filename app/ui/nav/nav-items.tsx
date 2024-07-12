import Link from "next/link";
import React from "react";
import {NavItem, NavItemsProps} from '@/app/types';


export const NavItems = ({ navItems }: NavItemsProps) => {
  return (
    <>
      {navItems.map((navItem, index) => {
        return (
          <Link key={index.toString()} href={navItem.link}>
            {navItem.name}
          </Link>
        );
      })}
    </>
  );
};
