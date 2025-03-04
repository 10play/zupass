import { z } from "zod";
import { TicketCategory } from "./PODTicketPCD";
import { canBeBigInt, cryptographic } from "./utils";

export const TicketDataSchema = z.object({
  eventName: z.string(),
  ticketName: z.string(),
  checkerEmail: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAltText: z.string().optional(),
  ticketId: z.string().uuid(),
  eventId: z.string().uuid(),
  productId: z.string().uuid(),
  timestampConsumed: z.number().int().nonnegative(),
  timestampSigned: z.number().int().nonnegative(),
  /**
   * V3 semaphore commitment.
   * Optional, used only by legacy v3 tickets.
   * @deprecated
   */
  attendeeSemaphoreId: z
    .string()
    .refine(canBeBigInt)
    .optional()
    // important that the transform comes last, otherwise
    // `dataToPodEntries` will not work
    .transform(cryptographic),
  /**
   * Semaphore v4 identity commitment.
   */
  owner: z
    .string()
    .refine(canBeBigInt)
    .optional()
    // important that the transform comes last, otherwise
    // `dataToPodEntries` will not work
    .transform(cryptographic),
  isConsumed: z.boolean(),
  isRevoked: z.boolean(),
  ticketCategory: z.nativeEnum(TicketCategory),
  attendeeName: z.string(),
  attendeeEmail: z.string(),
  ticketSecret: z.string().optional()
});

export type IPODTicketData = z.infer<typeof TicketDataSchema>;
