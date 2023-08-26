import React from 'react'
import { ReactComponent as Logo } from '../icons/addNewDoc.svg'
import './DocumentNew.css'

const DocumentNew: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    Object.assign(document.createElement('a'), { target: '_blank', href: '/', rel:'noopener noreferrer'}).click();
  }
  return (
    <button onClick={(event) => handleClick(event)} className='logoWrapper'>
      <Logo className='logo'/>
    </button>
  )
}

export default DocumentNew
