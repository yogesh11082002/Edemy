import { AdminHeader } from "@/components/admin/admin-header";
import { SeedDatabase } from "@/lib/seed-db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeedPage() {
    return (
        <>
            <AdminHeader title="Database Seeding" description="Populate the database with initial data." />
            <Card>
                <CardHeader>
                    <CardTitle>Seed Courses</CardTitle>
                    <CardDescription>
                        Click the button below to add the 12 sample courses to your Firestore database.
                        This action should only be performed once. If courses already exist, this might create duplicates.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SeedDatabase />
                </CardContent>
            </Card>
        </>
    )
}
