import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/tapapt-icon.svg" alt="TapApt logo" width={30} height={35} />
          TapApt
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="px-3 py-2 hover:text-cyan-600 font-medium">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/booking" className="px-3 py-2 hover:text-cyan-600 font-medium">
                  Book Now
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Role-based Links */}
            {user ? (
              <>
                {user.role === "admin" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/admin/dashboard"
                        className="px-3 py-2 hover:text-cyan-600 font-medium"
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                {user.role === "client" && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/dashboard"
                        className="px-3 py-2 hover:text-cyan-600 font-medium"
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-red-600 hover:text-red-800 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/login"
                      className="px-3 py-2 hover:text-cyan-600 font-medium"
                    >
                      Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/register"
                      className="px-3 py-2 hover:text-cyan-600 font-medium"
                    >
                      Register
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
