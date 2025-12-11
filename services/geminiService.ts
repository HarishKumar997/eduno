import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, AuditLog, User } from "../types";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Lazily construct the client only when a key exists so local mock testing works without env setup.
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export const generateAttendanceInsights = async (
  records: AttendanceRecord[],
  users: User[],
  auditLogs: AuditLog[],
  query: string
): Promise<string> => {
  if (!ai) {
    return "AI insights are unavailable because `VITE_GEMINI_API_KEY` is not set. Please add your Gemini API key to the `.env` file.";
  }

  // Calculate comprehensive statistics for better insights
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today);
  const last7Days = records.filter(r => {
    const recordDate = new Date(r.date);
    const daysAgo = (Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });
  const last30Days = records.filter(r => {
    const recordDate = new Date(r.date);
    const daysAgo = (Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  });

  // Department breakdown
  const deptStats = users.reduce((acc, user) => {
    if (user.role === 'STUDENT') {
      acc[user.department] = (acc[user.department] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Status breakdown for last 30 days
  const statusBreakdown = last30Days.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sample records (recent and diverse)
  const recentRecords = records
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
    .slice(0, 30);

  // Prepare comprehensive context data
  const dataContext = {
    summary: {
      totalUsers: users.length,
      totalRecords: records.length,
      students: users.filter(u => u.role === 'STUDENT').length,
      teachers: users.filter(u => u.role === 'TEACHER').length,
      departments: Object.keys(deptStats),
    },
    today: {
      totalCheckIns: todayRecords.length,
      present: todayRecords.filter(r => r.status === 'PRESENT').length,
      late: todayRecords.filter(r => r.status === 'LATE').length,
      absent: todayRecords.filter(r => r.status === 'ABSENT').length,
    },
    last7Days: {
      totalRecords: last7Days.length,
      attendanceRate: last7Days.length > 0 
        ? Math.round(((last7Days.filter(r => r.status !== 'ABSENT').length) / last7Days.length) * 100)
        : 0,
    },
    last30Days: {
      totalRecords: last30Days.length,
      statusBreakdown,
      attendanceRate: last30Days.length > 0
        ? Math.round(((last30Days.filter(r => r.status !== 'ABSENT').length) / last30Days.length) * 100)
        : 0,
    },
    departmentBreakdown: deptStats,
    sampleRecords: recentRecords.map(r => ({
      userName: r.userName,
      department: r.department,
      date: r.date,
      status: r.status,
      checkInTime: r.checkInTime,
      hasCheckOut: !!r.checkOutTime,
    })),
    recentLogs: auditLogs.slice(0, 10).map(log => ({
      action: log.action,
      performedBy: log.performedBy,
      timestamp: log.timestamp,
    })),
  };

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
You are an AI analyst for a student attendance CRM system. Analyze the provided data and answer the user's query with actionable insights.

**System Data Summary:**
${JSON.stringify(dataContext, null, 2)}

**User Query:** "${query}"

**Instructions:**
- Provide a clear, professional, and actionable response
- Use specific numbers and statistics from the data when available
- If analyzing trends, compare different time periods (today vs last 7 days vs last 30 days)
- Identify patterns, anomalies, or areas of concern
- Suggest actionable recommendations when appropriate
- Format your response in Markdown with proper headings, lists, and emphasis
- Be concise but thorough

**Note:** This data comes from the attendance system (works with both mock data and real database). Focus on the actual data provided, not assumptions.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No insights could be generated at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an issue analyzing the data. Please try again later. Make sure your Gemini API key is valid and has proper permissions.";
  }
};