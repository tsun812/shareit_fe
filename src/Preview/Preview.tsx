import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Preview.css'
interface Props {
    currentText: string
}
const Preview: React.FC<Props> = ({currentText}) => {
  
  return (
    <div>
    <div className='previewHeader'>Preview</div>
    <ReactMarkdown className='previewContainer'>{currentText}</ReactMarkdown>
    </div>
  )
}

export default Preview