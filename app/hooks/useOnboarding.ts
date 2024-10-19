import React, {useLayoutEffect, useState } from 'react'

const useOnboarding = () => {
    const [isVisible, setIsVisible] = useState(true);

    const closeOnboardingPopUp = () => {
        setIsVisible(false);
    }


    return {
       isVisible,
       closeOnboardingPopUp
    };
}

export default useOnboarding;

