import { $createParagraphNode, $getRoot, $setState, createState } from 'lexical';
import * as Y from 'yjs';
import { $createPageNode, $isPageContentNode, PageContentNode, PageNode } from './pageNode';
import { withHeadlessCollaborationEditor } from './createHeadlessCollaborativeEditor';

const DEFAULT_PAGE_SETUP = {
  margins: {
    bottom: 0.4,
    left: 0.4,
    right: 0.4,
    top: 0.4,
  },
  orientation: 'portrait' as const,
  pageSize: 'A4' as const,
};

const pageSetupState = createState('pageSetup', {
  parse: (v) => v,
});

export function createPageSeed(): Uint8Array {
  return withHeadlessCollaborationEditor([PageNode, PageContentNode], (editor, binding) => {
    editor.update(
      () => {
        const root = $getRoot();
        $setState(root, pageSetupState, DEFAULT_PAGE_SETUP);

        const page = $createPageNode();
        const pageContent = page.getFirstChild();
        if ($isPageContentNode(pageContent)) {
          pageContent.append($createParagraphNode());
        }
        root.append(page);
      },
      { discrete: true }
    );

    return Y.encodeStateAsUpdate(binding.doc);
  });
}
