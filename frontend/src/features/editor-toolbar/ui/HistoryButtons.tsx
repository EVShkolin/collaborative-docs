import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { UNDO_COMMAND, REDO_COMMAND, CLEAR_HISTORY_COMMAND } from 'lexical';
import { HistoryExtension } from '@lexical/history';
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue';
import { Button } from '@/shared/ui/button';
import { Redo, Undo } from 'lucide-react';
import { useHocuspocusEvent } from '@hocuspocus/provider-react';

export const HistoryButtons = () => {
  const [editor] = useLexicalComposerContext();
  const canUndo = useExtensionSignalValue(HistoryExtension, 'canUndo');
  const canRedo = useExtensionSignalValue(HistoryExtension, 'canRedo');

  useHocuspocusEvent('synced', () => {
    setTimeout(() => editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined), 0)
  });

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
        aria-label="Отменить"
      >
        <Undo />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
        aria-label="Повторить"
      >
        <Redo />
      </Button>
    </div>
  );
};