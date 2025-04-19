import { Inngest } from "inngest";
import dbConnect from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// save the user to the database
export const saveUser = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, fist_name, last_name, email_address, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${fist_name} ${last_name}`,
      email: email_address[0].email_address,
      imageURl: image_url,
    };
    await dbConnect();
    await User.create(userData);
  }
);

// update the user in the database
export const updateUser = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, fist_name, last_name, email_address, image_url } = event.data;
    const userData = {
      _id: id,
      name: `${fist_name} ${last_name}`,
      email: email_address[0].email_address,
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
