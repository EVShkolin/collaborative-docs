import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import { useEffect, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Toggle } from '@/shared/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

type AlignType = 'left' | 'center' | 'right' | 'justify';

const ALIGNS: { align: AlignType; label: string; Icon: typeof AlignLeft }[] = [
  { align: 'left', label: 'По левому краю', Icon: AlignLeft },
  { align: 'center', label: 'По центру', Icon: AlignCenter },
  { align: 'right', label: 'По правому краю', Icon: AlignRight },
  { align: 'justify', label: 'По ширине', Icon: AlignJustify },
];

export const TextAlignButtons = () => {
  const [editor] = useLexicalComposerContext();
  const [activeAlign, setActiveAlign] = useState<AlignType>('left');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? null : anchorNode.getTopLevelElement();

        if ($isElementNode(element)) {
          const format = element.getFormatType();

          const align: AlignType =
            format === '' || format === 'start'
              ? 'left'
              : format === 'center' || format === 'right' || format === 'justify'
                ? format
                : 'left';
          setActiveAlign(align);
        }
      });
    });
  }, [editor]);

  const applyAlign = (align: AlignType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

  return (
    <div className="flex items-center">
      {ALIGNS.map(({ align, label, Icon }) => (
        <Tooltip key={align}>
          <TooltipTrigger
            render={
              <Toggle
                size="sm"
                pressed={activeAlign === align}
                onPressedChange={() => applyAlign(align)}
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