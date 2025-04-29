'use  client';

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar} from "@heroui/react";
import Link from "next/link";

const NavBar = () => {
  const { user, isLoading } = useUser();

  return (
    <div className="nav-container bg-gray-900" data-testid="navbar">
      <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
            {user && (
              <>
                <Link
                  href="/"
                  className="duration-200 text-zinc-400 hover:text-zinc-100"
                >
                  Home
                </Link>
                <Link
                  href="/list/show"
                  className="duration-200 text-zinc-400 hover:text-zinc-100"
                >
                  Shopping
                </Link>
                <Link
                  href="/series/show"
                  className="duration-200 text-zinc-400 hover:text-zinc-100"
                >
                  Series
                </Link>
              </>
            )}
            {!isLoading && !user && (
              <Link
                href="/api/auth/login"
                className="duration-200 text-zinc-400 hover:text-zinc-100"
              >
                Log in
              </Link>
            )}
            {user && (
              <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  size='sm'
                  className="transition-transform"
                  src={user.picture}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  {user.name}
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  <Link href='/api/auth/logout'>
                    Log Out
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            )}
          </div>
      </div>
    </div>
  );
};

export default NavBar;