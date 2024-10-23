import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CTAPopUpProps } from "@/app/types";
import Link from "next/link";

export default function PlanLimitAlert({ title, description, onConfirmCta, onClose }: CTAPopUpProps){
  return (
      <div className="flex items-start justify-between my-4 gap-4 p-4 border rounded-2xl bg-white shadow-sm dark:bg-gray-800 dark:border-transparent w-full mx-auto shadow-md shadow-black">
        <div className="flex flex-col flex-grow md:flex-row md:items-center md:justify-between">
          {/* Main Content */}
          <div className="flex flex-col pr-8 text-left">
            <h1 className="font-bold">
              {title}
            </h1>
            <div className="text-gray-500 dark:text-gray-400">
            {description}
            </div>
          </div>

           { onConfirmCta && <Link href={'/#pricing'} className="border border-emerald-500 rounded-full p-2 max-w-40 w-full md:w-auto mt-4 md:mt-0">
              <span className="flex items-center justify-center">{onConfirmCta}</span>
            </Link>
            }
        </div>

        <button
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 bg-transparent rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-2 mt-3"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="opacity-80 w-4 h-4" />
        </button>
      </div>
  );
};

