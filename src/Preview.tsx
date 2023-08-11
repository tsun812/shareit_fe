import React from 'react'
import ReactMarkdown from 'react-markdown'
interface Props {
    currentText: string
}
const Preview: React.FC<Props> = ({currentText}) => {
  
  return (
    <ReactMarkdown>{currentText}</ReactMarkdown>
  )
}

export default Preview