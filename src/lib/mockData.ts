export const usageMock = {
  tokens: {
    used: 1200000,
    total: 2000000,
    breakdown: [
      { model: 'Claude 3.5 Sonnet', tokens: 450000, cost: 13.50, percentage: 37.5 },
      { model: 'GPT-4o', tokens: 350000, cost: 10.50, percentage: 29.2 },
      { model: 'DeepSeek V3', tokens: 250000, cost: 2.50, percentage: 20.8 },
      { model: 'Gemini 1.5 Pro', tokens: 150000, cost: 1.50, percentage: 12.5 },
    ]
  },
  sandboxHours: {
    used: 42,
    total: 100
  },
  projects: {
    used: 8,
    total: 25
  },
  teamStats: {
    used: 3,
    total: 'unlimited'
  },
  chartData: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Claude: Math.floor(Math.random() * 20000) + 10000,
      GPT: Math.floor(Math.random() * 15000) + 5000,
      DeepSeek: Math.floor(Math.random() * 10000) + 2000,
      Gemini: Math.floor(Math.random() * 8000) + 1000,
    };
  }),
  invoices: [
    { id: 'INV-001', date: 'Feb 28, 2026', amount: '$25.00', status: 'paid' },
    { id: 'INV-002', date: 'Jan 28, 2026', amount: '$25.00', status: 'paid' },
    { id: 'INV-003', date: 'Dec 28, 2025', amount: '$25.00', status: 'paid' },
  ],
  teamMembers: [
    { id: 'u1', name: 'Marko Tiosavljevic', email: 'marko.tiosavljevic@gmail.com', role: 'owner', avatar: 'https://i.pravatar.cc/150?u=marko', lastActive: 'Just now', status: 'online' },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah.c@tesseract.ai', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=sarah', lastActive: '2m ago', status: 'online' },
    { id: 'u3', name: 'Alex Rivera', email: 'alex.r@tesseract.ai', role: 'developer', avatar: 'https://i.pravatar.cc/150?u=alex', lastActive: '1h ago', status: 'offline' },
    { id: 'u4', name: 'Jordan Smith', email: 'jordan.s@tesseract.ai', role: 'developer', avatar: 'https://i.pravatar.cc/150?u=jordan', lastActive: '3h ago', status: 'online' },
    { id: 'u5', name: 'Elena Vance', email: 'elena.v@tesseract.ai', role: 'viewer', avatar: 'https://i.pravatar.cc/150?u=elena', lastActive: '1d ago', status: 'offline' },
    { id: 'u6', name: 'Marcus Wright', email: 'marcus.w@tesseract.ai', role: 'developer', avatar: 'https://i.pravatar.cc/150?u=marcus', lastActive: '2d ago', status: 'offline' },
  ],
  pendingInvites: [
    { email: 'david.k@tesseract.ai', role: 'developer', sentDate: 'Mar 15, 2026', status: 'pending' },
    { email: 'lisa.m@tesseract.ai', role: 'viewer', sentDate: 'Mar 10, 2026', status: 'expired' },
  ],
  auditLogs: [
    { id: 'l1', timestamp: '2026-03-16 19:45:22', user: { name: 'Marko Tiosavljevic', avatar: 'https://i.pravatar.cc/150?u=marko' }, action: 'project_create', resource: 'Tesseract AI Platform', ipAddress: '192.168.1.1' },
    { id: 'l2', timestamp: '2026-03-16 18:30:10', user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, action: 'invite_sent', resource: 'david.k@tesseract.ai', ipAddress: '192.168.1.42' },
    { id: 'l3', timestamp: '2026-03-16 17:15:05', user: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' }, action: 'deploy', resource: 'Vibrant Landing Page', ipAddress: '192.168.1.15' },
    { id: 'l4', timestamp: '2026-03-16 16:00:00', user: { name: 'Marko Tiosavljevic', avatar: 'https://i.pravatar.cc/150?u=marko' }, action: 'settings_changed', resource: 'Workspace Security', ipAddress: '192.168.1.1' },
    { id: 'l5', timestamp: '2026-03-16 15:20:45', user: { name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?u=jordan' }, action: 'model_switch', resource: 'Claude 3.5 Sonnet', ipAddress: '192.168.1.8' },
    { id: 'l6', timestamp: '2026-03-16 14:10:12', user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, action: 'member_removed', resource: 'John Doe', ipAddress: '192.168.1.42' },
    { id: 'l7', timestamp: '2026-03-16 13:05:33', user: { name: 'Marko Tiosavljevic', avatar: 'https://i.pravatar.cc/150?u=marko' }, action: 'login', resource: 'Web Dashboard', ipAddress: '192.168.1.1' },
    { id: 'l8', timestamp: '2026-03-16 12:00:00', user: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' }, action: 'project_delete', resource: 'Old Prototype', ipAddress: '192.168.1.15' },
    { id: 'l9', timestamp: '2026-03-16 11:45:22', user: { name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?u=jordan' }, action: 'project_create', resource: 'New Experiment', ipAddress: '192.168.1.8' },
    { id: 'l10', timestamp: '2026-03-16 10:30:10', user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, action: 'login', resource: 'Web Dashboard', ipAddress: '192.168.1.42' },
    { id: 'l11', timestamp: '2026-03-16 09:15:05', user: { name: 'Elena Vance', avatar: 'https://i.pravatar.cc/150?u=elena' }, action: 'login', resource: 'Web Dashboard', ipAddress: '192.168.1.22' },
    { id: 'l12', timestamp: '2026-03-16 08:00:00', user: { name: 'Marcus Wright', avatar: 'https://i.pravatar.cc/150?u=marcus' }, action: 'login', resource: 'Web Dashboard', ipAddress: '192.168.1.33' },
    { id: 'l13', timestamp: '2026-03-15 22:45:22', user: { name: 'Marko Tiosavljevic', avatar: 'https://i.pravatar.cc/150?u=marko' }, action: 'deploy', resource: 'Tesseract Core', ipAddress: '192.168.1.1' },
    { id: 'l14', timestamp: '2026-03-15 21:30:10', user: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' }, action: 'settings_changed', resource: 'Billing Plan', ipAddress: '192.168.1.42' },
    { id: 'l15', timestamp: '2026-03-15 20:15:05', user: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex' }, action: 'model_switch', resource: 'GPT-4o', ipAddress: '192.168.1.15' },
  ],
  arenaLeaderboard: [
    { rank: 1, model: 'Claude 3.5 Sonnet', provider: 'Anthropic', wins: 1240, losses: 310, winRate: 80, avgTime: '2.1s', avgTokens: 850, totalCost: '$4.20' },
    { rank: 2, model: 'GPT-4o', provider: 'OpenAI', wins: 1150, losses: 420, winRate: 73, avgTime: '1.8s', avgTokens: 720, totalCost: '$3.80' },
    { rank: 3, model: 'DeepSeek V3', provider: 'DeepSeek', wins: 980, losses: 450, winRate: 68, avgTime: '1.2s', avgTokens: 910, totalCost: '$0.85' },
    { rank: 4, model: 'Gemini 1.5 Pro', provider: 'Google', wins: 850, losses: 510, winRate: 62, avgTime: '1.0s', avgTokens: 680, totalCost: '$1.10' },
    { rank: 5, model: 'Llama 3.1 405B', provider: 'Meta', wins: 720, losses: 580, winRate: 55, avgTime: '2.5s', avgTokens: 1020, totalCost: '$2.50' },
    { rank: 6, model: 'Mistral Large 2', provider: 'Mistral', wins: 640, losses: 620, winRate: 51, avgTime: '1.9s', avgTokens: 780, totalCost: '$1.80' },
  ],
  arenaResponses: {
    'claude-3.5-sonnet': `### Authentication Middleware
This implementation uses a robust JWT-based approach with comprehensive error handling and type safety.

\`\`\`typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT.
 * Validates the 'Authorization' header and attaches the user payload to the request.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Missing or malformed authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Attach user to request object
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired token' 
    });
  }
};
\`\`\`
**Key Features:**
- Strict Bearer token validation
- Detailed error responses
- Centralized logging for security audits`,
    'gpt-4o': `### Express Auth Middleware
Here is a concise JWT authentication middleware for your Express application.

\`\`\`javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided');
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticate;
\`\`\`
This implementation is straightforward and handles the core logic of token extraction and verification.`,
    'deepseek-v3': `### High-Performance Auth Middleware
Optimized middleware with minimal overhead and early exit patterns.

\`\`\`typescript
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export default function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.sendStatus(401);

  const token = header.slice(7);
  try {
    (req as any).user = verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}
\`\`\`
**Notes:**
- Uses \`slice(7)\` for faster string manipulation.
- Minimalistic error handling to reduce latency.`,
    'gemini-1.5-pro': `### Secure JWT Middleware
A standard implementation focusing on security best practices for Express.

\`\`\`typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET!);
    req.body.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
\`\`\`
This uses a custom header \`auth-token\` for simplicity, but can be easily adapted to the standard \`Authorization\` header.`
  }
};
