import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

const DEFAULT_FONT = 'Arial';

const FONT_FAMILIES: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
  ['Comic Sans MS', 'Comic Sans MS'],
  ['Calibri', 'Calibri'],
  ['Poppins', 'Poppins'],
  ['Lobster', 'Lobster'],
];

export const FontDropdown = ({ disabled }: { disabled: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      let current = DEFAULT_FONT;
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const value = $getSelectionStyleValueForProperty(selection, 'font-family', DEFAULT_FONT);

        const first = value
          .split(',')[0]
          .replace(/^['"]|['"]$/g, '')
          .trim();
        if (first) current = first;
      });
      setFontFamily(current);
    });
  }, [editor]);

  const applyFontFamily = (next: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { 'font-family': next });
    });
    setFontFamily(next);
  };

  const currentLabel = FONT_FAMILIES.find(([, value]) => value === fontFamily)?.[0] ?? fontFamily;

  return (
    <DropdownMenu disabled={disabled}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="w-40 justify-between gap-1 text-sm font-normal">
            <span className="truncate">{currentLabel}</span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="max-h-80 w-48 overflow-y-auto">
        <DropdownMenuRadioGroup value={fontFamily} onValueChange={(value) => applyFontFamily(value)}>
          <DropdownMenuLabel>Шрифт</DropdownMenuLabel>
          {FONT_FAMILIES.map(([label, value]) => (
            <DropdownMenuRadioItem key={value} value={value} style={{ fontFamily: value }}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
