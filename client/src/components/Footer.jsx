import { Link } from "react-router-dom";

import { Container } from "./Container";

function NavLink({ href, children }) {
  return (
    <Link to={href} className="transition hover:text-teal-400">
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t 0 pt-10 pb-16 border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex gap-6 text-sm font-medium  text-zinc-200">
                <NavLink href="/">Buy Now</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <NavLink href="/careers">Careers</NavLink>
              </div>
              <p className="text-sm  text-zinc-500">
                &copy; {new Date().getFullYear()} Loop Cards. All rights
                reserved.
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  );
}
