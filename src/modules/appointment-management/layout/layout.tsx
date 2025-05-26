interface LayoutProps {
  header: React.ReactNode;
  body: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, body }) => {
  return (
    <div className="w-full flex flex-col text-gray-900 dark:bg-gray-950 dark:text-white">
      <header className="w-full">{header}</header>
      <main className="w-full">{body}</main>
    </div>
  );
};

export default Layout;
