"use client"
import React, { createContext, useContext, useState } from 'react';
/* eslint-disable*/
const RefreshContext = createContext({
    refreshData: false,
    setRefreshData: (value: boolean) => {}
});

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
    const [refreshData, setRefreshData] = useState(false);

    return (
        <RefreshContext.Provider value={{ refreshData, setRefreshData }}>
            {children}
        </RefreshContext.Provider>
    );
};
