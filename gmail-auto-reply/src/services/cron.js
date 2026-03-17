import cron from "node-cron";
import { updateAllUsersWatch } from "./gmailService.js";

cron.schedule("0 0 * * *", () => {
  console.log(
    "Running a task every day at midnight to update user watches:",
    new Date().toLocaleString(),
    new Date().getTime(),
  );
  updateAllUsersWatch();
});

export default cron;
