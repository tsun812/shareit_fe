import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Preview.css'
import remarkGfm from 'remark-gfm'

interface Props {
    currentText: string
}

const Preview: React.FC<Props> = ({currentText}) => {
  return (
    <div>
    <div className='previewHeader'>
      <span className='previewText'>Preview</span>
    </div>
      <ReactMarkdown className='previewContainer' linkTarget='_blank' remarkPlugins={[remarkGfm]}>{currentText}</ReactMarkdown>
    </div>
  )
}

export default Preview