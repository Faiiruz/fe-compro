import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  const isActive = (path) => {
    if (path === "/") {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className="md:w-56 w-28 font-mons font-semibold h-full fixed bg-black/40 p-4 text-sm">
      <ul className="mt-16">
        <li>
          <Link
            href="/"
            className={`flex items-center justify-center md:justify-start gap-4 p-4 rounded-full ${
              isActive("/") ? "bg-gray-400 md:w-full w-20 text-black" : ""
            }`}
          >
            <h1 className="hidden md:block">Home</h1>
          </Link>
        </li>
        <li>
          <Link
            href="/content"
            className={`gap-2 p-4 rounded-full flex items-center justify-center md:justify-start ${
              isActive("/content")
                ? "bg-gray-400 md:w-full w-20 text-black"
                : ""
            }`}
          >
            <h1 className="hidden md:block">Content</h1>
          </Link>
        </li>
        <li>
          <Link
            href="/comment"
            className={`flex items-center gap-4 p-4 rounded-full justify-center md:justify-start ${
              isActive("/comment")
                ? "bg-gray-400 md:w-full w-20 text-black"
                : ""
            }`}
          >
            <h1 className="hidden md:block">Comment</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
