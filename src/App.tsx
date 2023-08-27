import React from 'react'
import DocumentPage from './DocumentPage/DocumentPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
const App: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route  path='/' element={<Navigate to={`/documents/${uuidV4()}`} replace/>} />
        <Route  path='/documents/:id' element={<DocumentPage />} />
      </Routes>
    </Router>
  )
}

export default App
