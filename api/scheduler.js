import cron from "node-cron";
import MaintancePkgModel from "./model/MaintancePkg.model.js";

//this is a node-cron shedular to update promotion status accordingly datenow0828
cron.schedule("* * * * *", async () => {
  //this will run concurrently all the day0828
  const today = new Date();

  try {
    const result = await MaintancePkgModel.updateMany(
      { pkgExp: { $lt: today }, status: true },
      { $set: { status: false } }
    );
    console.log(
      `${result.nModified} promotions have been updated to inactive.`
    );
  } catch (error) {
    console.error("Error updating promotion statuses:", error);
  }
});
