import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Transaction } from "@/lib/mock-data";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  transactions: Transaction[];
}

export function ExportButtons({ transactions }: ExportButtonsProps) {
  
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Monthly Expense Report", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = transactions.map((t) => [
      t.date,
      t.merchant,
      t.category,
      `$${t.amount.toFixed(2)}`,
      t.source
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Date", "Merchant", "Category", "Amount", "Source"]],
      body: tableData,
    });

    doc.save("expenses-report.pdf");
    toast({ title: "PDF Downloaded", description: "Your report has been generated." });
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expenses-report.xlsx");
    toast({ title: "Excel Downloaded", description: "Your spreadsheet has been generated." });
  };

  return (
    <div className="flex gap-2 w-full">
      <Button variant="outline" className="flex-1" onClick={exportPDF}>
        <FileText className="mr-2 h-4 w-4 text-red-500" />
        PDF
      </Button>
      <Button variant="outline" className="flex-1" onClick={exportExcel}>
        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
        Excel
      </Button>
    </div>
  );
}
