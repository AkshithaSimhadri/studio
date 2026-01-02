
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, FileType, Trash2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { UploadHistoryItem } from '@/lib/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type UploadHistoryProps = {
  newUploadId: string | null;
};

export function UploadHistory({ newUploadId }: UploadHistoryProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'upload_history'), orderBy('uploadDate', 'desc'));
  }, [user, firestore]);

  const { data: history, isLoading, error } = useCollection<UploadHistoryItem>(historyQuery);

  // This effect is a bit of a trick to ensure the list re-fetches when a new item is added,
  // even though `useCollection` is real-time. Sometimes there can be a slight delay,
  // and this ensures consistency if we pass the new ID down.
  useEffect(() => {
    // The main purpose of this is to react if `newUploadId` changes,
    // though the query itself is what will fetch the data.
  }, [newUploadId]);

  const handleDelete = (item: UploadHistoryItem) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'upload_history', item.id);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "History Item Deleted",
      description: `Removed "${item.fileName}" from your history.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload History</CardTitle>
        <CardDescription>A log of your previously uploaded transaction files.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!isLoading && error && (
          <div className="text-destructive text-center py-4">Failed to load upload history.</div>
        )}
        {!isLoading && !error && history?.length === 0 && (
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Uploads Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your uploaded file history will appear here.</p>
          </div>
        )}
        {!isLoading && history && history.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.fileName}</TableCell>
                  <TableCell>{format(new Date(item.uploadDate), 'PPp')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.fileType.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>{item.transactionCount}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the history record for "{item.fileName}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

    