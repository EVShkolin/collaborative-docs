import { configExtension, defineExtension } from 'lexical';
import { RichTextExtension } from '@lexical/rich-text';
import { AutoFocusExtension, EditorStateExtension } from '@lexical/extension';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { TreeViewExtension } from '@lexical/react/TreeViewExtension';
import { PagesReactExtension } from '@/features/document-pages';
import { PageBreakExtension } from '@/features/document-pages';

import { CollaborationPluginV2__EXPERIMENTAL } from '@lexical/react/LexicalCollaborationPlugin';
import { ExtensionComponent } from '@lexical/react/ExtensionComponent';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';
import type { Provider } from '@lexical/yjs';
import '@/features/document-pages/ui/EditorPage.css';

const appExtension = defineExtension({
  dependencies: [
    RichTextExtension,
    configExtension(EditorStateExtension, { $initialEditorState: null }),
    AutoFocusExtension,
    TreeViewExtension,
    PagesReactExtension,
    PageBreakExtension,
  ],
  name: 'Editor',
  namespace: 'CoDraft',
  theme: {},
  $initialEditorState: null,
});

export const Editor = ({ documentId }: { documentId: string }) => {
  const provider = useHocuspocusProvider();

  return (
    <LexicalCollaboration>
      <LexicalExtensionComposer extension={appExtension} contentEditable={null}>
        <CollaborationPluginV2__EXPERIMENTAL
          id={documentId}
          doc={provider.document}
          provider={provider as unknown as Provider}
          __shouldBootstrapUnsafe={false}
        />
        <div className="flex items-center justify-center pt-[100px]">
          <ContentEditable className="outline-none"></ContentEditable>
        </div>
        <ExtensionComponent lexical:extension={PagesReactExtension} />
        <ExtensionComponent lexical:extension={TreeViewExtension} viewClassName="treeViewOutput" />
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
};
