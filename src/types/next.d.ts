// Fallback for LayoutProps when .next/dev/types hasn't been generated yet
type LayoutProps<T extends string = string> = {
  children: React.ReactNode;
  params?: Record<string, string>;
};
