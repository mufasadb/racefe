import React from 'react'
import {
  Box,
  Paper,
  ThemeProvider,
  createTheme,
  Typography
} from '@mui/material'
import UserContext from '../context/UserContext'
import TeamComparison from './TeamComparison'
import LeaderBoard from './LeaderBoard'
import AvailableScoreableObjects from './AvailableScoreableObjects'

const HomePage = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Section */}
        <Box display='flex' justifyContent='space-between'>
          {/* Top Left - Player Leaderboard */}
          <Box width='50%' p={2}>
            <LeaderBoard />
          </Box>

          {/* Top Right - Team Comparison */}
          <Box width='50%' p={2}>
            {' '}
            <TeamComparison />
          </Box>
        </Box>

        {/* Bottom Section - Available Bounties */}
        <Box mt={4} p={2}>
          <div justifyContent='space-between'>
            <Typography variant='h5'>Available Scoreable Objects</Typography>
          </div>
          <AvailableScoreableObjects />
          {/* <LeaderBoard/> */}
          {/* <Submittables /> */}
        </Box>
      </Box>
    </div>
  )
}

export default HomePage
