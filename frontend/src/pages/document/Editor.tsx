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
import { EditorHeader } from '@/widgets/editor-header/ui/EditorHeader.tsx';
import { useState } from 'react';
import { ParticipantsPanel } from '@/features/document-participants/ui/ParticipantsPanel.tsx';
import type { UserResponseDto } from '@/shared/api/model';
import { getRandomColor } from '@/shared/lib/getRandomColor.ts';

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

export const Editor = ({ documentId, currentUser }: { documentId: string; currentUser: UserResponseDto }) => {
  const provider = useHocuspocusProvider();
  const [isParticipantsOpen, setIsParticipantsOpen] = useState<boolean>(false);

  return (
    <LexicalCollaboration>
      <LexicalExtensionComposer extension={appExtension} contentEditable={null}>
        <CollaborationPluginV2__EXPERIMENTAL
          id={documentId}
          username={currentUser.name}
          awarenessData={{ userId: currentUser.id }}
          cursorColor={getRandomColor()}
          doc={provider.document}
          provider={provider as unknown as Provider}
          __shouldBootstrapUnsafe={false}
        />
        <div className="flex h-dvh flex-col overflow-hidden">
          <EditorHeader documentId={documentId} toggleOpen={() => setIsParticipantsOpen((v) => !v)} />

          <div className="relative flex min-h-0 flex-1">
            <div
              className={`flex-1 overflow-y-auto transition-[padding] duration-300 ease-in-out ${
                isParticipantsOpen ? 'pr-80' : ''
              }`}
            >
              <div className="flex items-center justify-center pt-[100px]">
                <ContentEditable className="outline-none" />
              </div>
              <ExtensionComponent lexical:extension={PagesReactExtension} />
              <ExtensionComponent lexical:extension={TreeViewExtension} viewClassName="treeViewOutput" />
            </div>

            <ParticipantsPanel
              documentId={documentId}
              isOpen={isParticipantsOpen}
              toggleOpen={() => setIsParticipantsOpen((v) => !v)}
            />
          </div>
        </div>
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
};
