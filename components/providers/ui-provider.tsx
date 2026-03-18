'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UIContextType {
  show3DItems: boolean;
  toggle3DItems: () => void;
  adminLocale: string;
  setAdminLocale: (loc: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isMounted: boolean; // Add isMounted to the context
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [show3DItems, setShow3DItems] = useState(true);
  const [adminLocale, setAdminLocaleState] = useState<string>('ar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [introFinished, setIntroFinished] = useState(false);
  // Initialize isMounted to true on client to avoid initial render issues
  const [isMounted, setIsMounted] = useState(typeof window !== 'undefined');

  useEffect(() => {
    // Ensure mounted is set on client
    if (typeof window !== 'undefined' && !isMounted) {
      setIsMounted(true);
    }

    // Hydrate everything from localStorage only on client
    // Use try-catch to handle cases where localStorage might not be available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('show3DItems');
        if (saved !== null) {
          setShow3DItems(saved === 'true');
        }
        const savedAdmin = localStorage.getItem('adminLanguage');
        if (savedAdmin) {
          setAdminLocaleState(savedAdmin);
        }
        const savedSidebar = localStorage.getItem('adminSidebarCollapsed');
        if (savedSidebar !== null) {
          setSidebarCollapsed(savedSidebar === 'true');
        }
        const savedIntro = localStorage.getItem('introFinished');
        if (savedIntro !== null) {
          setIntroFinished(savedIntro === 'true');
        }
      }
    } catch (error) {
      // Silently handle localStorage errors (e.g., in private browsing mode)
      console.warn('Failed to access localStorage:', error);
    }
  }, []);

  const toggle3DItems = () => {
    const newValue = !show3DItems;
    setShow3DItems(newValue);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('show3DItems', String(newValue));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };
  const setAdminLocale = (loc: string) => {
    setAdminLocaleState(loc);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('adminLanguage', loc);
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };
  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('adminSidebarCollapsed', String(next));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  const setIntroFinishedHandler = (finished: boolean) => {
    setIntroFinished(finished);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (finished) {
          localStorage.setItem('introFinished', 'true');
        } else {
          localStorage.removeItem('introFinished');
        }
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  return (
    <UIContext.Provider value={{
      show3DItems,
      toggle3DItems,
      adminLocale,
      setAdminLocale,
      sidebarCollapsed,
      toggleSidebar,
      introFinished,
      setIntroFinished: setIntroFinishedHandler,
      isMounted
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
