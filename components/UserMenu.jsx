// components/UserMenu.tsx
"use client";
import React from "react";
import { CartIcon, BagIcon, HomeIcon, BoxIcon } from "@/assets/assets";
import { UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";

const UserMenu = ({ isMobile = false }) => {
  const { router } = useAppContext();

  return (
    <UserButton>
      <UserButton.MenuItems>
        {isMobile && (
          <UserButton.Action
            label="Home"
            labelIcon={<HomeIcon />}
            onClick={() => router.push("/")}
          />
        )}
        {isMobile && (
          <UserButton.Action
            label="Products"
            labelIcon={<BoxIcon />}
            onClick={() => router.push("/all-products")}
          />
        )}
        <UserButton.Action
          label="Cart"
          labelIcon={<CartIcon />}
          onClick={() => router.push("/cart")}
        />
        <UserButton.Action
          label="My Orders"
          labelIcon={<BagIcon />}
          onClick={() => router.push("/my-orders")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;
