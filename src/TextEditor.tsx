import React from 'react'
import Quill from 'quill'
import { useEffect, useRef} from 'react'
import "quill/dist/quill.snow.css"

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["clean"]
  ];

const TextEditor: React.FC = () => {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() =>{
    
    const editor = document.createElement('div')
    const current = container.current
    if(current){
        current.append(editor)
    }
    //asdf
    new Quill(editor, {
        theme: 'snow',
        modules: {
            toolbar: {
              container: TOOLBAR_OPTIONS,
            },
          }
      });
    
    return () => {
        if(current){
        current.innerHTML = ''
        }
    }
  }, [])

  return (
    <div ref={container}></div>
  )
}

export default TextEditor