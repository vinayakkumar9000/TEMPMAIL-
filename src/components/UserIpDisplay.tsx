
import React, { useEffect, useState } from 'react';

const UserIpDisplay = () => {
  const [userIp, setUserIp] = useState<string>('');

  useEffect(() => {
    // Fetch the user's IP address
    const fetchUserIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIp('Unknown');
      }
    };

    fetchUserIp();
  }, []);

  return (
    <div className="text-xs text-muted-foreground">
      IP: {userIp || 'Loading...'}
    </div>
  );
};

export default UserIpDisplay;
