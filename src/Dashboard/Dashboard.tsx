import React from 'react'
import DocumentNew from '../DocumentNew/DocumentNew'
import DocumentList from './DocumentList'

const Dashboard: React.FC = () => {
  return (
    <div>
        <DocumentNew />
        <DocumentList />
    </div>
  )
}

export default Dashboard