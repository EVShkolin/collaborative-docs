import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/ui/combobox';

const MIN_SIZE = 8;
const MAX_SIZE = 96;
const DEFAULT_SIZE = 16;
const PRESETS = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];

export const FontSizeGroup = ({ disabled }: { disabled: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [inputValue, setInputValue] = useState(String(DEFAULT_SIZE));

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      let parsed = DEFAULT_SIZE;
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const value = $getSelectionStyleValueForProperty(selection, 'font-size', `${DEFAULT_SIZE}px`);
        const n = parseInt(value, 10);
        if (!Number.isNaN(n)) parsed = n;
      });

      setSize(parsed);
      setInputValue(String(parsed));
    });
  }, [editor]);

  const applySize = (next: number) => {
    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(next)));
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $patchStyleText(selection, { 'font-size': `${clamped}px` });
    });
    setSize(clamped);
    setInputValue(String(clamped));
  };

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => applySize(size - 1)}
        disabled={size <= MIN_SIZE || disabled}
        aria-label="Уменьшить размер шрифта"
      >
        <Minus className="size-4" />
      </Button>

      <Combobox
        items={PRESETS}
        filter={null}
        value={String(size)}
        onValueChange={(value) => {
          if (value != null) applySize(Number(value));
        }}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        disabled={disabled}
      >
        <ComboboxInput
          className="h-8 w-12 text-center text-sm"
          placeholder="16"
          showTrigger={false}
          aria-label="Размер шрифта"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const parsed = parseInt(inputValue, 10);
              if (!Number.isNaN(parsed)) {
                applySize(parsed);
              }
              (e.currentTarget as HTMLInputElement).blur();
            }
          }}
        />

        <ComboboxContent className="w-12 min-w-0">
          <ComboboxEmpty>Нет совпадений</ComboboxEmpty>
          <ComboboxList>
            {(preset) => (
              <ComboboxItem
                key={preset}
                value={String(preset)}
                className="data-[selected]:bg-accent data-[selected]:font-medium"
              >
                {preset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => applySize(size + 1)}
        disabled={size >= MAX_SIZE || disabled}
        aria-label="Увеличить размер шрифта"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
