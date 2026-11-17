import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { Toggle } from '@/shared/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

type TextFormat = 'bold' | 'italic' | 'underline' | 'strikethrough';

const FORMATS: { format: TextFormat; label: string; Icon: typeof Bold }[] = [
  { format: 'bold', label: 'Жирный', Icon: Bold },
  { format: 'italic', label: 'Курсив', Icon: Italic },
  { format: 'underline', label: 'Подчёркнутый', Icon: Underline },
  { format: 'strikethrough', label: 'Зачёркнутый', Icon: Strikethrough },
];

export const TextFormatButtons = () => {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState<Record<TextFormat, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setActive({
          bold: selection.hasFormat('bold'),
          italic: selection.hasFormat('italic'),
          underline: selection.hasFormat('underline'),
          strikethrough: selection.hasFormat('strikethrough'),
        });
      });
    });
  }, [editor]);

  const toggleFormat = (format: TextFormat) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex items-center">
      {FORMATS.map(({ format, label, Icon }) => (
        <Tooltip key={format}>
          <TooltipTrigger
            render={
              <Toggle
                size="sm"
                pressed={active[format]}
                onPressedChange={() => toggleFormat(format)}
                aria-label={label}
              >
                <Icon className="size-4" />
              </Toggle>
            }
          ></TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
