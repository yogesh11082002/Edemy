interface AdminHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export function AdminHeader({ title, description, children }: AdminHeaderProps) {
    return (
        <div className="flex items-center justify-between space-y-2 mb-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {children}
        </div>
    )
}
