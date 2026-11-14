import type { PageSetup, PageSize } from '@/features/document-pages/PagesExtension/types.ts';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue';
import { type JSX, useCallback } from 'react';

import { DEFAULT_PAGE_SETUP, PAGE_SIZES } from '@/features/document-pages/PagesExtension/constants.ts';
import { $setPageSetup, marginsIsEqual } from '@/features/document-pages/PagesExtension/pageSetup.ts';
import { PagesExtension } from '@/features/document-pages/PagesExtension';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { ChevronDown, FileText } from 'lucide-react';

const MARGIN_PRESETS: readonly {
  label: string;
  margins: PageSetup['margins'];
}[] = [
  {
    label: 'Narrow (0.25")',
    margins: { bottom: 0.25, left: 0.25, right: 0.25, top: 0.25 },
  },
  {
    label: 'Normal (0.4")',
    margins: { ...DEFAULT_PAGE_SETUP.margins },
  },
  {
    label: 'Moderate (0.75")',
    margins: { bottom: 0.75, left: 0.75, right: 0.75, top: 0.75 },
  },
  {
    label: 'Wide (1")',
    margins: { bottom: 1, left: 1, right: 1, top: 1 },
  },
];

const PAGE_SIZE_ORDER: PageSize[] = [
  'A4',
  'Letter',
  'Legal',
  'Tabloid',
  'A3',
  'A5',
  'B4',
  'B5',
  'Statement',
  'Executive',
  'Folio',
];

export type PageSetupDropdownProps = {
  disabled?: boolean;
};

/**
 * Output component for {@link PageExtension}. Render via
 * {@link @lexical/react/ExtensionComponent | ExtensionComponent} or
 * {@link @lexical/react/useExtensionComponent | useExtensionComponent}.
 */
export function PageSetupDropdownComponent({ disabled = false }: PageSetupDropdownProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const pageSetup = useExtensionSignalValue(PagesExtension, 'pageSetup');

  const applyUpdate = useCallback(
    (v: null | Partial<PageSetup>) => {
      editor.update(() => {
        $setPageSetup(v ? (prev) => ({ ...(prev || DEFAULT_PAGE_SETUP), ...v }) : v);
      });
    },
    [editor]
  );

  return (
    <DropdownMenu disabled={disabled}>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <FileText /> <ChevronDown />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Page size</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem className={pageSetup === null ? 'bg-accent' : ''} onClick={() => applyUpdate(null)}>
                Pageless
              </DropdownMenuItem>
              {PAGE_SIZE_ORDER.map((size) => (
                <DropdownMenuItem
                  key={size}
                  className={pageSetup?.pageSize === size ? 'bg-accent' : ''}
                  onClick={() => applyUpdate({ pageSize: size })}
                >
                  {PAGE_SIZES[size].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Orientation</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className={pageSetup?.orientation === 'portrait' ? 'bg-accent' : ''}
                onClick={() => applyUpdate({ orientation: 'portrait' })}
              >
                Portrait
              </DropdownMenuItem>
              <DropdownMenuItem
                className={pageSetup?.orientation === 'landscape' ? 'bg-accent' : ''}
                onClick={() => applyUpdate({ orientation: 'landscape' })}
              >
                Landscape
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Margins</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {MARGIN_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.label}
                  className={
                    marginsIsEqual(pageSetup?.margins ?? DEFAULT_PAGE_SETUP.margins, preset.margins) ? 'bg-accent' : ''
                  }
                  onClick={() => applyUpdate({ margins: preset.margins })}
                >
                  {preset.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
