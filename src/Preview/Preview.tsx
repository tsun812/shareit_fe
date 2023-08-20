import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Preview.css'
import {ReactComponent as VerticalDots } from '../icons/verticalDots.svg'
import remarkGfm from 'remark-gfm'

interface Props {
    currentText: string
}
const Preview: React.FC<Props> = ({currentText}) => {
  return (
    <div>
    <div className='previewHeader'>
      <span className='previewText'>Preview</span>
      <button className='iconContainer'>
        <VerticalDots className='icon' />
      </button>
    </div>
      <ReactMarkdown className='previewContainer' remarkPlugins={[remarkGfm]}>{currentText}</ReactMarkdown>
    </div>
  )
}

export default Preview