import React, { useState } from 'react'
import TextEditor from '../Editor/TextEditor'
import Preview from '../Preview/Preview'
import DocumentNew from '../DocumentNew/DocumentNew'
import ShareLink from './ShareLink/ShareLink'
import DashboardLink from './DashboardLink/DashboardLink'

import './DocumentPage.css'
const DocumentPage = () => {
  const [currentText, setCurrentText] = useState<string>('')
  return (
    <div className='container'>
      <div className='header'>
        <DashboardLink />
        <DocumentNew />
        <ShareLink />
      </div>
      <div className='docContainer'>
        <TextEditor setCurrentText={setCurrentText} />
        <Preview currentText={currentText} />
      </div>
    </div>
  )
}

export default DocumentPage