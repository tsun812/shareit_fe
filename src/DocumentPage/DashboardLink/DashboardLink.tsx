import React from 'react'
import { ReactComponent as DashboardLogo } from '../../icons/dashboard.svg'
import { useNavigate } from 'react-router-dom'
import './DashboardLink.css'

const DashboardLink: React.FC = () => {
  const navigate = useNavigate()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    navigate('/dashboard')
  }
  return (
    <button onClick={(event) => handleClick(event)} className='dashboardLogoWrapper'>
      <DashboardLogo className='dashboardLogo'/>
    </button>
  )
}

export default DashboardLink
