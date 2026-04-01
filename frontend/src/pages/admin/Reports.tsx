import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { AttendanceStats } from '../../types';
import { BarChart3, TrendingUp, Users, Calendar, FileText, FileSpreadsheet, FileType } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType } from 'docx';

const Reports: React.FC = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await attendanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Title
    doc.setFontSize(20);
    doc.text('Hospital Attendance Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, 28);
    
    // Summary Statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 14, 40);
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Staff', stats.totalStaff.toString()],
      ['Present Today', stats.presentToday.toString()],
      ['Absent Today', stats.absentToday.toString()],
      ['Late Arrivals', stats.lateToday.toString()],
      ['Attendance Rate', `${attendanceRate}%`],
      ['Punctuality Rate', `${punctualityRate}%`],
      ['Monthly Attendance', stats.monthlyAttendance.toString()],
    ];

    autoTable(doc, {
      startY: 45,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`attendance-report-${date}.pdf`);
  };

  const exportToExcel = () => {
    if (!stats) return;

    const date = new Date().toLocaleDateString();
    
    const worksheetData = [
      ['Hospital Attendance Report'],
      [`Generated on: ${date}`],
      [],
      ['Metric', 'Value'],
      ['Total Staff', stats.totalStaff],
      ['Present Today', stats.presentToday],
      ['Absent Today', stats.absentToday],
      ['Late Arrivals', stats.lateToday],
      ['Attendance Rate', `${attendanceRate}%`],
      ['Punctuality Rate', `${punctualityRate}%`],
      ['Monthly Attendance', stats.monthlyAttendance],
      [],
      ['Performance Indicators'],
      ['Attendance Status', attendanceRate >= 90 ? 'Excellent' : attendanceRate >= 75 ? 'Good' : 'Needs Improvement'],
      ['Punctuality Status', punctualityRate >= 85 ? 'Excellent' : punctualityRate >= 70 ? 'Good' : 'Needs Improvement'],
      ['Absenteeism Status', stats.absentToday === 0 ? 'Perfect' : stats.absentToday <= 2 ? 'Acceptable' : 'High'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    
    XLSX.writeFile(workbook, `attendance-report-${date}.xlsx`);
  };

  const exportToWord = async () => {
    if (!stats) return;

    const date = new Date().toLocaleDateString();

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'Hospital Attendance Report',
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Generated on: ${date}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Summary Statistics',
            heading: 'Heading2',
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Metric', bold: true })]
                    })] 
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Value', bold: true })]
                    })] 
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Total Staff')] }),
                  new TableCell({ children: [new Paragraph(stats.totalStaff.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Present Today')] }),
                  new TableCell({ children: [new Paragraph(stats.presentToday.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Absent Today')] }),
                  new TableCell({ children: [new Paragraph(stats.absentToday.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Late Arrivals')] }),
                  new TableCell({ children: [new Paragraph(stats.lateToday.toString())] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Attendance Rate')] }),
                  new TableCell({ children: [new Paragraph(`${attendanceRate}%`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Punctuality Rate')] }),
                  new TableCell({ children: [new Paragraph(`${punctualityRate}%`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Monthly Attendance')] }),
                  new TableCell({ children: [new Paragraph(stats.monthlyAttendance.toString())] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'Performance Indicators',
            heading: 'Heading2',
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Attendance Status: ', bold: true }),
              new TextRun(attendanceRate >= 90 ? 'Excellent' : attendanceRate >= 75 ? 'Good' : 'Needs Improvement'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Punctuality Status: ', bold: true }),
              new TextRun(punctualityRate >= 85 ? 'Excellent' : punctualityRate >= 70 ? 'Good' : 'Needs Improvement'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Absenteeism Status: ', bold: true }),
              new TextRun(stats.absentToday === 0 ? 'Perfect' : stats.absentToday <= 2 ? 'Acceptable' : 'High'),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `attendance-report-${date}.docx`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports</h1>
          <p className="text-gray-600">Unable to load statistics.</p>
        </div>
      </div>
    );
  }

  const attendanceRate = stats.totalStaff > 0 ? 
    Math.round((stats.presentToday / stats.totalStaff) * 100) : 0;

  const punctualityRate = stats.presentToday > 0 ? 
    Math.round(((stats.presentToday - stats.lateToday) / stats.presentToday) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Export to PDF"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Export to Excel"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={exportToWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Export to Word"
          >
            <FileType className="h-4 w-4" />
            <span className="hidden sm:inline">Word</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Punctuality Rate</p>
              <p className="text-3xl font-bold text-purple-600">{punctualityRate}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Staff:</span>
              <span className="font-semibold text-gray-900">{stats.totalStaff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present:</span>
              <span className="font-semibold text-green-600">{stats.presentToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent:</span>
              <span className="font-semibold text-red-600">{stats.absentToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late Arrivals:</span>
              <span className="font-semibold text-yellow-600">{stats.lateToday}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Attendance Rate:</span>
                <span className="font-semibold text-blue-600">{attendanceRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Check-ins This Month:</span>
              <span className="font-semibold text-gray-900">{stats.monthlyAttendance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Daily Attendance:</span>
              <span className="font-semibold text-blue-600">
                {Math.round(stats.monthlyAttendance / new Date().getDate())}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Punctuality Rate:</span>
              <span className="font-semibold text-purple-600">{punctualityRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              attendanceRate >= 90 ? 'text-green-600' : 
              attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {attendanceRate >= 90 ? '🟢' : attendanceRate >= 75 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Attendance</h3>
            <p className="text-sm text-gray-600">
              {attendanceRate >= 90 ? 'Excellent' : 
               attendanceRate >= 75 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              punctualityRate >= 85 ? 'text-green-600' : 
              punctualityRate >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {punctualityRate >= 85 ? '🟢' : punctualityRate >= 70 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Punctuality</h3>
            <p className="text-sm text-gray-600">
              {punctualityRate >= 85 ? 'Excellent' : 
               punctualityRate >= 70 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              stats.absentToday === 0 ? 'text-green-600' : 
              stats.absentToday <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.absentToday === 0 ? '🟢' : 
               stats.absentToday <= 2 ? '🟡' : '🔴'}
            </div>
            <h3 className="font-semibold text-gray-900">Absenteeism</h3>
            <p className="text-sm text-gray-600">
              {stats.absentToday === 0 ? 'Perfect' : 
               stats.absentToday <= 2 ? 'Acceptable' : 'High'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;