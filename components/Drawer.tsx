import { useUser } from '@supabase/auth-ui-react/dist/esm/src/components/Auth/UserContext'
import Link from 'next/link'
import { FilePlus } from 'react-feather'

function Drawer() {
  return (
    <div className="drawer-mobile drawer fixed left-0 z-10 my-16 w-80">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 border-r bg-base-100 p-4 text-base-content">
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Drawer
