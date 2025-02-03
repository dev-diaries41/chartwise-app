import React, {useLayoutEffect, useState } from 'react'

// Custom loading hook
// The minimize variable and minimizeLoader can be used to optionally hide the loader
const useLoading = (defaultState: boolean = false) => {
    const [loading, setLoading] = useState(defaultState);
    const [minimize, setMinimize] = useState(false);
    const showLoadingDialog = loading && !minimize;
    const showLoadingMiniIndicator = loading && minimize;
  

    const minimizeLoader = () => {
        setMinimize(true);
    }

    // Set minimize false when loading stops 
    useLayoutEffect(() => {
        if(!loading && minimize){
            setMinimize(false);
        }
    }, [minimize, loading])

    return {
        loading, 
        setLoading,
        minimize,
        minimizeLoader,
        showLoadingDialog,
        showLoadingMiniIndicator
    };
}

export default useLoading;

