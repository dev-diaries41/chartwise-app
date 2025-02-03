import React, {useLayoutEffect, useState } from 'react'

const usePopUp = () => {
    const [popUpTitle, setPopUpTitle] = useState('');
    const [popUpDescription, setPopUpDescription] = useState('');
    const [popUpCta, setPopUpCta] = useState<string|undefined>('');

  

    const closePopUp = () => {
        setPopUpTitle('');
        setPopUpDescription('');  
        setPopUpCta('');
    }

    const showPopUp=(title: string, description: string, cta?: string)=> {
        setPopUpTitle(title);
        setPopUpDescription(description);
        setPopUpCta(cta);
    }


    return {
        popUpCta,
        popUpTitle,
        popUpDescription,
        closePopUp, 
        showPopUp
    };
}

export default usePopUp;

