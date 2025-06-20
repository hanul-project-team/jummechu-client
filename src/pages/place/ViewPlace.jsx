import React, { useEffect, useState, useRef } from 'react';
import zustandStore from '../../app/zustandStore.js';
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx';
import { useLocation,  } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecentViewPlace from './RecentViewPlace.jsx';

const ViewPlace = () => {
  const location = useLocation();
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail);
  const setIsLoading = zustandStore(state => state.setIsLoading);

  const user = useSelector(state => state.auth.user);
  const userId = user?.id; 


  useEffect(() => {
    
    
    if (location.state) {
      
      setPlaceDetail(location.state);
      if(location.state?._id) { 
        setIsLoading(false);
      }
    } 
  }, [location.state]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);


  return <div>
    <ViewPlaceDetail />
    <RecentViewPlace />
  </div>;
};

export default ViewPlace;