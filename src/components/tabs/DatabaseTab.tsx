import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { 
  Database, 
  ChevronDown, 
  Search, 
  Plus, 
  Trash2, 
  Play, 
  History, 
  Code2, 
  Table as TableIcon,
  Check,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { cn } from '../../lib/utils';

interface TableData {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: any[];
}

const MOCK_TABLES: TableData[] = [
  {
    id: 'users',
    name: 'users',
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'email', type: 'text' },
      { name: 'full_name', type: 'text' },
      { name: 'age', type: 'int4' },
      { name: 'is_active', type: 'bool' },
      { name: 'created_at', type: 'timestamp' },
    ],
    rows: [
      { id: 'u1', email: 'marko.tiosavljevic@gmail.com', full_name: 'Marko Tiosavljevic', age: 28, is_active: true, created_at: '2026-03-17 10:00:00' },
      { id: 'u2', email: 'jane.doe@example.com', full_name: 'Jane Doe', age: 32, is_active: true, created_at: '2026-03-16 14:30:00' },
      { id: 'u3', email: 'bob.smith@test.com', full_name: 'Bob Smith', age: 45, is_active: false, created_at: '2026-03-15 09:15:00' },
    ]
  },
  {
    id: 'posts',
    name: 'posts',
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'title', type: 'text' },
      { name: 'content', type: 'text' },
      { name: 'author_id', type: 'uuid' },
      { name: 'published', type: 'bool' },
    ],
    rows: [
      { id: 'p1', title: 'Hello Tesseract', content: 'This is my first post on Tesseract IDE!', author_id: 'u1', published: true },
      { id: 'p2', title: 'Building with AI', content: 'AI-first coding is the future of software development.', author_id: 'u1', published: true },
    ]
  },
  {
    id: 'sessions',
    name: 'sessions',
    columns: [
      { name: 'id', type: 'uuid' },
      { name: 'user_id', type: 'uuid' },
      { name: 'token', type: 'text' },
      { name: 'expires_at', type: 'timestamp' },
    ],
    rows: []
  }
];

export default function DatabaseTab() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTableId, setActiveTableId] = useState('users');
  const [viewMode, setViewMode] = useState<'table' | 'sql'>('table');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
  
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0c] p-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/10">
          <Database size={40} className="text-violet-400" />
        </div>
        <h2 className="text-xl font-bold text-[#e8e8ed] mb-2">No database connected</h2>
        <p className="text-sm text-[#6b6b7a] mb-8 text-center max-w-md">
          Connect a database to view tables, run SQL queries, and manage your project's data.
        </p>
        <button 
          onClick={() => setIsConnected(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-400 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          Connect Database
        </button>
        <p className="mt-6 text-[10px] text-[#44444d] uppercase tracking-widest font-bold">
          Ask the agent to add a database to your project
        </p>
      </div>
    );
  }
  const [queryHistory] = useState([
    'SELECT * FROM users WHERE age > 30;',
    'UPDATE posts SET published = true WHERE author_id = \'u1\';',
    'DELETE FROM sessions WHERE expires_at < NOW();',
    'SELECT email, full_name FROM users ORDER BY created_at DESC;',
    'INSERT INTO posts (title, content) VALUES (\'New Post\', \'Content here\');'
  ]);

  const activeTable = MOCK_TABLES.find(t => t.id === activeTableId) || MOCK_TABLES[0];

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === activeTable.rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(activeTable.rows.map(r => r.id));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0c] overflow-hidden">
      {/* HEADER */}
      <div className="h-9 bg-[#141416] flex items-center justify-between px-3 shrink-0 border-b border-[#232328]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#6b6b7a]">
            <Database size={14} />
            <span className="text-xs font-medium">Database</span>
          </div>
          
          <div className="w-[1px] h-4 bg-[#232328]" />

          <Select.Root value={activeTableId} onValueChange={setActiveTableId}>
            <Select.Trigger className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1c1c20] text-xs text-[#e8e8ed] outline-none transition-colors">
              <Select.Value />
              <Select.Icon>
                <ChevronDown size={12} className="text-[#44444d]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-[#1c1c20] border border-[#232328] rounded-lg p-1 shadow-2xl z-50">
                <Select.Viewport>
                  {MOCK_TABLES.map(table => (
                    <Select.Item 
                      key={table.id} 
                      value={table.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-[#e8e8ed] hover:bg-violet-500 rounded cursor-pointer outline-none"
                    >
                      <Select.ItemText>{table.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <div className="flex items-center gap-1 ml-2">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
                viewMode === 'table' ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
              )}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('sql')}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
                viewMode === 'sql' ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
              )}
            >
              SQL Editor
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected
          </div>
          <button className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {viewMode === 'table' ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* TABLE GRID */}
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[#141416] border-b border-[#232328]">
                  <tr>
                    <th className="w-10 p-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.length === activeTable.rows.length && activeTable.rows.length > 0}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 rounded border-[#232328] bg-[#0a0a0c] text-violet-500 focus:ring-violet-500/20"
                      />
                    </th>
                    {activeTable.columns.map(col => (
                      <th key={col.name} className="p-2 border-r border-[#232328] last:border-r-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#e8e8ed]">{col.name}</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-[#1c1c20] text-[#6b6b7a] font-mono uppercase tracking-tighter">
                            {col.type}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232328]">
                  {activeTable.rows.map((row, idx) => (
                    <tr 
                      key={row.id} 
                      className={cn(
                        "hover:bg-[#1c1c20] transition-colors group",
                        idx % 2 === 0 ? "bg-[#0a0a0c]" : "bg-[#0d0d0f]"
                      )}
                    >
                      <td className="p-2 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="w-3.5 h-3.5 rounded border-[#232328] bg-[#0a0a0c] text-violet-500 focus:ring-violet-500/20"
                        />
                      </td>
                      {activeTable.columns.map(col => (
                        <td key={col.name} className="p-2 border-r border-[#232328] last:border-r-0 text-xs text-[#6b6b7a] font-mono truncate max-w-[200px] cursor-text hover:text-[#e8e8ed]">
                          {String(row[col.name])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {activeTable.rows.length === 0 && (
                    <tr>
                      <td colSpan={activeTable.columns.length + 1} className="p-10 text-center text-[#44444d] text-xs italic">
                        No rows found in this table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="h-10 bg-[#141416] border-t border-[#232328] flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#6b6b7a]">{activeTable.rows.length} rows</span>
                {selectedRows.length > 0 && (
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors">
                    <Trash2 size={12} />
                    Delete {selectedRows.length} selected
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-wider hover:bg-violet-500/20 transition-colors">
                  <Plus size={12} />
                  Add Row
                </button>
                <div className="w-[1px] h-4 bg-[#232328] mx-1" />
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 text-[10px] text-[#44444d] hover:text-[#e8e8ed] disabled:opacity-30" disabled>Previous</button>
                  <button className="px-2 py-1 text-[10px] text-[#44444d] hover:text-[#e8e8ed] disabled:opacity-30" disabled>Next</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* SQL EDITOR */}
            <div className="h-[40%] border-b border-[#232328] flex flex-col bg-[#0a0a0c]">
              <div className="h-8 flex items-center justify-between px-3 border-b border-[#232328] shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 size={12} className="text-[#44444d]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b7a]">Query Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select.Root>
                    <Select.Trigger className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-[#1c1c20] text-[10px] text-[#6b6b7a] outline-none transition-colors">
                      <History size={10} />
                      History
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-[#1c1c20] border border-[#232328] rounded-lg p-1 shadow-2xl z-50 max-w-[300px]">
                        <Select.Viewport>
                          {queryHistory.map((q, i) => (
                            <Select.Item 
                              key={i} 
                              value={q}
                              className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-[#6b6b7a] hover:bg-violet-500 hover:text-white rounded cursor-pointer outline-none truncate"
                            >
                              <Select.ItemText>{q}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-violet-400 transition-colors shadow-lg shadow-violet-500/20">
                    <Play size={10} />
                    Run
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language="sql"
                  theme="vs-dark"
                  value={sqlQuery}
                  onChange={(v) => setSqlQuery(v || '')}
                  options={{
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    padding: { top: 8 },
                  }}
                />
              </div>
            </div>

            {/* RESULTS VIEW */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#0d0d0f]">
              <div className="h-8 flex items-center px-3 border-b border-[#232328] shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b6b7a]">Results</span>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#141416] border-b border-[#232328]">
                    <tr>
                      {activeTable.columns.map(col => (
                        <th key={col.name} className="p-2 border-r border-[#232328] last:border-r-0 text-[10px] font-medium text-[#6b6b7a] uppercase tracking-wider">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232328]">
                    {activeTable.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#1c1c20] transition-colors">
                        {activeTable.columns.map(col => (
                          <td key={col.name} className="p-2 border-r border-[#232328] last:border-r-0 text-xs text-[#6b6b7a] font-mono truncate">
                            {String(row[col.name])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
