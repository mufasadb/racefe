import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Popover
} from '@mui/material'
import UserContext from '../context/UserContext'
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'

const AvailableScoreableObjects = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)
  const [popoverData, setPopoverData] = useState({
    anchorEl: null,
    content: ''
  })
  const [sortField, setSortField] = useState('sortOrder')
  const [sortDirection, setSortDirection] = useState('asc') // or 'desc'

  const sortData = (field, data, direction) => {
    console.log(data)
    const sortedData = [...data].sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1
      }
      if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1
      }
      return 0
    })
    return sortedData
  }

  const handleSort = field => {
    const isAsc = sortField === field && sortDirection === 'asc'
    const isDesc = sortField === field && sortDirection === 'desc'
    if (isDesc) {
      setSortField('sortOrder')
      setSortDirection('asc')
      return
    }
    setSortField(field)
    setSortDirection(isAsc ? 'desc' : 'asc')
  }

  const handlePopoverOpen = (event, description) => {
    setPopoverData({
      anchorEl: event.currentTarget,
      content: description
    })
  }

  const handlePopoverClose = () => {
    setPopoverData({
      anchorEl: null,
      content: ''
    })
  }

  const open = Boolean(popoverData.anchorEl)
  const [scoreableObjects, setScoreableObjects] = useState([])

  useEffect(() => {
    fetchScoreableObjects()
  }, [])

  const fetchScoreableObjects = async () => {
    try {
      const responses = await Promise.all([
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${
            process.env.REACT_APP_BACKEND_PORT
          }/scoreable-objects/available/player-bounties/${userId ? userId : 1}`
        ),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${
            process.env.REACT_APP_BACKEND_PORT
          }/scoreable-objects/available/team-bounties/${teamId ? teamId : 1}`
        )
      ])
      const data = await Promise.all(responses.map(res => res.json()))
      setScoreableObjects(data.flat())
    } catch (error) {
      console.error(error)
    }
  }
  const convertTypeToHumanReadable = scoreableType => {
    switch (scoreableType) {
      case 'character_objective':
        return 'Character Objective'
      case 'account_objective':
        return 'Account Objective'
      case 'team_objective':
        return 'Team Objective'
      case 'team_bounty':
        return 'Team Bounty'
      case 'account_bounty':
        return 'Account Bounty'
      default:
        return 'Unknown'
    }
  }

  const trimDescription = description => {
    return description.length > 100
      ? `${description.substring(0, 100)}...`
      : description
  }

  return (
    <div>
      <TableContainer>
        <Table aria-label='Available Scoreable Objects'>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('name')}>
                Name
                {sortField === 'name' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  ))}
              </TableCell>
              <TableCell onClick={() => handleSort('description')}>
                Description
                {sortField === 'description' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  ))}
              </TableCell>
              <TableCell onClick={() => handleSort('points')}>
                Points
                {sortField === 'points' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  ))}
              </TableCell>
              <TableCell onClick={() => handleSort('submittableType')}>
                Type
                {/* Add other relevant columns as needed */}
                {sortField === 'submittableType' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  ))}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(sortField, scoreableObjects, sortDirection).map(
              (object, index) => (
                <TableRow key={index}>
                  <TableCell>{object.name}</TableCell>
                  <TableCell
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup='true'
                    onMouseEnter={e => handlePopoverOpen(e, object.description)}
                    onMouseLeave={handlePopoverClose}
                  >
                    {trimDescription(object.description)}
                  </TableCell>
                  <TableCell>{object.points}</TableCell>
                  <TableCell>
                    {convertTypeToHumanReadable(object.submittableType)}
                  </TableCell>
                  {/* Render other object properties as needed */}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PopoverComponent
        anchorEl={popoverData.anchorEl}
        open={open}
        onClose={handlePopoverClose}
        content={popoverData.content}
      />
    </div>
  )
}

const PopoverComponent = ({ anchorEl, open, onClose, content }) => {
  return (
    <Popover
      id='mouse-over-popover'
      sx={{ pointerEvents: 'none' }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      disableRestoreFocus
    >
      <Paper elevation={3} style={{ padding: '10px' }}>
        <Typography>{content}</Typography>
      </Paper>
    </Popover>
  )
}
export default AvailableScoreableObjects
