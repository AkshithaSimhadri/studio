
'use client';

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 relative overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-sm font-semibold mx-4">Welcome to FinanceWise AI</span>
        <span className="text-sm font-semibold mx-4">Welcome to FinanceWise AI</span>
        <span className="text-sm font-semibold mx-4">Welcome to FinanceWise AI</span>
        <span className="text-sm font-semibold mx-4">Welcome to FinanceWise AI</span>
      </div>
    </div>
  );
}
