import { $getDocument, ElementNode, type LexicalNode } from 'lexical';

export class PageContentNode extends ElementNode {
  static getType(): string {
    return 'page-content';
  }

  static clone(node: PageContentNode): PageContentNode {
    return new PageContentNode(node.__key);
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('div');
  }

  updateDOM(): boolean {
    return false;
  }

  isShadowRoot(): boolean {
    return true;
  }

  excludeFromCopy(): boolean {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canBeEmpty(): boolean {
    return false;
  }
}

export class PageNode extends ElementNode {
  static getType(): string {
    return 'page';
  }

  static clone(node: PageNode): PageNode {
    return new PageNode(node.__key);
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement('div');
  }

  updateDOM(): boolean {
    return false;
  }

  excludeFromCopy(): boolean {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createPageContentNode(): PageContentNode {
  return new PageContentNode();
}

export function $createPageNode(): PageNode {
  return new PageNode().append($createPageContentNode());
}

export function $isPageNode(node: LexicalNode | null | undefined): node is PageNode {
  return node instanceof PageNode;
}

export function $isPageContentNode(node: LexicalNode | null | undefined): node is PageContentNode {
  return node instanceof PageContentNode;
}
