import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Dialog from '@radix-ui/react-dialog';
import Editor, { useMonaco } from '@monaco-editor/react';
import { 
  ChevronRight, 
  ChevronDown, 
  FileJson, 
  FileCode2, 
  FileType2, 
  File, 
  Plus, 
  X, 
  ChevronLeft,
  Folder,
  FolderOpen,
  FolderPlus,
  Code2
} from 'lucide-react';
import AgentPanel from './AgentPanel';
import BottomPanel from './BottomPanel';
import { useAppStore, FileNode } from './useAppStore';
import { cn } from './utils';

const getFileIcon = (extension?: string) => {
  switch (extension) {
    case 'tsx': return <FileCode2 size={14} className="text-violet-400" />;
    case 'ts': return <FileType2 size={14} className="text-blue-400" />;
    case 'css': return <FileCode2 size={14} className="text-amber-300" />;
    case 'json': return <FileJson size={14} className="text-gray-400" />;
    default: return <File size={14} className="text-gray-400" />;
  }
};

const getLanguageFromExtension = (extension?: string) => {
  switch (extension) {
    case 'tsx': return 'typescript';
    case 'ts': return 'typescript';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'html': return 'html';
    default: return 'plaintext';
  }
};

const FileTreeItem = ({ item, level = 0, activeId, onSelect, onCreateFile, onCreateFolder, onRename, onDelete }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === 'folder';
  const isActive = activeId === item.id;

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div className="flex flex-col">
          {isFolder ? (
            <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
              <Collapsible.Trigger asChild>
                <div 
                  className={cn(
                    "flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none text-sm transition-colors text-[#e8e8ed] hover:bg-[#2a2a30] border-l-2 border-transparent"
                  )}
                  style={{ paddingLeft: `${level * 12 + 8}px` }}
                >
                  <span className="text-[#6b6b7a]">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  {isOpen ? <FolderOpen size={14} className="text-blue-400" /> : <Folder size={14} className="text-blue-400" />}
                  <span className="truncate">{item.name}</span>
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <div className="flex flex-col">
                  {item.children?.map((child: any) => (
                    <FileTreeItem 
                      key={child.id} 
                      item={child} 
                      level={level + 1} 
                      activeId={activeId}
                      onSelect={onSelect}
                      onCreateFile={onCreateFile}
                      onCreateFolder={onCreateFolder}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          ) : (
            <div 
              className={cn(
                "flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none text-sm transition-colors",
                isActive ? "bg-violet-500/10 text-violet-300 border-l-2 border-violet-500" : "text-[#e8e8ed] hover:bg-[#2a2a30] border-l-2 border-transparent"
              )}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => onSelect(item.id)}
            >
              <span className="w-3.5" />
              {getFileIcon(item.extension)}
              <span className="truncate">{item.name}</span>
            </div>
          )}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] bg-[#1c1c20] border border-[#2a2a30] rounded-md p-1 shadow-xl z-50 text-sm text-[#e8e8ed]">
          {isFolder && (
            <>
              <ContextMenu.Item 
                className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-300 rounded-sm"
                onSelect={() => onCreateFile(item.id)}
              >
                New File
              </ContextMenu.Item>
              <ContextMenu.Item 
                className="px-2 py-1.5 outline-none cursor-pointer hover:bg-violet-500/20 hover:text-violet-300 rounded-sm"
                onSelect={() => onCreateFolder(item.id)}
              >
                New Folder
              </ContextMenu.Item>
              <ContextMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
            </>
          )}
          <ContextMenu.Item 
            className="px-2 py-1.5 outline-none cursor-pointer hover:bg-[#2a2a30] rounded-sm"
            onSelect={() => onRename(item.id, item.name)}
          >
            Rename
          </ContextMenu.Item>
          <ContextMenu.Item 
            className="px-2 py-1.5 outline-none cursor-pointer hover:bg-red-500/20 hover:text-red-400 rounded-sm"
            onSelect={() => onDelete(item.id)}
          >
            Delete
          </ContextMenu.Item>
          <ContextMenu.Separator className="h-[1px] bg-[#2a2a30] my-1" />
          <ContextMenu.Item className="px-2 py-1.5 outline-none cursor-pointer hover:bg-[#2a2a30] rounded-sm">
            Copy Path
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default function IDEShell() {
  // Sidebar resizing
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Agent panel collapsing
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);
  
  // Editor cursor position
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Store state
  const files = useAppStore(state => state.files);
  const openTabs = useAppStore(state => state.openTabs);
  const activeTab = useAppStore(state => state.activeTab);
  const openFile = useAppStore(state => state.openFile);
  const closeTab = useAppStore(state => state.closeTab);
  const updateFileContent = useAppStore(state => state.updateFileContent);
  const createFile = useAppStore(state => state.createFile);
  const deleteFile = useAppStore(state => state.deleteFile);
  const renameFile = useAppStore(state => state.renameFile);

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      updateFileContent(activeTab, value);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"]
    });
  };

  // Build file tree
  const fileTree = useMemo(() => {
    const buildTree = (parentId: string | null): any[] => {
      return files
        .filter(f => f.parentId === parentId)
        .sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'folder' ? -1 : 1;
        })
        .map(f => ({
          ...f,
          children: f.type === 'folder' ? buildTree(f.id) : undefined
        }));
    };
    return buildTree(null);
  }, [files]);

  const activeFileNode = files.find(f => f.id === activeTab);
  const openFileNodes = openTabs.map(id => files.find(f => f.id === id)).filter(Boolean) as FileNode[];

  useEffect(() => {
    if (!isDraggingSidebar) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Min 180px, Max 320px
      const newWidth = Math.min(Math.max(e.clientX, 180), 320);
      setSidebarWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      document.body.style.cursor = 'default';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar]);

  // Dialog state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: 'createFile' | 'createFolder' | 'rename' | 'delete';
    targetId: string | null;
    initialValue?: string;
  }>({ isOpen: false, type: 'createFile', targetId: null });
  const [dialogInput, setDialogInput] = useState('');

  const handleCreateFile = (parentId: string | null) => {
    setDialogState({ isOpen: true, type: 'createFile', targetId: parentId });
    setDialogInput('');
  };

  const handleCreateFolder = (parentId: string | null) => {
    setDialogState({ isOpen: true, type: 'createFolder', targetId: parentId });
    setDialogInput('');
  };

  const handleRename = (id: string, oldName: string) => {
    setDialogState({ isOpen: true, type: 'rename', targetId: id, initialValue: oldName });
    setDialogInput(oldName);
  };

  const handleDelete = (id: string) => {
    setDialogState({ isOpen: true, type: 'delete', targetId: id });
  };

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { type, targetId } = dialogState;
    const name = dialogInput.trim();

    if (type !== 'delete' && !name) return;

    if (type === 'createFile') {
      createFile(name, 'file', targetId);
    } else if (type === 'createFolder') {
      createFile(name, 'folder', targetId);
    } else if (type === 'rename' && targetId) {
      renameFile(targetId, name);
    } else if (type === 'delete' && targetId) {
      deleteFile(targetId);
    }

    setDialogState({ ...dialogState, isOpen: false });
  };

  return (
    <div className="flex flex-row h-full w-full overflow-hidden bg-[#0d0d0f]">
      
      {/* PANEL 1 — File tree sidebar */}
      <div 
        ref={sidebarRef}
        className="flex flex-col bg-[#141416] border-r border-[#2a2a30] shrink-0 relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="h-9 flex items-center justify-between px-4 border-b border-[#2a2a30] shrink-0">
          <span className="text-xs font-semibold text-[#6b6b7a] uppercase tracking-wider">Explorer</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleCreateFile(null)}
              className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#2a2a30] rounded transition-colors"
              title="New File"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={() => handleCreateFolder(null)}
              className="p-1 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#2a2a30] rounded transition-colors"
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
          </div>
        </div>
        
        <ScrollArea.Root className="flex-1 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full py-2">
            <div className="flex flex-col">
              {fileTree.map(item => (
                <FileTreeItem 
                  key={item.id} 
                  item={item} 
                  activeId={activeTab}
                  onSelect={openFile}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[#2a2a30] w-2 transition-colors">
            <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-[10px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Drag handle */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-violet-500/30 transition-colors z-10"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingSidebar(true);
            document.body.style.cursor = 'col-resize';
          }}
        />
      </div>

      {/* PANEL 2 — Editor area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f]">
        
        {/* Tab bar */}
        <div className="h-9 border-b border-[#2a2a30] flex items-center bg-[#141416] shrink-0">
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="w-full h-full">
              <div className="flex h-full">
                {openFileNodes.map(file => {
                  const isActive = activeTab === file.id;
                  return (
                    <div 
                      key={file.id}
                      onClick={() => openFile(file.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 h-full border-r border-[#2a2a30] cursor-pointer select-none min-w-[120px] max-w-[200px] group transition-colors",
                        isActive ? "bg-[#1c1c20] text-[#e8e8ed]" : "bg-[#141416] text-[#6b6b7a] hover:bg-[#1c1c20]/50 hover:text-[#e8e8ed]"
                      )}
                    >
                      {getFileIcon(file.extension)}
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(file.id);
                        }}
                        className={cn(
                          "p-0.5 rounded-md hover:bg-[#2a2a30] transition-colors",
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[#2a2a30] h-2 transition-colors">
              <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-[10px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          
          <div className="px-2 shrink-0 border-l border-[#2a2a30] h-full flex items-center">
            <button 
              onClick={() => handleCreateFile(null)}
              className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#2a2a30] rounded-md transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-grow relative">
          <div className="absolute inset-0 flex items-center justify-center text-[#6b6b7a] font-mono text-sm">
            {activeFileNode ? (
              <Editor
                height="100%"
                language={getLanguageFromExtension(activeFileNode.extension)}
                theme="vs-dark"
                value={activeFileNode.content || ''}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                }}
                loading={
                  <div className="flex flex-col items-center gap-4">
                    <Code2 size={48} className="opacity-20 animate-pulse" />
                    <span>Loading Editor...</span>
                  </div>
                }
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <File size={48} className="opacity-20" />
                <span>No file open</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel */}
        <BottomPanel />

        {/* Slim status bar */}
        <div className="h-6 bg-[#141416] border-t border-[#2a2a30] flex items-center justify-between px-3 text-xs text-[#6b6b7a] shrink-0">
          <div className="flex items-center gap-4">
            {activeFileNode ? (
              <>
                <span>{activeFileNode.name}</span>
                <span>UTF-8</span>
              </>
            ) : (
              <span>Ready</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {activeFileNode && <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>}
            {activeFileNode && <span>{getLanguageFromExtension(activeFileNode.extension)}</span>}
            <span>Prettier</span>
          </div>
        </div>
      </div>

      {/* PANEL 3 — Agent panel */}
      <div 
        className={cn(
          "border-l border-[#2a2a30] bg-[#141416] flex shrink-0 transition-all duration-200 ease-in-out relative",
          isAgentPanelOpen ? "w-80" : "w-8"
        )}
      >
        {/* Collapse toggle */}
        <button 
          onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-[#1c1c20] border border-[#2a2a30] rounded-full flex items-center justify-center text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#2a2a30] transition-colors z-20 shadow-md"
        >
          {isAgentPanelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {isAgentPanelOpen ? (
          <div className="w-full h-full overflow-hidden">
            <AgentPanel />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center py-4 gap-6">
            <div className="flex flex-col gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-gray-500" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[#6b6b7a] text-xs font-semibold tracking-[0.2em] -rotate-90 whitespace-nowrap select-none">
                AGENTS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File Operation Dialog */}
      <Dialog.Root open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState(prev => ({ ...prev, isOpen }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#2a2a30] bg-[#141416] p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
            <div className="flex flex-col gap-2">
              <Dialog.Title className="text-lg font-semibold text-[#e8e8ed]">
                {dialogState.type === 'createFile' && 'New File'}
                {dialogState.type === 'createFolder' && 'New Folder'}
                {dialogState.type === 'rename' && 'Rename'}
                {dialogState.type === 'delete' && 'Delete'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-[#6b6b7a]">
                {dialogState.type === 'delete' 
                  ? 'Are you sure you want to delete this? This action cannot be undone.'
                  : `Enter a name for the ${dialogState.type === 'createFolder' ? 'folder' : 'file'}.`
                }
              </Dialog.Description>
            </div>

            <form onSubmit={handleDialogSubmit} className="flex flex-col gap-4">
              {dialogState.type !== 'delete' && (
                <input
                  type="text"
                  value={dialogInput}
                  onChange={(e) => setDialogInput(e.target.value)}
                  placeholder={dialogState.type === 'createFolder' ? 'folder-name' : 'filename.ext'}
                  className="w-full bg-[#1c1c20] border border-[#2a2a30] rounded-md px-3 py-2 text-sm text-[#e8e8ed] focus:outline-none focus:border-violet-500"
                  autoFocus
                />
              )}
              
              <div className="flex justify-end gap-3 mt-2">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-[#e8e8ed] hover:bg-[#2a2a30] rounded-md transition-colors">
                    Cancel
                  </button>
                </Dialog.Close>
                <button 
                  type="submit"
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-white rounded-md transition-colors shadow-sm",
                    dialogState.type === 'delete' ? "bg-red-600 hover:bg-red-500" : "bg-violet-600 hover:bg-violet-500"
                  )}
                >
                  {dialogState.type === 'delete' ? 'Delete' : 'Confirm'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
