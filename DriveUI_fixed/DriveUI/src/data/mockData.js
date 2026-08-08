// Seed data for DriveX. In production, this file would not exist —
// the API layer in src/api would talk to the real backend endpoints instead.

let idCounter = 1000;
export const nextId = () => String(idCounter++);

export const FOLDER_COLORS = ['violet', 'teal', 'amber', 'rose', 'sky'];

export const initialFolders = [
  { id: 'f1', name: 'Client Projects', color: 'violet', parentId: null, owner: 'Saurav Kumar', createdAt: '2026-05-02T10:00:00Z', modifiedAt: '2026-07-10T09:12:00Z', starred: true, trashed: false },
  { id: 'f2', name: 'Design Assets', color: 'teal', parentId: null, owner: 'Saurav Kumar', createdAt: '2026-04-18T10:00:00Z', modifiedAt: '2026-07-08T14:30:00Z', starred: false, trashed: false },
  { id: 'f3', name: 'Invoices', color: 'amber', parentId: null, owner: 'Saurav Kumar', createdAt: '2026-03-11T10:00:00Z', modifiedAt: '2026-06-30T11:00:00Z', starred: false, trashed: false },
  { id: 'f4', name: 'Screenshots', color: 'rose', parentId: 'f1', owner: 'Saurav Kumar', createdAt: '2026-06-01T10:00:00Z', modifiedAt: '2026-07-05T08:00:00Z', starred: false, trashed: false },
  { id: 'f5', name: 'Contracts', color: 'sky', parentId: 'f1', owner: 'Ananya Rao', createdAt: '2026-05-20T10:00:00Z', modifiedAt: '2026-06-28T16:20:00Z', starred: true, trashed: false }
];

const t = (offsetDays) => new Date(Date.now() - offsetDays * 86400000).toISOString();

export const initialFiles = [
  { id: 'file1', name: 'Q3-Brand-Guidelines.pdf', type: 'pdf', size: 4_200_000, folderId: 'f2', owner: 'Saurav Kumar', createdAt: t(21), modifiedAt: t(2), starred: true, trashed: false, shared: true },
  { id: 'file2', name: 'Product-Mockup-Hero.png', type: 'image', size: 2_800_000, folderId: 'f2', owner: 'Saurav Kumar', createdAt: t(14), modifiedAt: t(1), starred: false, trashed: false, shared: false },
  { id: 'file3', name: 'Client-Onboarding-Demo.mp4', type: 'video', size: 58_400_000, folderId: 'f1', owner: 'Ananya Rao', createdAt: t(30), modifiedAt: t(5), starred: false, trashed: false, shared: true },
  { id: 'file4', name: 'Meeting-Notes-Kickoff.docx', type: 'document', size: 340_000, folderId: 'f1', owner: 'Saurav Kumar', createdAt: t(9), modifiedAt: t(0.2), starred: false, trashed: false, shared: false },
  { id: 'file5', name: 'Podcast-Intro-Theme.mp3', type: 'audio', size: 5_100_000, folderId: null, owner: 'Saurav Kumar', createdAt: t(40), modifiedAt: t(12), starred: false, trashed: false, shared: false },
  { id: 'file6', name: 'Invoice-July-2026.pdf', type: 'pdf', size: 190_000, folderId: 'f3', owner: 'Saurav Kumar', createdAt: t(3), modifiedAt: t(3), starred: false, trashed: false, shared: false },
  { id: 'file7', name: 'Backend-Source-Code.zip', type: 'zip', size: 12_600_000, folderId: null, owner: 'Saurav Kumar', createdAt: t(60), modifiedAt: t(18), starred: true, trashed: false, shared: false },
  { id: 'file8', name: 'Dashboard-Screenshot.png', type: 'image', size: 1_100_000, folderId: 'f4', owner: 'Saurav Kumar', createdAt: t(4), modifiedAt: t(1), starred: false, trashed: false, shared: false },
  { id: 'file9', name: 'Vendor-Agreement-Signed.pdf', type: 'pdf', size: 780_000, folderId: 'f5', owner: 'Ananya Rao', createdAt: t(25), modifiedAt: t(6), starred: false, trashed: false, shared: true },
  { id: 'file10', name: 'Release-Notes-v2.1.txt', type: 'text', size: 12_000, folderId: null, owner: 'Saurav Kumar', createdAt: t(2), modifiedAt: t(0.5), starred: false, trashed: false, shared: false },
  { id: 'file11', name: 'Team-Standup-Recording.mp4', type: 'video', size: 96_200_000, folderId: 'f1', owner: 'Saurav Kumar', createdAt: t(7), modifiedAt: t(7), starred: false, trashed: false, shared: false },
  { id: 'file12', name: 'Old-Draft-Proposal.docx', type: 'document', size: 220_000, folderId: null, owner: 'Saurav Kumar', createdAt: t(90), modifiedAt: t(80), starred: false, trashed: true, shared: false }
];

export const activityFeed = [
  { id: 'a1', type: 'upload', target: 'Meeting-Notes-Kickoff.docx', time: t(0.2), user: 'Saurav Kumar' },
  { id: 'a2', type: 'rename', target: 'Dashboard-Screenshot.png', time: t(1), user: 'Saurav Kumar' },
  { id: 'a3', type: 'share', target: 'Vendor-Agreement-Signed.pdf', time: t(6), user: 'Ananya Rao' },
  { id: 'a4', type: 'delete', target: 'Old-Draft-Proposal.docx', time: t(10), user: 'Saurav Kumar' },
  { id: 'a5', type: 'upload', target: 'Invoice-July-2026.pdf', time: t(3), user: 'Saurav Kumar' },
  { id: 'a6', type: 'move', target: 'Dashboard-Screenshot.png', time: t(4), user: 'Saurav Kumar' }
];

export const currentUser = {
  name: 'Saurav Kumar',
  role: 'Java Full Stack Developer',
  email: 'sauravm461@gmail.com',
  avatarInitials: 'SK',
  storageUsedBytes: 8_600_000_000,
  storageLimitBytes: 15_000_000_000
};
