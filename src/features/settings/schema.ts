import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const themeModeSchema = z.enum(["light", "dark", "system"]);

export type ThemeMode = z.infer<typeof themeModeSchema>;
