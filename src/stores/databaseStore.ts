import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColumnType = 'text' | 'int4' | 'uuid' | 'timestamp' | 'bool';

export interface ColumnDefinition {
  name: string;
  type: ColumnType;
  isPK?: boolean;
  isFK?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  references?: string; // "table.column"
}

export interface TableDefinition {
  id: string;
  name: string;
  columns: ColumnDefinition[];
  rows: any[];
}

export interface DatabaseState {
  tables: TableDefinition[];
  queryHistory: string[];
  isProvisioning: boolean;
  isReady: boolean;
  activeTableId: string | null;
  
  // Actions
  provision: () => Promise<void>;
  addTable: (name: string, columns: ColumnDefinition[]) => void;
  deleteTable: (id: string) => void;
  addRow: (tableId: string, row: any) => void;
  updateCell: (tableId: string, rowIndex: number, column: string, value: any) => void;
  deleteRow: (tableId: string, rowIndex: number) => void;
  addQueryToHistory: (query: string) => void;
  setActiveTable: (id: string | null) => void;
}

const INITIAL_TABLES: TableDefinition[] = [
  {
    id: 't1',
    name: 'users',
    columns: [
      { name: 'id', type: 'uuid', isPK: true },
      { name: 'email', type: 'text', isUnique: true },
      { name: 'full_name', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'is_active', type: 'bool' },
    ],
    rows: [
      { id: 'u1', email: 'marko@tesseract.ai', full_name: 'Marko Tiosavljevic', created_at: '2026-03-16T10:00:00Z', is_active: true },
      { id: 'u2', email: 'jane@example.com', full_name: 'Jane Doe', created_at: '2026-03-16T11:30:00Z', is_active: true },
      { id: 'u3', email: 'bob@dev.io', full_name: 'Bob Smith', created_at: '2026-03-17T09:15:00Z', is_active: false },
    ]
  },
  {
    id: 't2',
    name: 'projects',
    columns: [
      { name: 'id', type: 'uuid', isPK: true },
      { name: 'name', type: 'text' },
      { name: 'user_id', type: 'uuid', isFK: true, references: 'users.id' },
      { name: 'description', type: 'text', isNullable: true },
    ],
    rows: [
      { id: 'p1', name: 'Tesseract Platform', user_id: 'u1', description: 'Next-gen AI IDE' },
      { id: 'p2', name: 'Personal Blog', user_id: 'u2', description: 'My daily thoughts' },
    ]
  },
  {
    id: 't3',
    name: 'messages',
    columns: [
      { name: 'id', type: 'int4', isPK: true },
      { name: 'content', type: 'text' },
      { name: 'sender_id', type: 'uuid', isFK: true, references: 'users.id' },
      { name: 'sent_at', type: 'timestamp' },
    ],
    rows: [
      { id: 1, content: 'Hello world!', sender_id: 'u1', sent_at: '2026-03-17T03:00:00Z' },
      { id: 2, content: 'Database is ready.', sender_id: 'u1', sent_at: '2026-03-17T03:05:00Z' },
    ]
  }
];

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set) => ({
      tables: INITIAL_TABLES,
      queryHistory: [],
      isProvisioning: false,
      isReady: false,
      activeTableId: 't1',

      provision: async () => {
        set({ isProvisioning: true });
        await new Promise(r => setTimeout(r, 2500));
        set({ isProvisioning: false, isReady: true });
      },

      addTable: (name, columns) => set((state) => ({
        tables: [...state.tables, { id: `t-${Date.now()}`, name, columns, rows: [] }]
      })),

      deleteTable: (id) => set((state) => ({
        tables: state.tables.filter(t => t.id !== id),
        activeTableId: state.activeTableId === id ? (state.tables.find(t => t.id !== id)?.id || null) : state.activeTableId
      })),

      addRow: (tableId, row) => set((state) => ({
        tables: state.tables.map(t => t.id === tableId ? { ...t, rows: [...t.rows, row] } : t)
      })),

      updateCell: (tableId, rowIndex, column, value) => set((state) => ({
        tables: state.tables.map(t => {
          if (t.id === tableId) {
            const newRows = [...t.rows];
            newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
            return { ...t, rows: newRows };
          }
          return t;
        })
      })),

      deleteRow: (tableId, rowIndex) => set((state) => ({
        tables: state.tables.map(t => {
          if (t.id === tableId) {
            const newRows = [...t.rows];
            newRows.splice(rowIndex, 1);
            return { ...t, rows: newRows };
          }
          return t;
        })
      })),

      addQueryToHistory: (query) => set((state) => ({
        queryHistory: [query, ...state.queryHistory.slice(0, 4)]
      })),

      setActiveTable: (id) => set({ activeTableId: id }),
    }),
    {
      name: 'tesseract-database-storage',
    }
  )
);
