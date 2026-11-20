import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isLinkNode } from '@lexical/link';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Toggle } from '@/shared/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useLinkEditor } from '@/features/editor-toolbar/hook/useLinkEditor.ts';

export const LinkButton = ({ disabled }: { disabled: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const { state, open, close, save } = useLinkEditor();
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const anchorNode = selection.anchor.getNode();
        setIsActive($isLinkNode(anchorNode) || $isLinkNode(anchorNode.getParent()));
      });
    });
  }, [editor]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state.open) setInputValue(state.url);
  }, [state]);

  useEffect(() => {
    if (!state.open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [state.open, close]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    save(inputValue.trim());
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Toggle
              disabled={disabled}
              size="sm"
              pressed={isActive}
              onPressedChange={open}
              aria-label={isActive ? 'Редактировать ссылку' : 'Добавить ссылку'}
            >
              <LinkIcon className="size-4" />
            </Toggle>
          }
        />
        <TooltipContent>Ссылка</TooltipContent>
      </Tooltip>

      {state.open && state.anchorRect && (
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: state.anchorRect.bottom + 6,
            left: state.anchorRect.left,
            zIndex: 50,
          }}
          className="w-80 rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              autoFocus
              placeholder="https://example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              {state.isExisting && (
                <Button type="button" variant="ghost" size="sm" onClick={() => save('')}>
                  Удалить
                </Button>
              )}
              <Button type="submit" size="sm">
                Сохранить
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
