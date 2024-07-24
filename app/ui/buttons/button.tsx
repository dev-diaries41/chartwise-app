'use client'
import Link from "next/link";
import React from 'react';
import { useFormStatus } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { AnchorProps, ButtonProps } from "@/app/types";


export const Button= ({ 
  children,
  icon,
  className = `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`, 
  ...props
}: ButtonProps) => {
  return (
    <button
      className={className}
      {...props}
    >
      {icon && <FontAwesomeIcon icon={icon} className="w-6 h-6" />}
      {children}
    </button>
  );
};


interface NavButtonProps extends AnchorProps {
  href: string
  icon?: IconProp
}

export const NavButton = ({ 
  children,
  href,
  icon,
  className = `flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-md`, 
  ...props 
}: NavButtonProps) =>{

    return(
    <Link
    href={href} 
    className={className}
    {...props}
    > 
    {children}
    </Link>
    )

  }



export const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <button
      type="submit" 
      disabled={pending}
      className = {`flex w-full items-center justify-center bg-emerald-700 hover:bg-emerald-500  lg:mx-0 sm:mx-auto text-white font-semibold p-2 rounded-3xl shadow-md`}
      > 
      {pending? 'Submit...' : 'Submit'}
      </button>
    );
};

interface MoreOptsProps {
  cta: string;
  showMore: boolean;
  onClick: () => void
}

export const MoreOptsButton = ({showMore, onClick, cta}: MoreOptsProps) => {

    return (
        <button
            type="button"
            className="flex items-center justify-center w-auto text-white text-sm hover:opacity-50 focus:outline-none gap-2"
            onClick={onClick}
        >
            { showMore? (
            <FontAwesomeIcon icon={faChevronUp} className="w-4 h-4" /> 

            ) :(
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
            )}
            {cta}
        </button>
    );
};


