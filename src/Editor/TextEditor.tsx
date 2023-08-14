import React from 'react'
import { useRef, useState, useMemo } from 'react'
import 'quill/dist/quill.snow.css'
//import './TextEditor.css'
import ReactQuill, { Quill } from 'react-quill'

interface Props {
  setCurrentText: React.Dispatch<React.SetStateAction<string>>
}

const TextEditor: React.FC<Props> = ({ setCurrentText }) => {
  const [value, setValue] = useState<string>('')
  
  // preserve white space, remove auto indentation
   const container = useRef<ReactQuill>(null)
  let Block = Quill.import('blots/block');
  Block.tagName = 'DIV';
  Block.className = 'pre';
  Quill.register(Block, true);
  
  const handleValueChange = (
    value: string,
    delta: any,
    source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setCurrentText(editor.getText())
    setValue(value)
  }
  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6] }],
    ['bold', 'italic', 'strike'],
    ['blockquote', 'code-block', 'link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ]
  // custom handlers to generate markdown syntax on click
  const CUSTOM_HANDLERS = {
    header: (input: string) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)

      if (currentIndex) {
        switch (input) {
          case '1':
            currentEditor?.insertText(currentIndex?.index, '# ')
            break
          case '2':
            currentEditor?.insertText(currentIndex?.index, '## ')
            break
          case '3':
            currentEditor?.insertText(currentIndex?.index, '### ')
            break
          case '4':
            currentEditor?.insertText(currentIndex?.index, '#### ')
            break
          case '5':
            currentEditor?.insertText(currentIndex?.index, '##### ')
            break
          case '6':
            currentEditor?.insertText(currentIndex?.index, '###### ')
            break
        }
        currentEditor?.setSelection(
          currentIndex?.index + parseInt(input) + 1,
          0
        )
      }
    },
    bold: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '****')
        currentEditor?.setSelection(currentIndex?.index + 2, 0)
      }
    },
    italic: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '**')
        currentEditor?.setSelection(currentIndex?.index + 1, 0)
      }
    },
    strike: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '~~~~')
        currentEditor?.setSelection(currentIndex?.index + 2, 0)
      }
    },
    blockquote: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '> ')
        currentEditor?.setSelection(currentIndex?.index + 2, 0)
      }
    },
    'code-block': (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '```\n\n```')
        currentEditor?.setSelection(currentIndex?.index + 4, 0)
      }
    },
    link: (input: boolean) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        currentEditor?.insertText(currentIndex?.index, '[](https://)')
        currentEditor?.setSelection(currentIndex?.index + 1, 0)
      }
    },
    list: (input: string) => {
      const currentEditor = container.current?.getEditor()
      let currentIndex = currentEditor?.getSelection(true)
      if (currentIndex) {
        if (input == 'ordered') {
          currentEditor?.insertText(currentIndex?.index, '* ')
        } else if (input == 'bullet') {
          currentEditor?.insertText(currentIndex?.index, '1. ')
        }
        currentEditor?.setSelection(currentIndex?.index + 1, 0)
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

  return (
    <ReactQuill
      theme='snow'
      ref={container}
      defaultValue={value}
      modules={modules}
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
