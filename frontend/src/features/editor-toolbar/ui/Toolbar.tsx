import { HistoryButtons } from '@/features/editor-toolbar/ui/HistoryButtons.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { TextStyleDropdown } from '@/features/editor-toolbar/ui/TextStyleDropdown.tsx';
import { TextFormatButtons } from '@/features/editor-toolbar/ui/TextFormatButtons.tsx';
import { TextAlignButtons } from '@/features/editor-toolbar/ui/TextAlignButtons.tsx';
import { ListButtons } from '@/features/editor-toolbar/ui/ListButtons.tsx';
import { LinkButton } from '@/features/editor-toolbar/ui/LinkButton.tsx';
import { FontSizeGroup } from '@/features/editor-toolbar/ui/FontSizeGroup.tsx';
import { FontDropdown } from '@/features/editor-toolbar/ui/FontDropdown.tsx';
import { ExtensionComponent } from '@lexical/react/ExtensionComponent';
import { PagesReactExtension } from '@/features/document-pages';

export const Toolbar = () => {
  return (
    <div className="scrollbar-none flex h-12 items-center gap-0.5 overflow-x-auto border-t px-3 border-border">
      <HistoryButtons />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <TextStyleDropdown />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <FontDropdown />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <FontSizeGroup />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <TextFormatButtons />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <TextAlignButtons />
      <Separator orientation='vertical' className="h-5 my-auto mx-1.5" />
      <ListButtons />
      <LinkButton />
      <ExtensionComponent lexical:extension={PagesReactExtension} />
    </div>
  );
};