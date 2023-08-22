import React from 'react'
import { useRef, useState, useMemo, useEffect } from 'react'
import 'quill/dist/quill.snow.css'
import './TextEditor.css'
import ReactQuill, { Quill } from 'react-quill'
import { io, Socket } from 'socket.io-client'

interface Props {
  setCurrentText: React.Dispatch<React.SetStateAction<string>>
}

interface ServerToClientEvents {
  'receive-changes': (delta: any) => void
}

interface ClientToServerEvents {
  'send-changes': (delta: any) => void
}

const TextEditor: React.FC<Props> = ({ setCurrentText }) => {
  const [value, setValue] = useState<string>('')
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>()

  const container = useRef<ReactQuill>(null)

  useEffect(() => {
    const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      'http://localhost:3001'
    )
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null) return
    const updateHandler = (delta: any) => {
      const currentEditor = container.current?.getEditor()
      currentEditor?.updateContents(delta)
    }

    socket.on('receive-changes', updateHandler)

    return () => {
      socket.off('receive-changes', updateHandler)
    }
  }, [socket])

  const handleValueChange = (
    value: string,
    delta: any,
    source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    if (source !== 'user' || socket == null) return
    socket.emit('send-changes', delta)
    setCurrentText(editor.getText())
    setValue(value)
  }
  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6] }],
    ['bold', 'italic', 'strike'],
    ['blockquote', 'code-block', 'link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ]
  // custom handlers to generate markdown syntax on click
  const CUSTOM_HANDLERS = {
    header: (input: string) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        switch (input) {
          case '1':
            currentEditor?.insertText(startIndex, '# ')
            break
          case '2':
            currentEditor?.insertText(startIndex, '## ')
            break
          case '3':
            currentEditor?.insertText(startIndex, '### ')
            break
          case '4':
            currentEditor?.insertText(startIndex, '#### ')
            break
          case '5':
            currentEditor?.insertText(startIndex, '##### ')
            break
          case '6':
            currentEditor?.insertText(startIndex, '###### ')
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
        currentEditor?.insertText(startIndex, '**')
        currentEditor?.insertText(startIndex + textLength + 2, '**')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    italic: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '*')
        currentEditor?.insertText(startIndex + textLength + 1, '*')
        currentEditor?.setSelection(startIndex + textLength + 1, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    strike: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '~~')
        currentEditor?.insertText(startIndex + textLength + 2, '~~')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    blockquote: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '> ')
        currentEditor?.setSelection(startIndex + textLength + 2, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    'code-block': (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '```\n')
        currentEditor?.insertText(startIndex + textLength + 4, '\n```')
        currentEditor?.setSelection(startIndex + textLength + 4, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    link: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '[')
        currentEditor?.insertText(startIndex + textLength + 1, '](https://)')
        currentEditor?.setSelection(startIndex + textLength + 1, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    image: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      const currentSelection = currentEditor?.getSelection(true)
      const startIndex = currentSelection?.index
      const textLength = currentSelection?.length
      if (startIndex !== undefined && textLength !== undefined) {
        currentEditor?.insertText(startIndex, '![](')
        currentEditor?.insertText(startIndex + textLength + 4, ')')
        currentEditor?.setSelection(startIndex + textLength + 4, 0)
      }

      if(currentEditor?.getText()){
        setCurrentText(currentEditor?.getText())
      }

    },
    list: (input: string) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        if (input === 'ordered') {
          currentEditor?.insertText(currentIndex?.index, '* ')
        } else if (input === 'bullet') {
          currentEditor?.insertText(currentIndex?.index, '1. ')
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
  }, [])

  const formats = [
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
        delta: any,
        source: any,
        editor: ReactQuill.UnprivilegedEditor
      ) => handleValueChange(value, delta, source, editor)}
    />
  )
}

export default TextEditor
