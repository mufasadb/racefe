import React from 'react'
import { Link } from 'wouter'

const Header = ({ isLoggedIn, isAdmin }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link to='/PlayerData'>Submissions</Link>
            </li>

            <li>
              <Link to='/CreateScoringEvent'>Submit Objectives</Link>
            </li>
            <li>
              <Link to='/Users'>Users</Link>
            </li>
            <li>
              <Link to='/AllScoreablesList'>Objectives List</Link>
            </li>
            {isAdmin && (
              <>
                <li>
                  <Link to='/CreateLeague'>Create League</Link>
                </li>
                <li>
                  <Link to='/CreateTeam'>Create Team</Link>
                </li>
                {/* <li>
                  <Link to='/CreateCharacter'>Create Character</Link>
                </li> */}
                <li>
                  <Link to='/CreateScoreableObject'>
                    Create Scoreable Event
                  </Link>
                </li>
                <li>
                  <Link to='/ScoringEventsReviewPage'>
                    Review Scored Events
                  </Link>
                </li>
                <li>
                  <Link to='/ScoringEventsTable'>List All Scored Events</Link>
                </li>
              </>
            )}
          </>
        )}
        {!isLoggedIn && (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Header
