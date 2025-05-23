import { serve } from "inngest/next";
import {
  inngest,
  saveUser,
  updateUser,
  deleteUser,
  createUserOrder,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [saveUser, updateUser, deleteUser, createUserOrder],
});
