import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPublicBarbersApi, getBarberBySlugApi } from '../utils/api';

const BarberContext = createContext(null);

export const BarberProvider = ({ children }) => {
  const [activeBarber, setActiveBarber] = useState(() => {
    const saved = localStorage.getItem('active_barber');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing active_barber from localStorage', e);
        return null;
      }
    }
    return null;
  });
  const [barbersList, setBarbersList] = useState([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [loadingActiveBarber, setLoadingActiveBarber] = useState(false);

  // Fetch all active barbers on mount
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const list = await getPublicBarbersApi();
        setBarbersList(list);
      } catch (error) {
        console.error('Error fetching public barbers list:', error);
      } finally {
        setLoadingBarbers(false);
      }
    };
    fetchBarbers();
  }, []);

  const selectBarber = (barber) => {
    if (barber) {
      setActiveBarber(barber);
      localStorage.setItem('active_barber', JSON.stringify(barber));
    } else {
      setActiveBarber(null);
      localStorage.removeItem('active_barber');
    }
  };

  const loadBarberBySlug = async (slug) => {
    setLoadingActiveBarber(true);
    try {
      const barber = await getBarberBySlugApi(slug);
      selectBarber(barber);
      return barber;
    } catch (error) {
      console.error(`Error loading barber with slug ${slug}:`, error);
      throw error;
    } finally {
      setLoadingActiveBarber(false);
    }
  };

  const clearActiveBarber = () => {
    selectBarber(null);
  };

  const value = {
    activeBarber,
    barbersList,
    loadingBarbers,
    loadingActiveBarber,
    selectBarber,
    loadBarberBySlug,
    clearActiveBarber
  };

  return (
    <BarberContext.Provider value={value}>
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
