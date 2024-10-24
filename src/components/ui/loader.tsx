export function Loader({ className }: { className?: string }) {
	return (
		<div
			className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-foreground ${className}`}
			role="status"
			aria-label="loading"
		>
			<span className="sr-only">Loading...</span>
		</div>
	)
}
