import React from 'react'
import {useParams } from "react-router-dom";
import Homepage from './Homepage';
import Activate from './Activate';
import axios from "../utility/axios";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {updateCardID } from '../actions';
import Loader from "./Loader"


export default function UserDetails() {
    const { cardId } = useParams();
    const [userProfileExists, setUserProfileExists] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add a loading state
  const dispatch = useDispatch();


    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          console.log("userDetails component",cardId)
    
              const response = await axios.post('/users/getUserProfilePublic', {
                 cardID:cardId,
              });
              setUserProfileExists(response.data.exists);
              setUserProfile(response.data);
              setIsLoading(false)

              
            } catch (error) {
              console.log(error)
              setIsLoading(false)

            }   
      };
       fetchData();
    }, [cardId]);
    if(isLoading){
      return <Loader/>
    }
     if (!userProfileExists) {
      dispatch(updateCardID(cardId));
      return <Activate cardId={cardId} />;
    }
    if(userProfile){
      console.log("debug",userProfile)

      return <Homepage cardId={userProfile} />;

    }

}