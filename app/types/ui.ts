import { IconDefinition, } from "@fortawesome/free-solid-svg-icons";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { positions } from "../constants/layout";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { TradeJournalEntry } from "./chartwise";
import { GetDocsResponse } from "./response";
import { JobReceipt } from "./data";

export interface WhatsIncludedItem {
    icon: IconDefinition;
    title: string;
    details: string[]
    }
      
    export interface WhatsIncludedProps {
      items: WhatsIncludedItem[];
    }

    export interface BaseCard extends React.HTMLAttributes<HTMLDivElement> {
      title: string;
      description?: string;
      link?: string;
      cta?: string;
      tags?: string[];
      metadata?: string[];
      icon?: IconProp
      iconColor?: string;
    }
    
    export interface CardProps extends BaseCard   {
      description: string;
      link: string;
      cta: string;
    }

    export interface ListCardProps extends BaseCard   {
      items: string[]
    }

    export type InputField = Partial<React.JSX.IntrinsicElements['input']> & {
      optional?: boolean;
    };
    
    
    export type NavItem =  {
      name: string;
      link: string;
      newPage?: boolean;
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
      onFileUpload: (files: File[]) => void; // Updated to handle an array of files
      acceptedFileExt: string[];
      acceptedMimes: string[];
      children?: ReactNode;
      maxFiles?: number
      maxSize?: number;
      className?: string;
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
      children?: ReactNode;
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


  export type RegistrationState = {
    errors?: {
      email?: string[];
      passowrd?: string[];
      confirmPassword?: string[];
    };
    message: string | null;
  };

  export type CompleteResetState = {
    errors?: {
      passowrd?: string[];
      confirmPassword?: string[];
    };
    message: string | null;
  };

  export type ResetState = {
    errors?: {
      email?: string[];
    };
    message: string | null;
  };

  export type UpgradeState = {
    message: string | null;
  };
  


export interface PollOptions  {
  interval: number;
  maxDuration: number;
  maxErrors: number;
  onMaxErrors?: () => void;
  onMaxDuration?: () => void;
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
  onMinimize? :() => void;
  status?: JobReceipt['status'] | null;
  queue?: JobReceipt['queue'];
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
  onConfirmCta?: string;
  onCloseCta?: string;
  onConfirmClassName?: string;
  onCloseClassName?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface UserProfileWidgetProps {
  userId: string | undefined | null;    //email/uid/username
} 

export interface ActionRowProps {
  onCopy: () => void;
  onDelete: () => void;
  shareUrl: string | null;
}

export interface SettingItem {
  type: 'dropdown' | 'toggle' | 'button';
  label: string;
  options?: string[]; // For dropdown
  value?: string | boolean;
  onChange?: (value: | string | boolean) => void;
}

export interface SettingCategory {
  name: string;
  items: SettingItem[];
}

export interface Settings {
  general: Record<string, any>
  dataControls: Record<string, any>
}

export type Mode = 'chart' | 'analysis'

export interface AnalysisUsageProps {
  usage: number;
  period: string;
}


export interface ActionItem {
  icon: IconDefinition;
  onClick: () => void;
  tooltip: string;
  isVisible?: boolean;
}

export interface ActionRowProps {
  actions: ActionItem[];
}

export type FAQ = {
  question: string;
  answer: string []
}

export interface TradeJournalTableProps {
  entries: TradeJournalEntry[];
  onAddEntry: () => void, 
  onDeleteEntry: (entryId: number) => void;
  onOpenEntry: (entry: TradeJournalEntry) => void;
  metadata: Pick<GetDocsResponse, 'totalDocuments' | 'perPage' | 'page'>
}

export interface Filters {
  type: string;
  sentiment: string;
  symbol: string;
}

export type FilterOptions =  {
  name: string;
  value: string;
  options: {
      value: string;
      label: string;
  }[]
}

export interface FiltersProps {
  filters: Filters;
  filterOptions: FilterOptions[]
  updateFilter: (filterName: string, value: string) => void;
}