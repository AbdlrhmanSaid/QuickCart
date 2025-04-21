import { Inngest } from "inngest";
import dbConnect from "./db";
import User from "@/models/User";
import Order from "@/models/Orders";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// save the user to the database
export const saveUser = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;

      const email =
        Array.isArray(email_addresses) && email_addresses.length > 0
          ? email_addresses[0]?.email_address || ""
          : "";

      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email,
        imageUrl: image_url, // خلي بالك من الـ camelCase
      };

      await dbConnect();
      await User.create(userData);
      console.log("✅ User synced successfully");
    } catch (err) {
      console.error("❌ Error syncing user:", err);
      throw err;
    }
  }
);

// update the user in the database
export const updateUser = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_addresses,
      imageURl: image_url,
    };
    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
  }
);

// delete the user from the database
export const deleteUser = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);

// inngest functions to create user's oreder in database
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 25,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ event }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      };
    });
    await dbConnect();
    await Order.insertMany(orders);

    return {
      success: true,
      processed: orders.length,
      message: "Orders created successfully",
    };
  }
);
