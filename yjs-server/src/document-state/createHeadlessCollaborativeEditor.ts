import type { BindingV2, Provider } from '@lexical/yjs';
import type { Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement, SerializedEditorState } from 'lexical';

import { createHeadlessEditor } from '@lexical/headless';
import {
  createBindingV2__EXPERIMENTAL,
  syncLexicalUpdateToYjsV2__EXPERIMENTAL,
  syncYjsChangesToLexicalV2__EXPERIMENTAL,
} from '@lexical/yjs';
import { type YEvent, applyUpdate, Doc, Transaction } from 'yjs';

export default function headlessConvertYDocStateToLexicalJSON(
  nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>,
  yDocState: Uint8Array
): SerializedEditorState {
  return withHeadlessCollaborationEditor(nodes, (editor, binding) => {
    applyUpdate(binding.doc, yDocState, { isUpdateRemote: true });
    editor.update(() => {}, { discrete: true });

    return editor.getEditorState().toJSON();
  });
}

export function withHeadlessCollaborationEditor<T>(
  nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>,
  callback: (editor: LexicalEditor, binding: BindingV2, provider: Provider) => T
): T {
  const editor = createHeadlessEditor({
    nodes,
    onError: (error) => {
      throw error;
    },
  });

  const id = 'main';
  const doc = new Doc();
  const docMap = new Map([[id, doc]]);
  const provider = createNoOpProvider();
  const binding = createBindingV2__EXPERIMENTAL(editor, id, doc, docMap);

  const unsubscribe = registerCollaborationListeners(editor, provider, binding);

  const res = callback(editor, binding, provider);

  unsubscribe();

  return res;
}

function registerCollaborationListeners(editor: LexicalEditor, provider: Provider, binding: BindingV2): () => void {
  const unsubscribeUpdateListener = editor.registerUpdateListener(
    ({ dirtyElements, dirtyLeaves, editorState, normalizedNodes, prevEditorState, tags }) => {
      if (tags.has('skip-collab') === false) {
        syncLexicalUpdateToYjsV2__EXPERIMENTAL(
          binding,
          provider,
          prevEditorState,
          editorState,
          dirtyElements,
          dirtyLeaves,
          normalizedNodes,
          tags
        );
      }
    }
  );

  const observer = (events: Array<YEvent<any>>, transaction: Transaction) => {
    if (transaction.origin !== binding) {
      syncYjsChangesToLexicalV2__EXPERIMENTAL(binding, provider, events, transaction, false);
    }
  };

  binding.root.observeDeep(observer);

  return () => {
    unsubscribeUpdateListener();
    binding.root.unobserveDeep(observer);
  };
}

function createNoOpProvider(): Provider {
  const emptyFunction = () => {};

  return {
    awareness: {
      getLocalState: () => null,
      getStates: () => new Map(),
      off: emptyFunction,
      on: emptyFunction,
      setLocalState: emptyFunction,
      setLocalStateField: emptyFunction,
    },
    connect: emptyFunction,
    disconnect: emptyFunction,
    off: emptyFunction,
    on: emptyFunction,
  };
}
