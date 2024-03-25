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

const BountyPage = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)
  const [popoverData, setPopoverData] = useState({
    anchorEl: null,
    content: ''
  })
  const [sortField, setSortField] = useState('sortOrder')
  const [sortDirection, setSortDirection] = useState('asc') // or 'desc'

  const sortData = (field, data, direction) => {
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
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/dashboard-data/bounty-completion/`
        )
      ])
      const data = await Promise.all(responses.map(res => res.json()))
      setScoreableObjects(data.flat())
    } catch (error) {
      console.error(error)
    }
  }

  const trimDescription = description => {
    if (!description) return ''
    return description.length > 100
      ? `${description.substring(0, 100)}...`
      : description
  }

  function timeAgo (date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 1) {
      return `${diffInDays} day(s) ago`
    } else if (diffInHours > 1) {
      return `${diffInHours} hour(s) ago`
    } else if (diffInMinutes > 1) {
      return `${diffInMinutes} minute(s) ago`
    } else {
      return 'Just now'
    }
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
              <TableCell onClick={() => handleSort('createdAt')}>
                Submitted
                {/* Add other relevant columns as needed */}
                {sortField === 'createdAt' &&
                  (sortDirection === 'asc' ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  ))}
              </TableCell>
              <TableCell onClick={() => handleSort('submittedBy')}>
                Submitted By
                {/* Add other relevant columns as needed */}
                {sortField === 'createdAt' &&
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
                  <TableCell>{object.scoreableObject.name}</TableCell>
                  <TableCell
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup='true'
                    onMouseEnter={e => {
                      if (object.scoreableObject.description.length > 100) {
                        handlePopoverOpen(e, object.scoreableObject.description)
                      }
                    }}
                    onMouseLeave={handlePopoverClose}
                  >
                    {trimDescription(object.scoreableObject.description)}
                  </TableCell>
                  <TableCell>{object.scoreableObject.points}</TableCell>
                  <TableCell>
                    {object.createdAt
                      ? timeAgo(new Date(object.createdAt))
                      : ''}
                  </TableCell>
                  <TableCell>{object.user.username}</TableCell>
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
export default BountyPage
