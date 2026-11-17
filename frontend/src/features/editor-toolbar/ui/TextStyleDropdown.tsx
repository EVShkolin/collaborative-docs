import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3';

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: 'Обычный',
  h1: 'Заголовок 1',
  h2: 'Заголовок 2',
  h3: 'Заголовок 3',
};

export const TextStyleDropdown = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(element)) {
          setBlockType(element.getTag() as BlockType);
        } else if (element.getType() === 'paragraph') {
          setBlockType('paragraph');
        }
      });
    });
  }, [editor]);

  const formatHeading = (type: BlockType) => {
    if (blockType === type) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      $patchStyleText(selection, {
        'font-size': null,
      });

      $setBlocksType(selection, () => (type === 'paragraph' ? $createParagraphNode() : $createHeadingNode(type)));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-1 text-sm font-normal w-30">
            {BLOCK_LABELS[blockType]}
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuRadioGroup value={blockType} onValueChange={(value) => formatHeading(value as BlockType)}>
          <DropdownMenuLabel>Стиль текста</DropdownMenuLabel>
          {(['paragraph', 'h1', 'h2', 'h3'] as BlockType[]).map((type) => (
            <DropdownMenuRadioItem key={type} value={type}>
              {BLOCK_LABELS[type]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
