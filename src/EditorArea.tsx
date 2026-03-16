import React, { useState } from 'react';
import { FileCode, X } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function EditorArea() {
  const [activeTab, setActiveTab] = useState('index.tsx');

  const files: Record<string, { language: string, content: string }> = {
    'index.tsx': {
      language: 'typescript',
      content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`
    },
    'App.tsx': {
      language: 'typescript',
      content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold">Hello from ArrayIDE</h1>\n    </div>\n  );\n}`
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base">
      {/* Tab Bar */}
      <div className="h-10 flex bg-surface border-b border-border-dim shrink-0 overflow-x-auto no-scrollbar">
        {Object.keys(files).map((filename) => (
          <div 
            key={filename}
            onClick={() => setActiveTab(filename)}
            className={`flex items-center gap-2 px-3 py-2 border-r border-border-dim min-w-[120px] group cursor-pointer transition-colors ${
              activeTab === filename ? 'bg-elevated border-t-2 border-t-accent' : 'hover:bg-elevated'
            }`}
          >
            <FileCode size={14} className={activeTab === filename ? "text-accent" : "text-blue-400"} />
            <span className={`text-sm truncate ${activeTab === filename ? 'text-text-primary' : 'text-text-muted'}`}>
              {filename}
            </span>
            <X size={14} className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary ml-auto" />
          </div>
        ))}
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={files[activeTab].language}
          theme="vs-dark"
          value={files[activeTab].content}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 24,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
