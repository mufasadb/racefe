import React from 'react';

const UserContext = React.createContext({
  userId: null,
  teamId: null,
  isAdmin: false,
  isLoggedIn: false,
  isTeamLeader: false
  // You can include functions to update these values here as well.
});

export default UserContext;
