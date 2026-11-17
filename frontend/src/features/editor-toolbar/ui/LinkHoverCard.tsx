import { useCallback, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { LinkNode } from '@lexical/link';
import { ExternalLink } from 'lucide-react';
import type { LexicalEditor, NodeKey } from 'lexical';
import { $getNodeByKey } from 'lexical';

type HoveredLink = { url: string; rect: DOMRect } | null;

export const LinkHoverCard = () => {
  const [editor] = useLexicalComposerContext();
  const [hovered, setHovered] = useState<HoveredLink>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimeoutRef.current = setTimeout(() => setHovered(null), 150);
  }, [cancelHide]);

  const handleMouseEnter = useCallback(
    (_event: Event, _editor: LexicalEditor, nodeKey: NodeKey) => {
      cancelHide();

      let url: string | null = null;
      editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        if (node instanceof LinkNode) url = node.getURL();
      });
      if (!url) return;

      const el = editor.getElementByKey(nodeKey);
      if (!el) return;

      setHovered({ url, rect: el.getBoundingClientRect() });
    },
    [editor, cancelHide]
  );

  return (
    <>
      <NodeEventPlugin
        nodeType={LinkNode}
        eventType="mouseenter"
        eventListener={handleMouseEnter}
      />
      <NodeEventPlugin
        nodeType={LinkNode}
        eventType="mouseleave"
        eventListener={scheduleHide}
      />

      {hovered && (
        <div
          style={{
            position: 'fixed',
            top: hovered.rect.bottom + 6,
            left: hovered.rect.left,
            zIndex: 50,
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          className="w-80 rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
        >
          <a
            href={hovered.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ExternalLink className="size-4 shrink-0" />
            <span className="truncate">{hovered.url}</span>
          </a>
        </div>
      )}
    </>
  );
};