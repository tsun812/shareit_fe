import React, { useState } from 'react'
import './ShareLink.css'

const ShareLink = () => {
  const [copied, setCopied] = useState<boolean>(false)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(window.location.href)
    let currentTarget = event.target as HTMLElement
    currentTarget.style.backgroundColor = '#40f1dc'
    if (copied) {
      return
    } else {
      setCopied(true)
    }
  }
  return (
    <button className='shareWrapper' onClick={(event) => handleClick(event)}>
      {copied ? 'Copied' : 'Copy Link'}
    </button>
  )
}

export default ShareLink
