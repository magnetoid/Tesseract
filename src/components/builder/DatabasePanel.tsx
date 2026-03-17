import React, { useState, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Database, Table as TableIcon, Code, Search, Plus, Trash2, Edit2, Play, History, Info, X, ChevronRight } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useDatabaseStore, TableDefinition, ColumnDefinition } from '../../stores/databaseStore';
import { useAppStore } from '../../useAppStore';
import { cn } from '../../lib/utils';

export function DatabasePanel() {
  const { tables, activeTableId, setActiveTable, addRow, updateCell, deleteRow, queryHistory, addQueryToHistory } = useDatabaseStore();
  const setDatabaseOpen = useAppStore(state => state.setDatabaseOpen);
  
  const [view, setView] = useState<'tables' | 'sql' | 'schema'>('tables');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  const handleRunQuery = async () => {
    setIsExecuting(true);
    addQueryToHistory(sqlQuery);
    
    // Mock query execution
    await new Promise(r => setTimeout(r, 600));
    
    if (sqlQuery.toLowerCase().includes('select * from users')) {
      setQueryResult(tables.find(t => t.name === 'users')?.rows || []);
    } else if (sqlQuery.toLowerCase().includes('select * from projects')) {
      setQueryResult(tables.find(t => t.name === 'projects')?.rows || []);
    } else {
      setQueryResult([{ message: 'Query executed successfully. 1 row affected.' }]);
    }
    
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] border-l border-[#2a2a30] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-12 border-b border-[#2a2a30] flex items-center justify-between px-4 bg-[#141416]">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-violet-400" />
          <span className="text-sm font-bold text-[#e8e8ed]">Supabase Database</span>
        </div>
        
        <div className="flex items-center gap-1 bg-[#0d0d0f] p-1 rounded-md border border-[#2a2a30]">
          <button 
            onClick={() => setView('tables')}
            className={cn(
              "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
              view === 'tables' ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
            )}
          >
            Tables
          </button>
          <button 
            onClick={() => setView('sql')}
            className={cn(
              "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
              view === 'sql' ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
            )}
          >
            SQL Editor
          </button>
          <button 
            onClick={() => setView('schema')}
            className={cn(
              "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all",
              view === 'schema' ? "bg-violet-500/20 text-violet-400" : "text-[#6b6b7a] hover:text-[#e8e8ed]"
            )}
          >
            Schema
          </button>
        </div>

        <button 
          onClick={() => setDatabaseOpen(false)}
          className="p-1.5 text-[#6b6b7a] hover:text-[#e8e8ed] hover:bg-[#1c1c20] rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'tables' && (
          <>
            {/* Table Tabs */}
            <div className="flex items-center gap-1 px-2 pt-2 bg-[#141416] border-b border-[#2a2a30] overflow-x-auto no-scrollbar">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-t-md border-t border-x transition-all flex items-center gap-2 shrink-0",
                    activeTableId === table.id 
                      ? "bg-[#0d0d0f] border-[#2a2a30] text-violet-400" 
                      : "bg-transparent border-transparent text-[#6b6b7a] hover:text-[#e8e8ed]"
                  )}
                >
                  <TableIcon size={12} />
                  {table.name}
                </button>
              ))}
            </div>

            {/* Table View */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea.Root className="flex-1 overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full">
                  <table className="w-full border-collapse text-xs text-[#e8e8ed]">
                    <thead className="sticky top-0 bg-[#1c1c20] z-10 shadow-sm">
                      <tr>
                        {activeTable.columns.map(col => (
                          <th key={col.name} className="px-4 py-2 text-left border-b border-[#2a2a30] font-mono text-[10px] text-[#6b6b7a] uppercase tracking-wider">
                            <div className="flex flex-col">
                              <span>{col.name}</span>
                              <span className="text-[9px] lowercase opacity-50 font-normal">{col.type}</span>
                            </div>
                          </th>
                        ))}
                        <th className="w-10 border-b border-[#2a2a30]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232328]">
                      {activeTable.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-[#141416] group transition-colors">
                          {activeTable.columns.map(col => (
                            <td key={col.name} className="px-4 py-2 border-r border-[#232328]/30">
                              <input 
                                type="text"
                                value={row[col.name]}
                                onChange={(e) => updateCell(activeTable.id, rowIndex, col.name, e.target.value)}
                                className="bg-transparent border-none outline-none w-full focus:text-violet-400 transition-colors"
                              />
                            </td>
                          ))}
                          <td className="px-2 text-center">
                            <button 
                              onClick={() => deleteRow(activeTable.id, rowIndex)}
                              className="p-1 text-[#6b6b7a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent hover:bg-[#1c1c20] w-2.5 transition-colors">
                  <ScrollArea.Thumb className="flex-1 bg-[#2a2a30] rounded-[10px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>

              {/* Table Footer */}
              <div className="h-10 border-t border-[#2a2a30] bg-[#141416] px-4 flex items-center justify-between shrink-0">
                <div className="text-[10px] text-[#6b6b7a] font-medium uppercase tracking-wider">
                  {activeTable.rows.length} rows
                </div>
                <button 
                  onClick={() => addRow(activeTable.id, {})}
                  className="flex items-center gap-1.5 px-2 py-1 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                >
                  <Plus size={12} />
                  Add Row
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'sql' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 border-b border-[#2a2a30]">
              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={sqlQuery}
                onChange={(val) => setSqlQuery(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono", monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 }
                }}
              />
            </div>
            
            <div className="h-12 bg-[#141416] border-b border-[#2a2a30] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleRunQuery}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg transition-all disabled:opacity-50"
                >
                  {isExecuting ? <Play size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                  Run Query
                </button>
                
                <div className="flex items-center gap-2 text-[10px] text-[#6b6b7a] font-bold uppercase tracking-widest">
                  <History size={12} />
                  History
                  <select 
                    className="bg-transparent border-none outline-none text-violet-400 cursor-pointer"
                    onChange={(e) => setSqlQuery(e.target.value)}
                  >
                    <option value="">Recent...</option>
                    {queryHistory.map((q, i) => (
                      <option key={i} value={q}>{q.slice(0, 20)}...</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#0a0a0c] overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-[#232328] text-[10px] font-bold text-[#6b6b7a] uppercase tracking-widest">
                Results
              </div>
              <ScrollArea.Root className="flex-1 overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full p-4">
                  {queryResult ? (
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead>
                        <tr>
                          {Object.keys(queryResult[0] || {}).map(key => (
                            <th key={key} className="pb-2 text-[#6b6b7a] font-medium border-b border-[#232328] pr-4">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="py-2 text-[#e8e8ed] border-b border-[#232328]/50 pr-4">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#6b6b7a] gap-2 opacity-50">
                      <Code size={32} strokeWidth={1} />
                      <p className="text-xs">Run a query to see results</p>
                    </div>
                  )}
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </div>
          </div>
        )}

        {view === 'schema' && (
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="w-full h-full p-6">
              <div className="flex flex-col gap-8">
                {tables.map(table => (
                  <div key={table.id} className="bg-[#141416] rounded-xl border border-[#232328] overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-[#1c1c20] border-b border-[#232328] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TableIcon size={14} className="text-violet-400" />
                        <span className="text-sm font-bold text-[#e8e8ed]">{table.name}</span>
                      </div>
                      <div className="text-[10px] text-[#6b6b7a] font-medium uppercase tracking-wider">
                        {table.columns.length} columns
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      {table.columns.map(col => (
                        <div key={col.name} className="flex items-center justify-between py-1.5 border-b border-[#232328]/50 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[#e8e8ed]">{col.name}</span>
                            <span className="text-[10px] text-[#6b6b7a] bg-[#0d0d0f] px-1.5 py-0.5 rounded border border-[#232328]">{col.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {col.isPK && <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">PK</span>}
                            {col.isFK && <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-1 rounded border border-blue-500/20">FK</span>}
                            {col.isUnique && <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">UNIQUE</span>}
                            {!col.isNullable && <span className="text-[9px] font-black text-zinc-500 bg-zinc-500/10 px-1 rounded border border-zinc-500/20">NOT NULL</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-4 border-2 border-dashed border-[#232328] rounded-xl text-[#6b6b7a] hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                  <Plus size={16} />
                  Add New Table
                </button>
              </div>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        )}
      </div>
    </div>
  );
}
