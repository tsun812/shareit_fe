import React from 'react'
import './App.css'
import TextEditor from './Editor/TextEditor'
import Preview from './Preview/Preview'
import { useState} from 'react'

const App: React.FC = () => {
  const [currentText, setCurrentText] = useState<string>('')
  return (
    <div className='container'>
      <TextEditor setCurrentText={setCurrentText} />
      <Preview currentText={currentText} />
    </div>
  )
}

export default App
