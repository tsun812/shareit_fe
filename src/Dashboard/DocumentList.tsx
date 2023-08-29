import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './DocumentList.css'

export interface document {
  id: string
  name: string
  createdAt: number
}

const DocumentList: React.FC = () => {
  const [currentList, setCurrentList] = useState<document[]>([])
  const navigate = useNavigate()
  useEffect(() => {
    const expirationDuration = 1000 * 60 * 60 * 24 * 7
    let documentList = JSON.parse(localStorage.getItem('documentList') || '[]')
    if (!currentList) return
    for(const [index, document] of documentList.entries()){
      const currentTime = Date.now()
      const createdTime = document.createdAt
      if (createdTime - currentTime > expirationDuration) {
        documentList.splice(index, 0)
      }
    }

    localStorage.setItem('documentList', JSON.stringify(documentList))
    setCurrentList(documentList)
    //eslint-disable-next-line
  }, [])
  
  const handleClick = (id: string) => {
    navigate(`/documents/${id}`)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let items = [...currentList]
    let item = {...currentList[index], name: e.target.value}
    items[index] = item
    setCurrentList(items)
    localStorage.setItem('documentList', JSON.stringify(items))
  }
  const result = currentList.map((document: document, index: number) => {
    return (
      <div className='buttons-wrapper'>
        <button
          className='seemingly-outer-button'
          onClick={() => handleClick(document.id)}
        >
        </button>
        <input className='seemingly-inner-button' defaultValue={document.name} onChange={(e) => handleChange(e, index)}></input>
      </div>
    )
  })
  return <ul className='documentList'>{result}</ul>
}

export default DocumentList
