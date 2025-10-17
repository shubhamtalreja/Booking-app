import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  const DesktopNavLinks = () => (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to="/" className="px-3 py-2 hover:text-cyan-600 font-medium">
            Home
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to="/booking"
            className="px-3 py-2 hover:text-cyan-600 font-medium"
          >
            Book Now
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

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
            <Button
              onClick={logout}
              variant="ghost"
              className="px-3 py-2 text-red-600 hover:text-red-800 font-medium cursor-pointer"
            >
              Logout
            </Button>
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
    </>
  );

  // ✅ Mobile NavLinks (plain Links)
  const MobileNavLinks = () => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/booking">Book Now</Link>
          </DropdownMenuItem>

          {user ? (
            <>
              {user.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              )}
              {user.role === "client" && (
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-700"
              >
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link to="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/register">Register</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  );

  return (
    <div className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/tapapt-icon.svg" alt="TapApt logo" width={30} height={35} />
          TapApt
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              <DesktopNavLinks />
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNavLinks/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
