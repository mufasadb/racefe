import React from 'react'
import { Box, Paper, ThemeProvider, createTheme } from '@mui/material'
import UserContext from '../context/UserContext'
import SobjectTableAccount from './SobjectTableAccount'
import SobjectTableTeam from './SobjectTableTeam'
// import AvailableScoreableObjects from './AvailableScoreableObjects'

const AllScoreablesList = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Section */}
        <Box display='flex' justifyContent='space-between'>
          {/* Top Left - Player Leaderboard */}
          <Box mt={4} p={2}>
            <h2>Per Account Objectives and Bounties</h2>
            <SobjectTableAccount />
          </Box>
        </Box>

        {/* Bottom Section - Available Bounties */}
        <Box mt={4} p={2}>
          <h2>Per Team Objectives and bounties</h2>
          <SobjectTableTeam />
        </Box>
      </Box>
    </div>
  )
}

export default AllScoreablesList
