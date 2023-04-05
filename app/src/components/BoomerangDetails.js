import React, { useState, useEffect } from "react";
import axios from "axios";

const BoomerangDetails = ({ match }) => {
  const [boomerang, setBoomerang] = useState({});

  useEffect(() => {
    async function fetchBoomerang() {
      const response = await axios.get(
        `http://localhost:3001/boomerangs/${match.params.id}`
      );
      setBoomerang(response.data);
    }

    fetchBoomerang();
  }, [match.params.id]);

  const calculateTimeLeft = () => {
    const difference = new Date(boomerang.expiryTime * 1000) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div>
      <h2>Boomerang Details</h2>
      <p>Expiry Time: {boomerang.expiryTime}</p>
      <p>Update Frequency: {boomerang.updateFrequency}</p>
      <p>Last Check-In Time: {boomerang.lastCheckInTime}</p>
      <p>Creator: {boomerang.creator}</p>
      <p>
        Time left until unlocked: {timeLeft.days} days, {timeLeft.hours} hours,{" "}
        {timeLeft.minutes} minutes, and {timeLeft.seconds} seconds
      </p>
      <p>Is Unlocked: {boomerang.isUnlocked ? "Yes" : "No"}</p>
      <p>Is Expired: {boomerang.isExpired ? "Yes" : "No"}</p>
    </div>
  );
};

export default BoomerangDetails;
