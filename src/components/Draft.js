import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "./Draft.css";

const customStyleMap = {
  RED: { color: "red" },
  UNDERLINE: { textDecoration: "underline" },
};

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const editorRef = useRef(null);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = content.getBlockForKey(blockKey);
    const text = block.getText();

    if (text === "#" && chars === " ") {
      const newContentState = Modifier.replaceText(
        content,
        selection.merge({ anchorOffset: 0, focusOffset: text.length }),
        ""
      );
      setEditorState(
        EditorState.push(editorState, newContentState, "remove-range")
      );
      setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
      return "handled";
    }

    if (text === "*" && chars === " ") {
      const newContentState = Modifier.replaceText(
        content,
        selection.merge({ anchorOffset: 0, focusOffset: text.length }),
        ""
      );
      setEditorState(
        EditorState.push(editorState, newContentState, "remove-range")
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
      return "handled";
    }

    if (text === "**" && chars === " ") {
      const newContentState = Modifier.replaceText(
        content,
        selection.merge({ anchorOffset: 0, focusOffset: text.length }),
        ""
      );
      setEditorState(
        EditorState.push(editorState, newContentState, "remove-range")
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, "RED"));
      return "handled";
    }

    if (text === "***" && chars === " ") {
      const newContentState = Modifier.replaceText(
        content,
        selection.merge({ anchorOffset: 0, focusOffset: text.length }),
        ""
      );
      setEditorState(
        EditorState.push(editorState, newContentState, "remove-range")
      );
      setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return "handled";
    }
    return "not-handled";
  };

  const handleSave = () => {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <div className="button">
        <h2 className="text-lg font-bold">
          Demo editor by &lt;Mani Deepak&gt;
        </h2>
        <button className="buttonClick" onClick={handleSave}>
          Save
        </button>
      </div>
      <h6>Below is the Draft Editor with required functionlities</h6>
      <div className="editor" onClick={() => editorRef.current.focus()}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap}
        />
      </div>
    </div>
  );
};

export default DraftEditor;
