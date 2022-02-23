import React, { useCallback, useMemo, useState } from 'react'
import isHotkey,{isKeyHotkey} from 'is-hotkey'
import Image from 'next/image'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import * as SlateReact from 'slate-react'
import {   Slate,
  Editable,useSlate,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  ReactEditor, } from 'slate-react'

import {
  Editor,
  Transforms,Range,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'

import { withHistory } from 'slate-history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

import { 
  faBold,
  faAlignCenter,
  faAlignLeft,
  faItalic,
  faUnderline,
  faLink,
  faImage,
  faCode,
  faQuoteRight,
  faListOl,
  faListUl,
  faLinkSlash } from '@fortawesome/free-solid-svg-icons'

import { LinkElement, ButtonElement } from './custom-types'
import { css } from '@emotion/css'
import { Button, Icon, Toolbar } from './EditorComps'

fontawesome.library.add( faBold,faAlignCenter,faAlignLeft,faItalic,faUnderline,faLink,faImage,faCode,faQuoteRight,faListOl,faListUl,faLinkSlash);

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichTextExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, []) 
   const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )


  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const { selection } = editor
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey]
        toggleMark(editor, mark)
      }
    }
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'offset', reverse: true })
        return
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'offset' })
        return
      }
    }
  }

  return (
  
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar>
        <MarkButton format="bold" icon="bold" />
        <MarkButton format="italic" icon="italic" />
        <MarkButton format="underline" icon="underline" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="left-align" icon="align-left" />
        <BlockButton format="center-align" icon="align-center" />
        <BlockButton format="block-quote" icon="quote-right" />
        <BlockButton format="numbered-list" icon="list-ol" />
        <BlockButton format="bulleted-list" icon="list-ul" />
        <InsertImageButton />
      </Toolbar>
      <Editable className='textarea'
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text…"
        spellCheck
        autoFocus
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}



const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = (props) => {
  switch (props.element.type) {
    case 'block-quote':
      return <blockquote {...props.attributes}>{props.children}</blockquote>
    case 'bulleted-list':
      return <ul {...props.attributes}>{props.children}</ul>
    case 'list-item':
      return <li {...props.attributes}>{props.children}</li>
    case 'numbered-list':
      return <ol {...props.attributes}>{props.children}</ol>
    case 'left-align':
      return <p style={{textAlign : 'left'}}{...props.attributes}>{props.children}</p>
    case 'center-align':
        return <p style={{textAlign : 'center'}}{...props.attributes}>{props.children}</p>
    case "image":
          return <ImageElement {...props} >{props.children}</ImageElement>;
    // case "link":
    //       return <Link {...props} ></Link>;
    default:
      return <p {...props.attributes}>{props.children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const withImages = editor => {
  const { insertData, isVoid } = editor;

  editor.isVoid = element => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = data => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};


const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <Image
          src={element.url} height={500} width={500}
          className={css`
            display: block;
            opacity: 1;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
          `}
        />
      </div>
      {children}
    </div>
  );
};

const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (!url) return;
        insertImage(editor, url);
      }}
    >
      <FontAwesomeIcon icon={faImage}/>
    </Button>
  );
};

const isImageUrl = url => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};
const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
    <FontAwesomeIcon icon={icon}/>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <FontAwesomeIcon icon={icon}/>
    </Button>
  )
}


const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: "There are many variations of Lorem Ipsum but the majority have suffered alteration There are many variationpassages of Lorem Ipsum available, but the majority have salteration in some form, by injected humour, or randomised wowhich don't look even slightly believable. If you are going to use a passage. There are many variations of Lorem Ipsum but the majority have suffered alteration There are many variationpassages of Lorem Ipsum available, but the majority have salteration in some form, by injected humour, or randowowhich don't look even slightly believable. If you are going to use a passage." }
    ],
  },
  

]

export default RichTextExample

