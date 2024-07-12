import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { positions } from "../constants/layout/style";

export interface WhatsIncludedItem {
    icon: IconDefinition;
    title: string;
    details: string[]
    }
      
    export interface WhatsIncludedProps {
      items: WhatsIncludedItem[];
    }
    
    export interface CardProps extends React.HTMLAttributes<HTMLDivElement>   {
      title: string;
      description: string;
      link: string;
      cta: string;
      tags?: string[];
      metadata?: string[];
    }

    export type InputField = Partial<React.JSX.IntrinsicElements['input']> & {
      optional?: boolean;
    };
    
    
    export interface NavItem {
      name: string;
      link: string;
      icon?: any
    } 
    
    
    export interface NavItemsProps {
      navItems: NavItem[];
    }
    
    export interface LogoProps {
      src: string;
      alt?: string;
      width?:  number | `${number}`;
      height?:  number | `${number}`;
    } 
    
    export interface FileUploaderProps {
      label?: string;
      onFileUpload: (file: File) => void | Promise<void>;
      acceptedFileExt: string[];
      acceptedMimes: string[];
      className?: string;
      children?: ReactNode;
    }
    
    export interface Option {
      value: string;
      label: string;
    }
    

    export type SelectorProps = SelectHTMLAttributes<HTMLSelectElement> & {
      options: Option[];
      placeholderOption: string
    }
    
    export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
      children: ReactNode;
      className?: string;
      icon?: IconProp;
    };
    
    export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

      
  export type FeedbackState = {
    errors?: {
      feedbackType?: string[];
      email?: string[];
      feedback?: string[];
    };
    message: string | null;
  };
  


export interface PollOptions  {
  interval: number;
  maxDuration?: number;
  maxErrors?: number;
}

export interface ToastProps {
  title: string;
  description: string;
  logo?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left' | 'center' | 'center-top';
  maxDuration?: number;
  onClose: () => void;
};



export interface ToastOptions extends Omit<ToastProps, 'onClose'> {}


export interface BasePopUpProps {
  title: string;
  description: string;
  position?: keyof typeof positions;
}

export interface LoaderDialogProps extends BasePopUpProps{
  onMinimize :() => void;

}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  minimize: boolean;
  minimizeLoader: () => void;
  showLoadingDialog: boolean;
  showLoadingMiniIndicator: boolean;
}

export interface CTAPopUpProps extends BasePopUpProps{ 
  cta?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface UserProfileWidgetProps {
  userId: string | undefined | null;    //email/uid/username
  isLoading: boolean
} 

export interface ActionRowProps {
  onCopy: () => void;
  onDelete: () => void;
  shareUrl: string | null;
}
