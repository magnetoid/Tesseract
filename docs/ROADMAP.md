# Torsor Roadmap

Development phases to build out a complete vibe-coding platform.

## Phase 0: Foundation (Current)

✅ **Complete**
- Docker Compose setup (postgres, redis, api, worker, frontend)
- Basic API structure (Express, TypeScript)
- Database schema with core tables
- Worker service skeleton
- Env templates and documentation

**Status**: Ready for local development

---

## Phase 1: Authentication & User Management

**Timeline**: Week 1-2

### Tasks

1. **JWT Auth System**
   - [ ] User signup endpoint (`POST /api/v1/auth/signup`)
   - [ ] User login endpoint (`POST /api/v1/auth/login`)
   - [ ] Token refresh endpoint
   - [ ] Logout endpoint
   - [ ] Password hashing with bcrypt
   - [ ] Token validation middleware
   - [ ] Session table cleanup (expired tokens)

2. **User Endpoints**
   - [ ] Get current user (`GET /api/v1/users/me`)
   - [ ] Update profile (`PATCH /api/v1/users/me`)
   - [ ] Change password (`POST /api/v1/users/me/password`)
   - [ ] Delete account

3. **Frontend Integration**
   - [ ] Login/signup page
   - [ ] Store JWT in memory or localStorage
   - [ ] Add Authorization header to API calls
   - [ ] Handle token expiry (redirect to login)
   - [ ] Protected routes (require auth)

4. **Testing**
   - [ ] Test signup/login flow
   - [ ] Test token expiry
   - [ ] Test protected endpoints

### Files to Create
- `apps/api/src/routes/auth.ts`
- `apps/api/src/middleware/auth.ts`
- `apps/api/src/lib/jwt.ts`
- Frontend components: `LoginPage.tsx`, `SignupPage.tsx`

---

## Phase 2: Projects & File Management

**Timeline**: Week 3-4

### Tasks

1. **Project CRUD**
   - [ ] Create project (`POST /api/v1/projects`)
   - [ ] List user projects (`GET /api/v1/projects`)
   - [ ] Get single project (`GET /api/v1/projects/:id`)
   - [ ] Update project (`PATCH /api/v1/projects/:id`)
   - [ ] Delete project (`DELETE /api/v1/projects/:id`)
   - [ ] Validate user ownership

2. **File Management**
   - [ ] Create file (`POST /api/v1/projects/:id/files`)
   - [ ] List project files (`GET /api/v1/projects/:id/files`)
   - [ ] Get file content (`GET /api/v1/projects/:id/files/:filename`)
   - [ ] Update file (`PATCH /api/v1/projects/:id/files/:filename`)
   - [ ] Delete file (`DELETE /api/v1/projects/:id/files/:filename`)
   - [ ] File versioning (track history)

3. **Frontend Integration**
   - [ ] Projects sidebar with create/delete
   - [ ] File explorer within project
   - [ ] Editor tied to selected file
   - [ ] Auto-save files to API
   - [ ] File tabs

4. **Testing**
   - [ ] Test CRUD for projects
   - [ ] Test file operations
   - [ ] Test ownership validation

### Files to Create
- `apps/api/src/routes/projects.ts`
- `apps/api/src/routes/files.ts`
- Frontend: `ProjectPanel.tsx`, `FileExplorer.tsx`

---

## Phase 3: AI Integration (Gemini)

**Timeline**: Week 5-6

### Tasks

1. **Gemini API Integration**
   - [ ] Wrapper function to call Gemini API
   - [ ] Error handling and retries
   - [ ] Rate limiting (track API calls)
   - [ ] Cost tracking (log tokens used)
   - [ ] Support multiple models (flash, pro, etc.)

2. **AI Task Endpoint**
   - [ ] Submit task (`POST /api/v1/projects/:id/ai-tasks`)
   - [ ] Get task status (`GET /api/v1/ai-tasks/:id`)
   - [ ] List project tasks (`GET /api/v1/projects/:id/ai-tasks`)
   - [ ] Task types: code generation, refactoring, bug finding, etc.

3. **Worker Processing**
   - [ ] Poll database for pending tasks
   - [ ] Call Gemini API
   - [ ] Handle streaming responses
   - [ ] Store result in database
   - [ ] Handle errors gracefully

4. **Frontend Integration**
   - [ ] AI input panel (ask AI to code)
   - [ ] Show task progress/status
   - [ ] Display AI result in editor
   - [ ] Accept/reject/edit AI suggestions

5. **Testing**
   - [ ] Test task submission
   - [ ] Test worker processing
   - [ ] Test result storage
   - [ ] Test error handling

### Files to Create
- `apps/api/src/lib/gemini.ts`
- `apps/api/src/routes/ai.ts`
- `apps/worker/src/processors/ai-task.ts`
- Frontend: `AIPanel.tsx`, `AISuggestion.tsx`

---

## Phase 4: Real-Time Collaboration (WebSockets)

**Timeline**: Week 7-8

### Tasks

1. **WebSocket Server**
   - [ ] Setup Socket.io or ws library
   - [ ] User connection management
   - [ ] Project room concept (multiple users in same project)
   - [ ] Broadcast file changes
   - [ ] Broadcast AI task updates

2. **Real-Time Sync**
   - [ ] Send file edits to other users
   - [ ] Cursor positions
   - [ ] Selection highlights
   - [ ] Presence awareness (who's editing?)

3. **Conflict Resolution**
   - [ ] Operational Transformation (OT) or CRDTs
   - [ ] Resolve concurrent edits
   - [ ] Merge strategies

4. **Frontend**
   - [ ] Connect to WebSocket on project open
   - [ ] Listen for remote changes
   - [ ] Display other users' cursors
   - [ ] Show presence list

### Files to Create
- `apps/api/src/websocket/server.ts`
- `apps/api/src/websocket/handlers.ts`
- Frontend: `useWebSocket.ts`, `RemoteCursor.tsx`

---

## Phase 5: Code Execution & Preview

**Timeline**: Week 9-10

### Tasks

1. **Code Execution (Safe Sandbox)**
   - [ ] Option A: Run in Web Worker (frontend-only, limited)
   - [ ] Option B: Isolate sandbox service (e.g., Deno Deploy, Piscina)
   - [ ] Option C: Docker containers for full isolation

2. **Preview Panel**
   - [ ] Run code in sandbox
   - [ ] Capture output (stdout, errors)
   - [ ] Render HTML/CSS/JS results
   - [ ] Hot reload on file change

3. **Error Handling**
   - [ ] Catch runtime errors
   - [ ] Show stack traces
   - [ ] Timeout protection

### Files to Create
- `apps/api/src/services/sandbox.ts` (or use external service)
- Frontend: `PreviewPanel.tsx`, `SandboxRunner.ts`

---

## Phase 6: Secrets & Environment Management

**Timeline**: Week 11

### Tasks

1. **Secrets Management**
   - [ ] Create secret (`POST /api/v1/projects/:id/secrets`)
   - [ ] List secrets (names only) (`GET /api/v1/projects/:id/secrets`)
   - [ ] Delete secret (`DELETE /api/v1/projects/:id/secrets/:name`)
   - [ ] Encrypt/decrypt at rest
   - [ ] Inject into worker/execution environment

2. **API Key Rotation**
   - [ ] Rotate GEMINI_API_KEY periodically
   - [ ] Backup old keys temporarily
   - [ ] Alert on key expiry

3. **Frontend**
   - [ ] Secrets panel
   - [ ] Add/remove secrets
   - [ ] Show warnings for missing secrets

### Files to Create
- `apps/api/src/routes/secrets.ts`
- `apps/api/src/lib/encryption.ts`

---

## Phase 7: Deployment & Sharing

**Timeline**: Week 12

### Tasks

1. **Project Sharing**
   - [ ] Share project link (public/private)
   - [ ] Share with specific users
   - [ ] Read-only vs edit permissions
   - [ ] Revoke access

2. **Export Options**
   - [ ] Export project as ZIP
   - [ ] Export as HTML (static)
   - [ ] Export as GitHub repo (create + push)

3. **Deploy to Vercel / Netlify**
   - [ ] One-click deploy
   - [ ] Environment var mapping
   - [ ] GitHub integration

4. **Frontend**
   - [ ] Share dialog with link/buttons
   - [ ] Permissions UI
   - [ ] Export menu

### Files to Create
- `apps/api/src/routes/sharing.ts`
- `apps/api/src/services/deploy.ts`

---

## Phase 8: Advanced Features

**Timeline**: Week 13+

### Performance & Monitoring

- [ ] Structured logging (pino, winston)
- [ ] Error tracking (Sentry)
- [ ] Metrics & monitoring (Prometheus, Datadog)
- [ ] Database query optimization
- [ ] Cache layer optimization (Redis)

### Advanced AI Features

- [ ] Multi-model support (Claude, GPT-4, etc.)
- [ ] Fine-tuning on user codebases
- [ ] Code explanation
- [ ] Test generation
- [ ] Documentation generation

### Team Features

- [ ] Workspaces (organize projects)
- [ ] Teams & roles
- [ ] Billing & usage limits
- [ ] Team invitations

### UI/UX Polish

- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Command palette improvements
- [ ] Themes & customization
- [ ] Mobile responsive design

### Testing Infrastructure

- [ ] Unit tests (jest)
- [ ] Integration tests (supertest)
- [ ] E2E tests (Playwright, Cypress)
- [ ] Performance tests (k6, Artillery)

---

## Implementation Priority Matrix

### High Impact, Low Effort
1. Phase 1: Auth (foundation for everything else)
2. Phase 2: Projects (core product)
3. Phase 3: Gemini (AI is the killer feature)

### High Impact, Medium Effort
4. Phase 4: Real-time (collaboration)
5. Phase 5: Code execution (tangible results)

### Medium Impact, Medium Effort
6. Phase 6: Secrets (operational necessity)
7. Phase 7: Sharing (distribution)

### Nice-to-Have
- Phase 8: Polish & scale

---

## Technical Debt & Refactoring

As you build each phase:

- [ ] Add unit tests for new routes
- [ ] Add integration tests
- [ ] Keep database queries efficient (use indexes)
- [ ] Document new endpoints in API docs
- [ ] Update ARCHITECTURE.md as you add features
- [ ] Refactor duplicated code into shared libraries
- [ ] Monitor performance (use profiling tools)

---

## Success Metrics

### Phase 1 (Auth)
- Users can sign up and log in
- Sessions persist across page reloads
- Protected routes require auth

### Phase 2 (Projects)
- Users can create, view, edit, delete projects
- Files sync to database
- User sees their projects on dashboard

### Phase 3 (AI)
- User can prompt AI to generate code
- Worker processes tasks asynchronously
- Results appear in editor

### Phase 4 (Collaboration)
- Multiple users see each other's changes in real-time
- Cursor positions sync
- Conflicts resolved correctly

### Phase 5 (Execution)
- Code runs in preview panel
- Output captured and displayed
- Errors handled gracefully

### Phase 6-8
- Feature-specific success metrics

---

## Questions for Product Direction

1. **Vibe**: What's the core vibe of Torsor?
   - Side projects? Educational? Rapid prototyping?
   - This affects UI/UX and default templates

2. **Language Support**: Start with JavaScript? Or support Python, Go, Rust?
   - Affects sandbox complexity

3. **Target Audience**: Solo devs? Teams? Enterprises?
   - Affects auth, sharing, and billing features

4. **Monetization**: Freemium? Subscription? API usage-based?
   - Affects quota limits, metering, billing integration

5. **Deployment Targets**: Just Vercel? Or custom servers, AWS, Kubernetes?
   - Affects deployment complexity

Answers will help prioritize features and guide architecture decisions!
