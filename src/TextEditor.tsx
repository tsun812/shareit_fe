import React from 'react'
import Quill, { Sources } from 'quill'
import { useEffect, useRef, useState } from 'react'
import "quill/dist/quill.snow.css"
import Delta from 'quill-delta'
interface Props {
    setCurrentText: React.Dispatch<React.SetStateAction<string>>
}

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
  ];

const TextEditor: React.FC<Props> = ({setCurrentText}) => {
  const [quill, setQuill] = useState<Quill>()
  const [delta, setDelta] = useState<Delta>()
  const container = useRef<HTMLDivElement>(null)

  useEffect(() =>{
    const editor = document.createElement('div')
    const current = container.current
    if(current){
        current.append(editor)
    }

    const q = new Quill(editor, {
        theme: 'snow',
        modules: {
            toolbar: {
              container: TOOLBAR_OPTIONS,
            },
          }
      });
      
    setQuill(q)

    return () => {
        if(current){
        current.innerHTML = ''
        }
    }
  }, [])

  useEffect(() => {
    if(quill == null) return
    quill.on('text-change', function(delta: Delta, oldDelta: Delta, source: Sources) {
        if(source !== 'user') return
        setCurrentText(quill.getText())
      })
  }, [quill, setCurrentText])

  return (
    <div ref={container}></div>
  )
}

export default TextEditor