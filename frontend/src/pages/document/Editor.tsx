import { configExtension, defineExtension } from 'lexical';
import { RichTextExtension } from '@lexical/rich-text';
import { AutoFocusExtension, EditorStateExtension } from '@lexical/extension';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { TreeViewExtension } from '@lexical/react/TreeViewExtension';
import { PagesReactExtension } from '@/features/document-pages';
import { PageBreakExtension } from '@/features/document-pages';
import { HistoryExtension } from '@lexical/history';
import { MarkStateExtension } from '@lexical/mark';

import { CollaborationPluginV2__EXPERIMENTAL } from '@lexical/react/LexicalCollaborationPlugin';
import { ExtensionComponent } from '@lexical/react/ExtensionComponent';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';
import type { Provider } from '@lexical/yjs';
import '@/features/document-pages/ui/EditorPage.css';
import { EditorHeader } from '@/widgets/editor-header/ui/EditorHeader.tsx';
import { useState } from 'react';
import { ParticipantsPanel } from '@/features/document-participants';
import type { ParticipantRole, UserResponseDto } from '@/shared/api/model';
import { getRandomColor } from '@/shared/lib/getRandomColor.ts';
import { editorTheme } from '@/features/editor-toolbar/theme/EditorTheme.ts';
import { ListExtension } from '@lexical/list';
import { LinkExtension } from '@lexical/link';
import { LinkHoverCard } from '@/features/editor-toolbar';
import { CommentsPanel } from '@/features/comments';
import { DocumentSync } from './DocumentSync.tsx';

const appExtension = defineExtension({
  dependencies: [
    RichTextExtension,
    configExtension(EditorStateExtension, { $initialEditorState: null }),
    HistoryExtension,
    ListExtension,
    LinkExtension,
    MarkStateExtension,
    AutoFocusExtension,
    TreeViewExtension,
    PagesReactExtension,
    PageBreakExtension,
  ],
  name: 'Editor',
  namespace: 'CoDraft',
  theme: editorTheme,
  $initialEditorState: null,
});

export type EditorProps = {
  documentId: string;
  currentUser: UserResponseDto;
  role: ParticipantRole;
};

type RightPanel = 'participants' | 'comments' | null;

export const Editor = ({ documentId, currentUser, role }: EditorProps) => {
  const provider = useHocuspocusProvider();
  const [rightPanel, setRightPanel] = useState<RightPanel>(null);
  const editable = role === 'editor' || role === 'owner';

  const togglePanel = (panel: Exclude<RightPanel, null>) =>
    setRightPanel((current) => (current === panel ? null : panel));

  return (
    <LexicalCollaboration>
      <LexicalExtensionComposer extension={appExtension} contentEditable={null}>
        <DocumentSync editable={editable} />
        <CollaborationPluginV2__EXPERIMENTAL
          id={documentId}
          username={currentUser.name}
          awarenessData={{ userId: currentUser.id }}
          cursorColor={getRandomColor()}
          doc={provider.document}
          provider={provider as unknown as Provider}
          __shouldBootstrapUnsafe={false}
        />
        <LinkHoverCard />
        <div className="flex h-dvh flex-col overflow-hidden">
          <EditorHeader
            documentId={documentId}
            toolbarDisabled={!editable}
            onToggleParticipants={() => togglePanel('participants')}
            onToggleComments={() => togglePanel('comments')}
          />

          <div className="dot-grid relative flex min-h-0 flex-1 bg-editor transition-colors">
            <div
              className={`flex-1 overflow-y-auto transition-[padding] duration-300 ease-in-out ${
                rightPanel ? 'pr-80' : ''
              }`}
            >
              <div className="flex items-center justify-center pt-12">
                <ContentEditable className="outline-none" />
              </div>
              {/*<ExtensionComponent lexical:extension={TreeViewExtension} viewClassName="treeViewOutput" />*/}
            </div>

            <ParticipantsPanel
              documentId={documentId}
              isOpen={rightPanel === 'participants'}
              toggleOpen={() => togglePanel('participants')}
            />
            <CommentsPanel
              documentId={documentId}
              isOpen={rightPanel === 'comments'}
              toggleOpen={() => togglePanel('comments')}
            />
          </div>
        </div>
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
};
