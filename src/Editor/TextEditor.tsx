import React from 'react'
import { useRef, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import 'quill/dist/quill.snow.css'
import './TextEditor.css'
import ReactQuill, { UnprivilegedEditor, Value } from 'react-quill'
import {Sources, DeltaStatic} from 'quill'
import { io, Socket } from 'socket.io-client'

interface Props {
  setCurrentText: React.Dispatch<React.SetStateAction<string>>
}
type deltaType = DeltaStatic | undefined
interface ServerToClientEvents {
  'receive-changes': (delta: DeltaStatic) => void,
  'load-document': (delta: DeltaStatic) => void
}

interface ClientToServerEvents {
  'send-changes': (delta: Value) => void,
  'get-document': (id: string) => void,
  'save-changes': (delta: deltaType) => void,
}

const TextEditor: React.FC<Props> = ({ setCurrentText }) => {
  const [value, setValue] = useState<Value>()
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>()
  const {id: documentId} = useParams<string>()
  const container = useRef<ReactQuill>(null)

  useEffect(() => {
    const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      'http://localhost:3001'
    )
    setSocket(s)
    const currentEditor = container.current?.getEditor()
    currentEditor?.disable()

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if(socket == null || documentId == null) return
  
    socket.once('load-document', (document: DeltaStatic) => {
      const currentEditor = container.current?.getEditor()
      if(currentEditor){
        currentEditor?.updateContents(document)
        currentEditor?.enable()
        setCurrentText(currentEditor?.getText())
      }
    })

    socket.emit('get-document', documentId)
    
  }, [socket, documentId, setCurrentText])

  useEffect(() => {
    if (socket == null) return
    const updateHandler = (delta: DeltaStatic) => {
      const currentEditor = container.current?.getEditor()
      if(currentEditor){
        currentEditor.updateContents(delta)
        setCurrentText(currentEditor.getText())
      }
    }

    socket.on('receive-changes', updateHandler)

    return () => {
      socket.off('receive-changes', updateHandler)
    }
  }, [socket, setCurrentText])

  useEffect(() => {
    if (socket == null) return
    const SAVE_INTERVAL = 2000
    const currentEditor = container.current?.getEditor()
    const saveDocument = setInterval(() => {
      socket.emit('save-changes', currentEditor?.getContents())
    }, SAVE_INTERVAL)
    return () => {
     clearInterval(saveDocument)
    }
  }, [socket])

  const handleValueChange = (
    value: string,
    delta: Value,
    source: Sources,
    editor: UnprivilegedEditor
  ): void => {
    if (source !== 'user'  || socket == null) return
    socket.emit('send-changes', delta)
    setCurrentText(editor.getText())
    setValue(delta)

  }

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6] }],
    ['bold', 'italic', 'strike'],
    ['blockquote', 'code-block', 'link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ]
  // custom handlers to generate markdown syntax on click
  const CUSTOM_HANDLERS = {
    header: (input: string): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        switch (input) {
          case '1':
            currentEditor?.insertText(startIndex, '# ', 'user')
            break
          case '2':
            currentEditor?.insertText(startIndex, '## ', 'user')
            break
          case '3':
            currentEditor?.insertText(startIndex, '### ', 'user')
            break
          case '4':
            currentEditor?.insertText(startIndex, '#### ', 'user')
            break
          case '5':
            currentEditor?.insertText(startIndex, '##### ', 'user')
            break
          case '6':
            currentEditor?.insertText(startIndex, '###### ', 'user')
            break
        }
        currentEditor?.setSelection(
          startIndex + textLength + parseInt(input) + 1,
          0
        )
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    bold: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '**', 'user')
        currentEditor?.insertText(startIndex + textLength + 2, '**', 'user')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    italic: (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '*', 'user')
        currentEditor?.insertText(startIndex + textLength + 1, '*', 'user')
        currentEditor?.setSelection(startIndex + textLength + 1, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    strike: (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '~~', 'user')
        currentEditor?.insertText(startIndex + textLength + 2, '~~', 'user')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    blockquote: (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '> ', 'user')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    'code-block': (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '```\n', 'user')
        currentEditor?.insertText(startIndex + textLength + 4, '\n```', 'user')
        currentEditor?.setSelection(startIndex + textLength + 4, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    link: (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '[', 'user')
        currentEditor?.insertText(startIndex + textLength + 1, '](https://)', 'user')
        currentEditor?.setSelection(startIndex + textLength + 1, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    image: (input: boolean): void => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '![](', 'user')
        currentEditor?.insertText(startIndex + textLength + 4, ')', 'user')
        currentEditor?.setSelection(startIndex + textLength + 4, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    list: (input: string): void => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        if (input === 'ordered') {
          currentEditor?.insertText(currentIndex?.index, '* ', 'user')
        } else if (input === 'bullet') {
          currentEditor?.insertText(currentIndex?.index, '1. ', 'user')
        }
        currentEditor?.setSelection(currentIndex?.index + 3, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }
      
    },
  }

  const modules = useMemo(() => {
    const editor = {
      toolbar: {
        container: TOOLBAR_OPTIONS,
        handlers: CUSTOM_HANDLERS,
      },
    }
    return editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formats: string[] = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'underline',
    'blockquote',
    'header',
    'indent',
    'align',
    'direction',
    'code-block',
    'formula',
    'image',
    'video',
  ]

  return (
    <ReactQuill
      theme='snow'
      ref={container}
      defaultValue={value}
      modules={modules}
      formats={formats}
      onChange={(
        value: string,
        delta: Value,
        source: Sources,
        editor: UnprivilegedEditor
      ) => handleValueChange(value, delta, source, editor)}
    />
  )
}

export default TextEditor
