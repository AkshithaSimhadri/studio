import { UploadDashboard } from "@/components/upload/upload-dashboard";

export default function UploadPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Upload Transactions</h1>
        <p className="text-muted-foreground">
          Upload a PDF of your transaction history and let AI analyze it for you.
        </p>
      </div>
      <UploadDashboard />
    </div>
  );
}
