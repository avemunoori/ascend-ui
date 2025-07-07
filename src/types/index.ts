// User interfaces
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

// Session interfaces
export interface Session {
  id: string;
  discipline: SessionDiscipline;
  grade: Grade;
  date: string;
  notes?: string;
  sent: boolean;
}

export interface CreateSessionRequest {
  discipline: SessionDiscipline;
  grade: Grade;
  date: string;
  notes?: string;
  sent: boolean;
}

export interface UpdateSessionRequest {
  discipline?: SessionDiscipline;
  grade?: Grade;
  date?: string;
  notes?: string;
  sent?: boolean;
}

// Analytics interfaces
export interface SessionAnalytics {
  totalSessions: number;
  averageDifficulty: number;
  sentPercentage: number;
  sessionsByDiscipline: Record<SessionDiscipline, number>;
  averageDifficultyByDiscipline: Record<SessionDiscipline, number>;
  sentPercentageByDiscipline: Record<SessionDiscipline, number>;
}

export interface ProgressAnalytics {
  totalSessions: number;
  sentRate: number;
  avgDifficulty: number;
  progressByWeek: WeeklyProgress[];
  progressByMonth: MonthlyProgress[];
}

export interface WeeklyProgress {
  week: string; // Format: "2025-W25"
  avgDifficulty: number;
  sessionCount: number;
  sentRate: number;
}

export interface MonthlyProgress {
  month: string; // Format: "2025-01"
  avgDifficulty: number;
  sessionCount: number;
  sentRate: number;
}

export interface HighestGrades {
  BOULDER: string;
  LEAD: string;
  TOPROPE: string;
}

export interface AverageGrades {
  BOULDER: number;
  LEAD: number;
  TOPROPE: number;
}

// Enums
export enum SessionDiscipline {
  BOULDER = "BOULDER",
  LEAD = "LEAD",
  TOPROPE = "TOPROPE"
}

export enum Grade {
  // Boulder grades
  V0 = "V0", V1 = "V1", V2 = "V2", V3 = "V3", V4 = "V4", V5 = "V5",
  V6 = "V6", V7 = "V7", V8 = "V8", V9 = "V9", V10 = "V10", V11 = "V11",
  V12 = "V12", V13 = "V13", V14 = "V14", V15 = "V15", V16 = "V16", V17 = "V17",
  
  // Lead/Sport grades
  YDS_5_6 = "5.6", YDS_5_7 = "5.7", YDS_5_8 = "5.8", YDS_5_9 = "5.9",
  YDS_5_10A = "5.10a", YDS_5_10B = "5.10b", YDS_5_10C = "5.10c", YDS_5_10D = "5.10d",
  YDS_5_11A = "5.11a", YDS_5_11B = "5.11b", YDS_5_11C = "5.11c", YDS_5_11D = "5.11d",
  YDS_5_12A = "5.12a", YDS_5_12B = "5.12b", YDS_5_12C = "5.12c", YDS_5_12D = "5.12d",
  YDS_5_13A = "5.13a", YDS_5_13B = "5.13b", YDS_5_13C = "5.13c", YDS_5_13D = "5.13d",
  YDS_5_14A = "5.14a", YDS_5_14B = "5.14b", YDS_5_14C = "5.14c", YDS_5_14D = "5.14d",
  YDS_5_15A = "5.15a", YDS_5_15B = "5.15b", YDS_5_15C = "5.15c", YDS_5_15D = "5.15d"
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  SessionDetail: { sessionId: string };
  AddSession: undefined;
  EditSession: { session: Session };
  Analytics: undefined;
  Profile: undefined;
  Weather: undefined;
};

export type MainTabParamList = {
  Sessions: undefined;
  Add: undefined;
  Analytics: undefined;
  Profile: undefined;
  Weather: undefined;
}; 