// Part 27 — Task & Action Management
// Enterprise task system with workflows, checklists, dependencies, and escalation

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'VERIFIED' | 'CANCELLED';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskSource = 'manual' | 'workflow' | 'alert' | 'meeting' | 'ncr' | 'constraint' | 'hse' | 'chat';
export type DependencyType = 'finish_to_start';
export type RecurrenceRule = 'daily' | 'weekly' | 'monthly' | 'none';

export interface Task {
  id: string;
  taskNo: string;
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  departmentId?: string;
  departmentName?: string;
  recordType?: string;
  recordId?: string;
  recordNo?: string;
  source: TaskSource;
  assigneeId: string;
  assigneeName: string;
  watchers: string[];
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  completedAt?: string;
  completedBy?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  recurrenceRule: RecurrenceRule;
  parentId?: string;
  parentTaskNo?: string;
  subtaskCount: number;
  checklistProgress: number;
  commentCount: number;
  attachmentCount: number;
  dependencyCount: number;
  isOverdue: boolean;
  daysOverdue?: number;
  slaHours: number;
  escalationLevel?: number;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  taskNo: string;
  dependsOnTaskId: string;
  dependsOnTaskNo: string;
  type: DependencyType;
  createdAt: string;
  createdBy: string;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  text: string;
  done: boolean;
  doneBy?: string;
  doneByName?: string;
  doneAt?: string;
  order: number;
  createdAt: string;
  createdBy: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  body: string;
  attachments: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  isSystem: boolean;
}

export interface Meeting {
  id: string;
  meetingNo: string;
  projectId: string;
  projectName: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  organizer: string;
  organizerName: string;
  attendees: {
    userId: string;
    userName: string;
    role: string;
    attended: boolean;
  }[];
  minutes: string;
  actionItems: string[];
  taskIds: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

export interface ProtocolControlPoint {
  id: string;
  stage: string;
  control: string;
  enforcement: string;
  status: string;
}

// ===== TASKS =====
export const tasks: Task[] = [
  {
    id: 'task-001', taskNo: 'TSK-2024-001', title: 'Review foundation drawing revisions',
    description: 'Review and approve revised foundation layout drawing MT-STR-DWG-001-C02 incorporating client comments from RFI-001.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    recordType: 'Drawing', recordId: 'doc-001', recordNo: 'MT-STR-DWG-001',
    source: 'manual', assigneeId: 'user-025', assigneeName: 'Anil Mehta',
    watchers: ['user-010', 'user-015'], priority: 'high',
    startDate: '2024-01-16', dueDate: '2024-01-18', status: 'IN_PROGRESS',
    recurrenceRule: 'none', subtaskCount: 2, checklistProgress: 50,
    commentCount: 3, attachmentCount: 1, dependencyCount: 0,
    isOverdue: false, slaHours: 48, createdAt: '2024-01-16T10:00:00Z',
    createdBy: 'user-010', createdByName: 'Rajesh Kumar',
    updatedAt: '2024-01-16T14:30:00Z', updatedBy: 'user-025', version: 2
  },
  {
    id: 'task-002', taskNo: 'TSK-2024-002', title: 'Resolve NCR-2024-015 - Concrete strength issue',
    description: 'Investigate and resolve non-conformance report for concrete cube test results below specified strength at Zone B, Level 2.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    recordType: 'NCR', recordId: 'ncr-015', recordNo: 'NCR-2024-015',
    source: 'ncr', assigneeId: 'user-026', assigneeName: 'Krishna Rao',
    watchers: ['user-010', 'user-015', 'user-027'], priority: 'critical',
    startDate: '2024-01-15', dueDate: '2024-01-17', status: 'IN_PROGRESS',
    recurrenceRule: 'none', subtaskCount: 0, checklistProgress: 0,
    commentCount: 5, attachmentCount: 3, dependencyCount: 1,
    isOverdue: false, slaHours: 24, createdAt: '2024-01-15T09:00:00Z',
    createdBy: 'user-026', createdByName: 'Krishna Rao',
    updatedAt: '2024-01-16T16:00:00Z', updatedBy: 'user-026', version: 5
  },
  {
    id: 'task-003', taskNo: 'TSK-2024-003', title: 'Complete safety inspection checklist - Weekly',
    description: 'Conduct weekly safety inspection covering all active work zones, scaffolding, PPE compliance, and fire safety equipment.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    source: 'hse', assigneeId: 'user-027', assigneeName: 'HSE Officer',
    watchers: ['user-010', 'user-015'], priority: 'high',
    startDate: '2024-01-17', dueDate: '2024-01-17', status: 'OPEN',
    recurrenceRule: 'weekly', subtaskCount: 0, checklistProgress: 0,
    commentCount: 0, attachmentCount: 0, dependencyCount: 0,
    isOverdue: false, slaHours: 8, createdAt: '2024-01-16T18:00:00Z',
    createdBy: 'system', createdByName: 'System',
    updatedAt: '2024-01-16T18:00:00Z', updatedBy: 'system', version: 1
  },
  {
    id: 'task-004', taskNo: 'TSK-2024-004', title: 'Approve PO-2024-0894 - Steel procurement',
    description: 'Review and approve purchase order for TMT steel bars (50 MT) from Steel India Ltd. for foundation work.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    recordType: 'PurchaseOrder', recordId: 'po-091', recordNo: 'PO-2024-0894',
    source: 'workflow', assigneeId: 'user-010', assigneeName: 'Rajesh Kumar',
    watchers: ['user-020'], priority: 'high',
    startDate: '2024-01-16', dueDate: '2024-01-17', status: 'OPEN',
    recurrenceRule: 'none', subtaskCount: 0, checklistProgress: 0,
    commentCount: 1, attachmentCount: 2, dependencyCount: 0,
    isOverdue: false, slaHours: 24, createdAt: '2024-01-16T10:00:00Z',
    createdBy: 'user-020', createdByName: 'Amit Shah',
    updatedAt: '2024-01-16T10:00:00Z', updatedBy: 'user-020', version: 1
  },
  {
    id: 'task-005', taskNo: 'TSK-2024-005', title: 'Submit daily progress report - 17 Jan 2024',
    description: 'Prepare and submit daily progress report covering manpower, material consumption, equipment utilization, and work completed.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    source: 'manual', assigneeId: 'user-015', assigneeName: 'Ravi Sharma',
    watchers: ['user-010'], priority: 'medium',
    startDate: '2024-01-17', dueDate: '2024-01-17', status: 'OPEN',
    recurrenceRule: 'daily', subtaskCount: 0, checklistProgress: 0,
    commentCount: 0, attachmentCount: 0, dependencyCount: 0,
    isOverdue: false, slaHours: 8, createdAt: '2024-01-16T18:00:00Z',
    createdBy: 'user-015', createdByName: 'Ravi Sharma',
    updatedAt: '2024-01-16T18:00:00Z', updatedBy: 'user-015', version: 1
  },
  {
    id: 'task-006', taskNo: 'TSK-2024-006', title: 'Rectify water seepage at basement level',
    description: 'Investigate and rectify water seepage issue reported at basement level B2, Grid line C-5. Apply waterproofing treatment.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    source: 'constraint', assigneeId: 'user-015', assigneeName: 'Ravi Sharma',
    watchers: ['user-010', 'user-025'], priority: 'critical',
    startDate: '2024-01-14', dueDate: '2024-01-16', status: 'BLOCKED',
    recurrenceRule: 'none', subtaskCount: 3, checklistProgress: 33,
    commentCount: 8, attachmentCount: 5, dependencyCount: 2,
    isOverdue: true, daysOverdue: 1, slaHours: 48, escalationLevel: 1,
    createdAt: '2024-01-14T10:00:00Z', createdBy: 'user-015', createdByName: 'Ravi Sharma',
    updatedAt: '2024-01-16T15:00:00Z', updatedBy: 'user-015', version: 8
  },
  {
    id: 'task-007', taskNo: 'TSK-2024-007', title: 'Conduct toolbox talk - Working at heights',
    description: 'Organize and conduct toolbox talk for all site workers on working at heights safety procedures and PPE requirements.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    siteId: 'site-001', siteName: 'Metro Tower Site A',
    source: 'hse', assigneeId: 'user-027', assigneeName: 'HSE Officer',
    watchers: ['user-015'], priority: 'high',
    startDate: '2024-01-15', dueDate: '2024-01-15', status: 'DONE',
    completedAt: '2024-01-15T16:00:00Z', completedBy: 'user-027',
    recurrenceRule: 'none', subtaskCount: 0, checklistProgress: 100,
    commentCount: 2, attachmentCount: 1, dependencyCount: 0,
    isOverdue: false, slaHours: 8, createdAt: '2024-01-15T08:00:00Z',
    createdBy: 'user-027', createdByName: 'HSE Officer',
    updatedAt: '2024-01-15T16:00:00Z', updatedBy: 'user-027', version: 3
  },
  {
    id: 'task-008', taskNo: 'TSK-2024-008', title: 'Verify bill measurements - B-447',
    description: 'Verify measurements and quantities for subcontractor bill B-447 (Raj Constructions) for December 2024 work.',
    projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    recordType: 'Bill', recordId: 'bill-447', recordNo: 'B-447',
    source: 'workflow', assigneeId: 'user-025', assigneeName: 'Anil Mehta',
    watchers: ['user-022', 'user-011'], priority: 'high',
    startDate: '2024-01-16', dueDate: '2024-01-19', status: 'IN_PROGRESS',
    recurrenceRule: 'none', subtaskCount: 0, checklistProgress: 0,
    commentCount: 1, attachmentCount: 3, dependencyCount: 0,
    isOverdue: false, slaHours: 72, createdAt: '2024-01-16T09:00:00Z',
    createdBy: 'user-022', createdByName: 'Vikram Desai',
    updatedAt: '2024-01-16T16:00:00Z', updatedBy: 'user-025', version: 2
  },
];

// ===== TASK DEPENDENCIES =====
export const taskDependencies: TaskDependency[] = [
  {
    id: 'dep-001', taskId: 'task-006', taskNo: 'TSK-2024-006',
    dependsOnTaskId: 'task-002', dependsOnTaskNo: 'TSK-2024-002',
    type: 'finish_to_start', createdAt: '2024-01-14T10:30:00Z', createdBy: 'user-015'
  },
  {
    id: 'dep-002', taskId: 'task-006', taskNo: 'TSK-2024-006',
    dependsOnTaskId: 'task-009', dependsOnTaskNo: 'TSK-2024-009',
    type: 'finish_to_start', createdAt: '2024-01-14T11:00:00Z', createdBy: 'user-015'
  },
];

// ===== CHECKLIST ITEMS =====
export const checklistItems: ChecklistItem[] = [
  { id: 'chk-001', taskId: 'task-001', text: 'Review structural calculations', done: true, doneBy: 'user-025', doneByName: 'Anil Mehta', doneAt: '2024-01-16T11:00:00Z', order: 1, createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-010' },
  { id: 'chk-002', taskId: 'task-001', text: 'Check reinforcement details', done: true, doneBy: 'user-025', doneByName: 'Anil Mehta', doneAt: '2024-01-16T12:00:00Z', order: 2, createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-010' },
  { id: 'chk-003', taskId: 'task-001', text: 'Verify concrete grades', done: false, order: 3, createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-010' },
  { id: 'chk-004', taskId: 'task-001', text: 'Confirm dimensions with site', done: false, order: 4, createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-010' },
  { id: 'chk-005', taskId: 'task-007', text: 'Prepare presentation material', done: true, doneBy: 'user-027', doneByName: 'HSE Officer', doneAt: '2024-01-15T10:00:00Z', order: 1, createdAt: '2024-01-15T08:00:00Z', createdBy: 'user-027' },
  { id: 'chk-006', taskId: 'task-007', text: 'Conduct toolbox talk', done: true, doneBy: 'user-027', doneByName: 'HSE Officer', doneAt: '2024-01-15T14:00:00Z', order: 2, createdAt: '2024-01-15T08:00:00Z', createdBy: 'user-027' },
  { id: 'chk-007', taskId: 'task-007', text: 'Collect attendance signatures', done: true, doneBy: 'user-027', doneByName: 'HSE Officer', doneAt: '2024-01-15T15:30:00Z', order: 3, createdAt: '2024-01-15T08:00:00Z', createdBy: 'user-027' },
  { id: 'chk-008', taskId: 'task-007', text: 'Upload photos and attendance sheet', done: true, doneBy: 'user-027', doneByName: 'HSE Officer', doneAt: '2024-01-15T16:00:00Z', order: 4, createdAt: '2024-01-15T08:00:00Z', createdBy: 'user-027' },
];

// ===== TASK COMMENTS =====
export const taskComments: TaskComment[] = [
  {
    id: 'cmt-001', taskId: 'task-001', userId: 'user-010', userName: 'Rajesh Kumar',
    body: 'Please prioritize this review as client is waiting for approval to proceed with excavation.',
    attachments: [], createdAt: '2024-01-16T10:30:00Z', isSystem: false
  },
  {
    id: 'cmt-002', taskId: 'task-001', userId: 'user-025', userName: 'Anil Mehta',
    body: 'Started review. Will complete by EOD tomorrow.',
    attachments: [], createdAt: '2024-01-16T14:00:00Z', isSystem: false
  },
  {
    id: 'cmt-003', taskId: 'task-001', userId: 'system', userName: 'System',
    body: 'Task status changed from OPEN to IN_PROGRESS',
    attachments: [], createdAt: '2024-01-16T14:30:00Z', isSystem: true
  },
  {
    id: 'cmt-004', taskId: 'task-002', userId: 'user-026', userName: 'Krishna Rao',
    body: 'Investigation started. Core samples collected for testing.',
    attachments: [{ id: 'att-001', fileName: 'core-sample-photos.zip', fileSize: 5242880, mimeType: 'application/zip', uploadedAt: '2024-01-15T14:00:00Z' }],
    createdAt: '2024-01-15T14:30:00Z', isSystem: false
  },
  {
    id: 'cmt-005', taskId: 'task-002', userId: 'user-010', userName: 'Rajesh Kumar',
    body: 'Please ensure test reports are uploaded once available.',
    attachments: [], createdAt: '2024-01-16T09:00:00Z', isSystem: false
  },
  {
    id: 'cmt-006', taskId: 'task-006', userId: 'user-015', userName: 'Ravi Sharma',
    body: 'Waterproofing material procured. Waiting for approval to proceed with application.',
    attachments: [{ id: 'att-002', fileName: 'material-invoice.pdf', fileSize: 1048576, mimeType: 'application/pdf', uploadedAt: '2024-01-16T11:00:00Z' }],
    createdAt: '2024-01-16T11:30:00Z', isSystem: false
  },
  {
    id: 'cmt-007', taskId: 'task-006', userId: 'system', userName: 'System',
    body: 'Task escalated to L1 - Overdue by 1 day',
    attachments: [], createdAt: '2024-01-17T09:00:00Z', isSystem: true
  },
  {
    id: 'cmt-008', taskId: 'task-008', userId: 'user-025', userName: 'Anil Mehta',
    body: 'Measurement verification in progress. Site visit scheduled for tomorrow.',
    attachments: [], createdAt: '2024-01-16T16:00:00Z', isSystem: false
  },
];

// ===== MEETINGS =====
export const meetings: Meeting[] = [
  {
    id: 'mtg-001', meetingNo: 'MTG-2024-001', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    title: 'Weekly Progress Review Meeting', date: '2024-01-15', startTime: '10:00', endTime: '11:30',
    location: 'Site Office Conference Room', organizer: 'user-010', organizerName: 'Rajesh Kumar',
    attendees: [
      { userId: 'user-010', userName: 'Rajesh Kumar', role: 'Project Manager', attended: true },
      { userId: 'user-015', userName: 'Ravi Sharma', role: 'Site Engineer', attended: true },
      { userId: 'user-020', userName: 'Amit Shah', role: 'Procurement Manager', attended: true },
      { userId: 'user-025', userName: 'Anil Mehta', role: 'QS Engineer', attended: true },
      { userId: 'user-026', userName: 'Krishna Rao', role: 'QA Manager', attended: false },
    ],
    minutes: 'Discussed project progress, material procurement status, quality issues, and safety compliance. Key action items identified for foundation work completion and NCR resolution.',
    actionItems: [
      'Complete foundation drawing review by 18 Jan',
      'Resolve NCR-015 concrete strength issue',
      'Procure steel for foundation work',
      'Conduct weekly safety inspection'
    ],
    taskIds: ['task-001', 'task-002', 'task-004', 'task-003'],
    status: 'completed', createdAt: '2024-01-14T09:00:00Z', createdBy: 'user-010'
  },
  {
    id: 'mtg-002', meetingNo: 'MTG-2024-002', projectId: 'prj-001', projectName: 'Metro Tower Phase II',
    title: 'Safety Committee Meeting', date: '2024-01-18', startTime: '14:00', endTime: '15:00',
    location: 'Site Office Conference Room', organizer: 'user-027', organizerName: 'HSE Officer',
    attendees: [
      { userId: 'user-027', userName: 'HSE Officer', role: 'HSE Manager', attended: false },
      { userId: 'user-010', userName: 'Rajesh Kumar', role: 'Project Manager', attended: false },
      { userId: 'user-015', userName: 'Ravi Sharma', role: 'Site Engineer', attended: false },
    ],
    minutes: '',
    actionItems: [],
    taskIds: [],
    status: 'scheduled', createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-027'
  },
];

// ===== PROTOCOL CONTROL POINTS =====
export const protocolControlPoints: ProtocolControlPoint[] = [
  { id: 'CP-TSK-01', stage: 'PLAN', control: 'Tasks have owner, due date and linked record/project', enforcement: 'BLOCK', status: 'OBSERVE' },
  { id: 'CP-TSK-02', stage: 'MONITOR', control: 'Overdue tasks escalate L1→L2→L3; dependency violations', enforcement: 'MONITOR', status: 'OBSERVE' },
  { id: 'CP-TSK-03', stage: 'CLOSE', control: 'Tasks requiring evidence closed only with evidence', enforcement: 'BLOCK', status: 'OBSERVE' },
];

// ===== HELPER FUNCTIONS =====
export function getTaskStats(): { total: number; open: number; inProgress: number; blocked: number; done: number; overdue: number } {
  return {
    total: tasks.length,
    open: tasks.filter(t => t.status === 'OPEN').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    blocked: tasks.filter(t => t.status === 'BLOCKED').length,
    done: tasks.filter(t => t.status === 'DONE' || t.status === 'VERIFIED').length,
    overdue: tasks.filter(t => t.isOverdue).length,
  };
}

export function getMyTasks(userId: string): Task[] {
  return tasks.filter(t => t.assigneeId === userId);
}

export function getTasksByProject(projectId: string): Task[] {
  return tasks.filter(t => t.projectId === projectId);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return tasks.filter(t => t.status === status);
}

export function getOverdueTasks(): Task[] {
  return tasks.filter(t => t.isOverdue);
}

export function getTaskChecklist(taskId: string): ChecklistItem[] {
  return checklistItems.filter(c => c.taskId === taskId).sort((a, b) => a.order - b.order);
}

export function getTaskComments(taskId: string): TaskComment[] {
  return taskComments.filter(c => c.taskId === taskId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getTaskDependencies(taskId: string): TaskDependency[] {
  return taskDependencies.filter(d => d.taskId === taskId);
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-100 border-red-200';
    case 'high': return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'medium': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'low': return 'text-gray-600 bg-gray-100 border-gray-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function getStatusColor(status: TaskStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'DONE':
    case 'VERIFIED': return 'success';
    case 'IN_PROGRESS': return 'info';
    case 'BLOCKED': return 'warning';
    case 'OPEN': return 'neutral';
    case 'CANCELLED': return 'error';
    default: return 'neutral';
  }
}

export function getSourceIcon(source: TaskSource): string {
  switch (source) {
    case 'workflow': return 'git-branch';
    case 'alert': return 'alert';
    case 'meeting': return 'users';
    case 'ncr': return 'file-warning';
    case 'constraint': return 'alert-triangle';
    case 'hse': return 'shield';
    case 'chat': return 'message';
    default: return 'file';
  }
}
