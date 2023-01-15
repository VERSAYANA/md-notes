import Navbar from './Navbar'
import React, { ReactNode } from 'react'

import Drawer from './Drawer'
import Link from 'next/link'
import { FilePlus } from 'react-feather'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="drawer-mobile drawer">
      <input id="drawer" className="drawer-toggle" type="checkbox" />
      <div className="drawer-content overflow-x-hidden">
        <Navbar />
        <main className="flex flex-col">{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <aside className="flex h-full min-h-0 w-80 flex-col bg-base-100">
          <div className="flex h-16 w-full items-center px-4">
            <Link
              className="btn-ghost btn w-full justify-start gap-x-3 text-base normal-case text-primary"
              href="/notes/new"
            >
              <FilePlus size={24} />
              <span>New note</span>
            </Link>
          </div>
          <div className="flex h-full flex-1 flex-col overflow-y-auto border-y">
            <ul className="menu bg-base-100 p-4 text-base-content">
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
          <div className="flex h-32 flex-col">
            <ul className="menu bg-base-100 p-4 text-base-content">
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
        </aside>
      </div>
    </div>
  )
}
