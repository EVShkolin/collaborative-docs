import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isLinkNode, type LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useState } from 'react';

type LinkEditorState = { open: false } | { open: true; url: string; anchorRect: DOMRect | null; isExisting: boolean };

export const useLinkEditor = () => {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<LinkEditorState>({ open: false });

  const open = useCallback(() => {
    let next: LinkEditorState = { open: false };

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const linkNode = $isLinkNode(anchorNode)
        ? anchorNode
        : $isLinkNode(anchorNode.getParent())
          ? anchorNode.getParent()
          : null;

      if (linkNode) {
        const el = editor.getElementByKey(linkNode.getKey());
        next = {
          open: true,
          url: (linkNode as LinkNode).getURL(),
          anchorRect: el?.getBoundingClientRect() ?? null,
          isExisting: true,
        };
      } else {
        const domSelection = window.getSelection();
        const range = domSelection?.rangeCount ? domSelection.getRangeAt(0) : null;
        next = {
          open: true,
          url: '',
          anchorRect: range?.getBoundingClientRect() ?? null,
          isExisting: false,
        };
      }
    });

    setState(next);
  }, [editor]);

  const close = useCallback(() => setState({ open: false }), []);

  const save = useCallback(
    (url: string) => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url ? { url } : null);
      close();
    },
    [editor, close]
  );

  return { state, open, close, save };
};
