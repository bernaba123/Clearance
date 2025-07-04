export interface User {
  _id: string;
  fullName: string;
  email: string;
  studentId?: string;
  role: 'SystemAdmin' | 'RegistrarAdmin' | 'DepartmentHead' | 'ChiefLibrarian' | 'DormitoryProctor' | 'DiningOfficer' | 'StudentAffairs' | 'StudentDiscipline' | 'CostSharingOfficer' | 'Student';
  college?: 'Engineering' | 'NaturalAndAppliedScience' | 'SocialScienceAndHumanities';
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClearanceRequest {
  _id: string;
  studentId: string;
  student: User;
  reason?: string;
  isEarlyRequest: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvals: {
    chiefLibrarian?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    dormitoryProctor?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    diningOfficer?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    studentAffairs?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    studentDiscipline?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    costSharingOfficer?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    departmentHead?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
    registrarAdmin?: { status: 'approved' | 'rejected'; reason?: string; date: string; };
  };
  pdfGenerated: boolean;
  pdfPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsEvent {
  _id: string;
  title: string;
  content: string;
  type: 'news' | 'event';
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  _id: string;
  clearanceSystemEnabled: boolean;
  academicYearEnd: string;
  currentAcademicYear: string;
  updatedBy: string;
  updatedAt: string;
}