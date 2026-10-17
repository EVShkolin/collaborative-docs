import { defineExtension } from 'lexical';
import { RichTextExtension } from '@lexical/rich-text';
import { AutoFocusExtension, EditorStateExtension } from '@lexical/extension';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { TreeViewExtension } from '@lexical/react/TreeViewExtension';

import { CollaborationPluginV2__EXPERIMENTAL } from '@lexical/react/LexicalCollaborationPlugin';
import { ExtensionComponent } from '@lexical/react/ExtensionComponent';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';
import type { Provider } from '@lexical/yjs';

const appExtension = defineExtension({
  dependencies: [RichTextExtension, EditorStateExtension, AutoFocusExtension, TreeViewExtension],
  name: 'My editor',
  namespace: 'My namespace',
  theme: {},
  $initialEditorState: null,
});

export const Editor = () => {
  const provider = useHocuspocusProvider();

  return (
    <LexicalCollaboration>
      <LexicalExtensionComposer extension={appExtension} contentEditable={null}>
        <CollaborationPluginV2__EXPERIMENTAL
          id={'test'}
          doc={provider.document}
          provider={provider as unknown as Provider}
        />
        <div className="flex items-center justify-center pt-[100px]">
          <ContentEditable className="w-[600px] h-[300px] border border-black outline-none"></ContentEditable>
        </div>
        {/*<ExtensionComponent lexical:extension={TreeViewExtension} viewClassName="treeViewOutput" />*/}
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
};
