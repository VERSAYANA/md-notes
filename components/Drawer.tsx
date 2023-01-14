import { useUser } from '@supabase/auth-ui-react/dist/esm/src/components/Auth/UserContext'
import Link from 'next/link'
import { FilePlus } from 'react-feather'

function Drawer() {
  return (
    <div className="drawer-mobile drawer fixed z-10 w-fit lg:static">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side shadow-xl">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4 text-base-content">
          <li>
            <Link className="text-primary" href="/notes/new">
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </li>
          {/* <li>
            <a>Sidebar Item 2</a>
          </li> */}
        </ul>
      </div>
    </div>
  )
}

export default Drawer
