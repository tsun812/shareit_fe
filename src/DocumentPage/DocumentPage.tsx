import React from 'react'
import TextEditor from '../Editor/TextEditor'
import Preview from '../Preview/Preview'
import DocumentNew from '../DocumentNew/DocumentNew'
import { useState } from 'react'
import './DocumentPage.css'
const DocumentPage = () => {
  const [currentText, setCurrentText] = useState<string>('')
  return (
    <div className='container'>
      <DocumentNew />
      <div className='docContainer'>
        <TextEditor setCurrentText={setCurrentText} />
        <Preview currentText={currentText} />
      </div>
    </div>
  )
}

export default DocumentPage