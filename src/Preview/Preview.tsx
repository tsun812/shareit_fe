import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Preview.css'
interface Props {
    currentText: string
}
const Preview: React.FC<Props> = ({currentText}) => {
  
  return (
    <ReactMarkdown className='previewContainer'>{currentText}</ReactMarkdown>
  )
}

export default Preview