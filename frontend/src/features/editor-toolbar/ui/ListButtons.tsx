import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState } from 'react';
import { List, ListOrdered } from 'lucide-react';
import { Toggle } from '@/shared/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

type ListKind = 'bullet' | 'number';

const LISTS: { kind: ListKind; label: string; Icon: typeof List }[] = [
  { kind: 'bullet', label: 'Маркированный список', Icon: List },
  { kind: 'number', label: 'Нумерованный список', Icon: ListOrdered },
];

export const ListButtons = ({ disabled }: { disabled: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const [activeList, setActiveList] = useState<ListKind | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? null : anchorNode.getTopLevelElement();

        if (element && $isListNode(element)) {
          const listType = element.getListType();
          setActiveList(listType === 'bullet' || listType === 'number' ? listType : null);
        } else {
          setActiveList(null);
        }
      });
    });
  }, [editor]);

  const toggleList = (kind: ListKind) => {
    if (activeList === kind) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      return;
    }

    editor.dispatchCommand(kind === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-0.5">
      {LISTS.map(({ kind, label, Icon }) => (
        <Tooltip key={kind}>
          <TooltipTrigger
            render={
              <Toggle
                disabled={disabled}
                size="sm"
                pressed={activeList === kind}
                onPressedChange={() => toggleList(kind)}
                aria-label={label}
              >
                <Icon className="size-4" />
              </Toggle>
            }
          />
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
