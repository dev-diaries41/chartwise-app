import React, {useLayoutEffect, useState } from 'react'

const usePopUp = () => {
    const [popUpTitle, setPopUpTitle] = useState('');
    const [popUpDescription, setPopUpDescription] = useState('');
  

    const closePopUp = () => {
        setPopUpTitle('');
        setPopUpDescription('');   
    }

    const showPopUp=(title: string, description: string)=> {
        setPopUpTitle(title);
        setPopUpDescription(description);
    }


    return {
        popUpTitle,
        popUpDescription,
        closePopUp, 
        showPopUp
    };
}

export default usePopUp;

