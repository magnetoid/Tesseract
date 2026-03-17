import React, { useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  X, 
  ChevronRight, 
  FileCode, 
  FileJson, 
  FileText, 
  Hash, 
  Code2, 
  Terminal,
  Sparkles,
  Wand2,
  Search,
  Zap
} from 'lucide-react';
import { useAppStore } from '../../useAppStore';
import { useEditorStore } from '../../stores/editorStore';
import { cn } from '../../lib/utils';

export default function CodeEditorTab() {
  const { files, updateFileContent } = useAppStore();
  const { openFileIds, activeFileId, setActiveFile, closeFile } = useEditorStore();
  const [editorValue, setEditorValue] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const activeFile = files.find(f => f.id === activeFileId);
  const openFiles = openFileIds.map(id => files.find(f => f.id === id)).filter(Boolean);

  useEffect(() => {
    if (activeFile) {
      setEditorValue(activeFile.content || '');
    }
  }, [activeFileId, activeFile?.content]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFileId) {
      setEditorValue(value);
      updateFileContent(activeFileId, value);
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Custom theme matching #0a0a0c
    monaco.editor.defineTheme('tesseract-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0a0c',
        'editor.lineHighlightBackground': '#141416',
        'editorLineNumber.foreground': '#44444d',
        'editorLineNumber.activeForeground': '#e8e8ed',
        'editorIndentGuide.background': '#232328',
        'editor.selectionBackground': '#7c6ff740',
      }
    });
    monaco.editor.setTheme('tesseract-dark');

    // Add custom context menu items
    editor.addAction({
      id: 'ask-agent',
      label: 'Ask Agent',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: () => {
        console.log('Ask Agent triggered');
        // In a real app, this would open the chat with context
      }
    });

    editor.addAction({
      id: 'fix-this',
      label: 'Fix this',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 2,
      run: () => console.log('Fix this triggered')
    });

    editor.addAction({
      id: 'explain',
      label: 'Explain',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 3,
      run: () => console.log('Explain triggered')
    });

    editor.addAction({
      id: 'refactor',
      label: 'Refactor',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 4,
      run: () => console.log('Refactor triggered')
    });

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'tsx': return <FileCode size={14} className="text-violet-400" />;
      case 'ts': return <Code2 size={14} className="text-blue-400" />;
      case 'css': return <Hash size={14} className="text-amber-400" />;
      case 'json': return <FileJson size={14} className="text-gray-400" />;
      case 'md': return <FileText size={14} className="text-emerald-400" />;
      default: return <FileText size={14} className="text-[#6b6b7a]" />;
    }
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'tsx':
      case 'ts': return 'typescript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'html': return 'html';
      default: return 'plaintext';
    }
  };

  const getBreadcrumbs = () => {
    if (!activeFile) return [];
    const path = [];
    let current = activeFile;
    while (current) {
      path.unshift(current.name);
      if (current.parentId) {
        current = files.find(f => f.id === current.parentId) as any;
      } else {
        break;
      }
    }
    return path;
  };

  if (!activeFileId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#6b6b7a] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#141416] border border-[#232328] flex items-center justify-center">
          <Code2 size={32} />
        </div>
        <p className="text-sm font-medium">Select a file to edit</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0c] overflow-hidden">
      {/* EDITOR TAB BAR */}
      <div className="h-8 bg-[#141416] flex items-center overflow-x-auto no-scrollbar shrink-0">
        {openFiles.map((file) => file && (
          <div 
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={cn(
              "h-full flex items-center gap-2 px-3 border-r border-[#232328] min-w-[120px] max-w-[200px] cursor-pointer group transition-colors shrink-0",
              activeFileId === file.id ? "bg-[#0a0a0c] text-[#e8e8ed]" : "text-[#6b6b7a] hover:bg-[#1c1c20]"
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              file.name.endsWith('.tsx') ? "bg-violet-400" : 
              file.name.endsWith('.ts') ? "bg-blue-400" : 
              file.name.endsWith('.css') ? "bg-amber-400" : "bg-gray-400"
            )} />
            <span className="text-xs truncate flex-1">{file.name}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="p-0.5 rounded hover:bg-[#232328] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* BREADCRUMB */}
      <div className="h-6 px-3 flex items-center gap-1 text-[10px] text-[#44444d] border-b border-[#232328] bg-[#0a0a0c] shrink-0">
        {getBreadcrumbs().map((part, idx, arr) => (
          <React.Fragment key={idx}>
            <span className={cn(idx === arr.length - 1 && "text-[#6b6b7a]")}>{part}</span>
            {idx < arr.length - 1 && <ChevronRight size={10} />}
          </React.Fragment>
        ))}
      </div>

      {/* MONACO EDITOR */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getLanguage(activeFile.name)}
          value={editorValue}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            }
          }}
        />
      </div>

      {/* BOTTOM STATUS */}
      <div className="h-6 px-3 flex items-center justify-between text-[10px] text-[#44444d] border-t border-[#232328] bg-[#0a0a0c] shrink-0">
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Saved
          </span>
          <span className="uppercase">{getLanguage(activeFile.name)}</span>
        </div>
      </div>
    </div>
  );
}
