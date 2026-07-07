import { crudHandlers } from "@/lib/crud";

const h = crudHandlers("posts", { idPrefix: "pst", slugFromField: "title" });
export const GET = h.GET;
export const POST = h.POST;
export const PUT = h.PUT;
export const DELETE = h.DELETE;
